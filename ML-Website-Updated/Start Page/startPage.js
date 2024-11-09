// Get references to important elements
const nameContainer = document.getElementById("name-container");
const quizForm = document.getElementById("quiz-form");
const startBtn = document.getElementById("start-btn");
const questions = document.querySelectorAll(".question");
const nextBtns = document.querySelectorAll(".next-btn");
const submitBtn = document.getElementById("submit-btn");
const result = document.getElementById("result");


function toggleHighlight(name){
    choices = document.getElementsByName(name);
    choices.forEach((btn, index)  => {
        btn.parentElement.style.backgroundColor = "#ffffff";
        if(btn.checked){
            btn.parentElement.style.backgroundColor = "#3c93e4";
        }
    })
}

function movePage(){
    window.location.href = "/Main Page/index.html"; 
}

// Show the first question after entering the name
startBtn.addEventListener("click", () => {
    const userName = document.getElementById("user-name").value.trim();
    if (userName === "") {
        alert("Please enter your name to start the quiz.");
        return;
    }
    
    nameContainer.style.display = "none";
    quizForm.style.display = "block";
    questions[0].style.display = "block";
});

// Show the next question when "Next" is clicked
nextBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const currentQuestion = questions[index];
        const selectedAnswer = currentQuestion.querySelector('input[type="radio"]:checked');
        
        if (!selectedAnswer) {
            alert("Please select an answer before proceeding.");
            return;
        }
        
        // Hide current question and show the next one
        currentQuestion.style.display = "none";
        questions[index + 1].style.display = "block";
    });
});

// Handle the final submission
submitBtn.addEventListener("click", () => {
    const answers = [];
    
    // Collect answers
    questions.forEach((question, index) => {
        const selectedAnswer = question.querySelector('input[type="radio"]:checked');
        if (selectedAnswer) {
            answers.push(selectedAnswer.value);
        }
    });

    // Validate that all questions have been answered
    if (answers.length !== questions.length) {
        alert("Please make sure to answer all questions.");
        return;
    }

    // Hide the quiz form and show results
    quizForm.style.display = "none";
    result.style.display = "block";

    // Show the result summary
    result.innerHTML = `
        Thank you for completing the quiz! <br>
        Your Answers: <br>
        1. Programming Proficiency: ${answers[0]} <br>
        2. Learning Desire: ${answers[1]} <br>
        3. Random Stuff: ${answers[2]} <br>
        <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXM4dHdpemVienNqamN3ZGw4eXp1Ynp6bWFjZzk1cHhxOWk3OWMwZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/NVBR6cLvUjV9C/giphy.gif" alt="No gif ;(">
        <button type="button" id="continue-btn" onclick="movePage()">Proceed</button>
    `;
});
