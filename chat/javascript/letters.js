import { applyClassTheme , removeClassTheme} from './settings.js';
export let lettersCanMove = true;
export const LETTERS ='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
export const LETTERS_AMOUNT = 69;
export const CAPTURE_TIME = 2;

export function setLettersCanMove(value) {
    lettersCanMove = value;
}

export function generateFloatingLetters(letterAmount = LETTERS_AMOUNT){
    let LetterPool;

    if (document.querySelector('#letter-pool') != null) {
        LetterPool = document.querySelector('#letter-pool');
    } else {
        LetterPool = document.createElement('div');
        LetterPool.id = 'letter-pool';
        LetterPool.style.margin = '0';
    }

    for (let i = 0; i < letterAmount; i++) {
        let letter = document.createElement('div');
        letter.classList.add('letters');
        let top = Math.floor(Math.random() * window.innerHeight);
        let left = Math.floor(Math.random() * window.innerWidth);
        letter.textContent = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        letter.style.top = `${top}px`;
        letter.style.left = `${left}px`;
        let angle = 0;
        while(angle % 90 === 0){
            angle = Math.floor(Math.random() * 360);
        };
        let speed = (Math.random() * 1) + 1;
        letter.setAttribute('data-angle', angle);
        letter.setAttribute('data-speed', speed);
        LetterPool.appendChild(letter);
    }
    document.body.appendChild(LetterPool);
    animateFloatingLetters();
}

function moveFloatingletters(){
    const letters = document.querySelectorAll('.letters');
    for(let letter of letters){
        let angle = parseFloat(letter.getAttribute('data-angle'));
        const speed = parseFloat(letter.getAttribute('data-speed'));
        let x = parseFloat(letter.style.left) + Math.cos(angle * Math.PI / 180) * speed;
        let y = parseFloat(letter.style.top) + Math.sin(angle * Math.PI / 180) * speed;

        if (x < 0 || x > window.innerWidth) {
            angle = 180 - angle;
            letter.textContent = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }
        if (y < 0 || y > window.innerHeight) {
            angle = 360 - angle;
            letter.textContent = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        }

        letter.style.left = `${x}px`;
        letter.style.top = `${y}px`;
        letter.setAttribute('data-angle', angle);
    }
}

export function animateFloatingLetters(){
    function update(){
        moveFloatingletters();
    }

    function animate(){
        if(lettersCanMove){
            update();
            requestAnimationFrame(animate);
        }
    }

    animate();
}



export function removeFloatingLettersTheme(){
    const letters = document.querySelectorAll('.letters');
    letters.forEach(letter => {
        removeClassTheme("letters", letter);
    });

}
export function updateFloatingLettersTheme(){
    const letters = document.querySelectorAll('.letters');
    letters.forEach(letter => {
        applyClassTheme("letters", letter);
    });
}