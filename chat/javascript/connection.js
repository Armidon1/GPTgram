import { emailAccount, hashAccount, userAccount } from "./account.js";
import { createMessage, currentChatId, currentChatTitle, setChatTitle, setIsClickableNewChat, updateChatTitle, handleNewChat} from "./chat.js";
export let serverMessage = '';


let TYPE_CHAT_MESSAGE = "chat";
let TYPE_CHAT_TITLE_MESSAGE = "chatTitle";      // Tipo di messaggio per il titolo della chat
let TYPE_LOGOUT_MESSAGE = "logout";      // Tipo di messaggio per il logout

let homepage = "http://localhost:5500";
let loginpage = "http://localhost:5500/login/index.html";
let chatpage = "http://localhost:5500/chat/index.html";

let isFirstMessage = true;
export function setFirstMessage(value){
    isFirstMessage = value;
}
export function getFirstMessage(){
    return isFirstMessage;
}

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

export function logout(chatId){
    console.log("Logout");
    let hash = "hash"; //TODO
    // checks if ws is ready to transmit
    if (ws.readyState === WebSocket.OPEN) {
        let messageJSON = {
            'typeMessage': TYPE_LOGOUT_MESSAGE,
            'user' : userAccount,
            'email': emailAccount, 
            'hash': hashAccount,
        };
        ws.send(JSON.stringify(messageJSON));
        document.cookie = "login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Delete the login cookie by setting its expiry date to a date in the past
        window.location.href = homepage;
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
    }
}

export function sendMessage(message){
    console.log("Message sent from client: "+message);
    // checks if ws is ready to transmit
    if (ws.readyState === WebSocket.OPEN) {
        let messageJSON = {
            'typeMessage': TYPE_CHAT_MESSAGE,
            'message': message,
            'chatId': currentChatId,
            'user' : userAccount, 
            'email': emailAccount 
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
            'user' : userAccount, 
            'email': emailAccount 
        };
        ws.send(JSON.stringify(messageJSON));
        return true;
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
        return false; //needed to the user output
    }
}
