import { sendMessage } from "./connection-login.js";

const SENDTEXTCLASS = "sendbox";
const RECEIVETEXTCLASS = "receivebox";
const LETTERS ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
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

function popUpMessage(message){
  //da implementare
  console.log("implementare la funzione popUpMessage");
  alert(message);
  console.log(message);
  //inserire i messaggi pop-up belli
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
function checkRegisterEmail(email){
  let emailConfirm = document.getElementById("register-email-confirm").value;
  if (email.includes("@") && email.includes(".")){
    if (email === emailConfirm){
      return true;
    }
  }
  return false;
}
function checkRegisterPassword(password){
  let passwordConfirm = document.getElementById("register-password-confirm").value;
  if (password === passwordConfirm){
    return true;
  }
  return false;
}

function clickedRegisterButton(){
  let email = document.getElementById("register-email").value;
  let password = document.getElementById("register-password").value;
  if (!checkRegisterEmail(email)){
    popUpMessage("wrong email format");
  } else if (!checkRegisterPassword(password)){
    popUpMessage("wrong password format");
  } else{
    console.log("typeMessage: "+TYPE_REGISTER_MESSAGE+" email: "+email+" password: "+password);
    sendMessage({typeMessage: TYPE_REGISTER_MESSAGE ,email: email, password: password});
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
function clickedLogginButton(){
  let email = document.getElementById("login-email").value;
  let password = document.getElementById("login-password").value;
  if (!checkLoginEmail(email)){
    popUpMessage("wrong email format");
  } else{
    console.log("typeMessage: "+TYPE_LOGIN_MESSAGE+" email: "+email+" password: "+password);
    sendMessage({typeMessage: TYPE_LOGIN_MESSAGE ,email: email, password: password});
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
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    clickedLogginButton();
  });


  //register form
  let registerForm = document.querySelector('#register form');
  registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    clickedRegisterButton()
  });
});
