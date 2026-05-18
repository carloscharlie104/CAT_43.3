import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';

type FavoriteMap = Record<string, string[]>;

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly storageKey = 'cat_favorites_by_user';
  private readonly dbName = 'cat_favorites_db';
  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private readonly favoritesSubject = new BehaviorSubject<Set<string>>(new Set());
  private currentUid: string | null = null;
  private initialized = false;

  readonly favorites$ = this.favoritesSubject.asObservable();

  async setUser(uid: string | null): Promise<void> {
    this.currentUid = uid;

    if (this.isNativePlatform()) {
      await this.ensureNativeDatabase();
      const favorites = uid ? await this.getFavoritesForUser(uid) : [];
      this.favoritesSubject.next(new Set(favorites));
      return;
    }

    this.favoritesSubject.next(new Set(this.getUserFavoritesFromStorage(uid)));
  }

  async isFavorite(carId: string): Promise<boolean> {
    if (!this.currentUid) {
      return false;
    }

    if (this.isNativePlatform()) {
      await this.ensureNativeDatabase();
      const result = await this.db?.query(
        'SELECT id FROM favorites WHERE user_uid = ? AND car_id = ? LIMIT 1;',
        [this.currentUid, carId]
      );
      return Boolean(result?.values?.length);
    }

    return this.favoritesSubject.value.has(carId);
  }

  async addFavorite(carId: string): Promise<void> {
    if (!this.currentUid) {
      throw new Error('Debes iniciar sesión para gestionar favoritos.');
    }

    if (this.isNativePlatform()) {
      await this.ensureNativeDatabase();
      await this.db?.run(
        'INSERT OR IGNORE INTO favorites (user_uid, car_id, created_at) VALUES (?, ?, ?);',
        [this.currentUid, carId, new Date().toISOString()]
      );
      const refreshed = await this.getFavoritesForUser(this.currentUid);
      this.favoritesSubject.next(new Set(refreshed));
      return;
    }

    const favorites = new Set(this.getUserFavoritesFromStorage(this.currentUid));
    favorites.add(carId);
    this.persistUserFavoritesInStorage(this.currentUid, [...favorites]);
    this.favoritesSubject.next(favorites);
  }

  async removeFavorite(carId: string): Promise<void> {
    if (!this.currentUid) {
      throw new Error('Debes iniciar sesión para gestionar favoritos.');
    }

    if (this.isNativePlatform()) {
      await this.ensureNativeDatabase();
      await this.db?.run('DELETE FROM favorites WHERE user_uid = ? AND car_id = ?;', [
        this.currentUid,
        carId
      ]);
      const refreshed = await this.getFavoritesForUser(this.currentUid);
      this.favoritesSubject.next(new Set(refreshed));
      return;
    }

    const favorites = new Set(this.getUserFavoritesFromStorage(this.currentUid));
    favorites.delete(carId);
    this.persistUserFavoritesInStorage(this.currentUid, [...favorites]);
    this.favoritesSubject.next(favorites);
  }

  async toggleFavorite(carId: string): Promise<boolean> {
    const favorite = await this.isFavorite(carId);

    if (favorite) {
      await this.removeFavorite(carId);
      return false;
    }

    await this.addFavorite(carId);
    return true;
  }

  async getFavoritesForUser(uid: string): Promise<string[]> {
    if (this.isNativePlatform()) {
      await this.ensureNativeDatabase();
      const result = await this.db?.query(
        'SELECT car_id FROM favorites WHERE user_uid = ? ORDER BY created_at DESC;',
        [uid]
      );
      return (result?.values ?? [])
        .map((row) => String((row as { car_id?: string }).car_id ?? ''))
        .filter(Boolean);
    }

    return this.getUserFavoritesFromStorage(uid);
  }

  private getUserFavoritesFromStorage(uid: string | null): string[] {
    if (!uid) {
      return [];
    }

    const all = this.readAll();
    return all[uid] ?? [];
  }

  private persistUserFavoritesInStorage(uid: string, favorites: string[]): void {
    const all = this.readAll();
    all[uid] = favorites;
    localStorage.setItem(this.storageKey, JSON.stringify(all));
  }

  private readAll(): FavoriteMap {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as FavoriteMap) : {};
    } catch {
      return {};
    }
  }

  private isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  private async ensureNativeDatabase(): Promise<void> {
    if (!this.isNativePlatform() || this.initialized) {
      return;
    }

    const consistency = await this.sqlite.checkConnectionsConsistency();
    const hasConnection = (await this.sqlite.isConnection(this.dbName, false)).result;

    if (consistency.result && hasConnection) {
      this.db = await this.sqlite.retrieveConnection(this.dbName, false);
    } else {
      this.db = await this.sqlite.createConnection(this.dbName, false, 'no-encryption', 1, false);
    }

    await this.db.open();
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_uid TEXT NOT NULL,
        car_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(user_uid, car_id)
      );
    `);
    this.initialized = true;
  }
}
