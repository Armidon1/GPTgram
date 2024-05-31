import { createMessage, currentChatId, currentChatTitle, setChatTitle, setIsClickableNewChat, updateChatTitle, handleNewChat} from "./chat.js";
export let serverMessage = '';


let TYPE_CHAT_MESSAGE = "chat";
let TYPE_CHAT_TITLE_MESSAGE = "chatTitle";      // Tipo di messaggio per il titolo della chat

let isFirstMessage = true;
export function setFirstMessage(value){
    isFirstMessage = value;
}
export function getFirstMessage(){
    return isFirstMessage;
}

let currentUser = 'user'; //TODO
let currentEmail = 'email@example.com'; //TODO

const ws = new WebSocket('ws://localhost:8765');

/* gestisci connessione*/
ws.onopen = function() {
    console.log('WebSocket connection opened');
};


ws.onmessage = function(event) {
    console.log('Message from server: ' + event.data);
    let data = JSON.parse(event.data);
    if (data.typeMessage === TYPE_CHAT_MESSAGE) {
        serverMessage = data.message;
        console.log(serverMessage);
        // checks if ws is ready to transmit
        if (ws.readyState === WebSocket.OPEN) {
            createMessage(false);
            if (isFirstMessage) {
                getChatTitle();
                setFirstMessage(false);
            }
        } else {
            console.log('Cannot send message, WebSocket connection is not open');
        }
    } else if (data.typeMessage === TYPE_CHAT_TITLE_MESSAGE) {
        let title = data.title;
        console.log("Chat title: "+title);
        //sovrascrive il titolo della chat
        setChatTitle(title);
        updateChatTitle();
        setIsClickableNewChat(true);
        handleNewChat();
    }
}

ws.onclose = function() {
    console.log('WebSocket connection closed');
};

ws.onerror = function(event) {
    console.error("WebSocket error observed:", event);
};

export function sendMessage(message){
    console.log("Message sent from client: "+message);
    // checks if ws is ready to transmit
    if (ws.readyState === WebSocket.OPEN) {
        let messageJSON = {
            'typeMessage': TYPE_CHAT_MESSAGE,
            'message': message,
            'chatId': currentChatId,
            'user' : currentUser, // TODO: change to user
            'email': currentEmail // TODO: change to email
        };
        ws.send(JSON.stringify(messageJSON));
        return true;
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
        return false; //needed to the user output
    }
}

export function getChatTitle(){
    console.log("Asking for chat title");
    // checks if ws is ready to transmit
    if (ws.readyState === WebSocket.OPEN) {
        setIsClickableNewChat(false);
        handleNewChat();
        let messageJSON = {
            'typeMessage': TYPE_CHAT_TITLE_MESSAGE,
            'chatId': currentChatId,
            'user' : currentUser, // TODO: change to user
            'email': currentEmail // TODO: change to email
        };
        ws.send(JSON.stringify(messageJSON));
        return true;
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
        return false; //needed to the user output
    }
}
