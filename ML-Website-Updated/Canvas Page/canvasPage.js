const textArea = document.getElementById('textArea');
const promptButton = document.getElementById('promptButton');
const askPrompt = document.getElementById('askPrompt');
const promptPopup = document.getElementById('promptPopup');
const promptInput = document.getElementById('promptInput');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
/*
const editor = CodeMirror.fromTextArea
                (document.getElementById("textArea"), {
                    mode: {},
                });
editor.setSize("100%", "100%");
*/
let highlightedText = '';

// Display prompt popup when text is highlighted
document.addEventListener('mouseup', () => {
  const selection = window.getSelection().toString();
  if (selection) {
    let x = event.clientX;
    let y = event.clientY;
    promptButton.style.left = `${x + window.scrollX}px`;
    promptButton.style.top = `${y + window.scrollY}px`;
    promptButton.style.display = 'block';
    promptPopup.style.display = 'none';
  } else {
    promptButton.style.display = 'none';
    promptPopup.style.display = 'none';
  }
});

function enablePrompt(){
  const selection = window.getSelection().toString().trim();
  highlightedText = selection;
  if (selection) {
    let x = event.clientX;
    let y = event.clientY;
    promptPopup.style.left = `${x + window.scrollX}px`;
    promptPopup.style.top = `${y + window.scrollY}px`;
    promptPopup.style.display = 'block';
    promptInput.value = '';
    promptInput.focus();
  } else {
    promptPopup.style.display = 'none';
  }
}
// Submit prompt function
function submitPrompt() {
  const userInput = promptInput.value.trim();
  if (userInput){
    sendPromptMessage("\nAsking: " + userInput + "\nAbout: " + highlightedText);
    promptPopup.style.display = 'none';
  }
}

// Send chat message
function sendMessage() {
  const message = chatInput.value;
  if (message.trim()) {
    respond(message);
    if (message == "python"){
        generateText("python");
    } else if(message == "text"){
        generateText("text");
    }
  }
}

function sendPromptMessage(message) {
    if (message.trim()) {
        respond(message);
    }
}


/*
function generateText(mode){
    if (mode == "python"){
        editor.setValue("def hello(): \n print('Hello World')");
        editor.setOption("mode", "python");
        editor.setOption("lineNumbers", true);
    } else if (mode == "text"){
        editor.setValue("some generate text...");
        editor.setOption("mode", {});
        editor.setOption("lineNumbers", false);
    }

}

function printText(){
    let text = editor.getValue(); 
    console.log(text);
}
*/


