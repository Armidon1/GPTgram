import { preciseSetTimeout , createID , preventDefaultSelection , copyToClipboard, popUpMessage} from './utils.js';
import { sendMessage , serverMessage, getFirstMessage, setFirstMessage, requestChatsBackups, getContentChatFromServer} from './connection.js';
import { updateListHistoryChat, removeHistoryChat, removeSearchBar} from './history.js';
import { updateListAllHistoryChat, removeAllHistoryChat} from './all_history.js';
import { currentFile, fakeAI , setCurrentFile} from './events.js';
import { applyClassTheme , removeClassTheme} from './settings.js';
import { createFileHolder, deleteFileHolder } from './files.js';

export const SENDTEXTCLASS = 'sendbox';
export const RECEIVETEXTCLASS = 'receivebox'

const TYPECHAT = 'CHAT';
const TYPEMSG = 'MSG';

export let currentChatId = null;
export let currentChatTitle = "*";

export let sortedHistoryChat = {};     //contiene la data associata all'ID della chat
export let fromChatIDtoTitle = {};     //contiene l'ID della chat associata al titolo della chat
export let fromChatIDtoDate = {};      //contiene l'ID della chat associata alla data di creazione della chat

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

function restoreOldUserMessage(message){
    let newMessage = document.createElement('div');
    newMessage.classList.add(SENDTEXTCLASS);
    newMessage.id = message.id;
    newMessage.setAttribute('data-time', message.date);
    let newMessageText = document.createElement('p');
    newMessageText.classList.add('send');
    applyClassTheme('send',newMessageText);
    newMessageText.textContent = message.message;
    let Icon = document.createElement('div');
    Icon.classList.add('icon', 'default-user');
    newMessage.addEventListener('dblclick', copyToClipboard);
    newMessage.addEventListener('mousedown', preventDefaultSelection);
    newMessage.appendChild(newMessageText);
    newMessage.appendChild(Icon);

    return newMessage;
}

function restoreOldAIMessage(message){
    let newMessage = document.createElement('div');
    newMessage.classList.add(RECEIVETEXTCLASS);
    newMessage.id = message.id;
    newMessage.setAttribute('data-time', message.date);
    let newMessageText = document.createElement('p');
    newMessageText.classList.add('receive');
    applyClassTheme('receive',newMessageText);
    newMessageText.textContent = message.message;
    let Icon = document.createElement('div');
    Icon.classList.add('icon', 'default-ai');
    newMessage.addEventListener('dblclick', copyToClipboard);
    newMessage.addEventListener('mousedown', preventDefaultSelection);
    newMessage.appendChild(Icon);
    newMessage.appendChild(newMessageText);

    return newMessage;
}
function restoreOldAudioMessage(message){
    
}


//GESTIONE DELLA CHAT
// export function getChatTitle(){
//     return currentChatTitle;
// }
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

export function deleteCurrentChat(){
    let chatbox = document.querySelector('.chatbox');
    let chatflow = document.querySelector('.chatflow');
    if (chatIsNotEmpty(chatbox)){
        sortedHistoryChat[chatbox.dateTime] = chatbox.id;
        fromChatIDtoDate[chatbox.id] = chatbox.dateTime;
        fromChatIDtoTitle[chatbox.id] = currentChatTitle;
    } 
    chatflow.removeChild(chatbox);
    chatflow.removeChild(document.querySelector('.end-separator'));
}
function insertMessagesInsideChatbox(chatbox, messages){
    let newMessage;
    messages.forEach(message => {
       if (message.sender === 'User'){ //User
            switch (message.type) {
                case 'text':
                    newMessage = restoreOldUserMessage(message);
                    break;
                case 'image':
                    break;
                case 'pdf':
                    break;
                case 'audio':
                    newMessage = restoreOldAudioMessage(message);
                    break;
                // Add cases for 'audio' and 'pdf'...
                default:
                    console.error(`Unknown message type: ${message.type}`);
                    return;  // Skip this message
            }
       } else { //AI
            switch (message.type) {
                case 'text':
                    newMessage = restoreOldAIMessage(message);
                    break;
                case 'image':
                    break;
                case 'pdf':
                    break;
                case 'audio':
                    newMessage = restoreOldAudioMessage(message);
                    break;
                    // Add cases 
                // Add cases for 'audio' and 'file'...
                default:
                    console.error(`Unknown message type: ${message.type}`);
                    return;  // Skip this message
            }
       }
       if (newMessage) {
           chatbox.appendChild(newMessage);
       }
    });
}
export function restoreChat(chatId, messages){
    //crea una nuova chatbox con l'ID specificato
    let chatflow = document.querySelector('.chatflow');
    let newChat = document.createElement('div');
    newChat.classList.add('chatbox');
    newChat.id = chatId;
    newChat.dateTime = fromChatIDtoDate[chatId];

    insertMessagesInsideChatbox(newChat, messages);

    chatflow.appendChild(newChat);

    let endSeparator = document.createElement('div');
    endSeparator.classList.add('end-separator');
    chatflow.appendChild(endSeparator);
    
    currentChatId = chatId;
    currentChatTitle = fromChatIDtoTitle[chatId];
    console.log("restoreChat: ho ripristinato la chat con ID: "+chatId+ " e titolo: "+currentChatTitle);
    delete sortedHistoryChat[fromChatIDtoDate[chatId]];
    delete fromChatIDtoTitle[chatId];
    delete fromChatIDtoDate[chatId];
    //console.log("restoreChat: ho eliminato la chat con ID: "+chatId);

    //qui tutto ok in teoria
    removeHistoryChat();
    removeAllHistoryChat();
    removeSearchBar(document.querySelector('.header'));
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
        //history[oldChat.id] = oldChat;
        if (sortedHistoryChat[oldChat.dateTime] === undefined){
            // If it doesn't exist, insert it
            sortedHistoryChat[oldChat.dateTime] = oldChat.id;
            fromChatIDtoDate[oldChat.id] = oldChat.dateTime;
            fromChatIDtoTitle[oldChat.id] = currentChatTitle;
        } 
        chatflow.removeChild(oldChat);
        //chatflow.removeChild(document.querySelector(".end-separator"));
        
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

//BACKUP CHATS
export function importServerChats(chatList){
    for (let chat of chatList){
        //console.log(`Chat : hash=${chat["hash"]} - title=${chat["title"]} - creation_date=${chat["creation_date"]}`);
        fromChatIDtoTitle[chat["hash"]] = chat["title"];

        let creationDate = chat["creation_date"];
        let date = new Date(creationDate);
        
        sortedHistoryChat[date] = chat["hash"];
        fromChatIDtoDate[chat["hash"]] = date;
    }
}

//UPLOAD DOCUMENTS
export function clickedUploadButton(){
    if (currentFile == null){
        //isClickableUploadButton = false;
        //let uploadButton = document.querySelector('#upload');
        //uploadButton.classList.add('upload-disabled');
        let fileInput = document.querySelector('#file-input');
        //fileInput.style.display = 'block';
        fileInput.click();
    } else {
        console.log(currentFile);
        deleteFileHolder(currentFile);
        setCurrentFile(null);
        let uploadButton = document.querySelector('#upload');
        uploadButton.classList.remove('uploaded-file');
        console.log("removed file");
        popUpMessage('File removed');
    }
}
//THEME
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
export function updateChatTheme(){
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