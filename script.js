const SENDTEXTCLASS = 'sendbox';
const LETTERS ='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const LETTERS_AMOUNT = 69;
const TYPECHAT = 'CHAT';
const TYPEMSG = 'MSG';
let lettersCanMove = true;
let currentChatId = 'g67sdfgcvbn8';
let sendAsUser = true;
let isTiping = false;

let history = {};
let lastChat;



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
        letter.innerText = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
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
            letter.innerText = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }
        if (y < 0 || y > window.innerHeight) {
            angle = 360 - angle;
            letter.innerText = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
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

async function createID(type, classString,date){
    let ID = `${type}${classString}${date}`;
    const encoder = new TextEncoder();
    ID = encoder.encode(ID);
    
    const hash = await window.crypto.subtle.digest('SHA-256', ID);
    const hashArray = Array.from(new Uint8Array(hash));
    let hashString = hashArray.map(n => n.toString(16).padStart(2, '0')).join('');
    
    return hashString;
}

async function createMessage(asUser = true){
    let newMessage = document.createElement('div');
    newMessage.classList.add(asUser ? 'sendbox' : 'receivebox');

    // added dblclick event on new message
    newMessage.addEventListener('dblclick', function(event){
        let textToCopy = event.target.innerText;
        navigator.clipboard.writeText(textToCopy).then(function() {
            console.log('Copiato nella clipboard: ' + textToCopy);
    
            // Crea un elemento per mostrare il messaggio
            let notification = document.createElement('div');
            notification.classList.add("notification");
            let notification_body = document.createElement('div');
            notification_body.classList.add("notification_body");
            notification_body.innerText = "Copiato nella ClipBoard!\n";
            let notification_progress = document.createElement("div");
            notification_progress.classList.add("notification_progress");
            notification.appendChild(notification_body);
            notification.appendChild(notification_progress);
            document.body.appendChild(notification);
    
            // Rimuovi l'elemento dopo 2 secondi
            setTimeout(function() {
                document.body.removeChild(notification);
            }, 10000);
        }).catch(function(error) {
            console.error('Errore durante la copia nella clipboard: ', error);
        });
    });

    let msgDate = (new Date()).getTime();
    newMessage.id = await createID(TYPEMSG, SENDTEXTCLASS, msgDate);
    newMessage.setAttribute('data-time', msgDate);
    let newMessageText = document.createElement('p');
    newMessageText.classList.add(asUser ? 'send' : 'receive');
    let userInput = document.querySelector('#user-input');
    newMessageText.innerText = userInput.value.trim();
    userInput.value = '';
    let Icon = document.createElement('div');
    Icon.classList.add('icon', asUser ? 'default-user' : 'default-ai');
    if(sendAsUser){
        newMessage.appendChild(newMessageText);
        newMessage.appendChild(Icon);
    }
    else{
        newMessage.appendChild(Icon);
        newMessage.appendChild(newMessageText);
    }
    let currentChat = document.getElementById(currentChatId);
    currentChat.appendChild(newMessage);
    document.getElementsByClassName('end-separator')[0].scrollIntoView();
}

async function newChat(){
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
}

document.addEventListener("DOMContentLoaded", function() {
    generateFloatingLetters();
    animateFloatingLetters();
    document.getElementsByClassName('end-separator')[0].scrollIntoView();
});

document.addEventListener('keydown', function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        let userInput = document.querySelector('#user-input');
        if(userInput.value.trim()!=''){
            createMessage(sendAsUser);
        }
    }
})

document.addEventListener('keydown', function(event){
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
})

