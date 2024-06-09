# GPTgram
Una versione di chat con un Inteligenza Artificiale orientato alla privacy e con un interfaccia personalizzabile ed user-friendly.

## Tree Structure
.  
├── asset/  
│   ├── index/  
│   │   └── ...  
│   └── ...  
├── chat/  
│   ├── javascript/  
│   │   ├── account.js  
│   │   ├── all_history.js  
│   │   ├── audio.js  
│   │   ├── chat.js  
│   │   ├── connection.js  
│   │   ├── events.js  
│   │   ├── history.js  
│   │   ├── letters.js  
│   │   ├── settings.js  
│   │   └── utils.js  
│   ├── themes/  
│   │   ├── dark.css  
│   │   └── light.css  
│   ├── index.html  
│   └── style.css  
├── landing/  
│   ├── javascript/  
│   │   ├── connection-landpage.js  
│   │   ├── script.js  
│   │   └── scroll-images.js  
│   └── style/  
│       ├── scroll-images.css  
│       └── style.css  
├── login/  
│   ├── connection-login.js  
│   ├── index.html  
│   ├── login-script.js  
│   └── login-style.css  
├── .gitignore  
├── index.html  
├── LICENSE  
└── README.md  

## Docs

### Chat
* nella cartella ci sono tutti i file che riguardano la pagina della chat di interazione con l'IA
* nel file `index` vi è la struttura base della pagina (parte di essa viene generata in javascript)
* nel file `style` vi è tutto lo stile di base della pagina

#### javascript
* nel file `account` ci sta tutto ciò che riguarda l'account dell'utente in relazione alla tendina a comparsa laterale sinistra dell'account (non le impostazioni)
* il file `all_history` si occupa di gestire il ribbon laterale destro a comparsa dove ci sono tutte le conversazioni passate
* `audio` gestisce solo l'integrazione dei messaggi vocali nell'interfaccia
* `chat` è il file principale della pagina chat, esso gestire i messaggi in generale dell'utente oltre ad occupparsi dell'interfaccia
* tramite `connection` si gestisce la connessione tra client e server
* in `event` si effettua la gestione degli eventi della chat
* `files` si occupa dei file caricati nella chat
* in `history` permette alla barra di ricerca di funzionare e cercare e filtrare i risultati
* `letters` gestisce il movimeno delle lettere di sfondo
* in `settings` vi sono tutte le impostazioni della tendina laterale account che permettono di creare le varie combinazioni di stile
* in `utils` ci sono funzioni varie che sono utilizzate un po ovunque e il sistema di notifiche
#### CSS
* il file `style` gestisce lo stile generale di ogni elemento grafico dentro la pagina
* il file `light` dentro la cartella `themes` si occupa del tema light della chat in cui vi sono i corrispettivi delle varie classi
* il file `dark` dentro la cartella `themes` si occupa del tema light della chat in cui vi sono i corrispettivi delle varie classi

---
### Landing
* la pagina html è presente nella root mentre gli elementi javascript e css sono inseriti dentro le corrispettive sottocartelle nella cartella `landing`

#### javascript
* `connection-landpage` fa semplicemente un controllo di connessione con il server
* `script` si occupa della generazione e del movimento delle lettere in background 
* `scroll-images` si occupa del cambio automatico delle immagini del carosello, oltre che andare avanti/indietro in esso

#### CSS
* il file `style` gestisce lo stile generale di ogni elemento grafico dentro la pagina

---
### Login
* gli elementi inerenti al login sono inseriti dentro la cartella `login` 

#### javascript
* `connection-login` gestisce le interazioni con il server
* `login-script` gestisce le lettere genera/muove le lettere in background, controlla che i campi dei form register/login siano stati compilati correttametnte ed implementa il sistema di notifiche pop-up.

#### CSS
* il file `style` gestisce lo stile generale di ogni elemento grafico dentro la pagina

---
### Asset
* Nella cartella `asset` ci sono le icone del sito
* Dentro `asset`, c'è una sottocartella index ci sono le immagini del carrosello della landing page

