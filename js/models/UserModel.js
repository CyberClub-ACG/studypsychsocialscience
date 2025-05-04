/**
 * UserModel.js - Handles user data and authentication
 */
class UserModel {
    constructor() {
        this.points = parseInt(localStorage.getItem('points') || 0);
        this.level = parseInt(localStorage.getItem('level') || 1);
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.theme = localStorage.getItem('theme') || CONFIG.APP_SETTINGS.DEFAULT_THEME;
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.difficulty = localStorage.getItem('difficulty') || 'normal';
        this.timedMode = localStorage.getItem('timedMode') === 'true';
        this.timerDuration = parseInt(localStorage.getItem('timerDuration') || 60);
    }

    /**
     * Check if user is logged in
     * @returns {boolean} - True if logged in
     */
    checkLogin() {
        return this.isLoggedIn;
    }

    /**
     * Login user
     * @param {string} password - User password
     * @returns {boolean} - True if login successful
     */
    login(password) {
        const correctPassword = CONFIG && CONFIG.app && CONFIG.app.password 
            ? CONFIG.app.password 
            : "default"; // Fallback for testing only
        
        if (password === correctPassword) {
            this.isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            return true;
        }
        
        return false;
    }

    /**
     * Logout user
     */
    logout() {
        this.isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
    }

    /**
     * Add points to user
     * @param {number} points - Points to add
     */
    addPoints(points) {
        this.points += points;
        localStorage.setItem('points', this.points);
        this.updateLevel();
    }

    /**
     * Update user level based on points
     */
    updateLevel() {
        this.level = Math.floor(this.points / CONFIG.APP_SETTINGS.POINTS_PER_LEVEL) + 1;
        localStorage.setItem('level', this.level);
    }

    /**
     * Get level progress percentage
     * @returns {number} - Percentage progress to next level (0-1)
     */
    getLevelProgress() {
        const pointsInCurrentLevel = this.points % CONFIG.APP_SETTINGS.POINTS_PER_LEVEL;
        return pointsInCurrentLevel / CONFIG.APP_SETTINGS.POINTS_PER_LEVEL;
    }

    /**
     * Set theme preference
     * @param {string} theme - Theme color
     */
    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
    }

    /**
     * Toggle sound effects
     * @param {boolean} enabled - Whether sound is enabled
     */
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        localStorage.setItem('soundEnabled', enabled ? 'true' : 'false');
    }

    /**
     * Set difficulty level
     * @param {string} difficulty - Difficulty level (easy, normal, hard)
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        localStorage.setItem('difficulty', difficulty);
    }

    /**
     * Toggle timed mode
     * @param {boolean} enabled - Whether timed mode is enabled
     */
    setTimedMode(enabled) {
        this.timedMode = enabled;
        localStorage.setItem('timedMode', enabled ? 'true' : 'false');
    }

    /**
     * Set timer duration
     * @param {number} duration - Timer duration in seconds
     */
    setTimerDuration(duration) {
        this.timerDuration = duration;
        localStorage.setItem('timerDuration', duration);
    }

    /**
     * Get user profile data
     * @returns {Object} - User profile data
     */
    getProfile() {
        return {
            points: this.points,
            level: this.level,
            theme: this.theme,
            soundEnabled: this.soundEnabled,
            difficulty: this.difficulty,
            timedMode: this.timedMode,
            timerDuration: this.timerDuration,
            levelProgress: this.getLevelProgress()
        };
    }
}

window.UserModel = UserModel;
