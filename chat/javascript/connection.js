import { createMessage, currentChatId} from "./chat.js";
export let serverMessage = '';

let TYPE_CHAT_MESSAGE = "chat";

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
        } else {
            console.log('Cannot send message, WebSocket connection is not open');
        }
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
            'user' : 'user', // TODO: change to user
        };
        ws.send(JSON.stringify(messageJSON));
        return true;
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
        return false; //needed to the user output
    }
}
