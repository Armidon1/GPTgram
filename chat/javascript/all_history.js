import { createAndAppendNoResults } from './history.js';
import { history, sortedHistoryChat , restoreChat} from './chat.js';
import { preciseSetTimeout } from './utils.js';

let isAllHistoryChatShowed = false;

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
export function updateListAllHistoryChat(allHistoryChat){
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
export function handleAllHistoryChat(){
    if (isAllHistoryChatShowed){
        removeAllHistoryChat();
    } else {
        showAllHistoryChat();
    }
}
