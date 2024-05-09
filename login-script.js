const SENDTEXTCLASS = "sendbox";
const RECEIVETEXTCLASS = "receivebox";
const LETTERS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const LETTERS_AMOUNT = 69;
const TYPECHAT = "CHAT";
const TYPEMSG = "MSG";
let lettersCanMove = true;

function preciseSetTimeout(callback, delay) {
  let start = performance.now();

  function tick() {
    let now = performance.now();
    let difference = now - start;

    difference >= delay ? callback() : requestAnimationFrame(tick);
  }
  tick();
}

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
  document.body.appendChild(LetterPool);
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
document.addEventListener("DOMContentLoaded", async function () {
  generateFloatingLetters();
  animateFloatingLetters();
});
