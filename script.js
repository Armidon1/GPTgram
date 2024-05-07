import { sendMessage, serverMessage } from './connection.js';

const SENDTEXTCLASS = 'sendbox';
const RECEIVETEXTCLASS = 'receivebox'
const LETTERS ='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const LETTERS_AMOUNT = 69;
const TYPECHAT = 'CHAT';
const TYPEMSG = 'MSG';
let lettersCanMove = true;
let currentChatId = 'g67sdfgcvbn8';
let sendAsUser = true;
let isTiping = false;
let isSearchBarShowed = false;
let isChronologyChatShowed = false;

let history = {};
let lastChat;


//APP TOOLS
function preciseSetTimeout(callback, delay) {
    let start = performance.now();

    function tick() {
        let now = performance.now();
        let difference = now - start;

        (difference >= delay) ? callback() : requestAnimationFrame(tick); 
    }
    tick();
}

function generateFloatingLetters(){
    let LetterPool = document.createElement('div');
    LetterPool.id = 'LetterPool';
    LetterPool.style.margin = '0';

    for (let i = 0; i < LETTERS_AMOUNT; i++) {
        let letter = document.createElement('div');
        letter.classList.add('letters');
        let top = Math.floor(Math.random() * window.innerHeight);
        let left = Math.floor(Math.random() * window.innerWidth);
        letter.textContent = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        letter.style.top = `${top}px`;
        letter.style.left = `${left}px`;
        let angle = 0;
        while(angle % 90 === 0){
            angle = Math.floor(Math.random() * 360);
        };
        let speed = (Math.random() * 1) + 1;
        letter.setAttribute('data-angle', angle);
        letter.setAttribute('data-speed', speed);
        LetterPool.appendChild(letter);
    }
    document.body.appendChild(LetterPool);
}

function moveFloatingletters(){
    const letters = document.querySelectorAll('.letters');
    for(let letter of letters){
        let angle = parseFloat(letter.getAttribute('data-angle'));
        const speed = parseFloat(letter.getAttribute('data-speed'));
        let x = parseFloat(letter.style.left) + Math.cos(angle * Math.PI / 180) * speed;
        let y = parseFloat(letter.style.top) + Math.sin(angle * Math.PI / 180) * speed;

        if (x < 0 || x > window.innerWidth) {
            angle = 180 - angle;
            letter.textContent = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }
        if (y < 0 || y > window.innerHeight) {
            angle = 360 - angle;
            letter.textContent = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }

        letter.style.left = `${x}px`;
        letter.style.top = `${y}px`;
        letter.setAttribute('data-angle', angle);
    }
}

function animateFloatingLetters(){
    function update(){
        moveFloatingletters();
    }

    function animate(){
        if(lettersCanMove){
            update();
            requestAnimationFrame(animate);
        }
    }

    animate();
}

async function createID(type, classString, date){
    let ID = `${type}${classString}${date}`;
    const encoder = new TextEncoder();
    ID = encoder.encode(ID);
    
    const hash = await window.crypto.subtle.digest('SHA-256', ID);
    const hashArray = Array.from(new Uint8Array(hash));
    let hashString = hashArray.map(n => n.toString(16).padStart(2, '0')).join('');
    
    return hashString;
}


//USER TOOLS
async function copyToClipboard(event){
    let textToCopy = event.target.textContent;
    try{
        await navigator.clipboard.writeText(textToCopy);
        let notification = document.createElement('div');
        notification.classList.add("notification");
        let notification_body = document.createElement('div');
        notification_body.classList.add("notification-body");
        notification_body.textContent = "messaggio copiato!\n";
        let notification_progress = document.createElement("div");
        notification_progress.classList.add("notification-progress");
        notification.appendChild(notification_body);
        notification.appendChild(notification_progress);
        document.body.appendChild(notification);

        preciseSetTimeout(function() {
            document.body.removeChild(notification);
        }, 10000);
    
    } catch (error){
        console.error('Errore durante la copia nella clipboard: ', error);
    }
}

//GESTIONE DEI MESSAGGI
function preventDefaultSelection(event){
    if (event.detail > 1) {
        event.preventDefault();
    }
}
async function newUserMessage(){
    let userInput = document.querySelector('#user-input');
    if(userInput.value.trim()==''){
        return;
    }
    let newMessage = document.createElement('div');
    newMessage.classList.add(SENDTEXTCLASS);
    
    newMessage.addEventListener('dblclick', copyToClipboard);
    newMessage.addEventListener('mousedown', preventDefaultSelection);

    let msgDate = (new Date()).getTime();
    newMessage.id = await createID(TYPEMSG, SENDTEXTCLASS, msgDate);
    newMessage.setAttribute('data-time', msgDate);
    let newMessageText = document.createElement('p');
    newMessageText.classList.add('send');
    newMessageText.textContent = userInput.value.trim();
    userInput.value = '';
    let Icon = document.createElement('div');
    Icon.classList.add('icon', 'default-user');
    if (!sendMessage(newMessageText.textContent)){ //sends message at the server
        alert("ERRORE: La connessione WebSocket non è aperta ancora (?)");
    }
    newMessage.appendChild(newMessageText);
    newMessage.appendChild(Icon);
    
    let currentChat = document.getElementById(currentChatId);
    currentChat.appendChild(newMessage);
    document.getElementsByClassName('end-separator')[0].scrollIntoView();
}

