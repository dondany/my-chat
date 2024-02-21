import { ApplicationConfig, InjectionToken, importProvidersFrom } from '@angular/core';
import { FirebaseStorage, connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
import { provideRouter } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { Firestore, connectFirestoreEmulator, getFirestore, initializeFirestore } from 'firebase/firestore';

import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

import { FIREBASE_OPTIONS } from '@angular/fire/compat';

const app = initializeApp(environment.firebase);

export const AUTH = new InjectionToken('Firebase auth', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth();
    if (environment.useEmulators) {
      connectAuthEmulator(auth, 'http://localhost:9099', {
        disableWarnings: true,
      })
    }
    return auth;
  }
});

export const FIRESTORE = new InjectionToken('Firebase firestore', {
  providedIn: 'root',
  factory: () => {
    let firestore: Firestore;
    if (environment.useEmulators) {
      firestore = initializeFirestore(app, {});
      connectFirestoreEmulator(firestore, 'localhost', 8080);
    } else {
      firestore = getFirestore();
    }
    return firestore;
  }
})

export const STORAGE = new InjectionToken('Firebase storage', {
  providedIn: 'root',
  factory: () => {
    const storage: FirebaseStorage = getStorage();
    if (environment.useEmulators) {
      connectStorageEmulator(storage, 'localhost', 9199);
    } 
    return storage;
  }
})

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"my-chat-2bbb5","appId":"1:459512383177:web:b55cde4d378fcc82c0af18","storageBucket":"my-chat-2bbb5.appspot.com","apiKey":"AIzaSyCGNWF1lQlL6q0EVrxUVwFe91Ogf56WLHc","authDomain":"my-chat-2bbb5.firebaseapp.com","messagingSenderId":"459512383177"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideFunctions(() => getFunctions())), importProvidersFrom(provideStorage(() => getStorage())), { provide: FIREBASE_OPTIONS, useValue: environment.firebase}]
};
