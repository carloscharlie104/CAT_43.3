import { initializeApp } from 'firebase/app';
import {
    browserSessionPersistence,
    getAuth,
    setPersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { environment } from '../../environments/environment';

const app = initializeApp(environment.firebase);

export const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence);

export const db = getFirestore(app);