async function newAIMessage(message){
    let newMessage = document.createElement('div');
    newMessage.classList.add(RECEIVETEXTCLASS);
    
    newMessage.addEventListener('dblclick', copyToClipboard);
    newMessage.addEventListener('mousedown', preventDefaultSelection);

    let msgDate = (new Date()).getTime();
    newMessage.id = await createID(TYPEMSG, RECEIVETEXTCLASS, msgDate);
    newMessage.setAttribute('data-time', msgDate);
    let newMessageText = document.createElement('p');
    newMessageText.classList.add('receive');
    newMessageText.textContent = serverMessage;
    let Icon = document.createElement('div');
    Icon.classList.add('icon', 'default-ai');
    
    newMessage.appendChild(Icon);
    newMessage.appendChild(newMessageText);
    
    let currentChat = document.getElementById(currentChatId);
    currentChat.appendChild(newMessage);
    document.getElementsByClassName('end-separator')[0].scrollIntoView();
}
export async function createMessage(asUser = true){
    if (asUser) newUserMessage();
    else newAIMessage(serverMessage);
}

//GESTIONE DELLA CHAT
function chatIsNotEmpty(chatbox){
    return chatbox.childElementCount > 0;
}
function restoreChat(chatId){
    let chatbox = document.querySelector('.chatbox');
    if (chatIsNotEmpty(chatbox)){
        history[currentChatId] = document.querySelector('.chatbox');
    }
    let chatflow = document.querySelector('.chatflow');
    chatflow.removeChild(chatbox);
    chatflow.removeChild(document.querySelector('.end-separator'));
    chatflow.appendChild(history[chatId]);
    let endSeparator = document.createElement('div');
    endSeparator.classList.add('end-separator');
    chatflow.appendChild(endSeparator);
    currentChatId = chatId;
    delete history[chatId];
    removeChronologyChat();
    removeSearchBar(document.querySelector('.header'));
    preciseSetTimeout(function() {
        updateListChronologyChat(document.querySelector('#chronologyChat'), "");
    }, 300);
}
async function newChat(){
    if (chatIsNotEmpty(document.querySelector('.chatbox'))){
        let oldChat = document.querySelector(".chatbox");
        history[oldChat.id] = oldChat;
        let chatflow = document.querySelector(".chatflow")
        chatflow.removeChild(oldChat);
        chatflow.removeChild(document.querySelector(".end-separator"));
        
        let newChat = document.createElement("div"); /* ci servirà per la struttura dati*/
        newChat.classList.add("chatbox");

        let newDate = (new Date()).getTime();
        newChat.id = await createID(TYPECHAT, "chatbox", newDate);
        currentChatId = newChat.id
        newChat.setAttribute("data-time", newDate);
        chatflow.appendChild(newChat);
        let endSeparator = document.createElement("div");
        endSeparator.classList.add("end-separator");
        chatflow.appendChild(endSeparator);
        lastChat = oldChat;
        console.log(lastChat);
        let header = document.querySelector('.header');
        let chronologyChat = document.querySelector('#chronologyChat');
        updateListChronologyChat(chronologyChat, "");
    }
}

//GESTIONE DELLA RICERCA
function showSearchBar(header, title) {
    isSearchBarShowed = true;
    let searchBar = document.createElement('input');
    searchBar.addEventListener('input', function(event) {
        let text = event.target.value;
        let chronologyChat = document.querySelector('#chronologyChat');
        updateListChronologyChat(chronologyChat, text);
    });
    searchBar.type = 'text';
    searchBar.placeholder = 'Cerca...';
    searchBar.id = 'searchBar';
    searchBar.className = 'slide slide-in';
    header.insertBefore(searchBar, title.nextSibling);
    preciseSetTimeout(function(){
        searchBar.focus();
    }, 300);
}
function removeSearchBar(header) {
    isSearchBarShowed = false;
    let searchBar = document.querySelector('#searchBar');
    searchBar.className = 'slide slide-out';
    preciseSetTimeout(function() {
        header.removeChild(searchBar);
        let userInput = document.querySelector('#user-input');
        userInput.focus();
    }, 300); 
}
function handleSearchBar(header, title) {   
    if (isSearchBarShowed){
        removeSearchBar(header);
    } else {
        showSearchBar(header, title);
    }
}

function cancelContentChronologyChat() {
    if (document.querySelector('#chronologyChat') != null) {
        let chronologyChat = document.querySelector('#chronologyChat');
        chronologyChat.innerHTML = '';
    }
}

