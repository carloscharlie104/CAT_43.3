export function normalizeAssetPath(value: string | undefined | null): string {
  const raw = String(value ?? '').trim();

  if (!raw) {
    return '';
  }

  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')) {
    return raw;
  }

  return raw.replace(/^\.\.\//, '/');
}

export function normalizeIdentity(value: string): string {
  return value.trim().toLowerCase();
}

export function formatPrice(value: number): string {
  return `Desde ${value} €/día`;
}

export function calculateDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();

  if (Number.isNaN(diff) || diff < 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
