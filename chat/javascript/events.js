import { focusUserInput , scrollToEnd} from './utils.js';
import { clickedSearchButton } from './history.js';
import { createMessage , newChat} from './chat.js';
import { generateFloatingLetters } from './letters.js';
import { toggleRecording } from './audio.js';
import { insertEmail , clickedAccountButton } from './account.js';

let sendAsUser = true;
let isTiping = false;
export let fakeAI = false;

//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", async function() {
    generateFloatingLetters();
    insertEmail();
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
    if(event.ctrlKey && event.shiftKey && event.altKey && event.key === 'I'){
        fakeAI = true;
        console.log('AI mode');
    } else if(event.ctrlKey && event.shiftKey && event.altKey  && event.key === 'U'){
        fakeAI = false;
        console.log('User mode');
    } 
});

window.addEventListener('focus', focusUserInput);
document.querySelector('#newchat').addEventListener('click', newChat);
document.querySelector('#send').addEventListener('click', function(){createMessage(sendAsUser);})
document.querySelector('#mic').addEventListener('click', toggleRecording);
document.querySelector('#search').addEventListener('click', clickedSearchButton);
document.querySelector('.account-button').addEventListener('click', clickedAccountButton);
