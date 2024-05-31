import { clickedAccountButton, updateAccountTheme, removeAccountTheme} from './account.js';
import { lettersCanMove ,animateFloatingLetters, setLettersCanMove, updateFloatingLettersTheme, removeFloatingLettersTheme} from './letters.js';
import { updateSearchBarTheme , updateHistoryTheme, removeSearchBar, removeHistoryTheme, removeSearchBarTheme} from './history.js';
import { updateAllHistoryTheme , removeAllHistoryTheme} from './all_history.js';
import { updateVoiceRecorderTheme , removeVoiceRecorderTheme,isRecording} from './audio.js';
import { updateChatTheme , removeChatTheme} from './chat.js';
import { currentFont , setCurrentFont} from './events.js';


let isFontClicked = false;
let isThemeClicked = false;
export let currentTheme = 'Default';

//partially implementes inside account.js
let settingsButtons = ['Moving letters', 'Change font', 'Change theme'];

function findSettingsGridButton(buttonText){
    let settingsGrid = document.querySelector('.settings-grid');
    let settingsButtons = settingsGrid.querySelectorAll('.settings-grid-button');
    for (let i = 0; i < settingsButtons.length; i++){
        if (settingsButtons[i].textContent === buttonText){
            console.log('found button'+buttonText);
            return settingsButtons[i];
        }
    }
}


export function insertButtonsInsideSettingsGrid(settingsGrid){
    settingsButtons.forEach((button) => {
        let clickableElement = document.createElement('button');	
        switch(button){
            case 'Moving letters':
                console.log('Moving letters');
                clickableElement.textContent = 'Moving letters';
                clickableElement.classList.add('scroll-button');
                applyClassTheme('scroll-button', clickableElement);
                clickableElement.classList.add('settings-grid-button');
                clickableElement.addEventListener('click', clickedLettersButton);
                if (lettersCanMove){
                    clickableElement.classList.add('settings-button-clicked');
                    applyClassTheme("settings-button-clicked",clickableElement);
                }
                break;
            case 'Change font':
                console.log('Change font');
                clickableElement.textContent = 'Change font';
                clickableElement.classList.add('scroll-button');
                applyClassTheme('scroll-button', clickableElement);
                clickableElement.classList.add('settings-grid-button');
                clickableElement.addEventListener('click', clickedFontButton);
                break;
            case 'Change theme':
                console.log('Change theme');
                clickableElement.textContent = 'Change theme';
                clickableElement.classList.add('scroll-button');
                applyClassTheme('scroll-button', clickableElement);
                clickableElement.classList.add('settings-grid-button');
                clickableElement.addEventListener('click', clickedThemesButton);  
                break;
        }
        settingsGrid.appendChild(clickableElement);
    });
}

//Moving letters
function clickedLettersButton(){
    console.log('clicked Moving letters button');
    let lettersButton = findSettingsGridButton('Moving letters');
    if (!lettersCanMove){
        setLettersCanMove(true);
        lettersButton.classList.add('settings-button-clicked');
        applyClassTheme('settings-button-clicked', lettersButton);
        animateFloatingLetters();
    } else {
        setLettersCanMove(false);
        lettersButton.classList.remove('settings-button-clicked');
        removeClassTheme('settings-button-clicked', lettersButton);
        animateFloatingLetters();
    }
}

//font
function showFontGrid(){
    isFontClicked = true;
    let settingsGrid = document.querySelector('.settings-grid');
    let fontButton = findSettingsGridButton('Change font');
    fontButton.classList.add('settings-button-clicked');
    applyClassTheme('settings-button-clicked', fontButton);

    console.log('clicked font button');
    // Crea un nuovo div
    let fontDiv = document.createElement('div');
    fontDiv.classList.add('font-grid');

    // Crea un array con i nomi dei font
    let fonts = ["Helvetica Neue", ,'Arial', 'Courier New', 'Georgia', 'Times New Roman'];

    // Crea un pulsante per ogni font
    fonts.forEach((font) => {
        let fontButton = document.createElement('button');
        fontButton.textContent = font;
        fontButton.style.fontFamily = font;

        if ((JSON.stringify(font)) === currentFont){
            fontButton.classList.add('settings-button-clicked');
            applyClassTheme('settings-button-clicked', fontButton);
        }
        fontButton.addEventListener('click', function() {
            // Cambia il font di tutta la pagina quando il pulsante viene cliccato
            document.body.style.fontFamily = font;
            updateChatFont(font);
            updateClickedFontButton(fontButton, fonts);
        });
        fontButton.classList.add('font-button');
        applyClassTheme('font-button', fontButton);
        fontDiv.appendChild(fontButton);
    });

    // Aggiungi il div al body della pagina
    settingsGrid.insertBefore(fontDiv, findSettingsGridButton('Change theme'));
}
function updateChatFont(font){
    let sendList = document.querySelectorAll('.send');
    sendList.forEach((send) => {
        send.style.fontFamily = font;
    });
    let receivedList = document.querySelectorAll('.receive');
    receivedList.forEach((received) => {
        received.style.fontFamily = font;
    });
}
function updateClickedFontButton(fontButton, fonts){
    let buttons = document.querySelectorAll('.font-button');
    buttons.forEach((button) => {
        if (button !== fontButton){
            button.classList.remove('settings-button-clicked');
            removeClassTheme('settings-button-clicked', button);
        } else {
            setCurrentFont(button.textContent);
            fontButton.classList.add('settings-button-clicked');
            applyClassTheme('settings-button-clicked', fontButton);
        }
    });
}
function hideFontGrid(){
    isFontClicked = false;
    let fontButton = findSettingsGridButton('Change font');
    fontButton.classList.remove('settings-button-clicked');
    removeClassTheme('settings-button-clicked', fontButton);
    let settingsGrid = document.querySelector('.settings-grid');
    let fontDiv = document.querySelector('.font-grid');
    settingsGrid.removeChild(fontDiv);
}
function clickedFontButton(){
    if (isFontClicked){
        hideFontGrid();
    } else {    
        showFontGrid();
    }
}
export function setIsFontClicked(value){
    isFontClicked = value;
}


