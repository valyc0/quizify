# Quizify - Sistema di Quiz Generico

Quizify è un'applicazione web interattiva progettata per la preparazione ai concorsi pubblici, in particolare per il Comune di Roma Capitale nelle categorie istruttori e amministrativi.

## 🎯 Caratteristiche Principali

- **Quiz Interattivi**: Sistema di domande a scelta multipla con feedback immediato
- **Autenticazione Utenti**: Sistema di login per controllare l'accesso
- **Filtri per Materia**: Possibilità di filtrare le domande per argomento specifico
- **Modalità di Studio Flessibili**: 
  - Modalità casuale per tutte le domande
  - Modalità range per studiare sezioni specifiche
- **Gestione Errori**: Visualizzazione e ripetizione delle domande sbagliate
- **Progressi Salvati**: Il sistema mantiene il progresso anche dopo il riavvio del browser
- **Interfaccia Responsive**: Design moderno e mobile-friendly con Bootstrap 5

## 📚 Materie Disponibili

Il sistema include domande su diverse materie:
- Abilità di ragionamento logico-matematico
- Abilità logico-deduttive
- Abilità di ragionamento critico-verbale
- Diritto Amministrativo
- E altre materie specifiche per i concorsi pubblici

## 🚀 Come Utilizzare

### 1. Accesso al Sistema
- Aprire `index.html` nel browser
- Effettuare il login con le credenziali:
  - **Username**: `user` / **Password**: `user1`
  - **Username**: `user1` / **Password**: `user1`
  - **Username**: `admin` / **Password**: `admin123`

### 2. Configurazione Quiz
- **Filtro per Materia**: Selezionare una materia specifica o lasciare "Tutte le materie"
- **Modalità Quiz**:
  - **Random Questions**: Domande casuali da tutto il database
  - **Select Question Range**: Selezionare un range specifico di domande
- **Opzioni Aggiuntive**:
  - Randomizzare l'ordine delle domande nel range selezionato
  - Randomizzare l'ordine delle opzioni di risposta

### 3. Svolgimento Quiz
- Selezionare la risposta desiderata cliccando sull'opzione
- Cliccare "Submit Answer" per confermare
- Visualizzare il feedback immediato con la risposta corretta
- Navigare tra le domande usando "Previous" e "Next"
- Visualizzare eventuali note aggiuntive per ogni domanda

### 4. Risultati e Analisi
- Al termine del quiz, visualizzare il punteggio finale
- Accedere alla lista delle domande sbagliate
- Ripetere solo le domande errate per migliorare la preparazione
- Riavviare il quiz per una nuova sessione

## 🛠️ Struttura del Progetto

```
quizify/
├── index.html              # Pagina principale dell'applicazione
├── quiz.js                 # Logica principale del quiz
├── questions.js            # Database delle domande (istruttori)
├── questions-amministrativi.js  # Database delle domande (amministrativi)
├── questions-istruttori.js      # Database delle domande (istruttori - backup)
└── README.md               # Questo file
```

## 🔧 Funzionalità Tecniche

### Gestione Stato
- **LocalStorage**: Salvataggio automatico del progresso
- **Sessione Persistente**: Ripresa automatica della sessione precedente
- **Gestione Login**: Stato di autenticazione persistente

### Algoritmi di Randomizzazione
- **Shuffle Fisher-Yates**: Per randomizzare domande e opzioni
- **Filtri Dinamici**: Conteggio automatico delle domande per materia
- **Validazione Range**: Controllo degli input per evitare errori

### Interfaccia Utente
- **Design Responsive**: Ottimizzato per desktop e mobile
- **Feedback Visivo**: Colori e animazioni per indicare risposte corrette/errate
- **Navigazione Intuitiva**: Pulsanti di navigazione contestuali
- **Accessibilità**: Struttura HTML semantica e leggibile

## 📊 Statistiche Quiz

Il sistema traccia automaticamente:
- Numero di risposte corrette
- Percentuale di successo
- Lista delle domande sbagliate
- Progresso complessivo
- Tempo di sessione (tramite localStorage)

## 🔒 Sicurezza

- Sistema di autenticazione base per controllare l'accesso
- Validazione input lato client
- Prevenzione di manipolazioni delle risposte
- Gestione sicura dello stato dell'applicazione

## 🎨 Personalizzazione

Il sistema è facilmente personalizzabile:
- **Database Domande**: Modificare i file `.js` delle domande
- **Stili**: Personalizzare CSS per cambiare l'aspetto
- **Credenziali**: Modificare le credenziali di accesso in `quiz.js`
- **Materie**: Aggiungere nuove categorie di domande

## 📱 Compatibilità

- **Browser Moderni**: Chrome, Firefox, Safari, Edge
- **Dispositivi Mobile**: Responsive design per smartphone e tablet
- **Offline**: Funziona completamente offline una volta caricato

## 🤝 Contributi

Per contribuire al progetto:
1. Aggiungere nuove domande nei file appropriati
2. Migliorare l'interfaccia utente
3. Ottimizzare le prestazioni
4. Aggiungere nuove funzionalità

---

**Nota**: Questo sistema è progettato specificamente per la preparazione ai concorsi pubblici e può essere adattato per altri tipi di quiz o esami.