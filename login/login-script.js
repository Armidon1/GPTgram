import { sendMessage } from "./connection-login.js";

const SENDTEXTCLASS = "sendbox";
const RECEIVETEXTCLASS = "receivebox";
const LETTERS ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const GRAINS_SALT = "#%&=?¡¿,Ç_";
const ALL_SALT_PERMUTATIONS = ['#%&', '#%=', '#%?', '#%¡', '#%¿', '#%,', '#%Ç', '#%_', '#&%', '#&=', '#&?', '#&¡', '#&¿', '#&,', '#&Ç', '#&_', '#=%', '#=&', '#=?', '#=¡', '#=¿', '#=,', '#=Ç', '#=_', '#?%', '#?&', '#?=', '#?¡', '#?¿', '#?,', '#?Ç', '#?_', '#¡%', '#¡&', '#¡=', '#¡?', '#¡¿', '#¡,', '#¡Ç', '#¡_', '#¿%', '#¿&', '#¿=', '#¿?', '#¿¡', '#¿,', '#¿Ç', '#¿_', '#,%', '#,&', '#,=', '#,?', '#,¡', '#,¿', '#,Ç', '#,_', '#Ç%', '#Ç&', '#Ç=', '#Ç?', '#Ç¡', '#Ç¿', '#Ç,', '#Ç_', '#_%', '#_&', '#_=', '#_?', '#_¡', '#_¿', '#_,', '#_Ç', '%#&', '%#=', '%#?', '%#¡', '%#¿', '%#,', '%#Ç', '%#_', '%&#', '%&=', '%&?', '%&¡', '%&¿', '%&,', '%&Ç', '%&_', '%=#', '%=&', '%=?', '%=¡', '%=¿', '%=,', '%=Ç', '%=_', '%?#', '%?&', '%?=', '%?¡', '%?¿', '%?,', '%?Ç', '%?_', '%¡#', '%¡&', '%¡=', '%¡?', '%¡¿', '%¡,', '%¡Ç', '%¡_', '%¿#', '%¿&', '%¿=', '%¿?', '%¿¡', '%¿,', '%¿Ç', '%¿_', '%,#', '%,&', '%,=', '%,?', '%,¡', '%,¿', '%,Ç', '%,_', '%Ç#', '%Ç&', '%Ç=', '%Ç?', '%Ç¡', '%Ç¿', '%Ç,', '%Ç_', '%_#', '%_&', '%_=', '%_?', '%_¡', '%_¿', '%_,', '%_Ç', '&#%', '&#=', '&#?', '&#¡', '&#¿', '&#,', '&#Ç', '&#_', '&%#', '&%=', '&%?', '&%¡', '&%¿', '&%,', '&%Ç', '&%_', '&=#', '&=%', '&=?', '&=¡', '&=¿', '&=,', '&=Ç', '&=_', '&?#', '&?%', '&?=', '&?¡', '&?¿', '&?,', '&?Ç', '&?_', '&¡#', '&¡%', '&¡=', '&¡?', '&¡¿', '&¡,', '&¡Ç', '&¡_', '&¿#', '&¿%', '&¿=', '&¿?', '&¿¡', '&¿,', '&¿Ç', '&¿_', '&,#', '&,%', '&,=', '&,?', '&,¡', '&,¿', '&,Ç', '&,_', '&Ç#', '&Ç%', '&Ç=', '&Ç?', '&Ç¡', '&Ç¿', '&Ç,', '&Ç_', '&_#', '&_%', '&_=', '&_?', '&_¡', '&_¿', '&_,', '&_Ç', '=#%', '=#&', '=#?', '=#¡', '=#¿', '=#,', '=#Ç', '=#_', '=%#', '=%&', '=%?', '=%¡', '=%¿', '=%,', '=%Ç', '=%_', '=&#', '=&%', '=&?', '=&¡', '=&¿', '=&,', '=&Ç', '=&_', '=?#', '=?%', '=?&', '=?¡', '=?¿', '=?,', '=?Ç', '=?_', '=¡#', '=¡%', '=¡&', '=¡?', '=¡¿', '=¡,', '=¡Ç', '=¡_', '=¿#', '=¿%', '=¿&', '=¿?', '=¿¡', '=¿,', '=¿Ç', '=¿_', '=,#', '=,%', '=,&', '=,?', '=,¡', '=,¿', '=,Ç', '=,_', '=Ç#', '=Ç%', '=Ç&', '=Ç?', '=Ç¡', '=Ç¿', '=Ç,', '=Ç_', '=_#', '=_%', '=_&', '=_?', '=_¡', '=_¿', '=_,', '=_Ç', '?#%', '?#&', '?#=', '?#¡', '?#¿', '?#,', '?#Ç', '?#_', '?%#', '?%&', '?%=', '?%¡', '?%¿', '?%,', '?%Ç', '?%_', '?&#', '?&%', '?&=', '?&¡', '?&¿', '?&,', '?&Ç', '?&_', '?=#', '?=%', '?=&', '?=¡', '?=¿', '?=,', '?=Ç', '?=_', '?¡#', '?¡%', '?¡&', '?¡=', '?¡¿', '?¡,', '?¡Ç', '?¡_', '?¿#', '?¿%', '?¿&', '?¿=', '?¿¡', '?¿,', '?¿Ç', '?¿_', '?,#', '?,%', '?,&', '?,=', '?,¡', '?,¿', '?,Ç', '?,_', '?Ç#', '?Ç%', '?Ç&', '?Ç=', '?Ç¡', '?Ç¿', '?Ç,', '?Ç_', '?_#', '?_%', '?_&', '?_=', '?_¡', '?_¿', '?_,', '?_Ç', '¡#%', '¡#&', '¡#=', '¡#?', '¡#¿', '¡#,', '¡#Ç', '¡#_', '¡%#', '¡%&', '¡%=', '¡%?', '¡%¿', '¡%,', '¡%Ç', '¡%_', '¡&#', '¡&%', '¡&=', '¡&?', '¡&¿', '¡&,', '¡&Ç', '¡&_', '¡=#', '¡=%', '¡=&', '¡=?', '¡=¿', '¡=,', '¡=Ç', '¡=_', '¡?#', '¡?%', '¡?&', '¡?=', '¡?¿', '¡?,', '¡?Ç', '¡?_', '¡¿#', '¡¿%', '¡¿&', '¡¿=', '¡¿?', '¡¿,', '¡¿Ç', '¡¿_', '¡,#', '¡,%', '¡,&', '¡,=', '¡,?', '¡,¿', '¡,Ç', '¡,_', '¡Ç#', '¡Ç%', '¡Ç&', '¡Ç=', '¡Ç?', '¡Ç¿', '¡Ç,', '¡Ç_', '¡_#', '¡_%', '¡_&', '¡_=', '¡_?', '¡_¿', '¡_,', '¡_Ç', '¿#%', '¿#&', '¿#=', '¿#?', '¿#¡', '¿#,', '¿#Ç', '¿#_', '¿%#', '¿%&', '¿%=', '¿%?', '¿%¡', '¿%,', '¿%Ç', '¿%_', '¿&#', '¿&%', '¿&=', '¿&?', '¿&¡', '¿&,', '¿&Ç', '¿&_', '¿=#', '¿=%', '¿=&', '¿=?', '¿=¡', '¿=,', '¿=Ç', '¿=_', '¿?#', '¿?%', '¿?&', '¿?=', '¿?¡', '¿?,', '¿?Ç', '¿?_', '¿¡#', '¿¡%', '¿¡&', '¿¡=', '¿¡?', '¿¡,', '¿¡Ç', '¿¡_', '¿,#', '¿,%', '¿,&', '¿,=', '¿,?', '¿,¡', '¿,Ç', '¿,_', '¿Ç#', '¿Ç%', '¿Ç&', '¿Ç=', '¿Ç?', '¿Ç¡', '¿Ç,', '¿Ç_', '¿_#', '¿_%', '¿_&', '¿_=', '¿_?', '¿_¡', '¿_,', '¿_Ç', ',#%', ',#&', ',#=', ',#?', ',#¡', ',#¿', ',#Ç', ',#_', ',%#', ',%&', ',%=', ',%?', ',%¡', ',%¿', ',%Ç', ',%_', ',&#', ',&%', ',&=', ',&?', ',&¡', ',&¿', ',&Ç', ',&_', ',=#', ',=%', ',=&', ',=?', ',=¡', ',=¿', ',=Ç', ',=_', ',?#', ',?%', ',?&', ',?=', ',?¡', ',?¿', ',?Ç', ',?_', ',¡#', ',¡%', ',¡&', ',¡=', ',¡?', ',¡¿', ',¡Ç', ',¡_', ',¿#', ',¿%', ',¿&', ',¿=', ',¿?', ',¿¡', ',¿Ç', ',¿_', ',Ç#', ',Ç%', ',Ç&', ',Ç=', ',Ç?', ',Ç¡', ',Ç¿', ',Ç_', ',_#', ',_%', ',_&', ',_=', ',_?', ',_¡', ',_¿', ',_Ç', 'Ç#%', 'Ç#&', 'Ç#=', 'Ç#?', 'Ç#¡', 'Ç#¿', 'Ç#,', 'Ç#_', 'Ç%#', 'Ç%&', 'Ç%=', 'Ç%?', 'Ç%¡', 'Ç%¿', 'Ç%,', 'Ç%_', 'Ç&#', 'Ç&%', 'Ç&=', 'Ç&?', 'Ç&¡', 'Ç&¿', 'Ç&,', 'Ç&_', 'Ç=#', 'Ç=%', 'Ç=&', 'Ç=?', 'Ç=¡', 'Ç=¿', 'Ç=,', 'Ç=_', 'Ç?#', 'Ç?%', 'Ç?&', 'Ç?=', 'Ç?¡', 'Ç?¿', 'Ç?,', 'Ç?_', 'Ç¡#', 'Ç¡%', 'Ç¡&', 'Ç¡=', 'Ç¡?', 'Ç¡¿', 'Ç¡,', 'Ç¡_', 'Ç¿#', 'Ç¿%', 'Ç¿&', 'Ç¿=', 'Ç¿?', 'Ç¿¡', 'Ç¿,', 'Ç¿_', 'Ç,#', 'Ç,%', 'Ç,&', 'Ç,=', 'Ç,?', 'Ç,¡', 'Ç,¿', 'Ç,_', 'Ç_#', 'Ç_%', 'Ç_&', 'Ç_=', 'Ç_?', 'Ç_¡', 'Ç_¿', 'Ç_,', '_#%', '_#&', '_#=', '_#?', '_#¡', '_#¿', '_#,', '_#Ç', '_%#', '_%&', '_%=', '_%?', '_%¡', '_%¿', '_%,', '_%Ç', '_&#', '_&%', '_&=', '_&?', '_&¡', '_&¿', '_&,', '_&Ç', '_=#', '_=%', '_=&', '_=?', '_=¡', '_=¿', '_=,', '_=Ç', '_?#', '_?%', '_?&', '_?=', '_?¡', '_?¿', '_?,', '_?Ç', '_¡#', '_¡%', '_¡&', '_¡=', '_¡?', '_¡¿', '_¡,', '_¡Ç', '_¿#', '_¿%', '_¿&', '_¿=', '_¿?', '_¿¡', '_¿,', '_¿Ç', '_,#', '_,%', '_,&', '_,=', '_,?', '_,¡', '_,¿', '_,Ç', '_Ç#', '_Ç%', '_Ç&', '_Ç=', '_Ç?', '_Ç¡', '_Ç¿', '_Ç,'];
const LETTERS_AMOUNT = 69;
let lettersCanMove = true;
let TYPE_REGISTER_MESSAGE = "register";
let TYPE_LOGIN_MESSAGE = "login";