//theme
export function applyClassTheme(classTheme, element){
    let newClass;
    switch(currentTheme){
        case 'Default':
            break;
        case 'Light':
            newClass = "light-" + classTheme;
            element.classList.add(newClass);
            break;
        case 'Dark':
            newClass = "dark-" + classTheme;
            element.classList.add(newClass);
            break;
    }
}
export function removeClassTheme(classTheme, element){
    let newClass;
    switch(currentTheme){
        case 'Default':
            break;
        case 'Light':
            newClass = "light-" + classTheme;
            element.classList.remove(newClass);
            break;
        case 'Dark':
            newClass = "dark-" + classTheme;
            element.classList.remove(newClass);
            break;
    }
}
function removeTheme(){
    let body = document.querySelector('body');
    let header = document.querySelector('.header');
    let buttons = document.querySelectorAll('.ui-button');
    let accountButton = document.querySelector(".account-button");
    removeClassTheme('body',body);   
    //header Area
    removeClassTheme('header',header);
    removeClassTheme('title',header.querySelector('.title'));
    buttons.forEach((button) => {
        removeClassTheme('ui-button',button);
    });
    if (!isRecording){
        removeClassTheme("user-input",document.querySelector('#user-input'));
    }
    //account Area
    removeClassTheme('account-button',accountButton);
    removeClassTheme('account-email',accountButton.querySelector('.account-email'));
    //ora aggiornare tutte le componenti dinamici del sito, considerando se sono mostrate o no
    removeSearchBarTheme();
    removeHistoryTheme();
    removeAllHistoryTheme();
    removeChatTheme();
    removeAccountTheme();
    removeVoiceRecorderTheme();
    removeFloatingLettersTheme();
}
function changeTheme(theme){ 
    let body = document.querySelector('body');
    let header = document.querySelector('.header');
    let buttons = document.querySelectorAll('.ui-button');
    let accountButton = document.querySelector(".account-button");
    switch(theme){ //other changes implemented inside all javascript files
        case 'Default':
            removeTheme();
            currentTheme = 'Default';
            break;
        case 'Light':
            removeTheme();
            console.log('sono in Light');
            currentTheme = 'Light';
            body.classList.add('light-body');   
            //header Area
            header.classList.add('light-header');
            header.querySelector('.title').classList.add('light-title');
            buttons.forEach((button) => {
                button.classList.add('light-ui-button');
            });
            if (!isRecording){
                applyClassTheme("user-input",document.querySelector('#user-input'));
            }
            //account Area
            accountButton.classList.add('light-account-button');
            accountButton.querySelector('.account-email').classList.add('light-account-email');
            //ora aggiornare tutte le componenti dinamici del sito, considerando se sono mostrate o no
            updateSearchBarTheme();
            updateHistoryTheme();
            updateAllHistoryTheme();
            updateChatTheme();
            updateAccountTheme();
            updateVoiceRecorderTheme();
            updateFloatingLettersTheme();
            break;
        case 'Dark': 
            removeTheme();
            console.log('sono in Dark');
            currentTheme = 'Dark';
            body.classList.add('dark-body');   
            //header Area
            header.classList.add('dark-header');
            header.querySelector('.title').classList.add('dark-title');
            buttons.forEach((button) => {
                button.classList.add('dark-ui-button');
            });
            if (!isRecording){
                applyClassTheme("user-input",document.querySelector('#user-input'))
            }
            //account Area
            accountButton.classList.add('dark-account-button');
            accountButton.querySelector('.account-email').classList.add('dark-account-email');
            //ora aggiornare tutte le componenti dinamici del sito, considerando se sono mostrate o no
            updateSearchBarTheme();
            updateHistoryTheme();
            updateAllHistoryTheme();
            updateChatTheme();
            updateAccountTheme();
            updateVoiceRecorderTheme();
            updateFloatingLettersTheme();
            break;
    }
}
function showThemesGrid(){
    let settingsGrid = document.querySelector('.settings-grid');
    let themes = ['Default','Light', 'Dark'];
    let themesDiv = document.createElement('div');
    themesDiv.classList.add('themes-grid');
    themes.forEach((theme) => {
        let themeButton = document.createElement('button');
        themeButton.textContent = theme;
        themeButton.classList.add('theme-button');
        applyClassTheme('theme-button', themeButton);
        if (theme === currentTheme){
            themeButton.classList.add('settings-button-clicked');
            applyClassTheme('settings-button-clicked', themeButton);
        }
        themeButton.addEventListener('click', function() {
            updateClickedThemeButton(themeButton, themes);
            switch(theme){
                case 'Default':
                    changeTheme('Default');
                    break;
                case 'Light':
                    changeTheme('Light');
                    break;
                case 'Dark':
                    changeTheme('Dark');
                    break;
                
            }
        });
        themesDiv.appendChild(themeButton);
    });
    settingsGrid.appendChild(themesDiv);
}
function updateClickedThemeButton(themeButton){
    let buttons = document.querySelectorAll('.theme-button');
    buttons.forEach((button) => {
        if (button !== themeButton){
            button.classList.remove('settings-button-clicked');
            removeClassTheme('settings-button-clicked', button);
        } else {
            themeButton.classList.add('settings-button-clicked');
            applyClassTheme('settings-button-clicked', themeButton);
        }
    });
}
function hideThemesGrid(){
    let settingsGrid = document.querySelector('.settings-grid');
    let themesDiv = document.querySelector('.themes-grid');
    settingsGrid.removeChild(themesDiv);
}
function clickedThemesButton(){
    console.log('clicked themes button');
    let themesButton = findSettingsGridButton('Change theme');
    if (!isThemeClicked){
        isThemeClicked = true;
        themesButton.classList.add('settings-button-clicked');
        applyClassTheme("settings-button-clicked",themesButton);
        showThemesGrid();
    } else {
        isThemeClicked = false;
        themesButton.classList.remove('settings-button-clicked');
        removeClassTheme("settings-button-clicked",themesButton);
        hideThemesGrid();
    }
}
export function setIsThemeClicked(value){
    isThemeClicked = value;
}

