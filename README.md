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




## SERVER (scritto interamente in javascript, nodejs)
- [ ] aprire socket TCP
- [ ] gestire un UNICA connessione (no mutua esclusione)
- [ ] autenticare il client
- [ ] gestire richieste del client (eventualmente implementare anche la funzionalià di sync);
- [ ] per il modello di inteligenza artificiale, sfruttare le API keys di ANYTHINGLLM
- [ ] quando finisce la prima connessione del client, il server deve ritornare in attesa per una nuova connessione
- [ ] gestire (forse) il segnale SIGINT per chiudere il server in modo controllato

FINE

