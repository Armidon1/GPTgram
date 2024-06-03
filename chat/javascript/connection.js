import { emailAccount, hashAccount, userAccount } from "./account.js";
import { createMessage, currentChatId, currentChatTitle, setChatTitle, setIsClickableNewChat, updateChatTitle, handleNewChat, importServerChats, restoreChat} from "./chat.js";
export let serverMessage = '';


let TYPE_CHAT_MESSAGE = "chat";
let TYPE_CHAT_TITLE_MESSAGE = "chatTitle";      // Tipo di messaggio per il titolo della chat
let TYPE_LOGOUT_MESSAGE = "logout";      // Tipo di messaggio per il logout
let TYPE_REQUEST_CHAT_LIST = "chatList"          // Tipo di messaggio per la lista delle chat
let TYPE_REQUEST_CHAT_CONTENT = "chatContent"          // Tipo di messaggio per il contenuto della chat
let TYPE_AUDIO_MESSAGE = "audio";          // Tipo di messaggio per l'audio

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
    requestChatsBackups();
};


ws.onmessage = function(event) {
    //console.log('Message from server: ' + event.data);
    let data = JSON.parse(event.data);
    switch(data.typeMessage){
        case TYPE_CHAT_MESSAGE:
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
            break;
        case TYPE_CHAT_TITLE_MESSAGE:
            let title = data.title;
            console.log("Chat title: "+title);
            //sovrascrive il titolo della chat
            setChatTitle(title);
            updateChatTitle();
            setIsClickableNewChat(true);
            handleNewChat();
            break;
        case TYPE_REQUEST_CHAT_LIST:
            let titles = data.titles;
            //console.log("Chat titles: "+titles);
            importServerChats(titles);
            setIsClickableNewChat(true);
            handleNewChat();
            break;
        case TYPE_REQUEST_CHAT_CONTENT:
            let messages = data.messages;
            let chatID = data.chatID;
            console.log("chatID: "+ chatID +"chat content: "+messages);
            restoreChat(chatID, messages);
            setIsClickableNewChat(true);
            handleNewChat();
            break;
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

export function sendAudio(blob){
    if (ws.readyState === WebSocket.OPEN) {
        let binaryDataReader = new FileReader();
        binaryDataReader.onload = function(event) {
            let base64Audio = btoa(event.target.result); // Encode the audio data in base64
            let audioJSON = {
                'typeMessage': TYPE_AUDIO_MESSAGE,
                'audio': base64Audio,
                'chatId': currentChatId,
                'user' : userAccount,
                'email': emailAccount,
                'date' : (new Date()).toISOString()
            };
            ws.send(JSON.stringify(audioJSON));
        };
        binaryDataReader.readAsBinaryString(blob);
        return true;
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
        return false;
    }
}

export function sendMessage(message){
    //console.log("Message sent from client: "+message);
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

export function requestChatsBackups(){
    console.log("Asking for chat backups");
    // checks if ws is ready to transmit
    if (ws.readyState === WebSocket.OPEN) {
        setIsClickableNewChat(false);
        handleNewChat();
        let messageJSON = {
            'typeMessage': TYPE_REQUEST_CHAT_LIST,
            'user' : userAccount, 
        };
        ws.send(JSON.stringify(messageJSON));
        return true;
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
        return false; //needed to the user output
    }
}

export function getContentChatFromServer(chatID){
    console.log("Asking for chat content");
    // checks if ws is ready to transmit
    if (ws.readyState === WebSocket.OPEN) {
        setIsClickableNewChat(false);
        handleNewChat();
        //console.log("user: "+userAccount);
        //console.log("chatID: "+chatID);
        let messageJSON = {
            'typeMessage': TYPE_REQUEST_CHAT_CONTENT,
            'chatId': chatID,
            'user' : userAccount,
        };
        ws.send(JSON.stringify(messageJSON));
        return true;
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
        return false; //needed to the user output
    }
}
