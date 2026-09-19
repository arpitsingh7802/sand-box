// libs/shared/ui/src/lib/services/theme.service.ts
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly isDarkMode = signal<boolean>(false);

  constructor() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        this.enableDarkMode();
      }
    }
  }

  toggleDarkMode(): void {
    if (this.isDarkMode()) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode(): void {
    this.document.documentElement.classList.add('p-dark');
    if (this.isBrowser) {
      localStorage.setItem('theme', 'dark');
    }
    this.isDarkMode.set(true);
  }

  disableDarkMode(): void {
    this.document.documentElement.classList.remove('p-dark');
    if (this.isBrowser) {
      localStorage.setItem('theme', 'light');
    }
    this.isDarkMode.set(false);
  }
}
