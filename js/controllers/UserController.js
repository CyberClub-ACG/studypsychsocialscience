/**
 * UserController.js - Handles user authentication and profile management
 */
class UserController {
    constructor() {
        this.model = new UserModel();
    }

    /**
     * Initialize the controller
     */
    initialize() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            this.setupLoginForm();
        }
        
        const profilePanel = document.getElementById('profile-panel');
        if (profilePanel) {
            this.setupProfilePanel();
        }
        
        this.applyTheme();
    }

    /**
     * Set up login form
     */
    setupLoginForm() {
        const passwordInput = document.getElementById('password');
        const loginButton = document.querySelector('.login-form button');
        
        if (passwordInput && loginButton) {
            loginButton.addEventListener('click', () => this.handleLogin());
            
            passwordInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.handleLogin();
                }
            });
        }
    }

    /**
     * Set up profile panel
     */
    setupProfilePanel() {
        this.updateProfileDisplay();
        
        const profileButton = document.getElementById('profile-btn');
        if (profileButton) {
            profileButton.addEventListener('click', () => this.toggleProfilePanel());
        }
        
        const logoutButton = document.getElementById('logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => this.handleLogout());
        }
    }

    /**
     * Handle login
     */
    handleLogin() {
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('error-message');
        
        if (passwordInput) {
            const password = passwordInput.value;
            
            if (this.model.login(password)) {
                window.location.href = 'index.html';
            } else {
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
            }
        }
    }

    /**
     * Handle logout
     */
    handleLogout() {
        this.model.logout();
        window.location.href = 'login.html';
    }

    /**
     * Toggle profile panel
     */
    toggleProfilePanel() {
        const panel = document.getElementById('profile-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        }
    }

    /**
     * Update profile display
     */
    updateProfileDisplay() {
        const profile = this.model.getProfile();
        
        const pointsDisplay = document.getElementById('points');
        const levelDisplay = document.getElementById('level');
        
        if (pointsDisplay) {
            pointsDisplay.textContent = profile.points;
        }
        
        if (levelDisplay) {
            levelDisplay.textContent = profile.level;
        }
        
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${profile.levelProgress * 100}%`;
        }
        
        const soundToggle = document.getElementById('sound-toggle');
        const timedModeToggle = document.getElementById('timed-mode-toggle');
        const timerDurationInput = document.getElementById('timer-duration');
        
        if (soundToggle) {
            soundToggle.checked = profile.soundEnabled;
        }
        
        if (timedModeToggle) {
            timedModeToggle.checked = profile.timedMode;
        }
        
        if (timerDurationInput) {
            timerDurationInput.value = profile.timerDuration;
        }
        
        const difficultyBadge = document.getElementById('difficulty-badge');
        if (difficultyBadge) {
            difficultyBadge.textContent = profile.difficulty.charAt(0).toUpperCase() + profile.difficulty.slice(1);
            difficultyBadge.className = `difficulty-badge ${profile.difficulty}`;
        }
    }

    /**
     * Apply theme
     */
    applyTheme() {
        const profile = this.model.getProfile();
        document.body.style.backgroundColor = profile.theme;
    }

    /**
     * Check if user is logged in
     * @returns {boolean} - True if logged in
     */
    isLoggedIn() {
        return this.model.checkLogin();
    }

    /**
     * Redirect to login page if not logged in
     */
    checkLoginAndRedirect() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
}

window.UserController = UserController;
