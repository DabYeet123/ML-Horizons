const messagesContainer = document.getElementById('messages');
const inputField = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const newChatButton = document.getElementById('new-chat-button'); // New chat button
const conversationList = document.getElementById('conversation-list');

let conversations = [];
let currentConversationIndex = -1;

// Function to add a new message
function addMessage(text, sender, animate) {
    const messageElement = document.createElement('div');
    if (sender == "You"){
        messageElement.className = "user-message";
        sender = '';
        messageElement.textContent = text;
    } else if (sender == "Bot"){
        messageElement.className = "bot-message-container";
        const botImageContainer = document.createElement('div');
        const botImage = document.createElement('img');
        const message = document.createElement('div');
        botImageContainer.className="bot-image-container";
        botImage.className = "bot-image";
        message.className = "bot-message";
        botImage.src = "/assets/MH logo.png";
        botImageContainer.appendChild(botImage);
        messageElement.appendChild(botImageContainer);
        messageElement.appendChild(message);
        if (animate) {typeAnimation(text, message);}
        else{message.textContent = text;}
    }
    if (text == "python"){
        generateText("python");
    } else if(text == "text"){
        generateText("text");
    }
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
}

function respond(input){
    let userInput = inputField.value.trim();
    if (!userInput) {
        userInput = input;
    }
    if (userInput) {
        addMessage(userInput, 'You', false);
        inputField.value = '';

        // Simulate a response (replace with actual API call)
        setTimeout(() => {
            const botResponse = "This is a response to the question: " + userInput; //  Bot Message Here
            addMessage(botResponse, 'Bot', true);
            saveConversation(userInput, botResponse);
        }, 1000);
    }
}

// Send button event
sendButton.addEventListener('click', () => respond());

// Allow sending message with Enter key
inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click(); // Trigger the click event
    }
});

// Save conversation
function saveConversation(userMessage, botResponse) {
    // Create a new conversation or update the current one
    if (currentConversationIndex === -1) {
        conversations.push([[userMessage, botResponse]]);
        currentConversationIndex = conversations.length - 1;
    } else {
        conversations[currentConversationIndex].push([userMessage, botResponse]);
    }
    updateConversationList();
    displayConversation(currentConversationIndex);
}

// Update the conversation list in the sidebar
function updateConversationList() {
    conversationList.innerHTML = '';
    conversations.forEach((conv, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = conv[0][0].substring(0,1).toUpperCase() + conv[0][0].substring(1);
        listItem.addEventListener('click', () => displayConversation(index));
        conversationList.appendChild(listItem);
    });
}

// Display selected conversation in the chat area
function displayConversation(index) {
    currentConversationIndex = index;
    messagesContainer.innerHTML = ''; // Clear current messages
    conversations[index].forEach(([userMessage, botResponse]) => {
        addMessage(userMessage, 'You');
        addMessage(botResponse, 'Bot');
    });
}

// Function to start a new chat
function startNewChat() {
    inputField.value = '';
    messagesContainer.innerHTML = '';
    currentConversationIndex = -1; // Reset current conversation index
}

function typeAnimation(text, textContainer) {
    let index = 0; // Initialize the character index
    function typeCharacter(){
        if (index < text.length) {
            textContainer.textContent += text.charAt(index); // Add character
            index++; // Move to next character
            setTimeout(typeCharacter, 5); // Call again after delay
        }
    }
    typeCharacter();
}

// New chat button event
newChatButton.addEventListener('click', startNewChat);

// Initialize the app
function init() {
    // You can load previous conversations from localStorage here if needed
}

// Call init to set up anything needed on load
init();
