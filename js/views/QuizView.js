/**
 * QuizView.js - Handles rendering of quiz components
 */
class QuizView {
    constructor() {
        this.root = ReactDOM.createRoot(document.getElementById('root'));
        this.progressBar = document.getElementById('progress-bar');
        this.pointsDisplay = document.getElementById('points');
        this.levelDisplay = document.getElementById('level');
        this.chapterSelect = document.getElementById('chapterselect');
        this.courseSelect = document.getElementById('courseselect');
        this.exerciseTypeSelect = document.getElementById('exerciseType');
        this.tabsContainer = document.getElementById('chapter-tabs');
        this.timerDisplay = document.getElementById('timer-display');
    }

    /**
     * Initialize view elements
     */
    initialize() {
        const userModel = new UserModel();
        const profile = userModel.getProfile();
        this.applyTheme(profile.theme);
        
        if (this.timerDisplay && profile.timedMode) {
            this.timerDisplay.style.display = 'block';
        } else if (this.timerDisplay) {
            this.timerDisplay.style.display = 'none';
        }
        
        const difficultyBadge = document.getElementById('difficulty-badge');
        if (difficultyBadge) {
            difficultyBadge.textContent = profile.difficulty.charAt(0).toUpperCase() + profile.difficulty.slice(1);
            difficultyBadge.className = `difficulty-badge ${profile.difficulty}`;
        }
    }

    /**
     * Render multiple choice questions
     * @param {Array} data - Question data
     * @param {Function} answerCallback - Callback for answer selection
     * @param {boolean} shuffle - Whether to shuffle questions and answers
     */
    async renderMultipleChoice(data, answerCallback, shuffle = true) {
        const elements = data.map((datum, index) => {
            return (
                <section className="chapter" key={index}>
                    <div className="box">
                        <div className="title">
                            <h3>{datum.question}</h3>
                        </div>
                        <div className="answers">
                            <ol>
                                {(() => {
                                    if (datum.answer1 && datum.answer1.trim() !== '') {
                                        return (
                                            <li>
                                                <button className="ansbtn" id={`button-${index}-0`}
                                                        onClick={() => answerCallback(index, "answer1", 0, data)}>
                                                    {datum.answer1}
                                                </button>
                                            </li>
                                        )
                                    }
                                    return null;
                                })()}
                                {(() => {
                                    if (datum.answer2 && datum.answer2.trim() !== '') {
                                        return (
                                            <li>
                                                <button className="ansbtn" id={`button-${index}-1`}
                                                        onClick={() => answerCallback(index, "answer2", 1, data)}>
                                                    {datum.answer2}
                                                </button>
                                            </li>
                                        )
                                    }
                                    return null;
                                })()}
                                {(() => {
                                    if (datum.answer3 && datum.answer3.trim() !== '') {
                                        return (
                                            <li>
                                                <button className="ansbtn" id={`button-${index}-2`}
                                                        onClick={() => answerCallback(index, "answer3", 2, data)}>
                                                    {datum.answer3}
                                                </button>
                                            </li>
                                        )
                                    }
                                    return null;
                                })()}
                                {(() => {
                                    if (datum.answer4 && datum.answer4.trim() !== '') {
                                        return (
                                            <li>
                                                <button className="ansbtn" id={`button-${index}-3`}
                                                        onClick={() => answerCallback(index, "answer4", 3, data)}>
                                                    {datum.answer4}
                                                </button>
                                            </li>
                                        )
                                    }
                                    return null;
                                })()}
                            </ol>
                        </div>
                        <div className="texts">
                            <div id={`statushere-${index}`}></div>
                        </div>
                    </div>
                </section>
            );
        });

        await this.root.render(<div>{elements}</div>);
        
        if (shuffle) {
            await this.delay(100);
            document.getElementById('root').querySelectorAll("ol").forEach(el => this.shuffleChildren(el));
            this.shuffleChildren(document.getElementById('root'));
        }
        
        document.getElementById('root').style.visibility = "visible";
    }

