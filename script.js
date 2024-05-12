import { sendMessage, serverMessage } from './connection.js';
import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js'

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
let isRecording = false;
let isSearchBarShowed = false;
let isHistoryChatShowed = false;
let isAllHistoryChatShowed = false;
let moveHistoryChat = 0;

let history = {};               //contiene dall'ID della chat associata all'intera chatbox
let sortedHistoryChat = {};     //contiene la data associata all'ID della chat
let lastChat;

let audioDuration = null;
let audioRecorder = null;
let audioStream = null;
let temporaryAudioChunks = [];
let audios = [] // temporaneo

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

function generateFloatingLetters(letterAmount = LETTERS_AMOUNT){
    let LetterPool;

    if (document.querySelector('#letter-pool') != null) {
        letterPool = document.querySelector('#letter-pool');
    } else {
        LetterPool = document.createElement('div');
        LetterPool.id = 'letter-pool';
        LetterPool.style.margin = '0';
    }

    for (let i = 0; i < letterAmount; i++) {
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
function printHistory(){
    for (let i = 0; i<sortedHistoryChat.length; i++)
        console.log(history[sortedHistoryChat[i]]);
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
    removeHistoryChat();
    removeSearchBar(document.querySelector('.header'));
    preciseSetTimeout(function() {
        updateListHistoryChat(document.querySelector('#historyChat'), "");
        updateListAllHistoryChat(document.querySelector('#allHistoryChat'));
    }, 300);
}
async function newChat(){
    if (chatIsNotEmpty(document.querySelector('.chatbox'))){
        let oldChat = document.querySelector(".chatbox");
        printHistory();
        //console.log(oldChat.dateTime);
        history[oldChat.id] = oldChat;
        sortedHistoryChat[oldChat.dateTime] = oldChat.id;

        let chatflow = document.querySelector(".chatflow")
        chatflow.removeChild(oldChat);
        chatflow.removeChild(document.querySelector(".end-separator"));
        
        let newChat = document.createElement("div"); /* ci servirà per la struttura dati*/
        newChat.classList.add("chatbox");

        let newDate = (new Date()).getTime();
        newChat.id = await createID(TYPECHAT, "chatbox", newDate);
        newChat.dateTime = newDate;
        currentChatId = newChat.id
        newChat.setAttribute("data-time", newDate);
        chatflow.appendChild(newChat);
        let endSeparator = document.createElement("div");
        endSeparator.classList.add("end-separator");
        chatflow.appendChild(endSeparator);
        lastChat = oldChat;
        console.log(lastChat);
        let header = document.querySelector('.header');
        let historyChat = document.querySelector('#historyChat');
        let allHistoryChat = document.querySelector('#allHistoryChat');

        updateListHistoryChat(historyChat, "");
        updateListAllHistoryChat(allHistoryChat);
    }
}

//GESTIONE DELLA RICERCA
function showSearchBar(header, title) {
    isSearchBarShowed = true;
    let searchBar = document.createElement('input');
    searchBar.addEventListener('input', function(event) {
        let text = event.target.value;
        let historyChat = document.querySelector('#historyChat');
        updateListHistoryChat(historyChat, text);
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

function cancelContentHistoryChat() {
    if (document.querySelector('#historyChat') != null) {
        let historyChat = document.querySelector('#historyChat');
        historyChat.innerHTML = '';
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
    noResults.className = 'no-result-all-history-list';
    noResults.id = 'noResultAllHistoryList';
    noResults.textContent = message;
    parent.appendChild(noResults);
}
function updateListHistoryChat(historyChat, text) {
    if (historyChat != null) {
        let sortedDateKeys = Object.keys(sortedHistoryChat).sort((a, b) => b - a);   //continene una lista ordinata delle date delle chat. 
                                                                                    //le chiavi ordinate verrano usate nuovamente su sortedHistoryChat 
                                                                                    //per ottenere l'ID della chat in ordine
        let sortedChatIds = sortedDateKeys.map(date => sortedHistoryChat[date]);
        let results = text == "" ? sortedChatIds : sortedChatIds.filter(id => id.includes(text));
        

        cancelContentHistoryChat();
        if (text == ""){
            if (results.length == 0) {
                let message = "Nessun risultato trovato. Prova a divertirti con GPTgram e crea una nuova chat!" ;
                createAndAppendNoResults(historyChat, message);
            } else {
                for(let i = 0; (i < results.length && i<5); i++) {
                    createAndAppendClickableElement(historyChat, results[i]);
                }
            }
        } else{
            if (results.length == 0) {
                let message = "Nessun risultato trovato. Prova a cercare con un testo diverso!";
                createAndAppendNoResults(historyChat, message);
            } else {
                for(let i = 0; (i < results.length && i<5); i++) {
                    createAndAppendClickableElement(historyChat, results[i]);
                }
            }
        }
        }
}

function removeHistoryChat() {
    isHistoryChatShowed= false;
    let historyChat = document.querySelector('#historyChat');
    historyChat.className = 'scroll scroll-above';
    let header = document.querySelector('.header');
    header.style.borderRadius = '10px';
    preciseSetTimeout(function() {
        document.body.removeChild(historyChat);
    }, 300);
}
function showHistoryChat() {
    isHistoryChatShowed = true;
    let chatflow = document.querySelector('.chatflow');
    let historyChat = document.createElement('div');
    historyChat.id = 'historyChat';
    historyChat.className = 'scroll scroll-below';
    let header = document.querySelector('.header');
    header.style.borderRadius = '10px 10px 0 0';
    
    // Creazione di una lista di elementi cliccabili DA SISTEMARE
    updateListHistoryChat(historyChat,"");
    document.body.insertBefore(historyChat, chatflow);
}
function handleHistoryChat() {
    if (isHistoryChatShowed){
        removeHistoryChat();
    } else {
        showHistoryChat();
    }
}


function insertTitleToAllHistoryChat(allHistoryChat){
    let allHistoryChatTitle = document.createElement('p'); // Crea un nuovo elemento <p>
    allHistoryChatTitle.id = 'allHistoryChatTitle'; // Assegna un ID all'elemento
    allHistoryChatTitle.className = 'all-history-title'; // Assegna una classe all'elemento
    let textNode = document.createTextNode("History Chat"); // Crea un nodo di testo
    allHistoryChatTitle.appendChild(textNode); // Aggiunge il nodo di testo all'elemento
    allHistoryChat.appendChild(allHistoryChatTitle);
}
function cancelContentAllHistoryChat(){
    if (document.querySelector('#allHistoryChat') != null) {
        let allHistoryChatButtonList = allHistoryChat.querySelector("#allHistoryChatButtonList");
        allHistoryChatButtonList.innerHTML = '';
    }
}
function createAndAppendClickableAllHistoryButton(parent, key) {
    let clickableElement = document.createElement('button');
    clickableElement.classList.add('scroll-button');
    clickableElement.classList.add('all-history-button');
    //console.log("inserito con la chiave: "+key+", valore: "+History[key]);
    clickableElement.textContent = key;
    clickableElement.onclick = function() {
        console.log('Hai cliccato la chiave ' + key + '!');
        restoreChat(key);
    };
    parent.appendChild(clickableElement);
    return clickableElement;
}
function updateListAllHistoryChat(allHistoryChat){
    if (allHistoryChat != null) {
        let sortedDateKeys = Object.keys(sortedHistoryChat).sort((a, b) => b - a);   //continene una lista ordinata delle date delle chat. 
                                                                                                        //le chiavi ordinate verrano usate nuovamente su sortedHistoryChat 
                                                                                                        //per ottenere l'ID della chat in ordine
        cancelContentAllHistoryChat();
        if (sortedDateKeys.length == 0) {
            let message = "La lista è vuota! Premi il pulsante \"nuova chat\" per scoprirne di più ;)";
            createAndAppendNoResults(allHistoryChat.querySelector('#allHistoryChatButtonList'), message);
        } else {
            let allHistoryChatButtonList = allHistoryChat.querySelector("#allHistoryChatButtonList");
            for(let i = 0; i < sortedDateKeys.length; i++) {
                if (allHistoryChatButtonList.querySelector('#noResultAllHistoryList')!=null){
                    allHistoryChat.removeChild(document.querySelector('#noResultAllHistoryList'));
                }
                createAndAppendClickableAllHistoryButton(allHistoryChatButtonList, sortedHistoryChat[sortedDateKeys[i]]);
            }
        }
    }
}
function removeAllHistoryChat(){
    isAllHistoryChatShowed= false;
    let allHistoryChat = document.querySelector('#allHistoryChat');
    allHistoryChat.className = 'all-history all-history-slide-right';
    preciseSetTimeout(function() {
        document.body.removeChild(allHistoryChat);
    }, 300);
}
function showAllHistoryChat(){
    isAllHistoryChatShowed = true;
    let allHistoryChat = document.createElement('div');
    allHistoryChat.id = 'allHistoryChat';
    allHistoryChat.className = 'all-history all-history-slide-left';
    insertTitleToAllHistoryChat(allHistoryChat);
    
    // Creazione di una lista di elementi cliccabili 
    let allHistoryChatButtonList = document.createElement('div');
    allHistoryChatButtonList.id = 'allHistoryChatButtonList';
    allHistoryChatButtonList.className = 'all-history-button-list';
    allHistoryChat.appendChild(allHistoryChatButtonList);
    updateListAllHistoryChat(allHistoryChat);
    document.body.appendChild(allHistoryChat);
}
function handleAllHistoryChat(){
    if (isAllHistoryChatShowed){
        removeAllHistoryChat();
    } else {
        showAllHistoryChat();
    }
}


function clickedSearchButton() {
    let header = document.querySelector('.header');
    let title = document.querySelector('.title');
    handleSearchBar(header, title);
    handleHistoryChat();
    handleAllHistoryChat();
}

function canRecordAudio() {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
}

function setupStream(audioStream) {
    audioRecorder = new MediaRecorder(audioStream);
    
    audioRecorder.ondataavailable = function(event) {
        temporaryAudioChunks.push(event.data);
    }

    audioRecorder.onstop = function() {
        const audioBlob = new Blob(temporaryAudioChunks, {type: 'audio/ogg; codecs=opus'}); 
        const audioUrl = URL.createObjectURL(audioBlob);
        audios.push(audioUrl); // temporaneo
        const audio = new Audio(audioUrl);


        temporaryAudioChunks = [];

        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
        }
    }
}

async function setupAudio() {
    if(canRecordAudio()) {
        let audioStream = await navigator.mediaDevices.getUserMedia({audio: true})
        setupStream(audioStream)
    }
}

async function handleAudio() {

    if(!canRecordAudio()) {
        alert('ci sono problemi con la registrazione audio: il tuo browser non supporta questa funzionalità oppure non hai dato i permessi necessari');
        return;
    }

    isRecording = !isRecording;

    let mic = document.querySelector('#mic');
    if (isRecording) {
        mic.style.backgroundImage = 'url(./asset/recording.svg)';

        if (!audioStream) {
            await setupAudio();
        }
        audioRecorder.start();
        console.log('Recording...');
    } else{
        mic.style.backgroundImage = 'url(./asset/mic.svg)';
        audioRecorder.stop();
        console.log('Stopped recording');
    }
}

//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", async function() {
    generateFloatingLetters();
    animateFloatingLetters();

    // await setupAudio();
    
    let chatflow = document.querySelector('.chatflow');

    let chatbox = document.createElement('div');
    chatbox.classList.add('chatbox');
    let date = (new Date()).getTime();
    chatbox.id = await createID(TYPECHAT, 'chatbox', date);
    chatbox.dateTime = date;
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
document.querySelector('#mic').addEventListener('click', handleAudio);
document.querySelector('#search').addEventListener('click', clickedSearchButton);
