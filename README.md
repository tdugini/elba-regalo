# Un regalo speciale all'Isola d'Elba 🌊

Biglietto di auguri digitale + rivelazione di un regalo: una giornata in
motonave lungo la costa sud-occidentale dell'Isola d'Elba.

Pagina **single-page** statica, senza framework né build: solo
`index.html`, `styles.css`, `script.js`. Si apre come un biglietto e,
scorrendo, racconta l'esperienza tappa dopo tappa.

---

## 🚀 Avviare il progetto

Basta un qualsiasi server statico (serve un server perché il font e alcune
API si comportano meglio via `http://` che via `file://`).

```bash
cd elba-regalo

# Opzione 1 – Python (già presente su quasi tutti i sistemi)
python3 -m http.server 8000

# Opzione 2 – Node
npx serve .
```

Poi apri <http://localhost:8000>.

> Funziona anche aprendo direttamente `index.html` nel browser, ma con un
> server è tutto più fedele.

## 🌐 Pubblicare

È una cartella di file statici: si pubblica ovunque, gratis.

- **Netlify / Vercel**: trascina la cartella, oppure collega il repo.
- **GitHub Pages**: carica i file in un repo → *Settings → Pages* → branch
  `main`, cartella `/root`.
- **Qualsiasi hosting**: copia i file nella cartella pubblica.

### Non farla indicizzare da Google (URL privato)

Se la pubblichi su un link privato e non vuoi che finisca sui motori di
ricerca, aggiungi dentro `<head>` in `index.html`:

```html
<meta name="robots" content="noindex, nofollow" />
```

(opzionale) e un file `robots.txt` nella root con:

```
User-agent: *
Disallow: /
```

---

## ✏️ Personalizzare nome e messaggi

**Tutto in un unico punto**: apri `script.js`, in cima trovi l'oggetto
`birthdayGift`. Modifica solo quello.

```js
const birthdayGift = {
  recipientName: "Amore di mamma",     // ← nome del festeggiato (biglietto)
  senderNames:   "Tommaso e Zoe",       // ← firma
  initialGreeting: "Buon compleanno!",  // ← titolo del saluto finale
  finalMessage:  "Speriamo che questo regalo…", // ← messaggio finale
  experienceUrl: "https://freedome.it/…", // ← link ai dettagli (nuova scheda)
};
```

- **Nome del festeggiato** → `recipientName`
- **Messaggio finale** → `finalMessage`
- **Firma** → `senderNames`
- **Link esperienza** → `experienceUrl`

I testi delle sezioni (rotta, momenti, info) sono direttamente in
`index.html`, scritti in italiano e facili da ritoccare.

---

## 🖼️ Sostituire le immagini

Di default la pagina **non usa foto**: le scene del mare sono disegnate in
CSS e i "momenti" usano dei **frame-placeholder eleganti** (non rettangoli
grigi), ognuno con etichetta e dimensione consigliata.

Per inserire una vera foto in un momento, apri `index.html`, trova il blocco
`.moment__media` che ti interessa e aggiungi una `<img>` **come primo figlio**:

```html
<div class="moment__media ph" data-label="Dentro la Grotta Azzurra" data-size="1200 × 1500">
  <img src="assets/images/grotta-azzurra.jpg"
       alt="Interno della Grotta Azzurra con riflessi blu"
       width="1200" height="1500" loading="lazy" />
  <div class="ph__art ph__art--cave" aria-hidden="true"></div>
</div>
```

L'immagine copre automaticamente il placeholder. Se non si carica, resta
visibile il frame decorativo sotto (fallback integrato). Sono già impostati
`width`, `height` e `aspect-ratio` per evitare salti di layout.

### Dimensioni consigliate

| Dove | Proporzione | Dimensione ideale |
|------|-------------|-------------------|
| Momenti (le 6 tessere) | 4:5 verticale | **1200 × 1500 px** |
| Immagine social (Open Graph) | 1.91:1 | **1200 × 630 px** → `assets/images/social-cover.jpg` |

Per l'immagine social, sostituisci il file e/o aggiorna la riga
`<meta property="og:image" …>` in `index.html`.

### Dove cercare foto libere (verifica sempre la licenza)

- Unsplash — <https://unsplash.com>  (licenza Unsplash, uso libero)
- Pexels — <https://pexels.com>  (licenza Pexels)
- Pixabay — <https://pixabay.com>
- Wikimedia Commons — <https://commons.wikimedia.org>  (controlla licenza e autore)

Soggetti utili: *Isola d'Elba, Marina di Campo, costa dell'Elba, mare
mediterraneo, snorkeling, grotte marine, motonave/escursione in barca,
delfini nel Mediterraneo.*

Quando aggiungi una foto, annota qui sotto fonte, autore e licenza.

#### Registro immagini utilizzate

| File | Soggetto | Fonte / URL | Autore | Licenza |
|------|----------|-------------|--------|---------|
| _(nessuna ancora — solo placeholder)_ | | | | |

---

## 🔤 Font

Caricati da Google Fonts (con `display=swap`):

- **Cormorant Garamond** — titoli (serif editoriale, elegante e "mediterraneo")
- **Inter** — testo corrente (sans-serif molto leggibile)

Per usarli offline, scarica i file e sostituisci il `<link>` in `<head>`
con un `@font-face` locale.

---

## 🎬 Animazioni: come modificarle o disattivarle

- **Rispettano già `prefers-reduced-motion`**: chi ha attivato "riduci
  movimento" nel sistema operativo vede i contenuti comparire subito, senza
  parallasse, onde animate o linea che si disegna.
- Per **rallentare/velocizzare** tutto, cambia le variabili in `styles.css`
  (`:root`): `--dur`, `--dur-slow`, `--ease-out`.
- Per **togliere del tutto** un effetto:
  - onde animate → rimuovi il blocco `@media (prefers-reduced-motion: no-preference)`;
  - comparsa allo scroll → in `styles.css` imposta `.reveal-on-scroll { opacity: 1; transform: none; }`;
  - rotta che si disegna → è già completa senza JS; per disattivarla lascia
    `#routePath { stroke-dashoffset: 0 }`.
- **Nessuna musica in autoplay**, per scelta.

---

## ♿ Accessibilità & qualità

- Struttura semantica (`main`, `section`, `h1–h3`, liste, `dl`).
- Navigabile da **tastiera** (skip-link, focus visibili, bottone reale).
- Contrasto testo/sfondo verificato **≥ 4.5:1** su tutte le coppie principali.
- Immagini con `width`/`height`/`aspect-ratio` e `loading="lazy"`.
- **Leggibile anche senza JavaScript** (il biglietto diventa una normale
  prima schermata e tutti i contenuti restano visibili).
- Testato a **360 / 390 / 768 / 1024 / 1440 px**, nessuno scroll orizzontale,
  nessun errore in console.

---

## 📦 Dipendenze

Nessuna in produzione. Solo HTML, CSS e JavaScript vanilla.
(Google Fonts è l'unica risorsa esterna caricata a runtime.)

---

## 🗂️ Struttura

```
elba-regalo/
├── index.html      ← contenuti e struttura
├── styles.css      ← direzione artistica (colori/spazi/tempi in :root)
├── script.js       ← ⚙️ CONFIG in cima + logica (apertura, reveal, rotta)
├── assets/
│   ├── images/     ← qui le foto (e social-cover.jpg)
│   └── icons/
└── README.md
```

Con affetto. 🐬
# elba-regalo
