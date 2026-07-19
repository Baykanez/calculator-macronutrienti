# Session Log

## 2026-07-19

**Redesign vizual complet** (index.html, style.css, script.js)

- Direcție aleasă: bold/energic, tematică fitness/nutriție (portocaliu-roșu + verde-lime pe fundal alb/antracit)
- Adăugat și o a doua temă, dark-neon (accent cyan cu glow), apoi unificate ambele într-un singur set de fișiere folosind variabile CSS pe `[data-theme]`
- Adăugat buton de switch light/dark (🌙/☀️) cu persistare în `localStorage`, fără flash la încărcare (script inline în `<head>`)
- Structura funcțională și `script.js` (calculul BMR/TDEE, logica de rezultate) nu au fost modificate, doar CSS + markup pentru toggle
- Commits: `fc5f5fd` (redesign + toggle), `1bd4ada` (chore: exclude backup_datahost din git)
- Push pe `origin/main` (github.com/Baykanez/calculator-macronutrienti) — finalizat
- Site-ul live e pe hosting clasic (cPanel/FTP) la herbalnutrifit.ro, nu pe Vercel — actualizarea acolo se face manual (upload index.html/style.css/script.js prin File Manager sau FTP), am ghidat pașii dar nu am acces automat la acel hosting
- Utilizatorul a păstrat local un backup al fișierelor vechi de pe hosting în `backup_datahost/` (exclus din git via `.gitignore`)

**Next steps**: confirmă cu utilizatorul dacă a finalizat upload-ul manual pe herbalnutrifit.ro; dacă da, opțional se poate șterge `backup_datahost/` local.
