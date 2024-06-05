import { logout , homepage} from './connection.js';
import {insertButtonsInsideSettingsGrid, setIsFontClicked, setIsThemeClicked, applyClassTheme, removeClassTheme, updateSettingsTheme, removeSettingsTheme} from './settings.js';

export let emailAccount = "account@email.com"; 
export function setEmailAccount(email){
    emailAccount = email;
}
export function getEmailAccount(){
    return emailAccount;
}

export let userAccount = "account";
export function setUserAccount(user){
    userAccount = user;
}
export function getUserAccount(){
    return userAccount;
}

export let hashAccount = "hash";
export function setHashAccount(hash){
    hashAccount = hash;
}
export function getHashAccount(){
    return hashAccount;
}


let accountButtons = ['Settings', 'Logout'];
let isAccountClicked = false;
let isSettingsClicked = false;


//Account stuff
export function insertEmail(){
    let emailInput = document.createElement('div');
    emailInput.textContent = emailAccount;
    emailInput.classList.add('account-email');
    document.querySelector('.account-button').appendChild(emailInput);
}
function findAccountGridButton(buttonText){
    let accountGrid = document.querySelector('.account-grid');
    let accountButtons = accountGrid.querySelectorAll('.account-grid-button');
    for (let i = 0; i < accountButtons.length; i++){
        if (accountButtons[i].textContent === buttonText){
            console.log('found button'+buttonText);
            return accountButtons[i];
        }
    }
}

function createAndAppendClickableAccountButton(accountGrid, textContent) {
    let clickableElement = document.createElement('button');
    clickableElement.classList.add('scroll-button');
    applyClassTheme("scroll-button",clickableElement);
    clickableElement.classList.add('account-grid-button');
    clickableElement.textContent = textContent;
    switch(textContent){
        case 'Settings':
            clickableElement.addEventListener('click', clickedAccountSettingsButton);
            break;
        case 'Logout':
            clickableElement.addEventListener('click', clickedAccountLogoutButton);
            clickableElement.style.borderColor = 'red';
            clickableElement.style.color = 'red';
            break;
    }
    accountGrid.appendChild(clickableElement);
}
function insertButtonsInsideAccountGrid(accountGrid){
    accountButtons.forEach(button => {
        let buttonElement = document.createElement('button');
        buttonElement.textContent = button;
        createAndAppendClickableAccountButton(accountGrid, button);
    });
}

function showAccountGrid(){
    let account = document.querySelector('.account');
    let accountGrid = document.createElement('div');
    accountGrid.classList.add('account-grid');
    applyClassTheme("account-grid",accountGrid);
    insertButtonsInsideAccountGrid(accountGrid);
    account.appendChild(accountGrid);
    accountGrid.classList.add('account-grid-show');
}
function hideAccountGrid(){
    let account = document.querySelector('.account');
    let accountGrid = document.querySelector('.account-grid');
    accountGrid.classList.remove('account-grid-show');
    accountGrid.classList.add('account-grid-hide');
    setTimeout(() => {
        account.removeChild(accountGrid);
    }, 300);
    setIsFontClicked(false);
    setIsThemeClicked(false);
    isSettingsClicked = false;
}
export function clickedAccountButton(){
    console.log('clicked account button');
    if (!isAccountClicked){
        isAccountClicked = true;
        showAccountGrid();
    } else {
        isAccountClicked = false;
        hideAccountGrid();
    }
}

//Settings
export function removeAccountTheme(){
    if (isAccountClicked){
        let accountGrid = document.querySelector('.account-grid');
        removeClassTheme("account-grid",accountGrid);
        let accountButtons = accountGrid.querySelectorAll('.account-grid-button');
        accountButtons.forEach(button => {
            removeClassTheme("scroll-button",button);
            if (button.classList.contains('settings-button-clicked')){
                removeClassTheme("settings-button-clicked",button);
            }
        });
        if (isSettingsClicked){
            removeSettingsTheme();
        } 
    }
}
export function updateAccountTheme(){ //da implementare, considerare anche updateSettingsTheme
    if (isAccountClicked){
        let accountGrid = document.querySelector('.account-grid');
        applyClassTheme("account-grid",accountGrid);
        let accountButtons = accountGrid.querySelectorAll('.account-grid-button');
        accountButtons.forEach(button => {
            applyClassTheme("scroll-button",button);
            if (button.classList.contains('settings-button-clicked')){
                applyClassTheme("settings-button-clicked",button);
            }
        });
        if (isSettingsClicked){
            updateSettingsTheme();
        } 
    }
}
function showSettingsGrid(){
    let settingsGrid = document.createElement('div');
    settingsGrid.classList.add('settings-grid');
    insertButtonsInsideSettingsGrid(settingsGrid);

    let accountGrid = document.querySelector('.account-grid');
    
    accountGrid.insertBefore(settingsGrid, findAccountGridButton('Logout'));
    settingsGrid.classList.add('settings-grid-show');
}
function hideSettingsGrid(){
    let settingsGrid = document.querySelector('.settings-grid');
    settingsGrid.classList.remove('settings-grid-show');
    settingsGrid.classList.add('settings-grid-hide');
    setTimeout(() => {
        document.querySelector('.account-grid').removeChild(settingsGrid);
    }, 300);
}
function clickedAccountSettingsButton(){
    console.log('clicked account settings button');
    let settingsButton = findAccountGridButton('Settings');
    if (!isSettingsClicked){
        isSettingsClicked = true;
        settingsButton.classList.add('settings-button-clicked');
        applyClassTheme("settings-button-clicked",settingsButton);
        showSettingsGrid();
    } else {
        settingsButton.classList.remove('settings-button-clicked');
        removeClassTheme("settings-button-clicked",settingsButton);
        isSettingsClicked = false;
        hideSettingsGrid();
    }
}
//da implementare
async function clickedAccountLogoutButton(){
    await logout();
    document.cookie = "login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Delete the login cookie by setting its expiry date to a date in the past
    window.location.href = homepage;
}