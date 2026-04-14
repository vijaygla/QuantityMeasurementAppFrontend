import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      FormsModule
    ),
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { disableOptionCentering: true }
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId)
          }
        ],
        onError: (err) => console.error(err)
      } as SocialAuthServiceConfig
    }
  ]
};
