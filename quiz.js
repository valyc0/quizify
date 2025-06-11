document.addEventListener('DOMContentLoaded', function() {
    // DOM elements - Login Screen
    const loginScreen = document.getElementById('login-screen');
    const startScreen = document.getElementById('start-screen'); // Added initialization
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // Ensure login screen is visible on page load
    loginScreen.style.display = 'block';
    startScreen.style.display = 'none';
    
    // Add event listener for login form submission - SINGLE UNIFIED LOGIN CHECK
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
    
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
    
        if (username === '') {
            alert('Username cannot be empty.');
            return;
        }
        
        // Authentication logic with proper credential checking
        if ((username === 'user' && password === 'user1') || 
            (username === 'user1' && password === 'user1') ||
            (username === 'admin' && password === 'admin123')) {
            //alert('Login successful!');
            localStorage.setItem('isLoggedIn', 'true'); // Set login status
            loginScreen.style.display = 'none';
            startScreen.style.display = 'block';
        } else {
            alert('Invalid username or password. Please try again.');
        }
    });
    
    // DOM elements - Quiz Screens
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    
    // DOM elements - Start screen
    const totalQuestionsStart = document.getElementById('total-questions-start');
    const startBtn = document.getElementById('start-btn');
      // DOM elements - Quiz Options
    const randomModeRadio = document.getElementById('randomMode');
    const rangeModeRadio = document.getElementById('rangeMode');
    const rangeOptions = document.getElementById('rangeOptions');
    const startIdInput = document.getElementById('startId');
    const endIdInput = document.getElementById('endId');
    const randomizeRangeCheckbox = document.getElementById('randomizeRange');
    const randomizeOptionsCheckbox = document.getElementById('randomizeOptions'); // Nuovo elemento UI
    const subjectFilter = document.getElementById('subjectFilter');
    const filteredQuestionsCount = document.getElementById('filtered-questions-count');
    
    // Toggle range options visibility when radio buttons change
    randomModeRadio.addEventListener('change', function() {
        if (this.checked) {
            rangeOptions.style.display = 'none';
        }
    });
      rangeModeRadio.addEventListener('change', function() {
        if (this.checked) {
            rangeOptions.style.display = 'block';
        }
    });
    
    // Subject filter change event
    subjectFilter.addEventListener('change', function() {
        updateFilteredQuestionsCount();
    });    // Function to populate subject filter dynamically
    function populateSubjectFilter() {
        // Get unique subjects from all questions with count
        const subjectCounts = {};
        allQuestions.forEach(q => {
            subjectCounts[q.materia] = (subjectCounts[q.materia] || 0) + 1;
        });
        
        // Sort subjects alphabetically
        const subjects = Object.keys(subjectCounts).sort();
        
        // Clear existing options except the first one ("Tutte le materie")
        const firstOption = subjectFilter.firstElementChild;
        subjectFilter.innerHTML = '';
        subjectFilter.appendChild(firstOption);
        
        // Add options for each subject with question count
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = `${subject} (${subjectCounts[subject]} domande)`;
            subjectFilter.appendChild(option);
        });
    }

    // Function to update filtered questions count
    function updateFilteredQuestionsCount() {
        const selectedSubject = subjectFilter.value;
        let filteredQuestions = allQuestions;
        
        if (selectedSubject) {
            filteredQuestions = allQuestions.filter(q => q.materia === selectedSubject);
        }
        
        filteredQuestionsCount.textContent = filteredQuestions.length;
        
        // Update the range input max values based on filtered questions
        if (selectedSubject) {
            endIdInput.max = filteredQuestions.length;
            if (parseInt(endIdInput.value) > filteredQuestions.length) {
                endIdInput.value = filteredQuestions.length;
            }
        } else {
            endIdInput.max = allQuestions.length;
        }
    }
      // DOM elements - Quiz screen
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackElement = document.getElementById('feedback');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const endQuizBtn = document.getElementById('end-quiz-btn');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    const correctCounterElement = document.getElementById('correct-counter');
    const questionSubjectElement = document.getElementById('question-subject');
    
    // DOM elements for Notes feature
    const toggleNotesBtn = document.getElementById('toggle-notes');
    const notesContainer = document.getElementById('notes-container');
    
    // DOM elements - Results screen
    const finalScoreElement = document.getElementById('final-score');
    const totalQuestionsResult = document.getElementById('total-questions-result');
    const scorePercentageElement = document.getElementById('score-percentage');
    const viewIncorrectBtn = document.getElementById('view-incorrect-btn');
    const retryIncorrectBtn = document.getElementById('retry-incorrect-btn');
    const resetIncorrectBtn = document.getElementById('reset-incorrect-btn');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const incorrectQuestionsList = document.getElementById('incorrect-questions-list');
    const incorrectList = document.getElementById('incorrect-list');
    
    // Quiz state
    let allQuestions = [];
    let questions = [];
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let answeredQuestions = {};
    let incorrectQuestions = [];
    let isRetryMode = false;
    let selectedAnswers = new Set(); // Track currently selected answers
    
    // Notes toggle event listener
    toggleNotesBtn.addEventListener('click', function() {
        // Recupera l'elemento warning in modo sicuro
        const randomizeWarning = document.getElementById('randomize-warning');
        
        if (notesContainer.style.display === 'none' || notesContainer.style.display === '') {
            const currentQuestion = questions[currentQuestionIndex];
            
            // Get user answers
            const userAnswers = answeredQuestions[currentQuestion.id] ? 
                answeredQuestions[currentQuestion.id].split(',') : [];
                
            // Check if we're using randomized options
            if (randomizeOptionsCheckbox.checked) {
                // Find the original question in allQuestions to get original options
                const originalQuestion = allQuestions.find(q => q.id === currentQuestion.id);
                
                // Create HTML for showing the original options with user's selection highlighted
                let originalOptionsHtml = '<div class="original-options mb-3">';
                originalOptionsHtml += '<h6 class="mb-2">Opzioni nell\'ordine originale:</h6>';
                
                // Map current answer keys back to original keys if we have a mapping
                // This requires tracking the original to new key mapping during shuffle
                let userOriginalAnswers = [];
                
                // Keep track of which current option maps to which original option
                const optionMap = {};
                for (const [newKey, value] of Object.entries(currentQuestion.options)) {
                    // Find the original key by matching the option text
                    for (const [origKey, origValue] of Object.entries(originalQuestion.options)) {
                        if (value === origValue) {
                            optionMap[newKey] = origKey;
                            break;
                        }
                    }
                }
                
                // Map user selected answers back to original keys
                userOriginalAnswers = userAnswers.map(key => optionMap[key] || key);
                
                // Show original options with user selection highlighted
                for (const [key, value] of Object.entries(originalQuestion.options)) {
                    const isSelected = userOriginalAnswers.includes(key);
                    const isCorrect = originalQuestion.answer.split(',').includes(key);
                    
                    let optionClass = '';
                    if (isSelected) {
                        optionClass = isCorrect ? 'text-success fw-bold' : 'text-danger fw-bold';
                    } else if (isCorrect) {
                        optionClass = 'text-success';
                    }
                    
                    originalOptionsHtml += `<div class="${optionClass}">`;
                    originalOptionsHtml += `<span class="fw-medium">${key}:</span> ${value}`;
                    if (isSelected) {
                        originalOptionsHtml += ' <span class="badge bg-primary">La tua risposta</span>';
                    }
                    if (isCorrect) {
                        originalOptionsHtml += ' <span class="badge bg-success">Corretta</span>';
                    }
                    originalOptionsHtml += '</div>';
                }
                
                originalOptionsHtml += '</div><hr class="my-3">';
                
                // Set notes content with original options above
                notesContainer.innerHTML = originalOptionsHtml + '<div class="notes-text">' + currentQuestion.notes + '</div>';
                
                // Nascondi l'avviso solo se esiste l'elemento
                if (randomizeWarning) {
                    randomizeWarning.style.display = 'none';
                }
            } else {
                // If options aren't randomized, just show the notes
                notesContainer.textContent = currentQuestion.notes;
                
                // Nascondi l'avviso solo se esiste l'elemento
                if (randomizeWarning) {
                    randomizeWarning.style.display = 'none';
                }
            }
            
            // Show the notes container and update button text
            notesContainer.style.display = 'block';
            this.textContent = 'Hide Notes';
        } else {
            notesContainer.style.display = 'none';
            
            // Nascondi l'avviso solo se esiste l'elemento
            if (randomizeWarning) {
                randomizeWarning.style.display = 'none';
            }
            
            this.textContent = 'Show Notes';
        }
    });
    
    // Helper functions for array comparison
    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        return arr1.sort().toString() === arr2.sort().toString();
    }
    
    function hasCommonElements(arr1, arr2) {
        return arr1.some(item => arr2.includes(item));
    }
    
    // Function to shuffle the questions array
    function shuffleQuestions(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Function to shuffle options and update the answer key
    function shuffleOptions(question) {
        // Create a copy of the question to avoid modifying the original
        const questionCopy = JSON.parse(JSON.stringify(question));
        const originalOptions = questionCopy.options;
        const originalAnswer = questionCopy.answer;
        const originalNotes = questionCopy.notes;
        
        // Create arrays for keys and values
        const keys = Object.keys(originalOptions);
        const entries = keys.map(key => ({ key, value: originalOptions[key] }));
        
        // Create a map to track which new key corresponds to which old key
        const keyMap = {};
        const reverseKeyMap = {}; // Maps old keys to new keys
        
        // Shuffle the entries
        for (let i = entries.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [entries[i], entries[j]] = [entries[j], entries[i]];
        }
        
        // Create new options object with the standard keys but shuffled values
        const newOptions = {};
        const standardKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].slice(0, entries.length);
        
        entries.forEach((entry, index) => {
            const newKey = standardKeys[index];
            newOptions[newKey] = entry.value;
            keyMap[entry.key] = newKey;
            reverseKeyMap[newKey] = entry.key;
        });
        
        // Update the correct answer key(s)
        let newAnswer = '';
        if (originalAnswer.includes(',')) {
            // For multiple correct answers
            newAnswer = originalAnswer.split(',')
                .map(key => keyMap[key])
                .join(',');
        } else {
            // For single correct answer
            newAnswer = keyMap[originalAnswer];
        }
          // Manteniamo le note originali senza modificare i riferimenti alle lettere delle opzioni
        let newNotes = originalNotes;
        
        questionCopy.options = newOptions;
        questionCopy.answer = newAnswer;
        questionCopy.notes = newNotes;
        
        return questionCopy;
    }
      // Load questions from external file
    function loadQuestions() {
        try {
            // Use the external quizQuestions object
            allQuestions = quizQuestions.questions;

            // Set initial questions array (will be modified when starting quiz)
            questions = [...allQuestions];

            // Update the total questions count on start screen
            totalQuestionsStart.textContent = allQuestions.length;
            totalQuestionsElement.textContent = questions.length;
            totalQuestionsResult.textContent = questions.length;
              // Set max value for endId input to match total questions
            endIdInput.value = allQuestions.length;
            endIdInput.max = allQuestions.length;
            
            // Populate subject filter dynamically
            populateSubjectFilter();
            
            // Initialize filtered questions count
            updateFilteredQuestionsCount();
            
            // Set dynamic title if available
            if (quizQuestions.title) {
                document.querySelector('#start-screen h1').textContent = quizQuestions.title;
                document.title = quizQuestions.title;
            }

            // Return success
            return true;
        } catch (error) {
            console.error('Error loading questions:', error);
            questionText.textContent = 'Error loading questions: ' + error.message;
            return false;
        }
    }
      // Start the quiz with selected options
    function startQuiz() {
        // First apply subject filter if selected
        let filteredQuestions = allQuestions;
        const selectedSubject = subjectFilter.value;
        
        if (selectedSubject) {
            filteredQuestions = allQuestions.filter(q => q.materia === selectedSubject);
            
            if (filteredQuestions.length === 0) {
                alert('No questions found for the selected subject');
                return;
            }
        }
        
        // Get selected questions based on options
        if (randomModeRadio.checked) {
            // Random mode: use all filtered questions
            questions = [...filteredQuestions];
            questions = shuffleQuestions(questions);
        } else if (rangeModeRadio.checked) {
            // Range mode: filter questions by position range from filtered questions
            const startPos = parseInt(startIdInput.value, 10) || 1;
            const endPos = parseInt(endIdInput.value, 10) || filteredQuestions.length;
            
            if (startPos > endPos) {
                alert('Start position must be less than or equal to End position');
                return;
            }
            
            if (startPos > filteredQuestions.length) {
                alert('Start position exceeds available questions for the selected subject');
                return;
            }
            
            // Filter questions by array index position (1-based for user, 0-based for array)
            questions = filteredQuestions.slice(startPos - 1, startPos - 1 + (endPos - startPos + 1));
            
            // Check if we have any questions in range
            if (questions.length === 0) {
                alert('No questions found in the selected range');
                return;
            }
            
            // Randomize if checkbox is checked
            if (randomizeRangeCheckbox.checked) {
                questions = shuffleQuestions(questions);
            }
        }
        
        // Save shuffled questions to localStorage
        localStorage.setItem('shuffledQuestions', JSON.stringify(questions));
        
        // Hide start screen, show quiz screen
        startScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        
        // Reset quiz state
        currentQuestionIndex = 0;
        correctAnswers = 0;
        correctCounterElement.textContent = correctAnswers;
        
        // Update total questions count for quiz and results screen
        totalQuestionsElement.textContent = questions.length;
        totalQuestionsResult.textContent = questions.length;
        
        // Load the first question
        loadQuestion(currentQuestionIndex);
        
        // Setup next button
        nextBtn.textContent = 'Submit Answer';
        nextBtn.disabled = false;
    }
    
    // Display a question
    function loadQuestion(index) {
        const question = questions[index];
        if (!question) return;
        
        // Update question number
        currentQuestionIndex = index;
        localStorage.setItem('currentQuestionIndex', index); // Save progress
        currentQuestionElement.textContent = index + 1;
        
        // Ensure total questions element is updated with the current filtered questions length
        totalQuestionsElement.textContent = questions.length;
          // Display question text
        questionText.textContent = question.question;
        
        // Display question subject
        questionSubjectElement.textContent = question.materia || 'N/A';
        
        // Clear previous options and feedback
        optionsContainer.innerHTML = '';
        feedbackElement.className = 'feedback';
        feedbackElement.textContent = '';
        feedbackElement.style.display = 'none';
        
        // Hide notes section and toggle button
        notesContainer.style.display = 'none';
        toggleNotesBtn.style.display = 'none';
        
        // Update Next button text and behavior for new question
        nextBtn.textContent = 'Submit Answer';
        
        // Reset selected answers
        selectedAnswers.clear();
        
        // Shuffle the options for this question if enabled and not already answered
        let displayQuestion = question;
        if (!answeredQuestions[question.id] && randomizeOptionsCheckbox.checked) {
            displayQuestion = shuffleOptions(question);
            // Store the shuffled question back in the questions array to maintain consistency
            questions[index] = displayQuestion;
        }
        
        // Create option elements
        for (const [key, value] of Object.entries(displayQuestion.options)) {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.dataset.option = key;
            optionElement.textContent = key + ': ' + value;
            
            // If this question was already answered
            if (answeredQuestions[displayQuestion.id]) {
                const correctAnswers = displayQuestion.answer.split(',');
                const userAnswers = answeredQuestions[displayQuestion.id].split(',');
                
                if (userAnswers.includes(key)) {
                    optionElement.classList.add('selected');
                    optionElement.classList.add(correctAnswers.includes(key) ? 'correct' : 'incorrect');
                } else if (correctAnswers.includes(key)) {
                    optionElement.classList.add('correct');
                }
                
                // Show notes toggle button if question has notes
                if (displayQuestion.notes) {
                    toggleNotesBtn.style.display = 'block';
                }
            }
            
            // Add click handler
            optionElement.addEventListener('click', function() {
                selectOption(this, key, displayQuestion);
            });
            
            optionsContainer.appendChild(optionElement);
        }
        
        // Update navigation buttons and handle button state
        prevBtn.disabled = index === 0;
        if (answeredQuestions[displayQuestion.id]) {
            nextBtn.textContent = 'Next';
            nextBtn.disabled = index === questions.length - 1;
        } else {
            nextBtn.textContent = 'Submit Answer';
            nextBtn.disabled = false;
        }
    }
    
    // Handle option selection
    function selectOption(element, selectedKey, question) {
        // Only allow selection if question hasn't been answered
        if (answeredQuestions[question.id]) return;
        
        // Toggle selection
        if (element.classList.contains('selected')) {
            element.classList.remove('selected');
            selectedAnswers.delete(selectedKey);
        } else {
            element.classList.add('selected');
            selectedAnswers.add(selectedKey);
        }
    }
    
    // Show feedback message
    function validateAnswers(question) {
        const correctAnswersArray = question.answer.split(',');
        const selectedAnswersArray = Array.from(selectedAnswers).sort();
        
        // Check if answers match exactly
        const isFullyCorrect = arraysEqual(selectedAnswersArray, correctAnswersArray);
        
        // Check for partial correctness
        const isPartiallyCorrect = hasCommonElements(selectedAnswersArray, correctAnswersArray);
        
        return { isFullyCorrect, isPartiallyCorrect, selectedAnswersArray };
    }

    function showFeedback(validationResult, question) {
        feedbackElement.className = 'feedback';
        const correctAnswersList = question.answer.split(',');
        const selectedCount = selectedAnswers.size;
        
        if (validationResult.isFullyCorrect) {
            feedbackElement.classList.add('correct');
            feedbackElement.textContent = `Correct! You selected all ${correctAnswersList.length} correct answers.`;
            return true;
        } else if (validationResult.isPartiallyCorrect) {
            feedbackElement.classList.add('incorrect');
            feedbackElement.textContent = `Partially correct. You selected ${selectedCount} answer(s), but the correct answers are: ${question.answer}`;
            return false;
        } else {
            feedbackElement.classList.add('incorrect');
            feedbackElement.textContent = `Incorrect. You selected ${selectedCount} answer(s), but the correct answers are: ${question.answer}`;
            return false;
        }
    }
    
    // Show results
    function showResults() {
        // Hide quiz screen, show results screen
        quizScreen.style.display = 'none';
        resultsScreen.style.display = 'block';
        
        // Update results
        finalScoreElement.textContent = correctAnswers;
        totalQuestionsResult.textContent = questions.length;
        
        // Calculate percentage
        const percentage = Math.round((correctAnswers / questions.length) * 100);
        scorePercentageElement.textContent = percentage;
        
        // Update the visibility of the retry button based on incorrect questions
        retryIncorrectBtn.disabled = incorrectQuestions.length === 0;
        resetIncorrectBtn.disabled = incorrectQuestions.length === 0;
        viewIncorrectBtn.disabled = incorrectQuestions.length === 0;
    }
    
    // Generate list of incorrect questions
    function showIncorrectQuestions() {
        // Clear previous list
        incorrectList.innerHTML = '';
        
        // Show the container
        incorrectQuestionsList.style.display = 'block';
        
        // Check if there are incorrect questions
        if (incorrectQuestions.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = 'No incorrect questions!';
            incorrectList.appendChild(listItem);
            return;
        }
        
        // Add each incorrect question to the list
        for (const id of incorrectQuestions) {
            const question = allQuestions.find(q => q.id === id);
            if (question) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>Question ${question.id}:</strong> ${question.question}<br>
                                      Your answers: ${answeredQuestions[question.id].split(',').join(', ')}<br>
                                      Correct answers: ${question.answer.split(',').join(', ')}`;
                incorrectList.appendChild(listItem);
            }
        }
    }
    
    // Reset incorrect questions
    function resetIncorrectQuestions() {
        // Clear the list of incorrect questions
        incorrectQuestions = [];
        
        // Hide the incorrect questions list
        incorrectQuestionsList.style.display = 'none';
        
        // Disable buttons
        retryIncorrectBtn.disabled = true;
        resetIncorrectBtn.disabled = true;
        viewIncorrectBtn.disabled = true;
    }
    
    // Retry incorrect questions
    function retryIncorrectQuestions() {
        if (incorrectQuestions.length === 0) return;
        
        // Create a filtered array with only incorrect questions
        const retryQuestionsArray = allQuestions.filter(q => incorrectQuestions.includes(q.id));
        
        // Reset the quiz state for retry mode
        questions = shuffleQuestions([...retryQuestionsArray]);
        currentQuestionIndex = 0;
        isRetryMode = true;
        
        // Reset the counter for retry mode
        correctAnswers = 0;
        correctCounterElement.textContent = correctAnswers;
        
        // Update the total questions count
        totalQuestionsElement.textContent = questions.length;
        
        // Clear previous answers for these questions
        for (const q of retryQuestionsArray) {
            delete answeredQuestions[q.id];
        }
        
        // Reset next button
        nextBtn.textContent = 'Submit Answer';
        
        // Hide results screen, show quiz screen
        resultsScreen.style.display = 'none';
        quizScreen.style.display = 'block';
        
        // Load the first question
        loadQuestion(0);
        
        // Update button states
        prevBtn.disabled = true;
        nextBtn.disabled = questions.length <= 1;
    }
    
    // Restart the entire quiz
    function restartQuiz() {
        // Reset all quiz state
        questions = [...allQuestions];
        isRetryMode = false;
        currentQuestionIndex = 0;
        correctAnswers = 0;
        answeredQuestions = {};
        incorrectQuestions = [];
        
        // Hide any open screens and show start screen
        resultsScreen.style.display = 'none';
        quizScreen.style.display = 'none';
        startScreen.style.display = 'block';
        
        // Reset the incorrect questions list
        incorrectQuestionsList.style.display = 'none';
    }
    
    // Event listeners for navigation
    // Event listener for Previous button
    prevBtn.addEventListener('click', function() {
        if (currentQuestionIndex > 0) {
            loadQuestion(currentQuestionIndex - 1);
        }
    });
    nextBtn.addEventListener('click', function() {
        const currentQuestion = questions[currentQuestionIndex];
        
        // If button shows "Submit Answer", handle answer submission
        if (nextBtn.textContent === 'Submit Answer') {
            if (selectedAnswers.size === 0) {
                alert('Please select at least one answer');
                return;
            }
            
            const validationResult = validateAnswers(currentQuestion);
            const isCorrect = showFeedback(validationResult, currentQuestion);
            
            // Store answers and update score
            answeredQuestions[currentQuestion.id] = Array.from(selectedAnswers).join(',');
            
            if (validationResult.isFullyCorrect) {
                correctAnswers++;
                correctCounterElement.textContent = correctAnswers;
                localStorage.setItem('correctAnswers', correctAnswers.toString()); // Save correct answers count
            } else if (!validationResult.isPartiallyCorrect) {
                if (!incorrectQuestions.includes(currentQuestion.id)) {
                    incorrectQuestions.push(currentQuestion.id);
                }
            }
            
            // Show correct/incorrect answers
            const options = document.querySelectorAll('.option');
            const correctAnswersList = currentQuestion.answer.split(',');
            
            options.forEach(opt => {
                const optionKey = opt.dataset.option;
                if (correctAnswersList.includes(optionKey)) {
                    opt.classList.add('correct');
                } else if (selectedAnswers.has(optionKey)) {
                    opt.classList.add('incorrect');
                }
            });
            
            // Change button text to "Next"
            nextBtn.textContent = 'Next';
            feedbackElement.style.display = 'block';
            
            // If this is the last question, disable the Next button
            if (currentQuestionIndex === questions.length - 1) {
                nextBtn.disabled = true;
            }
            
            // Show notes button if notes are available
            if (currentQuestion.notes) {
                toggleNotesBtn.style.display = 'block';
                notesContainer.textContent = currentQuestion.notes;
            }
        }
        // If button shows "Next", move to next question
        else {
            if (currentQuestionIndex < questions.length - 1) {
                loadQuestion(currentQuestionIndex + 1);
            } else {
                showResults();
            }
        }
    });
    
    
    // Event listener for Start Quiz button
    startBtn.addEventListener('click', startQuiz);
    
    // Event listener for End Quiz button
    endQuizBtn.addEventListener('click', showResults);
    
    // Event listener for View Incorrect Questions button
    viewIncorrectBtn.addEventListener('click', showIncorrectQuestions);
    
    // Event listener for Retry Incorrect Questions button
    retryIncorrectBtn.addEventListener('click', retryIncorrectQuestions);
    
    // Event listener for Reset Incorrect Questions button
    resetIncorrectBtn.addEventListener('click', resetIncorrectQuestions);
    
    // Event listener for Restart Quiz button
    restartQuizBtn.addEventListener('click', restartQuiz);
    // Initialize the quiz data
    loadQuestions();
    
    // Check login state on page load
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loginScreen.style.display = 'none';
        startScreen.style.display = 'block';
        document.getElementById('logout-btn').style.display = 'inline-block'; // Show logout button
    
        // Restore quiz progress
        const savedQuestions = localStorage.getItem('shuffledQuestions');
        const savedIndex = localStorage.getItem('currentQuestionIndex');
        const savedCorrect = localStorage.getItem('correctAnswers');
        if (savedQuestions && savedIndex !== null) {
            const resume = confirm('Do you want to resume from your last position?');
            if (resume) {
                questions = JSON.parse(savedQuestions);
                currentQuestionIndex = parseInt(savedIndex, 10);
                correctAnswers = savedCorrect ? parseInt(savedCorrect, 10) : 0;
                correctCounterElement.textContent = correctAnswers;
                startScreen.style.display = 'none';
                quizScreen.style.display = 'block';
                loadQuestion(currentQuestionIndex);
            } else {
                localStorage.removeItem('shuffledQuestions');
                localStorage.removeItem('currentQuestionIndex');
            }
        }
    }
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn'); // Clear login status
        localStorage.removeItem('currentQuestionIndex'); // Reset progress
        localStorage.removeItem('correctAnswers'); // Reset correct answers count
        loginScreen.style.display = 'block';
        startScreen.style.display = 'none';
        this.style.display = 'none'; // Hide logout button
    });
});
