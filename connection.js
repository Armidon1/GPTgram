import { createMessage } from "./script.js";
export let serverMessage = '';

const ws = new WebSocket('wss://localhost:8765');

/* gestisci connessione*/
ws.onopen = function() {
    console.log('WebSocket connection opened');
};


ws.onmessage = function(event) {
    console.log('Message from server: ' + event.data);
    // checks if ws is ready to transmit
    console.log("ws.readyState: "+ parseInt(ws.readyState));
    console.log("typeof ws.readyState:"+(typeof ws.readyState));
    console.log("ws.readyState==1: "+ ws.readyState === WebSocket.OPEN);
    // if (parseInt(ws.readyState) == 1) {
    //     createMessage(false);
    // } else {
    //     console.log('Cannot receive message, WebSocket connection is not open');
    // }
    if (ws.readyState === WebSocket.OPEN) {
        console.log("sono qui: " + event.data);
        serverMessage = event.data;
        createMessage(false);
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
    }
}

ws.onclose = function() {
    console.log('WebSocket connection closed');
};


export function sendMessage(message){
    // checks if ws is ready to transmit
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        return true;
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
        return false; //needed to the user output
    }
}
