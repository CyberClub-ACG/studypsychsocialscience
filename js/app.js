/**
 * Main application module for My Goal Learning
 * This module handles the core functionality of the application
 */

let questionsnumber = 0;
let correctanswers = 0;
let datajson = [];
let originaldatajson = [];
let currentCourse = "biology"; // Default to biology
let currentExerciseType = "multiple-choice";

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

/**
 * Initialize the application
 */
async function init() {
    checkLogin();
    
    datajson = await getData();
    originaldatajson = datajson;
    
    await showData(datajson);
    
    loadSavedSettings();
    updateProgressBar();
    
    const points = loadPoints();
    document.getElementById('points').textContent = points;
    
    const level = loadLevel();
    document.getElementById('level').textContent = level;
    
    updateChapterTabs();
}

/**
 * Get data for the current course
 * @returns {Promise<Array>} - Array of questions
 */
async function getData() {
    const dataFile = currentCourse === "psychology" ? './json/data.json' : 
                    currentCourse === "biology" ? './json/biology-data.json' : './json/physics-data.json';
    
    return await fetch(dataFile)
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
            console.log(error);
            return [];
        });
}

/**
 * Show data with shuffling
 * @param {Array} datatoshow - Array of questions to display
 */
async function showData(datatoshow) {
    let elements = [];
    await datatoshow.forEach((datum, index) => {
        const element = (
            <section className="chapter" key={index}>
                <div className="box">
                    <div className="title">
                        <h3>{datum.question}</h3>
                    </div>
                    <div className="answers">
                        <ol>
                            {(() => {
                                if (datum.answer1.trim() !== '') {
                                    return (
                                        <li>
                                            <button className="ansbtn" id={"button-" + index + "-0"}
                                                    onClick={() => testAnswer(index, "answer1", 0, datatoshow)}>
                                                {datum.answer1}
                                            </button>
                                        </li>
                                    )
                                }
                                return null;
                            })()}
                            {(() => {
                                if (datum.answer2.trim() !== '') {
                                    return (
                                        <li>
                                            <button className="ansbtn" id={"button-" + index + "-1"}
                                                    onClick={() => testAnswer(index, "answer2", 1, datatoshow)}>
                                                {datum.answer2}
                                            </button>
                                        </li>
                                    )
                                }
                                return null;
                            })()}
                            {(() => {
                                if (datum.answer3.trim() !== '') {
                                    return (
                                        <li>
                                            <button className="ansbtn" id={"button-" + index + "-2"}
                                                    onClick={() => testAnswer(index, "answer3", 2, datatoshow)}>
                                                {datum.answer3}
                                            </button>
                                        </li>
                                    )
                                }
                                return null;
                            })()}
                            {(() => {
                                if (datum.answer4.trim() !== '') {
                                    return (
                                        <li>
                                            <button className="ansbtn" id={"button-" + index + "-3"}
                                                    onClick={() => testAnswer(index, "answer4", 3, datatoshow)}>
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
                        <div id={"statushere-" + index}>
                        </div>
                    </div>
                </div>
            </section>
        );

        elements.push(element);
    });

    questionsnumber = datatoshow.length;

    await root.render(elements);
    await delay(100);
    document.getElementById('root').querySelectorAll("ol").forEach(el => el.shuffleChildren());
    document.getElementById('root').shuffleChildren();
    document.getElementById('root').style.visibility = "visible";
    
    updateProgress(questionsnumber);
}

/**
 * Show data without shuffling
 * @param {Array} datatoshow - Array of questions to display
 */
async function showDataWithNoShuffle(datatoshow) {
    let elements = [];
    await datatoshow.forEach((datum, index) => {
        const element = (
            <section className="chapter" key={index}>
                <div className="box">
                    <div className="title">
                        <h3>{datum.question}</h3>
                    </div>
                    <div className="answers">
                        <ol>
                            {(() => {
                                if (datum.answer1.trim() !== '') {
                                    return (
                                        <li>
                                            <button className="ansbtn" id={"button-" + index + "-0"}
                                                    onClick={() => testAnswer(index, "answer1", 0, datatoshow)}>
                                                {datum.answer1}
                                            </button>
                                        </li>
                                    )
                                }
                                return null;
                            })()}
                            {(() => {
                                if (datum.answer2.trim() !== '') {
                                    return (
                                        <li>
                                            <button className="ansbtn" id={"button-" + index + "-1"}
                                                    onClick={() => testAnswer(index, "answer2", 1, datatoshow)}>
                                                {datum.answer2}
                                            </button>
                                        </li>
                                    )
                                }
                                return null;
                            })()}
                            {(() => {
                                if (datum.answer3.trim() !== '') {
                                    return (
                                        <li>
                                            <button className="ansbtn" id={"button-" + index + "-2"}
                                                    onClick={() => testAnswer(index, "answer3", 2, datatoshow)}>
                                                {datum.answer3}
                                            </button>
                                        </li>
                                    )
                                }
                                return null;
                            })()}
                            {(() => {
                                if (datum.answer4.trim() !== '') {
                                    return (
                                        <li>
                                            <button className="ansbtn" id={"button-" + index + "-3"}
                                                    onClick={() => testAnswer(index, "answer4", 3, datatoshow)}>
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
                        <div id={"statushere-" + index}>
                        </div>
                    </div>
                </div>
            </section>
        );

        elements.push(element);
    });

    questionsnumber = datatoshow.length;
    correctanswers = 0;

    await root.render(elements);
    updateProgress(questionsnumber);
}

/**
 * Clean up errors and correct answers
 */
function cleanUpErrorsCorrects() {
    const nodestexts = document.getElementsByClassName("texts");

    for (let i = 0; i < nodestexts.length; i++) {
        nodestexts[i].childNodes.forEach(node => node.textContent = "");
    }

    const nodes = document.getElementsByClassName("ansbtn");

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].disabled = false;
        nodes[i].style.backgroundColor === "#4BB543" ? "#4BB543" : "#004E64";
    }
}

/**
 * Change course
 * @param {Event} event - Change event
 */
function changeCourse(event) {
    currentCourse = event.target.value;
    updateChapterOptions();
    updateChapterTabs();
    init();
}

/**
 * Change exercise type
 * @param {Event} event - Change event
 */
function changeExerciseType(event) {
    currentExerciseType = event.target.value;
    
    if (currentExerciseType === "fill-in") {
        window.location.href = "html/fillin.html";
    } else if (currentExerciseType === "matching") {
        loadMatchingExercises();
    } else if (currentExerciseType === "mixed") {
        loadMixedExercises();
    } else {
        init();
    }
}

/**
 * Load matching exercises
 */
function loadMatchingExercises() {
    fetch(`./json/${currentCourse}-matching.json`)
        .then(response => response.json())
        .then(data => {
            let dataToShow = data;
            const chapterValue = document.getElementById("chapterselect").value;
            if (chapterValue !== "0") {
                dataToShow = data.filter(item => item.chapter === chapterValue);
            }
            
            if (dataToShow.length === 0) {
                root.render(<div>No matching exercises available for this selection.</div>);
                document.getElementById('root').style.visibility = "visible";
                return;
            }
            
            renderMatchingExercises(dataToShow);
        })
        .catch(error => {
            console.error('Error loading matching exercises:', error);
            root.render(<div>Error loading matching exercises. Please try again.</div>);
            document.getElementById('root').style.visibility = "visible";
        });
}

/**
 * Render matching exercises
 * @param {Array} data - Array of matching exercises
 */
function renderMatchingExercises(data) {
    questionsnumber = data.length;
    correctanswers = 0;
    
    const elements = data.map((exercise, index) => {
        const terms = exercise.terms;
        const definitions = [...exercise.definitions];
        shuffleArray(definitions);
        
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
                                            onChange={(e) => checkMatchingAnswer(exercise, i, e.target.value)}
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
    
    root.render(<div>{elements}</div>);
    document.getElementById('root').style.visibility = "visible";
    updateProgress(questionsnumber);
}

/**
 * Check matching answer
 * @param {Object} exercise - Matching exercise
 * @param {number} termIndex - Index of the term
 * @param {string} selectedDefinition - Selected definition
 */
function checkMatchingAnswer(exercise, termIndex, selectedDefinition) {
    const termText = exercise.terms[termIndex];
    const correctDefinition = exercise.definitions[termIndex];
    
    const selectElement = document.getElementById(`select-${exercise.id}-${termIndex}`);
    
    if (selectedDefinition === correctDefinition) {
        selectElement.style.backgroundColor = "#4BB543";
        selectElement.disabled = true;
        
        playCorrectSound();
        
        const allSelects = document.querySelectorAll(`[id^="select-${exercise.id}-"]`);
        const allCorrect = Array.from(allSelects).every(select => 
            select.disabled || select.value === ""
        );
        
        if (allCorrect) {
            document.getElementById(`statushere-matching-${exercise.id}`).innerText = 
                "✅ Great job! You've correctly matched all items!";
            correctanswers++;
            
            const pointsEarned = calculatePoints(1, exercise.chapter);
            updatePoints(pointsEarned);
            
            updateProgress(questionsnumber);
        }
    } else if (selectedDefinition !== "") {
        selectElement.style.backgroundColor = "#FF3333";
        setTimeout(() => {
            selectElement.style.backgroundColor = "";
            selectElement.value = "";
        }, 1000);
    }
}

/**
 * Load mixed exercises
 */
function loadMixedExercises() {
    Promise.all([
        fetch(currentCourse === "psychology" ? './json/data.json' : 
              currentCourse === "biology" ? './json/biology-data.json' : './json/physics-data.json')
            .then(response => response.json()),
        fetch(`./json/${currentCourse}-matching.json`)
            .then(response => response.json())
    ])
    .then(([mcData, matchingData]) => {
        const mcQuestions = mcData.slice(0, 3);
        
        const matchingExercise = matchingData.length > 0 ? [matchingData[0]] : [];
        
        if (mcQuestions.length > 0) {
            questionsnumber = mcQuestions.length + (matchingExercise.length > 0 ? 1 : 0);
            correctanswers = 0;
            
            showDataWithNoShuffle(mcQuestions);
            
            if (matchingExercise.length > 0) {
                setTimeout(() => {
                    const matchingElement = renderMatchingExercises(matchingExercise);
                    document.getElementById('root').appendChild(matchingElement);
                }, 500);
            }
        } else {
            root.render(<div>No mixed exercises available for this selection.</div>);
            document.getElementById('root').style.visibility = "visible";
        }
    })
    .catch(error => {
        console.error('Error loading mixed exercises:', error);
        root.render(<div>Error loading mixed exercises. Please try again.</div>);
        document.getElementById('root').style.visibility = "visible";
    });
}

/**
 * Update chapter tabs
 */
function updateChapterTabs() {
    const tabsContainer = document.getElementById("chapter-tabs");
    tabsContainer.innerHTML = "";
    
    if (currentCourse === "psychology") {
        createTab(tabsContainer, "chapter-1", "Intro to Psychology");
        createTab(tabsContainer, "chapter-5", "Human Development");
        createTab(tabsContainer, "chapter-10", "Intelligence");
        createTab(tabsContainer, "chapter-14", "Social Behavior");
    } else if (currentCourse === "biology") {
        createTab(tabsContainer, "bio-chapter-1", "Intro to Biology");
        createTab(tabsContainer, "bio-chapter-2", "Cell Structure");
        createTab(tabsContainer, "bio-chapter-3", "Genetics");
        createTab(tabsContainer, "bio-chapter-4", "Evolution");
        createTab(tabsContainer, "bio-chapter-7", "Ecology");
    } else if (currentCourse === "physics") {
        createTab(tabsContainer, "physics-chapter-1", "Mechanics");
        createTab(tabsContainer, "physics-chapter-2", "Electricity");
        createTab(tabsContainer, "physics-chapter-3", "Waves");
        createTab(tabsContainer, "physics-chapter-4", "Modern Physics");
    }
}

/**
 * Create tab
 * @param {HTMLElement} container - Container element
 * @param {string} value - Tab value
 * @param {string} text - Tab text
 */
function createTab(container, value, text) {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.textContent = text;
    tab.dataset.value = value;
    tab.onclick = function() {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        
        this.classList.add("active");
        
        document.getElementById("chapterselect").value = this.dataset.value;
        
        const event = new Event("change");
        document.getElementById("chapterselect").dispatchEvent(event);
    };
    container.appendChild(tab);
}

/**
 * Update chapter options
 */
function updateChapterOptions() {
    const chapterSelect = document.getElementById("chapterselect");
    chapterSelect.innerHTML = "";
    
    const defaultOption = document.createElement("option");
    defaultOption.value = "0";
    defaultOption.text = "Select chapter:";
    defaultOption.selected = true;
    chapterSelect.appendChild(defaultOption);
    
    if (currentCourse === "psychology") {
        addChapterOption(chapterSelect, "chapter-1", "Introduction to Psychology");
        addChapterOption(chapterSelect, "chapter-2", "Conducting Research in Psychology");
        addChapterOption(chapterSelect, "chapter-5", "Human Development");
        addChapterOption(chapterSelect, "chapter-10", "Intelligence, Problem Solving, and Creativity");
        addChapterOption(chapterSelect, "chapter-12", "Stress and Health");
        addChapterOption(chapterSelect, "chapter-13", "Personality: The Uniqueness of the Individual");
        addChapterOption(chapterSelect, "chapter-14", "Social Behavior");
        addChapterOption(chapterSelect, "chapter-15", "Psychological Disorders");
        addChapterOption(chapterSelect, "chapter-16", "Treatment of Psychological Disorders");
    } else if (currentCourse === "biology") {
        addChapterOption(chapterSelect, "bio-chapter-1", "Introduction to Biology");
        addChapterOption(chapterSelect, "bio-chapter-2", "Cell Structure and Function");
        addChapterOption(chapterSelect, "bio-chapter-3", "Genetics and Inheritance");
        addChapterOption(chapterSelect, "bio-chapter-4", "Evolution and Diversity");
        addChapterOption(chapterSelect, "bio-chapter-5", "Plant Structure and Function");
        addChapterOption(chapterSelect, "bio-chapter-6", "Animal Structure and Function");
        addChapterOption(chapterSelect, "bio-chapter-7", "Ecology and Ecosystems");
    } else if (currentCourse === "physics") {
        addChapterOption(chapterSelect, "physics-chapter-1", "Mechanics and Motion");
        addChapterOption(chapterSelect, "physics-chapter-2", "Electricity and Magnetism");
        addChapterOption(chapterSelect, "physics-chapter-3", "Waves and Optics");
        addChapterOption(chapterSelect, "physics-chapter-4", "Modern Physics");
        addChapterOption(chapterSelect, "physics-chapter-5", "Thermodynamics");
        addChapterOption(chapterSelect, "physics-chapter-6", "Particle Physics");
        addChapterOption(chapterSelect, "physics-chapter-7", "Fluid Mechanics");
    }
}

/**
 * Add chapter option
 * @param {HTMLSelectElement} selectElement - Select element
 * @param {string} value - Option value
 * @param {string} text - Option text
 */
function addChapterOption(selectElement, value, text) {
    const option = document.createElement("option");
    option.value = value;
    option.text = text;
    selectElement.appendChild(option);
}

/**
 * Show only questions from selected chapter
 * @param {Event} event - Change event
 */
function showOnly(event) {
    datajson = [...originaldatajson];

    let val = event.target.value;
    let datatoshow = [];
    if (val === "0") {
        showData(originaldatajson);
        return;
    }

    Object.entries(datajson).forEach(([key, value]) => {
        if (value.chapter === val)
            datatoshow.push(value);
    });

    cleanUpErrorsCorrects();

    datajson = [];
    datajson = [...datatoshow];
    showData(datatoshow);
}

/**
 * Gray out buttons
 * @param {number} index - Question index
 */
function grayOutButtons(index) {
    const button1 = document.getElementById("button-" + index + "-" + 0);
    if (button1) {
        button1.disabled = true;
    }
    const button2 = document.getElementById("button-" + index + "-" + 1);
    if (button2) {
        button2.disabled = true;
    }
    const button3 = document.getElementById("button-" + index + "-" + 2);
    if (button3) {
        button3.disabled = true;
    }
    const button4 = document.getElementById("button-" + index + "-" + 3);
    if (button4) {
        button4.disabled = true;
    }
}

/**
 * Test answer
 * @param {number} index - Question index
 * @param {string} answerselected - Selected answer
 * @param {number} indexBtn - Button index
 * @param {Array} data - Question data
 */
function testAnswer(index, answerselected, indexBtn, data) {
    const correctAnswer = data[index].correct;
    if (correctAnswer === answerselected) {
        document.getElementById("statushere-" + index).innerText = "✅ You got it right. Keep up the GREAT work buddy👍";
        grayOutButtons(index);
        document.getElementById("button-" + index + "-" + indexBtn).style.backgroundColor = "#4BB543";
        correctanswers++;
        
        playCorrectSound();
        
        const pointsEarned = calculatePoints(1, data[index].chapter);
        updatePoints(pointsEarned);
    } else {
        document.getElementById("statushere-" + index).innerText = "This is not the right answer but you are making progress buddy";
        document.getElementById("button-" + index + "-" + indexBtn).disabled = true;
    }

    updateProgress(datajson.length);
}

/**
 * Update progress
 * @param {number} total - Total number of questions
 */
function updateProgress(total) {
    const percentage = (correctanswers / total) * 100;
    updateProgressBar(percentage / 100);
    
    document.getElementById('progress-status').textContent = `${correctanswers} / ${total} correct`;
}

/**
 * Submit quiz
 */
function submit() {
    if (correctanswers === questionsnumber) {
        const pointsEarned = calculatePoints(questionsnumber, document.getElementById("chapterselect").value);
        updatePoints(pointsEarned);
        
        alert(`Mission accomplished! 🎉 You earned ${pointsEarned} points!`);
        window.confettiful = new Confettiful(document.querySelector('.js-container'));
    } else {
        alert("Mission failed. Try again!");
    }
}

/**
 * Toggle customization panel
 */
function toggleCustomizationPanel() {
    const panel = document.getElementById('customization-panel');
    panel.classList.toggle('active');
    
    document.getElementById('file-upload-container').classList.remove('active');
    
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            this.classList.add('selected');
            
            const color = this.getAttribute('data-color');
            saveThemePreference(color);
        });
    });
}

/**
 * Toggle file upload panel
 */
function toggleFileUploadPanel() {
    const panel = document.getElementById('file-upload-container');
    panel.classList.toggle('active');
    
    document.getElementById('customization-panel').classList.remove('active');
}

/**
 * Process PDF
 */
async function processPDF() {
    const fileInput = document.getElementById('pdf-upload');
    const statusDiv = document.getElementById('upload-status');
    const selectedCourse = document.getElementById('content-course').value;
    
    if (!fileInput.files || fileInput.files.length === 0) {
        statusDiv.textContent = 'Please select a PDF file first.';
        return;
    }
    
    const file = fileInput.files[0];
    if (file.type !== 'application/pdf') {
        statusDiv.textContent = 'Please select a PDF file.';
        return;
    }
    
    statusDiv.textContent = 'Reading PDF content...';
    
    try {
        const pdfText = await extractTextFromPDF(file);
        
        statusDiv.textContent = 'Generating questions using AI...';
        
        const questions = await generateQuestionsFromPDF(pdfText, selectedCourse);
        
        addQuestionsToDatabase(questions, selectedCourse);
        
        statusDiv.textContent = 'Success! New questions added to the database.';
        
        datajson = await getData();
        originaldatajson = datajson;
        await showData(datajson);
        
    } catch (error) {
        console.error('Error processing PDF:', error);
        statusDiv.textContent = 'Error processing PDF: ' + error.message;
    }
}

/**
 * Add questions to database
 * @param {Object} questions - Generated questions
 * @param {string} course - Course
 */
async function addQuestionsToDatabase(questions, course) {
    const multipleChoiceFile = course === 'psychology' ? './json/data.json' : 
                              course === 'biology' ? './json/biology-data.json' : './json/physics-data.json';
    
    const fillInFile = course === 'psychology' ? './json/fillindata.json' : 
                      course === 'biology' ? './json/biology-fillindata.json' : './json/physics-fillindata.json';
    
    const matchingFile = course === 'psychology' ? './json/psychology-matching.json' : 
                        course === 'biology' ? './json/biology-matching.json' : './json/physics-matching.json';
    
    console.log('New multiple choice questions:', questions.multipleChoice);
    console.log('New fill-in questions:', questions.fillIn);
    console.log('New matching exercise:', questions.matching);
    
    return true;
}

/**
 * Confetti animation
 * @param {HTMLElement} el - Container element
 */
const Confettiful = function (el) {
    this.el = el;
    this.containerEl = null;
    this.confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E', '#EFFF1D'];
    this.confettiAnimations = ['slow', 'medium', 'fast'];

    this._setupElements();
    this._renderConfetti();
};

Confettiful.prototype._setupElements = function () {
    const containerEl = document.createElement('div');
    const elPosition = this.el.style.position;

    this.el.style.position = 'fixed';

    containerEl.classList.add('confetti-container');
    const height = document.documentElement.scrollHeight;
    containerEl.style.height = height + "px";

    this.el.appendChild(containerEl);

    this.containerEl = containerEl;
};

Confettiful.prototype._renderConfetti = function () {
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

        confettiEl.removeTimeout = setTimeout(function () {
            confettiEl.parentNode.removeChild(confettiEl);
        }, 3000);

        this.containerEl.appendChild(confettiEl);
    }, 25);
};

const delay = ms => new Promise(res => setTimeout(res, ms));

Element.prototype.shuffleChildren = function () {
    for (let i = this.children.length; i >= 0; i--) {
        this.appendChild(this.children[Math.random() * i | 0]);
    }
};

document.addEventListener('DOMContentLoaded', init);
