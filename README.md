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


## SERVER (scritto interamente in javascript, nodejs)
- [ ] aprire socket TCP
- [ ] gestire un UNICA connessione (no mutua esclusione)
- [ ] autenticare il client
- [ ] gestire richieste del client (eventualmente implementare anche la funzionalià di sync);
- [ ] per il modello di inteligenza artificiale, sfruttare le API keys di ANYTHINGLLM
- [ ] quando finisce la prima connessione del client, il server deve ritornare in attesa per una nuova connessione
- [ ] gestire (forse) il segnale SIGINT per chiudere il server in modo controllato
- [ ] implementare chromadb (vector database)
- [ ] implementare sql database
- [ ] leggere pdf 
- [ ] modalita agente per svolgere funzioni  
FINE

## TODO lato client (entro il 7 maggio)
- [ ] sistemare le chat
  - [ ] creare la msgbox per user e AI (📗 Simone)
    - [ ] creare la forma del messaggio
    - [ ] fare si che la dimensione sia dinamica in base al messaggio
  - [ ] allineare i messaggi per bene in base a chi manda il messaggio (📗 Simone)
  - [ ] reimplementare la divisione delle chat (📗 Simone)
    - [ ] togliere le linee orizzontali
    - [ ] aggiungere un contorno
    - [ ] implementare il titolo della chat in base al contenuto della chat
  - [ ] inserire la barra di ricerca (📕 Patrizio)
    - [ ] implementare la tendina con le ricerche recenti
      - [ ] implentare il record con domanda e risposta
    - [ ] implementare un sistema di ricerca per le query simili
- [ ] implementare background le lettere fluttuanti (📕 Patrizio)
  - [ ] impostare il background
  - [ ] animazione che scrive il messaggio con le lettere (low priority)
- [x] sostituire le icone dell'AI e dell'utente per abbinarle a resto delle icone (📕 Patrizio)
- [ ] aggiungere un pulsante che crea una nuova chat (📗 Simone)
  - [ ] fare vibrare il tasto(?)
- [ ] gestire i cookies (📕 Patrizio)

### login
- [ ] fare la pagina di login

### low priority
- [ ] messaggi audio
- [ ] immagini
- [ ] pdf pptx csv
- [ ] backup/sync


## link interessanti
https://www.youtube.com/watch?v=p5O-_AiKD_Q&ab_channel=AllAboutAI
https://www.youtube.com/watch?v=Oe-7dGDyzPM&ab_channel=AllAboutAI
https://www.youtube.com/watch?v=ztBJqzBU5kc&ab_channel=TonyKipkemboi
