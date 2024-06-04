import { restoreChat, sortedHistoryChat , fromChatIDtoTitle, deleteCurrentChat} from './chat.js';
import { handleAllHistoryChat } from './all_history.js';
import { preciseSetTimeout } from './utils.js';
import { applyClassTheme , removeClassTheme} from './settings.js';
import { getContentChatFromServer } from './connection.js';

let isSearchBarShowed = false;
let isHistoryChatShowed = false;
let isHistoryChatEmpty = true;

//GESTIONE DELLA RICERCA
function showSearchBar(header, title) {
    header.classList.add('high-z-index');
    isSearchBarShowed = true;
    let searchBar = document.createElement('input');
    searchBar.addEventListener('input', function(event) {
        let text = event.target.value;
        let historyChat = document.querySelector('#historyChat');
        updateListHistoryChat(historyChat, text);
    });
    searchBar.type = 'text';
    searchBar.placeholder = 'Search...';
    searchBar.id = 'searchBar';
    searchBar.className = 'slide slide-in';
    applyClassTheme('slide',searchBar);
    header.insertBefore(searchBar, title.nextSibling);
    preciseSetTimeout(function(){
        searchBar.focus();
    }, 300);
}
export function removeSearchBar(header) {
    header.classList.remove('high-z-index');
    isSearchBarShowed = false;
    let searchBar = document.querySelector('#searchBar');
    searchBar.classList.remove('slide-in');
    searchBar.classList.add('slide-out');
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
    applyClassTheme('scroll-button',clickableElement);
    //console.log(key);
    //console.log(key.title);
    clickableElement.textContent = fromChatIDtoTitle[key];
    clickableElement.onclick = function() {
        console.log('Hai cliccato la chiave ' + key + '!');
        deleteCurrentChat();
        getContentChatFromServer(key);
    };
    parent.appendChild(clickableElement);
}
export function createAndAppendNoResults(parent, message) {
    let noResults = document.createElement('p');
    noResults.className = 'no-result-all-history-list';
    applyClassTheme('no-result-all-history-list',noResults);
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
        let results = text == "" ? sortedChatIds : sortedChatIds.filter(id => fromChatIDtoTitle[id].includes(text));
        //console.log(results);
        cancelContentHistoryChat();
        if (text == ""){
            if (results.length == 0) {
                let message = "No results found. Try having fun with GPTgram and create a new chat!" ;
                isHistoryChatEmpty = true;
                createAndAppendNoResults(historyChat, message);
            } else {
                for(let i = 0; (i < results.length && i<5); i++) {
                    createAndAppendClickableElement(historyChat, results[i]);
                }
                isHistoryChatEmpty = false;
            }
        } else{
            if (results.length == 0) {
                isHistoryChatEmpty = true;
                let message = "No results found. Try searching with a different text!";
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
    historyChat.classList.remove('scroll-below');
    historyChat.classList.add('scroll-above');
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
    historyChat.classList.add('high-z-index');
    applyClassTheme('scroll',historyChat);
    let header = document.querySelector('.header');
    header.style.borderRadius = '10px 10px 0 0';
    
    // Creazione di una lista di elementi cliccabili DA SISTEMARE
    updateListHistoryChat(historyChat,"");
    document.body.insertBefore(historyChat, chatflow);
}

//themes
export function removeSearchBarTheme(){
    if (isSearchBarShowed){
        let searchBar = document.querySelector('#searchBar');
        removeClassTheme('slide',searchBar);
    }
}
export function updateSearchBarTheme(){
    if (isSearchBarShowed){
        let searchBar = document.querySelector('#searchBar');
        applyClassTheme('slide',searchBar);
    }
}

export function removeHistoryTheme(){
    if (isHistoryChatShowed){
        let historyChat = document.querySelector('#historyChat');
        removeClassTheme('scroll',historyChat);
        if (isHistoryChatEmpty){
            removeClassTheme('no-result-all-history-list',document.querySelector('#noResultAllHistoryList'));
        } else {
            let scrollButtons = document.querySelectorAll('.scroll-button');
            scrollButtons.forEach(button => removeClassTheme('scroll-button',button));
        }
    }
}
export function updateHistoryTheme(){ 
    if (isHistoryChatShowed){
        let historyChat = document.querySelector('#historyChat');
        applyClassTheme('scroll',historyChat);
        if (isHistoryChatEmpty){
            applyClassTheme('no-result-all-history-list',document.querySelector('#noResultAllHistoryList'));
        } else {
            let scrollButtons = document.querySelectorAll('.scroll-button');
            scrollButtons.forEach(button => applyClassTheme('scroll-button',button));
        }
    }
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