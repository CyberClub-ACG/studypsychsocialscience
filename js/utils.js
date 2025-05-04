
/**
 * Load points from localStorage
 * @returns {number} - Current points
 */
function loadPoints() {
    return parseInt(localStorage.getItem('points') || 0);
}

/**
 * Load level from localStorage
 * @returns {number} - Current level
 */
function loadLevel() {
    return parseInt(localStorage.getItem('level') || 1);
}

/**
 * Update points and level
 * @param {number} pointsEarned - Points earned in this session
 */
function updatePoints(pointsEarned) {
    let currentPoints = loadPoints();
    currentPoints += pointsEarned;
    
    localStorage.setItem('points', currentPoints);
    
    document.getElementById('points').textContent = currentPoints;
    
    updateLevel(currentPoints);
    
    updateProgressBar(currentPoints % CONFIG.APP_SETTINGS.POINTS_PER_LEVEL / CONFIG.APP_SETTINGS.POINTS_PER_LEVEL);
}

/**
 * Update level based on points
 * @param {number} points - Total points
 */
function updateLevel(points) {
    const level = Math.floor(points / CONFIG.APP_SETTINGS.POINTS_PER_LEVEL) + 1;
    
    localStorage.setItem('level', level);
    
    document.getElementById('level').textContent = level;
}

/**
 * Update progress bar
 * @param {number} percentage - Percentage to fill (0-1)
 */
function updateProgressBar(percentage) {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percentage * 100}%`;
    }
}

/**
 * Calculate points based on difficulty and number of questions
 * @param {number} questionCount - Number of questions answered correctly
 * @param {string} chapter - Chapter identifier
 * @returns {number} - Points earned
 */
function calculatePoints(questionCount, chapter) {
    const basePoints = CONFIG.APP_SETTINGS.POINTS_PER_CORRECT;
    
    let difficultyMultiplier = 1;
    
    if (chapter.includes("chapter")) {
        const chapterNum = parseInt(chapter.split("-")[1]);
        difficultyMultiplier = Math.max(1, chapterNum / 5);
    } else if (chapter.includes("bio-chapter")) {
        const chapterNum = parseInt(chapter.split("-")[2]);
        difficultyMultiplier = Math.max(1, chapterNum / 3);
    } else if (chapter.includes("physics-chapter")) {
        const chapterNum = parseInt(chapter.split("-")[2]);
        difficultyMultiplier = Math.max(1, chapterNum / 2);
    }
    
    return Math.round(basePoints * questionCount * difficultyMultiplier);
}

/**
 * Play sound effect for correct answer
 */
function playCorrectSound() {
    if (CONFIG.APP_SETTINGS.ENABLE_SOUND_EFFECTS) {
        const audio = new Audio('./sounds/correct.mp3');
        audio.play().catch(error => {
            console.error('Error playing sound:', error);
        });
    }
}

/**
 * Save theme preference to localStorage
 * @param {string} color - Color code
 */
function saveThemePreference(color) {
    localStorage.setItem('theme', color);
    applyTheme(color);
}

/**
 * Apply theme to the page
 * @param {string} color - Color code
 */
function applyTheme(color) {
    document.body.style.backgroundColor = color;
}

/**
 * Load theme from localStorage
 * @returns {string} - Color code
 */
function loadTheme() {
    return localStorage.getItem('theme') || CONFIG.APP_SETTINGS.DEFAULT_THEME;
}

/**
 * Check if user is logged in
 * @returns {boolean} - True if logged in
 */
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

/**
 * Redirect to login page if not logged in
 */
function checkLogin() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

/**
 * Extract text from PDF file
 * @param {File} file - PDF file
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromPDF(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function() {
            const simulatedText = `This is simulated text extracted from the PDF about 
                                  ${file.name}. It would contain educational content related to 
                                  the selected course.`;
            resolve(simulatedText);
        };
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Shuffle array elements
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
