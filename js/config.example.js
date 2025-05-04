/**
 * config.example.js - Example configuration file
 * 
 * This is a template for the configuration settings.
 * Copy this file to config.js and add your actual API keys.
 * The config.js file is excluded from git via .gitignore for security.
 */

const CONFIG = {
    openai: {
        apiKey: 'YOUR_OPENAI_API_KEY_HERE', // Replace with your actual API key
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000
    },
    
    app: {
        defaultCourse: 'biology',
        defaultExerciseType: 'multiple-choice',
        pointsPerQuestion: 10,
        levelThreshold: 100, // Points needed to level up
        confettiDuration: 3000
    },
    
    features: {
        enableDarkMode: true,
        enableCustomization: true,
        enablePdfUpload: true,
        enableSoundEffects: true,
        enableProgressBar: true
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
