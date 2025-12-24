import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './Interceptors/auth-interceptor';
import { getAuthServiceProvider } from './testing/test-helpers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),

    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([authInterceptor])),
    getAuthServiceProvider() // Use mock or real service based on test-helpers config
  ]
};
