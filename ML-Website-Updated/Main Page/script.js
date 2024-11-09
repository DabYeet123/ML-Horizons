import { loadData, replaceData } from "../dataHandler/mongoDataHandler.js";
import { getResponseFromAI, generateConversationTitle } from "../dataHandler/chatbotDataHandler.js";

const messagesContainer = document.getElementById('messages');
const inputField = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const newChatButton = document.getElementById('new-chat-button'); // New chat button
const conversationList = document.getElementById('conversation-list');
let userData;
let USERID;


let conversations = {};
let sessionIDs = [];
let titles = {};
let currentSessionID; //CHANGE NEEDED
let maxID = 0;
let currentConversationIndex = 0;


// Function to add a new message
function addMessage(text, sender, animate) {
    const messageElement = document.createElement('div');
    if (sender == "You"){
        messageElement.className = "user-message";
        const userMessage = document.createElement('pre');
        //userMessage.className = "user-message";
        userMessage.textContent = text;
        messageElement.appendChild(userMessage);
    } else if (sender == "Bot"){
        messageElement.className = "bot-message-container";
        const botImageContainer = document.createElement('div');
        const botImage = document.createElement('img');
        const botMessage = document.createElement('pre');
        botImageContainer.className="bot-image-container";
        botImage.className = "bot-image";
        botMessage.className = "bot-message";
        botImage.src = "/assets/MH logo.png";
        botImageContainer.appendChild(botImage);
        messageElement.appendChild(botImageContainer);
        messageElement.appendChild(botMessage);
        if (animate) {typeAnimation(text, botMessage);}
        else{botMessage.textContent = text;}
    }
    if (text == "python"){
        generateText("python");
    } else if(text == "text"){
        generateText("text");
    }
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
}

// Send button event
sendButton.addEventListener('click', async function() {
    const userInput = inputField.value.trim();
    if (userInput) {
        addMessage(userInput, 'You', false);
        inputField.value = '';
        /*const botResponse = "This is a response to the question: " + userInput; //  Bot Message Here
        addMessage(botResponse, 'Bot', true);
        saveConversation(userInput, botResponse);*/

        // Simulate a response (replace with actual API call)
        
        //setTimeout(() => {
            if (currentConversationIndex === Object.keys(conversations).length) {currentSessionID = newSessionID();} // NEEDS UPDATE
            const botResponse = await getResponseFromAI( currentSessionID, userInput);
            //const botResponse = "Bot responding to: " + userInput;
            console.log("Response that came in is: " + botResponse);
            addMessage(botResponse, 'Bot');
            saveConversation(userInput, botResponse, currentSessionID);
        //}, 1000);
    }
});

// Allow sending message with Enter key
inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click(); // Trigger the click event
    }
});

// Save conversation
async function saveConversation(userMessage, botResponse, sessionID) {
    // Create a new conversation or update the current one
    if (currentConversationIndex === Object.keys(conversations).length) {
        sessionIDs.push(sessionID.toString());
        conversations[sessionID] = [[userMessage, botResponse]];
        currentConversationIndex = Object.keys(conversations).length - 1;
        await generateTitle(sessionID, userMessage);
        updateConversationList(sessionID, userMessage);
    } else {
        conversations[sessionIDs[currentConversationIndex]].push([userMessage, botResponse]);
    }
    const conv = {"sessionIDs" : sessionIDs, "conversations": conversations, "titles": titles};
    replaceData(USERID, undefined, undefined, undefined, undefined, conv, undefined);
}

function newSessionID() { //TEMPORARY
    maxID += 1;
    return maxID;
}


async function generateTitle(sessionID, input) {
    const title = await generateConversationTitle(sessionID, input);
    titles[sessionID] = title;
}

// Update the conversation list in the sidebar
function updateConversationList(sessionID, input) {  //might change sessionid
    conversationList.innerHTML = '';
    Object.keys(conversations).forEach((sessionID) => {
        const conv = conversations[sessionID];
        const listItem = document.createElement('li');
        listItem.textContent = titles[sessionID];
        listItem.addEventListener('click', () => displayConversation(sessionIDs.indexOf(sessionID)));
        conversationList.appendChild(listItem);
    });
}

// Display selected conversation in the chat area
function displayConversation(index) {
    currentConversationIndex = index;
    currentSessionID = sessionIDs[currentConversationIndex];
    messagesContainer.innerHTML = ''; // Clear current messages
    conversations[sessionIDs[index]].forEach(([userMessage, botResponse]) => {
        addMessage(userMessage, 'You', false);
        addMessage(botResponse, 'Bot', false);
    });
}

// Function to start a new chat
function startNewChat() {
    inputField.value = '';
    messagesContainer.innerHTML = '';
    currentConversationIndex = Object.keys(conversations).length; // Reset current conversation index
}

function typeAnimation(text, textContainer) {
    let index = 0; // Initialize the character index
    function typeCharacter(){
        if (index < text.length) {
            textContainer.textContent += text.charAt(index); // Add character
            index++; // Move to next character
            messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scrolls to the bottom
            setTimeout(typeCharacter, 5); // Call again after delay
        }
    }
    typeCharacter();
}

// New chat button event
newChatButton.addEventListener('click', startNewChat);

// Initialize the app

async function init() {
    userData = await loadData();
    USERID = userData["USERID"];
    //userData = getDocument(getGoogleID());
    const convs = userData["chatBotConversations"]; //A Map from {sessionID: Conversation}
    if (convs.length > 0) {
        conversations = convs["conversations"];
        currentSessionID = convs["sessionIDs"];
        titles = convs["titles"];
        currentConversationIndex = conversations.length -1;
        updateConversationList();
        displayConversation(currentConversationIndex);
    }

}



// Call init to set up anything needed on load
init();
