import { restoreChat, sortedHistoryChat } from './chat.js';
import { handleAllHistoryChat } from './all_history.js';
import { preciseSetTimeout } from './utils.js';

let isSearchBarShowed = false;
let isHistoryChatShowed = false;

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
export function removeSearchBar(header) {
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
export function createAndAppendNoResults(parent, message) {
    let noResults = document.createElement('p');
    noResults.className = 'no-result-all-history-list';
    noResults.id = 'noResultAllHistoryList';
    noResults.textContent = message;
    parent.appendChild(noResults);
}
export function updateListHistoryChat(historyChat, text) {
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
export function removeHistoryChat() {
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

export function clickedSearchButton() {
    let header = document.querySelector('.header');
    let title = document.querySelector('.title');
    handleSearchBar(header, title);
    handleHistoryChat();
    handleAllHistoryChat();
}