import { clickedAccountButton } from './account.js';
import { lettersCanMove ,animateFloatingLetters, setLettersCanMove} from './letters.js';

let isFontClicked = false;
let isThemeClicked = false;
let lastTheme = 'Default';

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
                clickableElement.classList.add('settings-grid-button');
                clickableElement.addEventListener('click', clickedLettersButton);
                if (lettersCanMove){
                    clickableElement.style.backgroundColor = 'green';
                }
                break;
            case 'Change font':
                console.log('Change font');
                clickableElement.textContent = 'Change font';
                clickableElement.classList.add('scroll-button');
                clickableElement.classList.add('settings-grid-button');
                clickableElement.addEventListener('click', clickedFontButton);
                break;
            case 'Change theme':
                console.log('Change theme');
                clickableElement.textContent = 'Change theme';
                clickableElement.classList.add('scroll-button');
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
        lettersButton.style.backgroundColor = 'green';
        animateFloatingLetters();
    } else {
        setLettersCanMove(false);
        lettersButton.style.backgroundColor = 'transparent';
        animateFloatingLetters();
    }
}

//font
function showFontGrid(){
    isFontClicked = true;
    let settingsGrid = document.querySelector('.settings-grid');
    let fontButton = findSettingsGridButton('Change font');
    fontButton.style.backgroundColor = 'green';

    console.log('clicked font button');
    // Crea un nuovo div
    let fontDiv = document.createElement('div');
    fontDiv.classList.add('font-grid');

    // Crea un array con i nomi dei font
    let fonts = ['Arial', 'Courier New', 'Georgia', 'Minecraft'];

    // Crea un pulsante per ogni font
    fonts.forEach((font) => {
        let fontButton = document.createElement('button');
        fontButton.textContent = font;
        fontButton.style.fontFamily = font;
        fontButton.addEventListener('click', function() {
            // Cambia il font di tutta la pagina quando il pulsante viene cliccato
            document.body.style.fontFamily = font;
        });
        fontButton.classList.add('font-button');
        fontDiv.appendChild(fontButton);
    });

    // Aggiungi il div al body della pagina
    settingsGrid.insertBefore(fontDiv, findSettingsGridButton('Change theme'));
}
function hideFontGrid(){
    isFontClicked = false;
    let fontButton = findSettingsGridButton('Change font');
    fontButton.style.backgroundColor = 'transparent';
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
function changeTheme(theme){ //da implementare meglio: prendere ogni componente ed inserirgli una classe custom in base al tema. nel caso Default, levare l'ultima classe inserita attraverso la variabile globale lastTheme
    let body = document.querySelector('body');
    switch(theme){
        case 'Default':

            break;
        case 'Light':
            body.style.backgroundColor = 'lightgray';   //esempio giocattolo
            body.style.color = 'black';
            break;
        case 'Dark':
            body.style.backgroundColor = 'black';       //esempio giocattolo
            body.style.color = 'white';
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
        themeButton.addEventListener('click', function() {
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
        themesButton.style.backgroundColor = 'green';
        showThemesGrid();
    } else {
        isThemeClicked = false;
        themesButton.style.backgroundColor = 'transparent';
        hideThemesGrid();
    }
}
export function setIsThemeClicked(value){
    isThemeClicked = value;
}