export function removeSettingsTheme(){
    let settingsGrid = document.querySelector('.settings-grid');
    let settingsButtons = settingsGrid.querySelectorAll('.settings-grid-button');
    settingsButtons.forEach(button => {
        removeClassTheme("scroll-button",button);
        if (button.classList.contains('settings-button-clicked')){
            removeClassTheme("settings-button-clicked",button);
        }
    });
    if (isFontClicked){
        let fontButtons = document.querySelectorAll('.font-button');
        fontButtons.forEach(button => {
            removeClassTheme("font-button",button);
            if (button.classList.contains('settings-button-clicked')){
                removeClassTheme("settings-button-clicked",button);
            }
        });
    }
    if (isThemeClicked){
        let themeButtons = document.querySelectorAll('.theme-button');
        themeButtons.forEach(button => {
            removeClassTheme("theme-button",button);
            if (button.classList.contains('settings-button-clicked')){
                removeClassTheme("settings-button-clicked",button);
            }
        });
    }
}
export function updateSettingsTheme(){ //da implementare
    let settingsGrid = document.querySelector('.settings-grid');
    let settingsButtons = settingsGrid.querySelectorAll('.settings-grid-button');
    settingsButtons.forEach(button => {
        applyClassTheme("scroll-button",button);
        if (button.classList.contains('settings-button-clicked')){
            applyClassTheme("settings-button-clicked",button);
        }
    });
    if (isFontClicked){
        let fontButtons = document.querySelectorAll('.font-button');
        fontButtons.forEach(button => {
            applyClassTheme("font-button",button);
            if (button.classList.contains('settings-button-clicked')){
                applyClassTheme("settings-button-clicked",button);
            }
        });
    }
    if (isThemeClicked){
        let themeButtons = document.querySelectorAll('.theme-button');
        themeButtons.forEach(button => {
            applyClassTheme("theme-button",button);
            if (button.classList.contains('settings-button-clicked')){
                applyClassTheme("settings-button-clicked",button);
            }
        });
    }
}