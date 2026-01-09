/**
 * Dark Mode Toggle with System Preference Detection
 */

class DarkMode {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applySavedTheme();
        this.setupSystemThemeListener();
    }

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        this.updateThemeToggleLabel(isDark);
        this.saveTheme(isDark);
        this.dispatchThemeChangeEvent(isDark);
    }

    updateThemeToggleLabel(isDark) {
        if (this.themeToggle) {
            this.themeToggle.setAttribute('aria-label', 
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
    }

    saveTheme(isDark) {
        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
    }

    applySavedTheme() {
        try {
            const savedTheme = localStorage.getItem('theme');
            
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                this.updateThemeToggleLabel(true);
            } else if (savedTheme === 'light') {
                document.body.classList.remove('dark-mode');
                this.updateThemeToggleLabel(false);
            } else if (this.prefersDark.matches) {
                // Use system preference if no saved preference
                document.body.classList.add('dark-mode');
                this.updateThemeToggleLabel(true);
            }
        } catch (e) {
            console.warn('Could not load theme preference:', e);
        }
    }

    setupSystemThemeListener() {
        this.prefersDark.addEventListener('change', (e) => {
            const hasSavedTheme = localStorage.getItem('theme') !== null;
            
            if (!hasSavedTheme) {
                if (e.matches) {
                    document.body.classList.add('dark-mode');
                    this.updateThemeToggleLabel(true);
                } else {
                    document.body.classList.remove('dark-mode');
                    this.updateThemeToggleLabel(false);
                }
            }
        });
    }

    dispatchThemeChangeEvent(isDark) {
        const event = new CustomEvent('themechange', {
            detail: { isDark }
        });
        document.dispatchEvent(event);
    }

    getCurrentTheme() {
        return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    }
}

// Initialize dark mode when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DarkMode();
});