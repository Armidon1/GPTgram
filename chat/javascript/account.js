export let emailAccount = "account@email.com"; 
let accountButtons = ['Settings', 'Loggout'];
let isAccountClicked = false;

export function insertEmail(){
    let emailInput = document.createElement('div');
    emailInput.textContent = emailAccount;
    emailInput.classList.add('account-email');
    document.querySelector('.account-button').appendChild(emailInput);
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
        case 'Loggout':
            clickableElement.addEventListener('click', clickedAccountLoggoutButton);
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

//da implementare
function clickedAccountSettingsButton(){
    console.log('clicked account settings button');
}
//da implementare
function clickedAccountLoggoutButton(){
    console.log('clicked account loggout button');
}