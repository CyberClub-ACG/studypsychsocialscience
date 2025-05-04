/**
 * QuizModel.js - Handles data management for quizzes
 */
class QuizModel {
    constructor() {
        this.currentCourse = localStorage.getItem('currentCourse') || CONFIG.APP_SETTINGS.DEFAULT_COURSE;
        this.currentExerciseType = localStorage.getItem('currentExerciseType') || 'multiple-choice';
        this.questionData = [];
        this.originalData = [];
        this.questionCount = 0;
        this.correctAnswers = 0;
    }

    /**
     * Load quiz data based on current course and exercise type
     * @returns {Promise<Array>} - Quiz data
     */
    async loadData() {
        let dataFile;
        
        switch (this.currentExerciseType) {
            case 'multiple-choice':
                dataFile = this.currentCourse === "psychology" ? './json/data.json' : 
                          this.currentCourse === "biology" ? './json/biology-data.json' : './json/physics-data.json';
                break;
            case 'fill-in':
                dataFile = this.currentCourse === "psychology" ? './json/fillindata.json' : 
                          this.currentCourse === "biology" ? './json/biology-fillindata.json' : './json/physics-fillindata.json';
                break;
            case 'matching':
                dataFile = `./json/${this.currentCourse}-matching.json`;
                break;
            default:
                dataFile = this.currentCourse === "psychology" ? './json/data.json' : 
                          this.currentCourse === "biology" ? './json/biology-data.json' : './json/physics-data.json';
        }
        
        try {
            const response = await fetch(dataFile);
            const data = await response.json();
            this.questionData = data;
            this.originalData = [...data];
            this.questionCount = data.length;
            this.correctAnswers = 0;
            return data;
        } catch (error) {
            console.error('Error loading quiz data:', error);
            return [];
        }
    }

    /**
     * Filter data by chapter
     * @param {string} chapter - Chapter to filter by
     * @returns {Array} - Filtered data
     */
    filterByChapter(chapter) {
        if (chapter === "0") {
            this.questionData = [...this.originalData];
            this.questionCount = this.questionData.length;
            return this.questionData;
        }
        
        const filteredData = this.originalData.filter(item => item.chapter === chapter);
        this.questionData = filteredData;
        this.questionCount = filteredData.length;
        return filteredData;
    }

    /**
     * Set current course
     * @param {string} course - Course name
     */
    setCourse(course) {
        this.currentCourse = course;
        localStorage.setItem('currentCourse', course);
    }

    /**
     * Set current exercise type
     * @param {string} type - Exercise type
     */
    setExerciseType(type) {
        this.currentExerciseType = type;
        localStorage.setItem('currentExerciseType', type);
    }

    /**
     * Get available chapters for current course
     * @returns {Array} - Array of chapter objects with value and text
     */
    getChapters() {
        const chapters = [];
        
        if (this.currentCourse === "psychology") {
            chapters.push({ value: "chapter-1", text: "Introduction to Psychology" });
            chapters.push({ value: "chapter-2", text: "Conducting Research in Psychology" });
            chapters.push({ value: "chapter-5", text: "Human Development" });
            chapters.push({ value: "chapter-10", text: "Intelligence, Problem Solving, and Creativity" });
            chapters.push({ value: "chapter-12", text: "Stress and Health" });
            chapters.push({ value: "chapter-13", text: "Personality: The Uniqueness of the Individual" });
            chapters.push({ value: "chapter-14", text: "Social Behavior" });
            chapters.push({ value: "chapter-15", text: "Psychological Disorders" });
            chapters.push({ value: "chapter-16", text: "Treatment of Psychological Disorders" });
        } else if (this.currentCourse === "biology") {
            chapters.push({ value: "bio-chapter-1", text: "Introduction to Biology" });
            chapters.push({ value: "bio-chapter-2", text: "Cell Structure and Function" });
            chapters.push({ value: "bio-chapter-3", text: "Genetics and Inheritance" });
            chapters.push({ value: "bio-chapter-4", text: "Evolution and Diversity" });
            chapters.push({ value: "bio-chapter-5", text: "Plant Structure and Function" });
            chapters.push({ value: "bio-chapter-6", text: "Animal Structure and Function" });
            chapters.push({ value: "bio-chapter-7", text: "Ecology and Ecosystems" });
        } else if (this.currentCourse === "physics") {
            chapters.push({ value: "physics-chapter-1", text: "Mechanics and Motion" });
            chapters.push({ value: "physics-chapter-2", text: "Electricity and Magnetism" });
            chapters.push({ value: "physics-chapter-3", text: "Waves and Optics" });
            chapters.push({ value: "physics-chapter-4", text: "Modern Physics" });
            chapters.push({ value: "physics-chapter-5", text: "Thermodynamics" });
            chapters.push({ value: "physics-chapter-6", text: "Particle Physics" });
            chapters.push({ value: "physics-chapter-7", text: "Fluid Mechanics" });
        }
        
        return chapters;
    }

    /**
     * Get tab chapters for current course (subset of all chapters)
     * @returns {Array} - Array of tab chapter objects with value and text
     */
    getTabChapters() {
        const tabChapters = [];
        
        if (this.currentCourse === "psychology") {
            tabChapters.push({ value: "chapter-1", text: "Intro to Psychology" });
            tabChapters.push({ value: "chapter-5", text: "Human Development" });
            tabChapters.push({ value: "chapter-10", text: "Intelligence" });
            tabChapters.push({ value: "chapter-14", text: "Social Behavior" });
        } else if (this.currentCourse === "biology") {
            tabChapters.push({ value: "bio-chapter-1", text: "Intro to Biology" });
            tabChapters.push({ value: "bio-chapter-2", text: "Cell Structure" });
            tabChapters.push({ value: "bio-chapter-3", text: "Genetics" });
            tabChapters.push({ value: "bio-chapter-4", text: "Evolution" });
            tabChapters.push({ value: "bio-chapter-7", text: "Ecology" });
        } else if (this.currentCourse === "physics") {
            tabChapters.push({ value: "physics-chapter-1", text: "Mechanics" });
            tabChapters.push({ value: "physics-chapter-2", text: "Electricity" });
            tabChapters.push({ value: "physics-chapter-3", text: "Waves" });
            tabChapters.push({ value: "physics-chapter-4", text: "Modern Physics" });
        }
        
        return tabChapters;
    }

    /**
     * Record a correct answer
     * @param {number} questionIndex - Index of the question
     * @param {string} chapter - Chapter of the question
     * @returns {number} - Points earned
     */
    recordCorrectAnswer(questionIndex, chapter) {
        this.correctAnswers++;
        return this.calculatePoints(1, chapter);
    }

    /**
     * Calculate points based on difficulty and number of questions
     * @param {number} questionCount - Number of questions answered correctly
     * @param {string} chapter - Chapter identifier
     * @returns {number} - Points earned
     */
    calculatePoints(questionCount, chapter) {
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
     * Check if all questions are answered correctly
     * @returns {boolean} - True if all questions are answered correctly
     */
    isQuizComplete() {
        return this.correctAnswers === this.questionCount;
    }

    /**
     * Get completion percentage
     * @returns {number} - Percentage of questions answered correctly
     */
    getCompletionPercentage() {
        return this.questionCount > 0 ? (this.correctAnswers / this.questionCount) * 100 : 0;
    }
}

window.QuizModel = QuizModel;
