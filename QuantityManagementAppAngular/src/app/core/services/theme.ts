import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(localStorage.getItem('theme') === 'dark');

  toggleTheme() {
    this.isDarkMode.update(prev => !prev);
    const theme = this.isDarkMode() ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    this.updateBodyClass();
  }

  updateBodyClass() {
    if (this.isDarkMode()) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  init() {
    this.updateBodyClass();
  }
}