//TOOLS
function preciseSetTimeout(callback, delay) {
  let start = performance.now();

  function tick() {
    let now = performance.now();
    let difference = now - start;

    difference >= delay ? callback() : requestAnimationFrame(tick);
  }
  tick();
}

async function generateCookieHash(email){
  let date = new Date().toLocaleString();
  let hashRandom = ''

  for (let i = 0; i < 14; i++){
    hashRandom += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
  }

  const encoder = new TextEncoder();
  let cookie = encoder.encode(email + date + hashRandom);
  const hash = await window.crypto.subtle.digest('SHA-256', cookie);
  const hashArray = Array.from(new Uint8Array(hash));
  let hashString = hashArray.map(n => n.toString(16).padStart(2, '0')).join('');

  return hashString;
}

async function hashRegisterPassword(password){
  let salt = '';
  for (let i = 0; i < 3; i++){
    salt += GRAINS_SALT.charAt(Math.floor(Math.random() * GRAINS_SALT.length));
  }
  const encoder = new TextEncoder();
  password = encoder.encode(salt + password);
  
  const hash = await window.crypto.subtle.digest('SHA-256', password);
  const hashArray = Array.from(new Uint8Array(hash));
  let hashString = hashArray.map(n => n.toString(16).padStart(2, '0')).join('');
  
  return hashString;
}

