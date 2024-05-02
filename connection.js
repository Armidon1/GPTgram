const ws = new WebSocket('wss://localhost:8765');

ws.onopen = function() {
    console.log('WebSocket connection opened');
    ws.send("we maschio");
};


ws.onmessage = function(event) {
    console.log('Message from server: ' + event.data);
    
    
};

ws.onclose = function() {
    console.log('WebSocket connection closed');
};



