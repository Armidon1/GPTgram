import {insertButtonsInsideSettingsGrid, setIsFontClicked, setIsThemeClicked} from './settings.js';
export let emailAccount = "account@email.com"; 
let accountButtons = ['Settings', 'Logout'];
let isAccountClicked = false;
let isSettingsClicked = false;

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
        settingsButton.style.backgroundColor = 'green';
        showSettingsGrid();
    } else {
        settingsButton.style.backgroundColor = 'transparent';
        isSettingsClicked = false;
        hideSettingsGrid();
    }
}
//da implementare
function clickedAccountLogoutButton(){
    console.log('clicked account loggout button');
}