async function hashLoginPassword(password){
  let hashArrayString = [];
  const encoder = new TextEncoder();

  for (let i = 0; i < ALL_SALT_PERMUTATIONS.length; i++){
    let saltedPassword = ALL_SALT_PERMUTATIONS[i] + password;
    saltedPassword = encoder.encode(saltedPassword);

    const hash = await window.crypto.subtle.digest('SHA-256', saltedPassword);
    const hashArray = Array.from(new Uint8Array(hash));
    let hashString = hashArray.map(n => n.toString(16).padStart(2, '0')).join('');
    hashArrayString.push(hashString);
  }
  return hashArrayString;
}

export function popUpMessage(message){
  //da implementare
    try{
        let notification = document.createElement('div');
        notification.classList.add("notification");
        let notification_body = document.createElement('div');
        notification_body.classList.add("notification-body");
        notification_body.textContent = message;
        let notification_progress = document.createElement("div");
        notification_progress.classList.add("notification-progress");
        notification.appendChild(notification_body);
        notification.appendChild(notification_progress);
        document.body.appendChild(notification);

        preciseSetTimeout(function() {
            document.body.removeChild(notification);
        }, 10000);
    
    } catch (error){
        console.error('Error during pop up message ', error);
    }
}

//FLOATING LETTERS
function generateFloatingLetters() {
  let LetterPool = document.createElement("div");
  LetterPool.id = "LetterPool";
  LetterPool.style.margin = "0";

  for (let i = 0; i < LETTERS_AMOUNT; i++) {
    let letter = document.createElement("div");
    letter.classList.add("letters");
    let top = Math.floor(Math.random() * window.innerHeight);
    let left = Math.floor(Math.random() * window.innerWidth);
    letter.textContent = LETTERS.charAt(
      Math.floor(Math.random() * LETTERS.length)
    );
    letter.style.top = `${top}px`;
    letter.style.left = `${left}px`;
    let angle = 0;
    while (angle % 90 === 0) {
      angle = Math.floor(Math.random() * 360);
    }
    let speed = Math.random() * 1 + 1;
    letter.setAttribute("data-angle", angle);
    letter.setAttribute("data-speed", speed);
    LetterPool.appendChild(letter);
  }
  let blurBackground = document.querySelector(".blur-background");
  blurBackground.appendChild(LetterPool);
}

