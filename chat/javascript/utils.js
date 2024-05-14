//APP TOOLS
export function preciseSetTimeout(callback, delay) {
    let start = performance.now();

    function tick() {
        let now = performance.now();
        let difference = now - start;

        (difference >= delay) ? callback() : requestAnimationFrame(tick); 
    }
    tick();
}

export function scrollToEnd() {
    let endSeparator = document.querySelector('.end-separator');
    endSeparator.scrollIntoView();

}

export function focusUserInput() {
    let userInput = document.querySelector('#user-input');
    userInput.focus();

}

export async function createID(type, classString, date){
    let ID = `${type}${classString}${date}`;
    const encoder = new TextEncoder();
    ID = encoder.encode(ID);
    
    const hash = await window.crypto.subtle.digest('SHA-256', ID);
    const hashArray = Array.from(new Uint8Array(hash));
    let hashString = hashArray.map(n => n.toString(16).padStart(2, '0')).join('');
    
    return hashString;
}

export function preventDefaultSelection(event){
    if (event.detail > 1) {
        event.preventDefault();
    }
}

//USER TOOLS
export async function copyToClipboard(event){
    let textToCopy = event.target.textContent;
    try{
        await navigator.clipboard.writeText(textToCopy);
        let notification = document.createElement('div');
        notification.classList.add("notification");
        let notification_body = document.createElement('div');
        notification_body.classList.add("notification-body");
        notification_body.textContent = "messaggio copiato!\n";
        let notification_progress = document.createElement("div");
        notification_progress.classList.add("notification-progress");
        notification.appendChild(notification_body);
        notification.appendChild(notification_progress);
        document.body.appendChild(notification);

        preciseSetTimeout(function() {
            document.body.removeChild(notification);
        }, 10000);
    
    } catch (error){
        console.error('Errore durante la copia nella clipboard: ', error);
    }
}