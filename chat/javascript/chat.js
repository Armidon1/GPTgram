import { preciseSetTimeout , createID , preventDefaultSelection , copyToClipboard} from './utils.js';
import { sendMessage , serverMessage, getFirstMessage, setFirstMessage} from './connection.js';
import { updateListHistoryChat, removeHistoryChat, removeSearchBar} from './history.js';
import { updateListAllHistoryChat, removeAllHistoryChat} from './all_history.js';
import { fakeAI } from './events.js';
import { applyClassTheme , removeClassTheme} from './settings.js';

export const SENDTEXTCLASS = 'sendbox';
export const RECEIVETEXTCLASS = 'receivebox'

const TYPECHAT = 'CHAT';
const TYPEMSG = 'MSG';

export let currentChatId = null;
export let currentChatTitle = "*";

export let history = {};               //contiene dall'ID della chat associata all'intera chatbox
export let sortedHistoryChat = {};     //contiene la data associata all'ID della chat
export let fromChatIDtoTitle = {};     //contiene l'ID della chat associata al titolo della chat

export let isClickableNewChat = true;

let devMode = true;


//GESTIONE DEI MESSAGGI
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
    applyClassTheme('send',newMessageText);
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

async function newAIMessage(){
    let newMessage = document.createElement('div');
    newMessage.classList.add(RECEIVETEXTCLASS);
    
    newMessage.addEventListener('dblclick', copyToClipboard);
    newMessage.addEventListener('mousedown', preventDefaultSelection);

    let msgDate = (new Date()).getTime();
    newMessage.id = await createID(TYPEMSG, RECEIVETEXTCLASS, msgDate);
    newMessage.setAttribute('data-time', msgDate);
    let newMessageText = document.createElement('p');
    newMessageText.classList.add('receive');
    applyClassTheme('receive', newMessageText);
    newMessageText.textContent = devMode && fakeAI ? document.querySelector('#user-input').value.trim() : serverMessage;
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
    else newAIMessage();
}

//GESTIONE DELLA CHAT
export function getChatTitle(){
    return currentChatTitle;
}
export function setChatTitle(title){
    currentChatTitle = title;
}
export function updateChatTitle(){
    let chatbox = document.querySelector('.chatbox');
    chatbox.setAttribute('data-title', currentChatTitle);
    fromChatIDtoTitle[currentChatId] = currentChatTitle;
    setIsClickableNewChat(true);
}
function chatIsNotEmpty(chatbox){
    return chatbox.childElementCount > 0;
}
export function restoreChat(chatId){
    let chatbox = document.querySelector('.chatbox');
    if (chatIsNotEmpty(chatbox)){       //salva la chat corrente nella history se non è vuota
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
    delete sortedHistoryChat[document.getElementById(chatId).dateTime];
    removeHistoryChat();
    removeAllHistoryChat();
    removeSearchBar(document.querySelector('.header'));
    preciseSetTimeout(function() {
        updateListHistoryChat(document.querySelector('#historyChat'), "");
        updateListAllHistoryChat(document.querySelector('#allHistoryChat'));
    }, 300);
}
export async function newChat(){
    if (isClickableNewChat){
        setFirstMessage(true);
    let chatflow = document.querySelector('.chatflow');
    let newChat = document.createElement('div');
    newChat.classList.add('chatbox');
    let newDate = (new Date()).getTime();
    newChat.id = await createID(TYPECHAT, "chatbox", newDate);
    newChat.setAttribute("data-time", newDate);
    newChat.setAttribute("data-title", currentChatTitle);
    newChat.dateTime = newDate;

    let endSeparator = document.querySelector('.end-separator');

    if (!document.querySelector('.chatbox')){
        currentChatId = newChat.id;
        chatflow.insertBefore(newChat, endSeparator);

    } else if (chatIsNotEmpty(document.querySelector('.chatbox'))){
        let oldChat = document.querySelector(".chatbox");
        history[oldChat.id] = oldChat;
        sortedHistoryChat[oldChat.dateTime] = oldChat.id;
        chatflow.removeChild(oldChat);
        // chatflow.removeChild(document.querySelector(".end-separator"));
        
        currentChatId = newChat.id
        chatflow.insertBefore(newChat, endSeparator);

        let historyChat = document.querySelector('#historyChat');
        let allHistoryChat = document.querySelector('#allHistoryChat');

        updateListHistoryChat(historyChat, "");
        updateListAllHistoryChat(allHistoryChat);
    } else{
        console.log("newChat: is not already clickable");
    }
    }
}
export function getIsClickableNewChat(){
    return isClickableNewChat;
}
export function setIsClickableNewChat(value){
    isClickableNewChat = value;
}
export function handleNewChat(){
    let newChatButton = document.querySelector('#newchat');
    if (isClickableNewChat){
        newChatButton.classList.remove('new-chat-disabled');
    } else {
        newChatButton.classList.add('new-chat-disabled');
    }
}


export function removeChatTheme(){
    let chatbox = document.querySelector('.chatbox');
    if (chatbox){
        let messages = chatbox.querySelectorAll('.send, .receive');
        messages.forEach(message => {
            removeClassTheme(message.classList[0], message);
        });
        let icons = chatbox.querySelectorAll('.default-user, .default-ai');
        icons.forEach(icon => {
            removeClassTheme(icon.classList[1], icon);
        });
    }
}
export function updateChatTheme(){ //da implementare
    let chatbox = document.querySelector('.chatbox');
    if (chatbox){
        let messages = chatbox.querySelectorAll('.send, .receive');
        messages.forEach(message => {
            applyClassTheme(message.classList[0], message);
        });
        let icons = chatbox.querySelectorAll('.default-user, .default-ai');
        icons.forEach(icon => {
            applyClassTheme(icon.classList[1], icon);
        });
    }
}