    /**
     * Render matching exercises
     * @param {Array} data - Matching exercise data
     * @param {Function} answerCallback - Callback for answer selection
     */
    renderMatching(data, answerCallback) {
        const elements = data.map((exercise, index) => {
            const terms = exercise.terms;
            const definitions = [...exercise.definitions];
            this.shuffleArray(definitions);
            
            return (
                <section className="chapter" key={index}>
                    <div className="box">
                        <div className="title">
                            <h3>{exercise.title || "Match the terms with their correct definitions"}</h3>
                        </div>
                        <div className="matching-exercise" id={`matching-${exercise.id}`}>
                            <div className="matching-columns">
                                <div className="terms-column">
                                    {terms.map((term, i) => (
                                        <div className="matching-item" key={`term-${i}`}>
                                            <span>{term}</span>
                                            <select 
                                                id={`select-${exercise.id}-${i}`} 
                                                className="matching-select"
                                                onChange={(e) => answerCallback(exercise, i, e.target.value)}
                                            >
                                                <option value="">-- Select definition --</option>
                                                {definitions.map((def, j) => (
                                                    <option key={`def-${j}`} value={def}>{def}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="texts">
                            <div id={`statushere-matching-${exercise.id}`}></div>
                        </div>
                    </div>
                </section>
            );
        });
        
        this.root.render(<div>{elements}</div>);
        document.getElementById('root').style.visibility = "visible";
    }

    /**
     * Update progress bar
     * @param {number} percentage - Percentage to fill (0-100)
     */
    updateProgressBar(percentage) {
        if (this.progressBar) {
            this.progressBar.style.width = `${percentage}%`;
        }
    }

    /**
     * Update points display
     * @param {number} points - Current points
     */
    updatePointsDisplay(points) {
        if (this.pointsDisplay) {
            this.pointsDisplay.textContent = points;
        }
    }

    /**
     * Update level display
     * @param {number} level - Current level
     */
    updateLevelDisplay(level) {
        if (this.levelDisplay) {
            this.levelDisplay.textContent = level;
        }
    }

    /**
     * Update timer display
     * @param {number} seconds - Seconds remaining
     */
    updateTimerDisplay(seconds) {
        if (this.timerDisplay) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            this.timerDisplay.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
            
            if (seconds < 10) {
                this.timerDisplay.style.color = 'red';
            } else if (seconds < 30) {
                this.timerDisplay.style.color = 'orange';
            } else {
                this.timerDisplay.style.color = 'black';
            }
        }
    }

    /**
     * Render chapter tabs
     * @param {Array} chapters - Chapter data
     * @param {Function} tabClickCallback - Callback for tab click
     */
    renderChapterTabs(chapters, tabClickCallback) {
        if (!this.tabsContainer) return;
        
        this.tabsContainer.innerHTML = "";
        
        chapters.forEach(chapter => {
            const tab = document.createElement("div");
            tab.className = "tab";
            tab.textContent = chapter.text;
            tab.dataset.value = chapter.value;
            tab.onclick = function() {
                document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
                this.classList.add("active");
                tabClickCallback(this.dataset.value);
            };
            this.tabsContainer.appendChild(tab);
        });
    }

    /**
     * Populate chapter select dropdown
     * @param {Array} chapters - Chapter data
     */
    populateChapterSelect(chapters) {
        if (!this.chapterSelect) return;
        
        this.chapterSelect.innerHTML = "";
        
        const defaultOption = document.createElement("option");
        defaultOption.value = "0";
        defaultOption.text = "Select chapter:";
        defaultOption.selected = true;
        this.chapterSelect.appendChild(defaultOption);
        
        chapters.forEach(chapter => {
            const option = document.createElement("option");
            option.value = chapter.value;
            option.text = chapter.text;
            this.chapterSelect.appendChild(option);
        });
    }

    /**
     * Set course select value
     * @param {string} course - Course name
     */
    setCourseSelect(course) {
        if (this.courseSelect) {
            this.courseSelect.value = course;
        }
    }

    /**
     * Set exercise type select value
     * @param {string} type - Exercise type
     */
    setExerciseTypeSelect(type) {
        if (this.exerciseTypeSelect) {
            this.exerciseTypeSelect.value = type;
        }
    }

    /**
     * Show success message
     * @param {string} elementId - Element ID to show message in
     * @param {string} message - Message to show
     */
    showSuccessMessage(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerText = `✅ ${message}`;
        }
    }

    /**
     * Show error message
     * @param {string} elementId - Element ID to show message in
     * @param {string} message - Message to show
     */
    showErrorMessage(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerText = message;
        }
    }

    /**
     * Disable answer buttons for a question
     * @param {number} questionId - Question ID
     */
    disableAnswerButtons(questionId) {
        for (let i = 0; i < 4; i++) {
            const button = document.getElementById(`button-${questionId}-${i}`);
            if (button) {
                button.disabled = true;
            }
        }
    }

    /**
     * Highlight correct answer button
     * @param {number} questionId - Question ID
     * @param {number} buttonIndex - Button index
     */
    highlightCorrectAnswer(questionId, buttonIndex) {
        const button = document.getElementById(`button-${questionId}-${buttonIndex}`);
        if (button) {
            button.style.backgroundColor = "#4BB543";
        }
    }

    /**
     * Apply theme to the page
     * @param {string} color - Theme color
     */
    applyTheme(color) {
        document.body.style.backgroundColor = color;
    }

    /**
     * Play correct answer sound
     */
    playCorrectSound() {
        const userModel = new UserModel();
        const profile = userModel.getProfile();
        
        if (profile.soundEnabled) {
            const audio = new Audio('./sounds/correct.mp3');
            audio.play().catch(error => {
                console.error('Error playing sound:', error);
            });
        }
    }

    /**
     * Show confetti animation
     */
    showConfetti() {
        window.confettiful = new Confettiful(document.querySelector('.js-container'));
    }

    /**
     * Utility: Shuffle children of an element
     * @param {Element} element - Element to shuffle children of
     */
    shuffleChildren(element) {
        for (let i = element.children.length; i >= 0; i--) {
            element.appendChild(element.children[Math.random() * i | 0]);
        }
    }

    /**
     * Utility: Shuffle array
     * @param {Array} array - Array to shuffle
     * @returns {Array} - Shuffled array
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Utility: Delay function
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} - Promise that resolves after delay
     */
    delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
}

window.QuizView = QuizView;
