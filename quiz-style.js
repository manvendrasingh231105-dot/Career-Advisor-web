document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const submitButton = document.getElementById('submit-quiz');
    const resultsDiv = document.getElementById('results');

    // Simplified Holland Code (RIASEC) questions
    const questions = [
        {
            text: "I enjoy working with my hands or with tools.",
            type: 'Realistic' // R
        },
        {
            text: "I like to solve complex problems and think analytically.",
            type: 'Investigative' // I
        },
        {
            text: "I prefer expressing myself creatively through art, music, or writing.",
            type: 'Artistic' // A
        },
        {
            text: "I enjoy helping people, teaching, or working in teams.",
            type: 'Social' // S
        },
        {
            text: "I like to lead projects, persuade others, and take risks.",
            type: 'Enterprising' // E
        },
        {
            text: "I prefer organized, structured tasks and working with data.",
            type: 'Conventional' // C
        }
    ];

    // Career suggestions based on type
    const careerSuggestions = {
        Realistic: "Engineer, Carpenter, Pilot, or Mechanic.",
        Investigative: "Scientist, Doctor, Data Analyst, or Researcher.",
        Artistic: "Graphic Designer, Writer, Musician, or Actor.",
        Social: "Teacher, Counselor, Nurse, or Social Worker.",
        Enterprising: "Sales Manager, Entrepreneur, Lawyer, or Politician.",
        Conventional: "Accountant, Librarian, Financial Analyst, or Office Manager."
    };

    // Function to load questions into the form
    function loadQuiz() {
        let quizHTML = '';
        questions.forEach((q, index) => {
            quizHTML += `
                <div class="question-block">
                    <p>${index + 1}. ${q.text}</p>
                    <label><input type="radio" name="q${index}" value="1" required> Agree</label>
                    <label><input type="radio" name="q${index}" value="0"> Disagree</label>
                </div>
            `;
        });
        quizForm.innerHTML = quizHTML;
    }

    // Function to calculate and display results
    function showResults() {
        const scores = {
            Realistic: 0,
            Investigative: 0,
            Artistic: 0,
            Social: 0,
            Enterprising: 0,
            Conventional: 0
        };

        const formData = new FormData(quizForm);
        let unanswered = false;
        for (let i = 0; i < questions.length; i++) {
            const answer = formData.get(`q${i}`);
            if (answer === null) {
                unanswered = true;
                break;
            }
        }
        if (unanswered) {
            resultsDiv.innerHTML = `<p style='color: #d9534f; font-weight: bold;'>You need to answer all the questions before viewing your result.</p>
            <button id="return-quiz" style="margin-top:15px;">Return to Quiz</button>
            <button id="back-home-incomplete" style="margin-top:15px;">Back to Home</button>`;
            resultsDiv.style.display = 'block';
            const returnBtn = document.getElementById('return-quiz');
            if (returnBtn) {
                returnBtn.addEventListener('click', () => {
                    resultsDiv.style.display = 'none';
                    // Scroll to the first question block in the quiz
                    const firstQuestion = document.querySelector('.question-block');
                    if (firstQuestion) {
                        firstQuestion.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
            const backHomeBtn = document.getElementById('back-home-incomplete');
            if (backHomeBtn) {
                backHomeBtn.addEventListener('click', () => {
                    window.location.hash = '';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    hideQuizModal();
                });
            }
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            const answer = formData.get(`q${i}`);
            if (answer === '1') {
                scores[questions[i].type]++;
            }
        }
        
        // Find the dominant type(s)
        let maxScore = -1;
        let dominantTypes = [];
        for (const type in scores) {
            if (scores[type] > maxScore) {
                maxScore = scores[type];
            }
        }
        for (const type in scores) {
            if (scores[type] === maxScore && maxScore > 0) {
                dominantTypes.push(type);
            }
        }
        let typeText = dominantTypes.length > 1 ? dominantTypes.join(', ') : dominantTypes[0];
        let description = {
            Realistic: "You enjoy activities that are practical and hands-on.",
            Investigative: "You enjoy solving complex problems and thinking analytically.",
            Artistic: "You prefer expressing yourself creatively through art, music, or writing.",
            Social: "You enjoy helping people, teaching, or working in teams.",
            Enterprising: "You like to lead projects, persuade others, and take risks.",
            Conventional: "You prefer organized, structured tasks and working with data."
        };
        let descText = dominantTypes.map(type => description[type]).join(' ');
        let careerText = dominantTypes.map(type => careerSuggestions[type]).join(' ');
        // Display the result
        resultsDiv.innerHTML = `
            <h3>Your dominant interest type${dominantTypes.length > 1 ? 's are' : ' is'}: <strong>${typeText}</strong></h3>
            <p>${descText}</p>
            <p><strong>Suggested Career Paths:</strong> ${careerText}</p>
            <button id="back-home" style="margin-top:20px;">Back to Home</button>
        `;
        resultsDiv.style.display = 'block';
        // Add event listener for back button
        const backBtn = document.getElementById('back-home');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.hash = '';
                window.scrollTo({ top: 0, behavior: 'smooth' });
                hideQuizModal();
            });
        }
    }

    // Show quiz modal overlay when Take Assessment or Self-Assessment is clicked
    function showQuizModal() {
        document.getElementById('quiz-modal').style.display = 'flex';
        // Reset quiz form and results
        if (quizForm) {
            quizForm.reset();
        }
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
            resultsDiv.innerHTML = '';
        }
    }
    // Hide quiz modal overlay
    function hideQuizModal() {
        document.getElementById('quiz-modal').style.display = 'none';
    }

    // Event Listeners
    loadQuiz();
    submitButton.addEventListener('click', showResults);

    // Self-Assessment nav link
    const selfAssessmentLink = document.querySelector('a[href="#assessment"]');
    if (selfAssessmentLink) {
        selfAssessmentLink.addEventListener('click', function(e) {
            e.preventDefault();
            showQuizModal();
        });
    }

    // Take the Assessment Test button
    const takeAssessmentBtn = document.querySelector('.cta-button');
    if (takeAssessmentBtn) {
        takeAssessmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showQuizModal();
        });
    }

    // Close button for modal
    const closeQuizModalBtn = document.getElementById('close-quiz-modal');
    if (closeQuizModalBtn) {
        closeQuizModalBtn.addEventListener('click', function() {
            hideQuizModal();
        });
    }

    // Hide modal when returning home
    const homeLogo = document.getElementById('home-logo');
    if (homeLogo) {
        homeLogo.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            hideQuizModal();
            resultsDiv.style.display = 'none';
        });
    }
});
