import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { SandboxPreset } from '@sand-box/ui';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withHashLocation()),
    providePrimeNG({
      theme: {
        preset: SandboxPreset,
        options: {
          prefix: 'p',
          darkModeSelector: '.p-dark',
          cssLayer: {
            name: 'primeng',
            order: 'base, primeng, tailwind-utilities',
          },
        },
      },
      ripple: true,
    }),
  ],
};
