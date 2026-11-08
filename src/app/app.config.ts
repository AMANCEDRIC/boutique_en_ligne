import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideFirestore, initializeFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import { environment, isFirebaseConfigured } from '../environments/environment';

// En mode démo (Firebase non configuré), on initialise quand même l'app avec un projectId
// factice pour que l'injection fonctionne ; les services n'appellent alors jamais Firestore.
const firebaseOptions = isFirebaseConfigured
  ? environment.firebase
  : { ...environment.firebase, projectId: 'demo-maison-shein', apiKey: 'demo' };

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseOptions)),
    provideFirestore(() => initializeFirestore(getApp(), { ignoreUndefinedProperties: true })),
    provideAuth(() => getAuth()),
  ],
};
