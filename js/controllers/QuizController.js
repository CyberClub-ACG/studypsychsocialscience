/**
 * QuizController.js - Handles quiz logic and connects model and view
 */
class QuizController {
    constructor() {
        this.model = new QuizModel();
        this.view = new QuizView();
        this.userModel = new UserModel();
        this.timer = null;
        this.timerSeconds = 0;
    }

    /**
     * Initialize the quiz
     */
    async initialize() {
        if (!this.userModel.checkLogin()) {
            window.location.href = 'login.html';
            return;
        }

        this.view.initialize();
        
        this.setupEventListeners();
        
        await this.loadQuizData();
        
        this.updateUserInterface();
        
        this.startTimerIfEnabled();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        const chapterSelect = document.getElementById('chapterselect');
        if (chapterSelect) {
            chapterSelect.addEventListener('change', (event) => this.handleChapterChange(event));
        }
        
        const courseSelect = document.getElementById('courseselect');
        if (courseSelect) {
            courseSelect.addEventListener('change', (event) => this.handleCourseChange(event));
        }
        
        const exerciseTypeSelect = document.getElementById('exerciseType');
        if (exerciseTypeSelect) {
            exerciseTypeSelect.addEventListener('change', (event) => this.handleExerciseTypeChange(event));
        }
        
        const submitButton = document.getElementById('submit');
        if (submitButton) {
            submitButton.addEventListener('click', () => this.handleSubmit());
        }
        
        const logoutButton = document.getElementById('logout-btn');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => this.handleLogout());
        }
        
        const customizeButton = document.getElementById('customize-btn');
        if (customizeButton) {
            customizeButton.addEventListener('click', () => this.toggleCustomizePanel());
        }
        
        const uploadButton = document.getElementById('upload-btn');
        if (uploadButton) {
            uploadButton.addEventListener('click', () => this.toggleUploadPanel());
        }
        
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleThemeChange(btn.dataset.color));
        });
        
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleDifficultyChange(btn.dataset.difficulty));
        });
        
        const timedModeToggle = document.getElementById('timed-mode-toggle');
        if (timedModeToggle) {
            timedModeToggle.addEventListener('change', (event) => this.handleTimedModeChange(event.target.checked));
        }
        
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', (event) => this.handleSoundChange(event.target.checked));
        }
        
        const timerDurationInput = document.getElementById('timer-duration');
        if (timerDurationInput) {
            timerDurationInput.addEventListener('change', (event) => this.handleTimerDurationChange(event.target.value));
        }
        
        const pdfUploadForm = document.getElementById('pdf-upload-form');
        if (pdfUploadForm) {
            pdfUploadForm.addEventListener('submit', (event) => this.handlePdfUpload(event));
        }
    }

    /**
     * Load quiz data
     */
    async loadQuizData() {
        const data = await this.model.loadData();
        
        if (this.model.currentExerciseType === 'multiple-choice') {
            await this.view.renderMultipleChoice(data, (index, answer, buttonIndex, data) => 
                this.handleAnswerSelection(index, answer, buttonIndex, data));
        } else if (this.model.currentExerciseType === 'matching') {
            this.view.renderMatching(data, (exercise, termIndex, selectedDefinition) => 
                this.handleMatchingSelection(exercise, termIndex, selectedDefinition));
        }
        
        const chapters = this.model.getChapters();
        this.view.populateChapterSelect(chapters);
        
        const tabChapters = this.model.getTabChapters();
        this.view.renderChapterTabs(tabChapters, (chapter) => this.handleTabClick(chapter));
        
        this.view.setCourseSelect(this.model.currentCourse);
        this.view.setExerciseTypeSelect(this.model.currentExerciseType);
    }

    /**
     * Update user interface
     */
    updateUserInterface() {
        const profile = this.userModel.getProfile();
        
        this.view.updatePointsDisplay(profile.points);
        this.view.updateLevelDisplay(profile.level);
        
        this.view.updateProgressBar(profile.levelProgress * 100);
        
        this.view.applyTheme(profile.theme);
    }

    /**
     * Start timer if enabled
     */
    startTimerIfEnabled() {
        const profile = this.userModel.getProfile();
        
        if (profile.timedMode) {
            this.timerSeconds = profile.timerDuration;
            this.view.updateTimerDisplay(this.timerSeconds);
            
            this.timer = setInterval(() => {
                this.timerSeconds--;
                this.view.updateTimerDisplay(this.timerSeconds);
                
                if (this.timerSeconds <= 0) {
                    clearInterval(this.timer);
                    this.handleTimeUp();
                }
            }, 1000);
        }
    }

    /**
     * Handle chapter change
     * @param {Event} event - Change event
     */
    handleChapterChange(event) {
        const chapter = event.target.value;
        const filteredData = this.model.filterByChapter(chapter);
        
        if (this.model.currentExerciseType === 'multiple-choice') {
            this.view.renderMultipleChoice(filteredData, (index, answer, buttonIndex, data) => 
                this.handleAnswerSelection(index, answer, buttonIndex, data));
        } else if (this.model.currentExerciseType === 'matching') {
            this.view.renderMatching(filteredData, (exercise, termIndex, selectedDefinition) => 
                this.handleMatchingSelection(exercise, termIndex, selectedDefinition));
        }
    }

    /**
     * Handle course change
     * @param {Event} event - Change event
     */
    async handleCourseChange(event) {
        const course = event.target.value;
        this.model.setCourse(course);
        
        await this.loadQuizData();
    }

    /**
     * Handle exercise type change
     * @param {Event} event - Change event
     */
    async handleExerciseTypeChange(event) {
        const type = event.target.value;
        this.model.setExerciseType(type);
        
        await this.loadQuizData();
    }

    /**
     * Handle answer selection for multiple choice
     * @param {number} index - Question index
     * @param {string} answer - Selected answer
     * @param {number} buttonIndex - Button index
     * @param {Array} data - Question data
     */
    handleAnswerSelection(index, answer, buttonIndex, data) {
        const question = data[index];
        
        if (answer === question.correct) {
            this.view.showSuccessMessage(`statushere-${index}`, "Correct!");
            this.view.disableAnswerButtons(index);
            
            const pointsEarned = this.model.recordCorrectAnswer(index, question.chapter);
            this.userModel.addPoints(pointsEarned);
            
            this.updateUserInterface();
            
            this.view.playCorrectSound();
        } else {
            this.view.showErrorMessage(`statushere-${index}`, "Try again!");
            
            const button = document.getElementById(`button-${index}-${buttonIndex}`);
            if (button) {
                button.disabled = true;
            }
        }
    }

    /**
     * Handle matching selection
     * @param {Object} exercise - Matching exercise
     * @param {number} termIndex - Term index
     * @param {string} selectedDefinition - Selected definition
     */
    handleMatchingSelection(exercise, termIndex, selectedDefinition) {
        const correctDefinition = exercise.definitions[termIndex];
        
        if (selectedDefinition === correctDefinition) {
            this.view.showSuccessMessage(`statushere-matching-${exercise.id}`, "Correct match!");
            
            const pointsEarned = this.model.recordCorrectAnswer(termIndex, exercise.chapter);
            this.userModel.addPoints(pointsEarned);
            
            this.updateUserInterface();
            
            this.view.playCorrectSound();
            
            const select = document.getElementById(`select-${exercise.id}-${termIndex}`);
            if (select) {
                select.disabled = true;
            }
        } else if (selectedDefinition) {
            this.view.showErrorMessage(`statushere-matching-${exercise.id}`, "Try again!");
        }
    }

    /**
     * Handle tab click
     * @param {string} chapter - Selected chapter
     */
    handleTabClick(chapter) {
        const filteredData = this.model.filterByChapter(chapter);
        
        if (this.model.currentExerciseType === 'multiple-choice') {
            this.view.renderMultipleChoice(filteredData, (index, answer, buttonIndex, data) => 
                this.handleAnswerSelection(index, answer, buttonIndex, data));
        } else if (this.model.currentExerciseType === 'matching') {
            this.view.renderMatching(filteredData, (exercise, termIndex, selectedDefinition) => 
                this.handleMatchingSelection(exercise, termIndex, selectedDefinition));
        }
    }

    /**
     * Handle submit button click
     */
    handleSubmit() {
        if (this.model.isQuizComplete()) {
            this.view.showConfetti();
            
            const bonusPoints = 20;
            this.userModel.addPoints(bonusPoints);
            
            this.updateUserInterface();
            
            if (this.timer) {
                clearInterval(this.timer);
            }
        } else {
            alert("Please answer all questions correctly before submitting!");
        }
    }

    /**
     * Handle logout button click
     */
    handleLogout() {
        this.userModel.logout();
        window.location.href = 'login.html';
    }

    /**
     * Toggle customize panel
     */
    toggleCustomizePanel() {
        const panel = document.getElementById('customize-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        }
    }

    /**
     * Toggle upload panel
     */
    toggleUploadPanel() {
        const panel = document.getElementById('upload-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        }
    }

    /**
     * Handle theme change
     * @param {string} color - Theme color
     */
    handleThemeChange(color) {
        this.userModel.setTheme(color);
        this.view.applyTheme(color);
    }

    /**
     * Handle difficulty change
     * @param {string} difficulty - Difficulty level
     */
    handleDifficultyChange(difficulty) {
        this.userModel.setDifficulty(difficulty);
        
        const difficultyBadge = document.getElementById('difficulty-badge');
        if (difficultyBadge) {
            difficultyBadge.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
            difficultyBadge.className = `difficulty-badge ${difficulty}`;
        }
    }

    /**
     * Handle timed mode change
     * @param {boolean} enabled - Whether timed mode is enabled
     */
    handleTimedModeChange(enabled) {
        this.userModel.setTimedMode(enabled);
        
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.style.display = enabled ? 'block' : 'none';
        }
        
        if (enabled) {
            this.startTimerIfEnabled();
        } else if (this.timer) {
            clearInterval(this.timer);
        }
    }

    /**
     * Handle sound change
     * @param {boolean} enabled - Whether sound is enabled
     */
    handleSoundChange(enabled) {
        this.userModel.setSoundEnabled(enabled);
    }

    /**
     * Handle timer duration change
     * @param {number} duration - Timer duration in seconds
     */
    handleTimerDurationChange(duration) {
        this.userModel.setTimerDuration(duration);
        
        if (this.timer) {
            clearInterval(this.timer);
            this.startTimerIfEnabled();
        }
    }

    /**
     * Handle time up
     */
    handleTimeUp() {
        alert("Time's up! Your quiz has ended.");
        
        document.querySelectorAll('button.ansbtn').forEach(btn => {
            btn.disabled = true;
        });
        
        document.querySelectorAll('select.matching-select').forEach(select => {
            select.disabled = true;
        });
    }

    /**
     * Handle PDF upload
     * @param {Event} event - Submit event
     */
    async handlePdfUpload(event) {
        event.preventDefault();
        
        const fileInput = document.getElementById('pdf-file');
        const courseSelect = document.getElementById('pdf-course');
        
        if (fileInput && fileInput.files.length > 0 && courseSelect) {
            const file = fileInput.files[0];
            const course = courseSelect.value;
            
            const uploadStatus = document.getElementById('upload-status');
            if (uploadStatus) {
                uploadStatus.textContent = "Processing PDF...";
                uploadStatus.style.color = "blue";
            }
            
            try {
                const pdfText = await extractTextFromPDF(file);
                
                const questions = await generateQuestionsFromPDF(pdfText, course);
                
                if (questions && questions.multipleChoice) {
                    if (uploadStatus) {
                        uploadStatus.textContent = "Questions generated successfully!";
                        uploadStatus.style.color = "green";
                    }
                    
                    setTimeout(() => {
                        alert(`Generated ${questions.multipleChoice.length} multiple choice questions, ${questions.fillIn.length} fill-in questions, and ${questions.matching.length} matching exercises from your PDF.`);
                        
                        document.getElementById('pdf-upload-form').reset();
                        
                        this.toggleUploadPanel();
                    }, 1500);
                } else {
                    throw new Error("Failed to generate questions");
                }
            } catch (error) {
                console.error("Error processing PDF:", error);
                
                if (uploadStatus) {
                    uploadStatus.textContent = "Error processing PDF. Please try again.";
                    uploadStatus.style.color = "red";
                }
            }
        }
    }
}

window.QuizController = QuizController;
