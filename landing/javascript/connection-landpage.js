let serverMessage = '';


const ws = new WebSocket('ws://localhost:8765');

/* gestisci connessione*/
ws.onopen = function() {
    console.log('WebSocket connection opened');
};


ws.onmessage = function(event) {
    console.log('Message from server: ' + event.data);
    // checks if ws is ready to transmit
    if (ws.readyState === WebSocket.OPEN) {
        serverMessage = JSON.parse(event.data);
        console.log("Message received from server: ", serverMessage);
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
    }
}

ws.onclose = function() {
    console.log('WebSocket connection closed');
};

ws.onerror = function(event) {
    console.error("WebSocket error observed:", event);
};

function sendMessage(message){
    console.log("Message sent from client: "+message);
    // checks if ws is ready to transmit
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        return true;
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
        return false; //needed to the user output
    }
}
