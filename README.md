# DeviceDoctor Preisrechner (statisch)

Kleine, **statische** Website (HTML/CSS/JS) für einen Preisrechner ohne Tracking/Cookies.

## Dateien

- `index.html`: UI
- `styles.css`: Styles
- `prices.js`: Preisdaten (aus deiner PDF-Tabelle)
- `script.js`: Rechner-Logik
- `assets/`: Logos

## Anpassen

In `script.js` im Objekt `CONTACT` deine Kontaktdaten eintragen:

- `email`
- `phoneE164` (z. B. `+491701234567`)
- `displayPhone` (Anzeige im Button)

## Lokal testen

Auf macOS im Projektordner:

```bash
python3 -m http.server 5173
```

Dann im Browser öffnen:

- `http://localhost:5173`