function createAndAppendClickableElement(parent, key) {
    let clickableElement = document.createElement('button');
    clickableElement.classList.add('scroll-button');
    clickableElement.textContent = key;
    clickableElement.onclick = function() {
        console.log('Hai cliccato la chiave ' + key + '!');
        restoreChat(key);
    };
    parent.appendChild(clickableElement);
}
function createAndAppendNoResults(parent, message) {
    let noResults = document.createElement('p');
    noResults.textContent = message;
    noResults.style.color = 'white';
    noResults.style.textAlign = 'center';
    noResults.style.marginTop = '10px';
    noResults.style.fontSize = '16px';
    parent.appendChild(noResults);
}
function updateListChronologyChat(chronologyChat, text) {
    if (chronologyChat != null) {
        let keys = Object.keys(history);
        let results = text == "" ? keys : keys.filter(key => key.includes(text));
        cancelContentChronologyChat();
        if (results.length == 0) {
            let message = text == "" ? "Nessun risultato trovato. Prova a divertirti con GPTgram e crea una nuova chat!" : "Nessun risultato trovato. Prova a cercare con un testo diverso!";
            createAndAppendNoResults(chronologyChat, message);
        } else {
            let chronologyDelimiter = document.createElement('div');
            chronologyDelimiter.classList.add('scroll-delimiter');
            chronologyChat.appendChild(chronologyDelimiter)
            for(let i = 0; i < results.length; i++) {
                createAndAppendClickableElement(chronologyChat, results[i]);
            }
        }
    }
}

function removeChronologyChat() {
    isChronologyChatShowed= false;
    let chronologyChat = document.querySelector('#chronologyChat');
    chronologyChat.className = 'scroll scroll-above';
    preciseSetTimeout(function() {
        document.body.removeChild(chronologyChat);
    }, 300);
}
function showChronologyChat() {
    isChronologyChatShowed = true;
    let chatflow = document.querySelector('.chatflow');
    let chronologyChat = document.createElement('div');
    chronologyChat.id = 'chronologyChat';
    chronologyChat.className = 'scroll scroll-below';
    
    // Creazione di una lista di elementi cliccabili DA SISTEMARE
    updateListChronologyChat(chronologyChat,"");
    document.body.insertBefore(chronologyChat, chatflow);
}
function handleChronologyChat() {
    if (isChronologyChatShowed){
        removeChronologyChat();
    } else {
       showChronologyChat();
    }
}

function clickedSearchButton() {
    let header = document.querySelector('.header');
    let title = document.querySelector('.title');
    handleSearchBar(header, title);
    handleChronologyChat();
}
let searchButton = document.querySelector('#search');
searchButton.addEventListener('click', clickedSearchButton);



//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", async function() {
    generateFloatingLetters();
    animateFloatingLetters();
    
    let chatflow = document.querySelector('.chatflow');

    let chatbox = document.createElement('div');
    chatbox.classList.add('chatbox');
    let date = (new Date()).getTime();
    chatbox.id = await createID(TYPECHAT, 'chatbox', date);
    chatbox.setAttribute('data-time', date);
    currentChatId = chatbox.id;
    chatflow.appendChild(chatbox);

    let endSeparator = document.createElement('div');
    endSeparator.classList.add('end-separator');
    chatflow.appendChild(endSeparator);

    endSeparator.scrollIntoView();
    let userInput = document.querySelector('#user-input');
    userInput.focus();
});

document.addEventListener('keydown', function(event){ //user bindings
    if(event.key === 'Enter' && !event.shiftKey && !event.ctrlKey){
        event.preventDefault();
        let userInput = document.querySelector('#user-input');
        if(userInput.value.trim()!=''){
            createMessage(sendAsUser);
        }
    } else if(event.key === 'Enter' && event.shiftKey){
        console.log('Enter + Shift');
        event.preventDefault();
        let userInput = document.querySelector('#user-input');
        userInput.value += '\n';
    }
});

document.addEventListener('keydown', function(event){ //developer bindings 
    if(event.ctrlKey && event.shiftKey && event.key === 'I'){
        sendAsUser = false;
    } else if(event.ctrlKey && event.shiftKey && event.key === 'U'){
        sendAsUser = true;
    } else if(event.ctrlKey && event.shiftKey && (event.key.toLocaleLowerCase() === 'z')) {
        console.log(lastChat);
        let currentChat = document.querySelector(".chatbox");
        console.log(currentChat);
        if (currentChat != null){
            history[currentChat.id] = currentChat;
            let chatflow = document.querySelector(".chatflow");
            chatflow.removeChild(currentChat);
            chatflow.removeChild(document.querySelector(".end-separator"));
            chatflow.appendChild(lastChat);
            currentChatId = lastChat.id;
            lastChat = currentChat;
            let endSeparator = document.createElement("div"); 
            endSeparator.classList.add("end-separator");
            chatflow.appendChild(endSeparator);
        }   
    }
});

window.addEventListener('focus', function(){
    let userInput = document.querySelector('#user-input');
    userInput.focus();
});

document.querySelector('#newchat').addEventListener('click', newChat);
