import { preciseSetTimeout , createID , preventDefaultSelection , copyToClipboard} from './utils.js';
import { sendMessage , serverMessage} from './connection.js';
import { updateListHistoryChat, removeHistoryChat, removeSearchBar} from './history.js';
import { updateListAllHistoryChat} from './all_history.js';

const SENDTEXTCLASS = 'sendbox';
const RECEIVETEXTCLASS = 'receivebox'

const TYPECHAT = 'CHAT';
const TYPEMSG = 'MSG';

export let currentChatId = null;

export let history = {};               //contiene dall'ID della chat associata all'intera chatbox
export let sortedHistoryChat = {};     //contiene la data associata all'ID della chat

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
export function restoreChat(chatId){
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
export async function newChat(){
    let chatflow = document.querySelector('.chatflow');
    let newChat = document.createElement('div');
    newChat.classList.add('chatbox');
    let newDate = (new Date()).getTime();
    newChat.id = await createID(TYPECHAT, "chatbox", newDate);
    newChat.setAttribute("data-time", newDate);

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
    }
}