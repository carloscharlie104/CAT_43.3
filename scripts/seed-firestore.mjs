import { readFile } from 'node:fs/promises';

import { initializeApp } from 'firebase/app';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAQzYbtXJvdfuy7k3qGIHd0z2LnT3BApfo',
  authDomain: 'cat-43-3-6aa4e.firebaseapp.com',
  projectId: 'cat-43-3-6aa4e',
  storageBucket: 'cat-43-3-6aa4e.firebasestorage.app',
  messagingSenderId: '151075154968',
  appId: '1:151075154968:web:f9c98cb0b3bf1d16dce76d'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function asDocId(value, fallback) {
  const id = String(value ?? '').trim();
  return id || fallback;
}

async function upsertCollection(name, items) {
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const fallback = `${index + 1}`;
    const docId = asDocId(item?.id, fallback);
    await setDoc(doc(db, name, docId), item);
  }
}

async function seed() {
  const raw = await readFile(new URL('../db.json', import.meta.url), 'utf-8');
  const data = JSON.parse(raw);

  await setDoc(doc(db, 'company', 'main'), data.company);
  await setDoc(doc(db, 'auth', 'main'), data.auth);

  await upsertCollection('locations', data.locations ?? []);
  await upsertCollection('categories', data.categories ?? []);
  await upsertCollection('cars', data.cars ?? []);
  await upsertCollection('faqs', data.faqs ?? []);
  await upsertCollection('paymentMethods', data.paymentMethods ?? []);
  await upsertCollection('users', data.users ?? []);
  await upsertCollection('reservations', data.reservations ?? []);
  await upsertCollection('contactMessages', data.contactMessages ?? []);

  console.log('Firestore poblado correctamente desde db.json');
}

seed().catch((error) => {
  console.error('Error al poblar Firestore:', error);
  process.exit(1);
});
