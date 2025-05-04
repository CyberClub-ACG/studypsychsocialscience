
/**
 * Securely call the OpenAI API
 * @param {string} prompt - The prompt to send to the API
 * @param {string} model - The model to use (defaults to gpt-4-turbo)
 * @returns {Promise} - Promise with the API response
 */
async function callOpenAI(prompt, model = "gpt-4-turbo") {
    try {
        if (typeof CONFIG === 'undefined' || !CONFIG.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY === 'your-api-key-here') {
            console.error('API key not configured. Please update js/config.js with your API key.');
            return simulateAIResponse(prompt);
        }
        
        const response = await fetch(CONFIG.OPENAI_API_ENDPOINT || "https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert in creating educational content. Your task is to create quiz questions in JSON format.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 3000
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return simulateAIResponse(prompt);
    }
}

/**
 * Simulate an AI response for testing or when API is unavailable
 * @param {string} prompt - The prompt that would be sent to the API
 * @returns {Object} - Simulated API response
 */
function simulateAIResponse(prompt) {
    console.log('Simulating AI response for prompt:', prompt);
    
    const courseMatch = prompt.match(/about\s+(\w+)\s+based/i);
    const course = courseMatch ? courseMatch[1].toLowerCase() : 'general';
    
    const chapterPrefix = course === "psychology" ? 'chapter' : 
                         course === "biology" ? 'bio-chapter' : 'physics-chapter';
    
    const chapterNum = Math.floor(Math.random() * 7) + 1;
    const chapter = `${chapterPrefix}-${chapterNum}`;
    
    return {
        choices: [{
            message: {
                content: JSON.stringify({
                    multipleChoice: [
                        {
                            question: `Sample ${course} multiple choice question 1?`,
                            chapter: chapter,
                            answers: {
                                answer1: "Option A",
                                answer2: "Option B",
                                answer3: "Option C",
                                answer4: "Option D"
                            },
                            correct: "answer2"
                        },
                        {
                            question: `Sample ${course} multiple choice question 2?`,
                            chapter: chapter,
                            answers: {
                                answer1: "Option A",
                                answer2: "Option B",
                                answer3: "Option C",
                                answer4: "Option D"
                            },
                            correct: "answer3"
                        }
                    ],
                    fillIn: [
                        {
                            question: `Sample ${course} fill-in-the-blank question with _______.`,
                            chapter: chapter,
                            answers: {
                                answer1: "option 1",
                                answer2: "option 2",
                                answer3: "option 3",
                                answer4: "option 4"
                            },
                            amountofspaces: 1,
                            correct: ["option 2"]
                        }
                    ],
                    matching: [
                        {
                            chapter: chapter,
                            title: `${course.charAt(0).toUpperCase() + course.slice(1)} Concepts`,
                            terms: [
                                `${course} Term 1`,
                                `${course} Term 2`,
                                `${course} Term 3`,
                                `${course} Term 4`,
                                `${course} Term 5`
                            ],
                            definitions: [
                                `Definition for ${course} Term 1`,
                                `Definition for ${course} Term 2`,
                                `Definition for ${course} Term 3`,
                                `Definition for ${course} Term 4`,
                                `Definition for ${course} Term 5`
                            ]
                        }
                    ]
                })
            }
        }]
    };
}

/**
 * Generate educational questions from PDF content
 * @param {string} pdfText - Extracted text from PDF
 * @param {string} course - The course (psychology, biology, physics)
 * @returns {Promise} - Promise with generated questions
 */
async function generateQuestionsFromPDF(pdfText, course) {
    const prompt = `Generate educational questions about ${course} based on the following content. 
                   Include 2 multiple-choice questions with 4 options each and the correct answer, 
                   1 fill-in-the-blank question with 4 possible answers for each blank, 
                   and 1 matching exercise with 5 terms and definitions.
                   Format the output as a JSON object with keys: multipleChoice, fillIn, and matching.
                   Content: ${pdfText.substring(0, 1000)}`;
    
    try {
        const response = await callOpenAI(prompt);
        const content = response.choices[0].message.content;
        
        try {
            return JSON.parse(content);
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            return JSON.parse(simulateAIResponse(prompt).choices[0].message.content);
        }
    } catch (error) {
        console.error('Error generating questions:', error);
        throw new Error('Failed to generate questions');
    }
}
