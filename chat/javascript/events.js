import { focusUserInput , popUpMessage, scrollToEnd, updateGlobalVariables} from './utils.js';
import { clickedSearchButton } from './history.js';
import { createMessage , newChat, updateChatTitle, importServerChats, clickedUploadButton} from './chat.js';
import { generateFloatingLetters } from './letters.js';
import { toggleRecording } from './audio.js';
import { insertEmail , clickedAccountButton } from './account.js';
import { createFileHolder, deleteFileHolder } from './files.js';

let sendAsUser = true;
let isTiping = false;
export let fakeAI = false;
export let currentFont = null; //current font of the chat will be updated after DOMContentLoaded
export let currentFile = null;
export function setCurrentFile(newFile){
    currentFile = newFile;
}

export function setCurrentFont(newFont){
    currentFont = newFont;
}

//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", async function() {
    generateFloatingLetters();
    updateGlobalVariables();
    insertEmail();
    newChat();
    scrollToEnd();
    focusUserInput();
    updateCurrentFont();
});
function updateCurrentFont(){
    let bodyElement = document.body;
    let style = window.getComputedStyle(bodyElement);
    currentFont = style.fontFamily;
    console.log(currentFont);
}
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
    if(event.ctrlKey && event.shiftKey && event.altKey && event.key === 'I'){
        fakeAI = true;
        console.log('AI mode');
    } else if(event.ctrlKey && event.shiftKey && event.altKey  && event.key === 'U'){
        fakeAI = false;
        console.log('User mode');
    } 
});
document.querySelector('#file-input').addEventListener('change', function(event) {
    // Ottieni il file selezionato
    currentFile = event.target.files[0];
    console.log(currentFile);
    let uploadButton = document.querySelector('#upload');
    if (!(currentFile.name && currentFile.name.endsWith('.pdf'))){
        popUpMessage('Only PDF files are allowed');
        currentFile = null;
        return;
    }
    if  (currentFile!=null){
        console.log(currentFile.name);
        popUpMessage('File selected! Now ask someting');
        createFileHolder(currentFile);
        uploadButton.classList.add('uploaded-file');
    }
    event.target.value = null;
});
window.addEventListener('focus', focusUserInput);
document.querySelector('#newchat').addEventListener('click', newChat);
document.querySelector('#send').addEventListener('click', function(){createMessage(sendAsUser);})
document.querySelector('#mic').addEventListener('click', toggleRecording);
document.querySelector('#search').addEventListener('click', clickedSearchButton);
document.querySelector('#upload').addEventListener('click', clickedUploadButton);
document.querySelector('.account-button').addEventListener('click', clickedAccountButton);