function moveFloatingletters() {
  const letters = document.querySelectorAll(".letters");
  for (let letter of letters) {
    let angle = parseFloat(letter.getAttribute("data-angle"));
    const speed = parseFloat(letter.getAttribute("data-speed"));
    let x =
      parseFloat(letter.style.left) + Math.cos((angle * Math.PI) / 180) * speed;
    let y =
      parseFloat(letter.style.top) + Math.sin((angle * Math.PI) / 180) * speed;

    if (x < 0 || x > window.innerWidth) {
      angle = 180 - angle;
      letter.textContent = LETTERS.charAt(
        Math.floor(Math.random() * LETTERS.length)
      );
    }
    if (y < 0 || y > window.innerHeight) {
      angle = 360 - angle;
      letter.textContent = LETTERS.charAt(
        Math.floor(Math.random() * LETTERS.length)
      );
    }

    letter.style.left = `${x}px`;
    letter.style.top = `${y}px`;
    letter.setAttribute("data-angle", angle);
  }
}

function animateFloatingLetters() {
  function update() {
    moveFloatingletters();
  }

  function animate() {
    if (lettersCanMove) {
      update();
      requestAnimationFrame(animate);
    }
  }

  animate();
}

//FUNCTIONs
//prevent form submit to refresh the page
// Register Functions
function checkRegisterEmail(email) {
  // Regex per il controllo del formato dell'email
  var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Verifica se l'email corrisponde al formato
  if (regex.test(email)) {
      return true;
  }
  return false;
}
function checkRegisterPassword(password){
  if (password === document.getElementById("register-password-confirm").value){
    return true;
  }
  else 
    return false;
}

async function clickedRegisterButton(){
  let email = document.getElementById("register-email").value;
  let username = document.getElementById("register-username").value;
  let password = document.getElementById("register-password").value;
  if (!checkRegisterEmail(email)){
    popUpMessage("wrong email format");
  } else if (!checkRegisterPassword(password)){
    popUpMessage("wrong password format");
  } else{
    console.log("typeMessage: "+TYPE_REGISTER_MESSAGE+" email: "+email+" password: "+password);
    sendMessage({typeMessage: TYPE_REGISTER_MESSAGE ,email: email, username: username,  password: await hashRegisterPassword(password)});
    console.log("message sent");
  }
}

//Login functions
function checkLoginEmail(email){
  if (email.includes("@") && email.includes(".")){
    return true;
  }
  return false;
}
async function clickedLogginButton(){
  let email = document.getElementById("login-email").value;
  let password = document.getElementById("login-password").value;
  if (!checkLoginEmail(email)){
    popUpMessage("wrong email format");
  } else{
    console.log("typeMessage: "+TYPE_LOGIN_MESSAGE+" email: "+email+" password: "+password);
    sendMessage({typeMessage: TYPE_LOGIN_MESSAGE ,email: email, password: await hashLoginPassword(password)});
    console.log("message sent");
  }
}


//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", async function () {
  //letters animation
  generateFloatingLetters();
  animateFloatingLetters();

  //login form
  let loginForm = document.querySelector('#login form');
  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    await clickedLogginButton();
  });


  //register form
  let registerForm = document.querySelector('#register form');
  registerForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    await clickedRegisterButton()
  });
});
