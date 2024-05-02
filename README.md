# GPTgram
a better chatGPT

## CLIENT (HTML, CSS e JAVACRIPT) partire da qui
- [ ] gestire autenticazione per funzionalità di sync
- [ ] ricerca delle parole nella chat
- [ ] riprendere una vecchia chat
- [ ] salvare chat tramite cookies
- [ ] richiesta di sync
- [ ] generare delle immagini (forse)
- [ ] mandare messaggi audio, il server li trascrive e l'AI ti risponde come se fosse un messaggio normale. Mettere text to speach (TTS) tramite WisperAI
- [ ] invio dei pdf
- [ ] quando in ricerca si apre una tendina sopra la chat con le vecchie ricerche composta da domanda e risposta con eventuale preview
- [ ] implementare user area

## SERVER (scritto interamente in javascript, nodejs)
- [ ] autenticare il client
- [ ] gestire richieste del client (eventualmente implementare anche la funzionalià di sync);
- [ ] per il modello di inteligenza artificiale, sfruttare le API keys di ANYTHINGLLM
- [X] quando finisce la prima connessione del client, il server deve ritornare in attesa per una nuova connessione
- [ ] gestire (forse) il segnale SIGINT per chiudere il server in modo controllato
- [ ] implementare chromadb (vector database)
- [ ] implementare sql database
- [ ] leggere pdf 
- [ ] modalita agente per svolgere funzioni  
FINE

## TODO lato client (entro il 7 maggio)
- [ ] sistemare le chat
  - [ ] reimplementare la divisione delle chat (📗 Simone)
    - [X] togliere le linee orizzontali
    - [ ] aggiungere un contorno (?)
    - [ ] implementare il titolo della chat in base al contenuto della chat
  - [ ] implementare la tendina dei bottoni
  - [ ] inserire la barra di ricerca (📕 Patrizio)
    - [ ] implementare la tendina con le ricerche recenti
      - [ ] implentare il record con domanda e risposta
    - [ ] implementare un sistema di ricerca per le query simili
- [X] implementare background le lettere fluttuanti (📕 Patrizio)
  - [X] impostare il background
  - [ ] animazione che scrive il messaggio con le lettere (low priority)
- [ ] gestire i cookies (📗 Simone)
- [ ] implementare la risposta con reference ai messaggi
- [ ] implementare tendina funzionalità extra

### login
- [ ] fare la pagina di login

### low priority
- [ ] messaggi audio
- [ ] immagini
- [ ] pdf pptx csv
- [ ] backup/sync

## done CLIENT
- [X] sostituire le icone dell'AI e dell'utente per abbinarle a resto delle icone (📕 Patrizio)
- [X] allineare i messaggi per bene in base a chi manda il messaggio (📗 Simone)
- [X] creare la msgbox per user e AI (📗 Simone)
    - [X] creare la forma del messaggio
    - [X] fare si che la dimensione sia dinamica in base al messaggio
- [X] creare template per gli elementi della chat
  - [X] messagio utente/ai
  - [X] chat
  - [X] components ui
    - [X] header
    - [X] user-area
- [X] sistemare un pulsante che crea una nuova chat (📕 Patrizio)

## done SERVER
- [X] aprire socket TCP
- [X] gestire un UNICA connessione (no mutua esclusione)

## link interessanti
https://www.youtube.com/watch?v=p5O-_AiKD_Q&ab_channel=AllAboutAI
https://www.youtube.com/watch?v=Oe-7dGDyzPM&ab_channel=AllAboutAI
https://www.youtube.com/watch?v=ztBJqzBU5kc&ab_channel=TonyKipkemboi


https://codepen.io/clintabrown/pen/kBPpZO
https://codepen.io/sajadhsm/pen/odaBdd
https://codepen.io/drumilpatel/pen/aEbNMK
https://codepen.io/leenalavanya/pen/MyjjjY
https://codepen.io/samuelkraft/pen/kYrjwX
https://codepen.io/jh3y/pen/bmNVNQ 
https://codepen.io/borntofrappe/pen/rbbZBL