# 🎓 ATA Planner — Versione HTML + CSS + JavaScript Puro (Zero Build)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3_&_Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-Offline_Ready-4F46E5?logo=pwa&logoColor=white)

**ATA Planner** è una web app / dashboard **PWA Mobile-First** progettata specificamente per il **Personale ATA della scuola italiana** per monitorare in tempo reale l'orario di servizio, le ferie, le festività soppresse, i permessi orari e il monte ore di recupero.

Questa versione è scritta interamente in **HTML + CSS + JavaScript puro (Vanilla JS)**:
- **Zero `node_modules`**
- **Zero compilazione richiesta**
- **Pronta per GitHub Pages** caricando direttamente i file nel repository!

---

## 📦 File del Progetto (solo 6 file!)

```text
├── index.html              # Struttura principale della pagina
├── style.css               # Stili personalizzati, animazioni e griglia oraria
├── app.js                  # Tutta la logica ATA, calendario, contatori e salvataggio
├── manifest.webmanifest    # Configurazione PWA per l'installazione su Android/iOS
├── sw.js                   # Service Worker per il funzionamento Offline
└── icon.svg                # Icona vettoriale dell'applicazione
```

---

## 🚀 Come pubblicarla su GitHub Pages

1. Carica tutti i file contenuti in questa cartella nella radice del tuo repository GitHub.
2. Vai su **Settings** → **Pages** del repository.
3. Sotto **Build and deployment > Source** seleziona **Deploy from a branch** e scegli il branch `main` (o `master`) con cartella `/ (root)`.
4. Dopo pochi secondi la tua web app sarà online e installabile su smartphone!
