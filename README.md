# GPTgram
a better chatGPT

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

### Asset
* Nella sottocartella index ci sono le immagini del carrosello
* nella cartella asset ci sono le icone del sito

### Chat
* nella cartella ci sono tuti i file che riguardano la pagina della chat di interazione con l'IA
* nel file index vi è la struttura base della pagina (parte di essa viene generata in javascript)
* nel file style vi è tutto lo stile di base della pagina

#### javascript
* nel file account ci sta tutto ciò che riguarda l'account dell'utente in relazione alla tendina a comparsa laterale sinistra dell'account (non le impostazioni)
* il file all_history si occupa di gestire il ribbon laterale destro a comparsa dove ci sono tutte le conversazioni passate
* audio gestisce solo l'integrazione dei messaggi vocali nell'interfaccia
* chat è il file principale della pagina chat, esso si occupa di gestire i messaggi in generale dell'utente e ai inoltreoccuppa di gestire l'interfaccia
* tramite connection si gestisce la connessione tra client e server
* in event si effettua la gestione degli eventi  della chat
* files si occupa dei file caricati nella chat
* in history permette alla barra di ricerca di funzionare e cercare e filtrare i risultati
* letters gestisce il movimeno delle lettere di sfondo
* in settings vi sono tutte le impostazioni della tendina laterale account che permettono di creare le varie combinazioni di stile
* in utils ci sono funzioni varie che sono utilizzate un po ovunque e il sistema di notifiche
#### themes
* il file light si occupa del tema light della chat in cui vi sono i corrispettivi delle varie classi
* il file dark gestisce il tema dark con corrispettive classi dei vari elementi
### landing
#### javascript
* connection-landpage fa semplicemente un controllo di connessione con il server
* 