import { sendMessage, serverMessage } from './connection.js';
import { copyToClipboard , focusUserInput , scrollToEnd} from './utils.js';
import { clickedSearchButton } from './history.js';
import { createMessage , newChat} from './chat.js';
import { generateFloatingLetters } from './letters.js';
import { toggleRecording } from './audio.js';

import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7/dist/wavesurfer.esm.js'

let sendAsUser = true;
let isTiping = false;

//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", async function() {
    generateFloatingLetters();
    newChat();
    scrollToEnd();
    focusUserInput();
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
    } 
});

window.addEventListener('focus', focusUserInput);
document.querySelector('#newchat').addEventListener('click', newChat);
document.querySelector('#send').addEventListener('click', function(){createMessage(sendAsUser);})
document.querySelector('#mic').addEventListener('click', toggleRecording);
document.querySelector('#search').addEventListener('click', clickedSearchButton);
