// Get references to important elements
const questionBody = document.getElementById("questionBody");
questionBody.innerHTML = '<link rel="stylesheet" href="question.css"><div class="quiz-container" id="quiz-container"><form id="quiz-form"></form><button type="button" id="back-btn" onclick = back() style="display: none;">Back</button></div>';

const quizForm = document.getElementById("quiz-form");
const backBtn = document.getElementById("back-btn");
const result = document.getElementById("result");
let questions = [];
const questionsText = {
                        "What is your experience level": ["Beginner", "Intermediate", "Advanced", "Expert"],
                        "What is the application": ["Appl", "Applicaiton 2", "Aon 3", "Applicaiton 4", "Applon 5", "Apon 6",
                            "Application 1", "Applicaiton 2", "Application 3", "Applicaiton 4", "Ation 5"],
                        "What algorithm do you want to use": ["Algorithm 1", "Alg","Algori 3","Algohm 4","Algo 5",]};
const answer = ["","",""];
let index = 0;


function generateQuestion(){ 
    let i = 0;
    for(question in questionsText) {
        const options = questionsText[question];
        const q = document.createElement("div");
        const answerOptions = document.createElement("div");
        const title = document.createElement("p");
        title.innerHTML = question;
        q.className = "question";
        answerOptions.className = "answer-options";
        questions.push(q);
        for(option of options) {
            const opt = document.createElement("button");
            opt.className = "answer-box";
            opt.type = "button";
            opt.innerHTML = option;
            opt.onclick = function () {
                answer[index] = opt.innerHTML;
                const currentQuestion = questions[index];
                currentQuestion.style.display = "none";
                if(index + 1 == questions.length) {
                    submit();
                }else{ 
                    index += 1;
                    questions[index].style.display = "block";
                    backBtn.style.display = "block";
                }
                
                setTimeout(() => {
                    // Update to the next question
                    let question = questions[index];
            
                    // Reset fade-in animation
                    question.classList.remove('hidden');
                    question.style.animation = 'slideIn 0.5s forwards';
                }, 500); // Duration matches CSS animation timing
            };
            answerOptions.appendChild(opt);
        }
        q.appendChild(title);
        q.appendChild(answerOptions);
        if(i != 0) {
            const other = createOtherButton();
            q.appendChild(other);
        }
        q.style.display = "none";
        quizForm.appendChild(q);
        i += 1;
    }
    questions[0].style.display = "block";
}


function createOtherButton() { 
    const otherContainer = document.createElement("div");
    const otherButton = document.createElement("button");
    const inputContainer = document.createElement("div");
    const otherInput = document.createElement("input");
    const submitButton = document.createElement("button");

    otherContainer.className = "other-container";

    otherButton.className = "answer-box";
    otherButton.type = "button";
    otherButton.innerHTML = "Others";
    otherButton.onclick = function() {
        inputContainer.style.display = "flex";
        otherButton.style.display = "none";
    };

    inputContainer.className = "input-container";
    inputContainer.style.display = "none";

    otherInput.type = "text";
    otherInput.className = "textInput";
    otherInput.placeholder = "Type Here";

    submitButton.className = "submit-btn";
    //submitButton.classList = "submit-btn answer-box";
    submitButton.type = "button";
    submitButton.innerHTML = "Submit";
    submitButton.onclick = function() {
        answer[index] = otherInput.value.trim();
        const currentQuestion = questions[index];
        currentQuestion.style.display = "none";
        if(index + 1 == questions.length) {
            submit();
        }else{ 
            index += 1;
            questions[index].style.display = "block";
            backBtn.style.display = "block";
        }
    };


    inputContainer.appendChild(otherInput);
    inputContainer.appendChild(submitButton);
    otherContainer.appendChild(otherButton);
    otherContainer.appendChild(inputContainer);
    return otherContainer;
}


function submit() {
    backBtn.style.display = "none";
    questionBody.style.display = "none";
    console.log(answer);
}

function back() {
    if(index == 1) backBtn.style.display = "none";
    answer[index] = "";
    const currentQuestion = questions[index];
    currentQuestion.style.display = "none";
    index -= 1;
    questions[index].style.display = "block";

}

//generateQuestion();
