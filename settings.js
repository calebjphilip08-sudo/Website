// Settings Management System - Enhanced with Performance Optimizations
(function() {
    // Default settings
    const defaultSettings = {
        layoutMode: 'header',
        animationSpeed: 'normal',
        reduceMotion: false,
        defaultYtChannel: 'cjphilip',
        letterboxdSort: 'recent',
        autoScroll: false,
        darkMode: false,
        fontSize: 'medium',
        colorTheme: 'default',
        enableGPU: true,
        compactMode: false
    };

    // Load settings from localStorage with error handling
    function loadSettings() {
        const saved = localStorage.getItem('userSettings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return { ...defaultSettings, ...parsed };
            } catch (e) {
                console.error('Error loading settings:', e);
                return defaultSettings;
            }
        }
        return defaultSettings;
    }

    // Save settings to localStorage
    function saveSettingsToStorage(settings) {
        try {
            localStorage.setItem('userSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings:', e);
            showNotification('⚠️ Settings could not be saved');
        }
    }

    // Apply settings to the page
    function applySettings(settings) {
        // Apply layout mode
        if (settings.layoutMode === 'sidebar') {
            document.body.classList.add('sidebar-mode');
        } else {
            document.body.classList.remove('sidebar-mode');
        }

        // Apply animation speed
        const speedValues = {
            slow: '1.2s',
            normal: '0.8s',
            fast: '0.4s',
            none: '0s'
        };
        
        document.documentElement.style.setProperty('--transition-speed', 
            speedValues[settings.animationSpeed] || '0.8s'
        );

        // Apply reduce motion (overrides animation speed)
        if (settings.reduceMotion) {
            document.body.classList.add('reduce-motion');
            document.documentElement.style.setProperty('--transition-speed', '0s');
        } else {
            document.body.classList.remove('reduce-motion');
        }

        // Apply dark mode
        if (settings.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-mode');
        }

        // Apply font size
        const fontSizes = {
            small: '14px',
            medium: '16px',
            large: '18px',
            'extra-large': '20px'
        };
        document.documentElement.style.setProperty('--base-text-size', 
            fontSizes[settings.fontSize] || '16px'
        );

        // Apply color theme
        document.documentElement.setAttribute('data-color-theme', settings.colorTheme);

        // Apply compact mode
        if (settings.compactMode) {
            document.body.classList.add('compact-mode');
        } else {
            document.body.classList.remove('compact-mode');
        }

        // GPU acceleration toggle
        if (settings.enableGPU) {
            document.body.style.willChange = 'auto';
        }

        // Store preferences
        localStorage.setItem('defaultYtChannel', settings.defaultYtChannel);
        localStorage.setItem('letterboxdSort', settings.letterboxdSort);

        // Apply auto-scroll
        if (settings.autoScroll && !window.location.pathname.includes('settings.html')) {
            setTimeout(() => {
                const content = document.querySelector('.page-content-wrapper, .hero, main');
                if (content) {
                    content.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    }

    // Load and apply settings on page load
    document.addEventListener('DOMContentLoaded', function() {
        const settings = loadSettings();
        applySettings(settings);

        // If on settings page, populate form
        if (window.location.pathname.includes('settings.html')) {
            populateSettingsForm(settings);
        }
    });

    // Apply saved settings immediately (before DOMContentLoaded) to prevent flash
    (function() {
        try {
            const saved = localStorage.getItem('userSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                // Apply critical settings immediately
                if (settings.darkMode) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.body.classList.add('dark-mode');
                }
                if (settings.fontSize) {
                    const fontSizes = { small: '14px', medium: '16px', large: '18px', 'extra-large': '20px' };
                    document.documentElement.style.setProperty('--base-text-size', fontSizes[settings.fontSize] || '16px');
                }
            }
        } catch (e) {
            console.error('Error loading theme:', e);
        }
    })();

    // Populate settings form
    function populateSettingsForm(settings) {
        const fields = [
            'layout-mode', 'animation-speed', 'reduce-motion', 
            'default-yt-channel', 'letterboxd-sort', 'auto-scroll',
            'dark-mode', 'font-size', 'color-theme', 'enable-gpu', 'compact-mode'
        ];

        fields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (!element) return;

            const settingKey = fieldId.replace(/-/g, 'Camel')
                .split('Camel')
                .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
                .join('');
            
            const realKey = fieldId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

            if (element.type === 'checkbox') {
                element.checked = settings[realKey] || false;
            } else if (element.tagName === 'SELECT') {
                element.value = settings[realKey] || '';
            }
        });
    }

    // Save settings from form
    window.saveSettings = function() {
        const settings = {
            layoutMode: document.getElementById('layout-mode')?.value || 'header',
            animationSpeed: document.getElementById('animation-speed')?.value || 'normal',
            reduceMotion: document.getElementById('reduce-motion')?.checked || false,
            defaultYtChannel: document.getElementById('default-yt-channel')?.value || 'cjphilip',
            letterboxdSort: document.getElementById('letterboxd-sort')?.value || 'recent',
            autoScroll: document.getElementById('auto-scroll')?.checked || false,
            darkMode: document.getElementById('dark-mode')?.checked || false,
            fontSize: document.getElementById('font-size')?.value || 'medium',
            colorTheme: document.getElementById('color-theme')?.value || 'default',
            enableGPU: document.getElementById('enable-gpu')?.checked !== false,
            compactMode: document.getElementById('compact-mode')?.checked || false
        };

        saveSettingsToStorage(settings);
        applySettings(settings);

        // Show feedback
        showNotification('Settings saved successfully! ✓');
    };

    // Reset settings to defaults
    window.resetSettings = function() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            localStorage.removeItem('userSettings');
            localStorage.removeItem('sidebarMode');
            localStorage.removeItem('defaultYtChannel');
            localStorage.removeItem('letterboxdSort');
            
            applySettings(defaultSettings);
            
            if (window.location.pathname.includes('settings.html')) {
                populateSettingsForm(defaultSettings);
            }

            showNotification('Settings reset to defaults! ✓');
        }
    };

    // Show notification with better performance
    function showNotification(message) {
        // Remove existing notification
        const existing = document.querySelector('.settings-notification');
        if (existing) {
            existing.remove();
        }

        // Create notification with reduced motion consideration
        const notification = document.createElement('div');
        notification.className = 'settings-notification';
        notification.textContent = message;
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');
        document.body.appendChild(notification);

        // Show notification
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Hide and remove after 3 seconds
        const removeTimeout = setTimeout(() => {
            notification.classList.remove('show');
            const destroyTimeout = setTimeout(() => notification.remove(), 300);
            return () => clearTimeout(destroyTimeout);
        }, 3000);

        return () => clearTimeout(removeTimeout);
    }

    // Export for other scripts to use
    window.getUserSettings = loadSettings;
    window.applySettings = applySettings;
})();
