import { createAndAppendNoResults } from './history.js';
import { history, sortedHistoryChat , restoreChat} from './chat.js';
import { preciseSetTimeout } from './utils.js';
import { applyClassTheme , removeClassTheme} from './settings.js';

let isAllHistoryChatShowed = false;
let isAllHistoryChatEmpty = true;

function insertTitleToAllHistoryChat(allHistoryChat){
    let allHistoryChatTitle = document.createElement('p'); // Crea un nuovo elemento <p>
    allHistoryChatTitle.id = 'allHistoryChatTitle'; // Assegna un ID all'elemento
    allHistoryChatTitle.className = 'all-history-title'; // Assegna una classe all'elemento
    applyClassTheme("all-history-title",allHistoryChatTitle);
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
    applyClassTheme("scroll-button",clickableElement);
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
            isAllHistoryChatEmpty = true;
            let message = "La lista è vuota! Premi il pulsante \"nuova chat\" per scoprirne di più ;)";
            createAndAppendNoResults(allHistoryChat.querySelector('#allHistoryChatButtonList'), message);
        } else {
            isAllHistoryChatEmpty = false;
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
export function removeAllHistoryChat(){
    isAllHistoryChatShowed= false;
    let allHistoryChat = document.querySelector('#allHistoryChat');
    allHistoryChat.classList.remove('all-history-slide-left');
    allHistoryChat.classList.add('all-history-slide-right');
    preciseSetTimeout(function() {
        document.body.removeChild(allHistoryChat);
    }, 300);
}
function showAllHistoryChat(){
    isAllHistoryChatShowed = true;
    let allHistoryChat = document.createElement('div');
    allHistoryChat.id = 'allHistoryChat';
    allHistoryChat.className = 'all-history all-history-slide-left';
    applyClassTheme("all-history",allHistoryChat);
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

export function removeAllHistoryTheme(){
    if (isAllHistoryChatShowed){
        let allHistoryChat = document.querySelector('#allHistoryChat');
        removeClassTheme("all-history",allHistoryChat);
        removeClassTheme("all-history-title",allHistoryChat.querySelector('#allHistoryChatTitle'));
        if (isAllHistoryChatEmpty)
            removeClassTheme("no-results",allHistoryChat.querySelector('#noResultAllHistoryList'));
        else{
            allHistoryChat.querySelectorAll('.scroll-button').forEach((button) => {
                removeClassTheme("scroll-button",button);
            });
        }
    }
}
export function updateAllHistoryTheme(){
    if (isAllHistoryChatShowed){
        let allHistoryChat = document.querySelector('#allHistoryChat');
        applyClassTheme("all-history",allHistoryChat);
        applyClassTheme("all-history-title",allHistoryChat.querySelector('#allHistoryChatTitle'));
        if (isAllHistoryChatEmpty)
            applyClassTheme("no-results",allHistoryChat.querySelector('#noResultAllHistoryList'));
        else{
            allHistoryChat.querySelectorAll('.scroll-button').forEach((button) => {
                applyClassTheme("scroll-button",button);
            });
        }
    }
}
