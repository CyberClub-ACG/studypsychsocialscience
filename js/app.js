/**
 * app.js - Main application entry point
 * 
 * This file initializes the application and sets up the MVC components.
 * It handles the initialization of controllers and models, and sets up
 * global event listeners.
 */

document.addEventListener('DOMContentLoaded', function() {
    const userController = new UserController();
    userController.initialize();
    
    if (!window.location.href.includes('login.html')) {
        userController.checkLoginAndRedirect();
    }
    
    if (document.getElementById('root') && !window.location.href.includes('login.html')) {
        const quizController = new QuizController();
        quizController.initialize();
    }
    
    setupGlobalUI();
});

/**
 * Set up global UI components
 */
function setupGlobalUI() {
    setupDarkModeToggle();
    
    setupAccessibilityFeatures();
    
    setupResponsiveDesign();
}

/**
 * Set up dark mode toggle
 */
function setupDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (darkModeToggle) {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }
}

/**
 * Set up accessibility features
 */
function setupAccessibilityFeatures() {
    document.querySelectorAll('button, a, input, select').forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('focus-visible');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focus-visible');
        });
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === '1') {
            const content = document.getElementById('root');
            if (content) {
                content.focus();
                event.preventDefault();
            }
        }
        
        if (event.altKey && event.key === 'd') {
            const darkModeToggle = document.getElementById('dark-mode-toggle');
            if (darkModeToggle) {
                darkModeToggle.click();
                event.preventDefault();
            }
        }
    });
    
    const announcer = document.getElementById('screen-reader-announcer');
    if (!announcer) {
        const newAnnouncer = document.createElement('div');
        newAnnouncer.id = 'screen-reader-announcer';
        newAnnouncer.className = 'sr-only';
        newAnnouncer.setAttribute('aria-live', 'polite');
        document.body.appendChild(newAnnouncer);
    }
}

/**
 * Set up responsive design
 */
function setupResponsiveDesign() {
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(meta);
    }
    
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('responsive');
        });
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && menu) {
            menu.classList.remove('responsive');
        }
    });
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    const announcer = document.getElementById('screen-reader-announcer');
    if (announcer) {
        announcer.textContent = message;
    }
}

/**
 * Confetti animation class
 * @param {Element} el - Container element
 */
class Confettiful {
    constructor(el) {
        this.el = el;
        this.containerEl = null;
        
        this.confettiFrequency = 3;
        this.confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E', '#EFFF1D'];
        this.confettiAnimations = ['slow', 'medium', 'fast'];
        
        this._setupElements();
        this._renderConfetti();
    }
    
    _setupElements() {
        const containerEl = document.createElement('div');
        const elPosition = this.el.style.position;
        
        if (elPosition !== 'relative' || elPosition !== 'absolute') {
            this.el.style.position = 'relative';
        }
        
        containerEl.classList.add('confetti-container');
        
        this.el.appendChild(containerEl);
        
        this.containerEl = containerEl;
    }
    
    _renderConfetti() {
        this.confettiInterval = setInterval(() => {
            const confettiEl = document.createElement('div');
            const confettiSize = (Math.floor(Math.random() * 3) + 7) + 'px';
            const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
            const confettiLeft = (Math.floor(Math.random() * this.el.offsetWidth)) + 'px';
            const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)];
            
            confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation);
            confettiEl.style.left = confettiLeft;
            confettiEl.style.width = confettiSize;
            confettiEl.style.height = confettiSize;
            confettiEl.style.backgroundColor = confettiBackground;
            
            confettiEl.removeTimeout = setTimeout(function() {
                confettiEl.parentNode.removeChild(confettiEl);
            }, 3000);
            
            this.containerEl.appendChild(confettiEl);
        }, 25);
    }
}

window.Confettiful = Confettiful;
