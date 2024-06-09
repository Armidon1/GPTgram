import {popUpMessage} from "../login/login-script.js";
export let serverMessage = '';

let LetterPool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //salt for the hash

let homepage = "http://localhost:5500";
let loginpage = "http://localhost:5500/login/index.html";
let chatpage = "http://localhost:5500/chat/index.html";

const ws = new WebSocket('wss://localhost:8765');
const TYPE_MESSAGE_NEW_COOKIE = "newCookie";
const TYPE_MESSAGE_COOKIE = "cookie";

let email = "";
let user = "";


//security
async function checksumHash(email, user, date){
    let hash = email+user+date;
    let salt = "";
    for (let i = 0; i < 16   ; i++){
        salt += LetterPool.charAt(Math.floor(Math.random() * LetterPool.length));
    }
    let pepper = "";
    for (let i = 0; i < 32; i++){
        pepper += LetterPool.charAt(Math.floor(Math.random() * LetterPool.length));
    }
    hash = salt + hash + pepper;
    const encoder = new TextEncoder();
    hash= encoder.encode(hash);
    hash = await window.crypto.subtle.digest('SHA-256', hash);
    const hashArray = Array.from(new Uint8Array(hash));
    let hashString = hashArray.map(n => n.toString(16).padStart(2, '0')).join('');

    console.log("Hash generated: ", hashString);

    return hashString;
}

/* gestisci connessione*/
ws.onopen = function() {
    console.log('WebSocket connection opened');
};

//handle server messages: login success and cookie creation
ws.onmessage = async function(event) {
    console.log('Message from server: ' + event.data);
    // checks if ws is ready to transmit
    if (ws.readyState === WebSocket.OPEN) {
        serverMessage = JSON.parse(event.data);
        console.log("Message received from server: ", serverMessage);
        switch (serverMessage.status) {
            case "success": //login success and cookie creation
                popUpMessage("Login success!");
                email = serverMessage.email;
                user = serverMessage.user;
                let currentDate = new Date();
                let hashString = await checksumHash(email, user, currentDate.toLocaleString());
                let expireDate = new Date(currentDate);
                expireDate.setDate(currentDate.getDate() + 7);
                let cookieValue = {
                    hash: hashString,
                    user: user,
                    email: email,
                };
                document.cookie = `login=${JSON.stringify(cookieValue)}; expires=${expireDate.toUTCString()}; path=/`;
                ws.send(JSON.stringify({typeMessage: TYPE_MESSAGE_NEW_COOKIE, hash: hashString, username: user, expire: expireDate.toLocaleString()}));
                //window.location.href = chatpage;
                break;
            case "RegisterSuccess":
                console.log("Registation success");
                popUpMessage("Registration success!");
                break;
            case "errorRegisterUserExist":
                popUpMessage("User already exists");
                break;
            case "NewCookieSuccess":
                if (serverMessage.email === email){
                    // window.location.href = chatpage;
                    window.location.replace(chatpage);
                } else {
                    console.log("Cookie not valid");
                }
                break;
            case "CookieSuccess":
                window.location.replace(chatpage);
                break;
            case "CookieInvalid":
                document.cookie = "login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                break;
            case "errorLoginWrongPassword":
                popUpMessage("Wrong password");
                break;
            case "errorLoginUserNotExist":
                popUpMessage("User does not exist");
                break;
            default:
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
        ws.send(JSON.stringify(message));
        return true;
    } else {
        console.log('Cannot send message, WebSocket connection is not open');
        return false; //needed to the user output
    }
}
window.onload = function() {
    // Check if the login cookie exists
    let loginCookie = document.cookie.split('; ').find(row => row.startsWith('login'));
    console.log("Cookie: ", loginCookie);
    if (loginCookie) {
        // Parse the cookie value into an object
        let cookieValue = JSON.parse(loginCookie.split('=')[1]);
        // Extract the hash, username, and expire date from the cookie
        let hash = cookieValue.hash;
        let username = cookieValue.user;
        let expireDate = new Date(cookieValue.expire);
        ws.send(JSON.stringify({typeMessage: TYPE_MESSAGE_COOKIE, hash: hash, username: username, expire: expireDate.toLocaleString()}));
    }
}