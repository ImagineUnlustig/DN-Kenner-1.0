# DN Kenner

Installierbare Progressive Web App für technische Fittingmaße. Die App ist für GitHub Pages vorbereitet.

## Aktueller Stand

- Auswahl von Kupfer, HT und Temperguss
- Suche nach Fittingart, Größe und Begriff
- Darstellung der Maße samt PDF-Seitenreferenz
- responsives Layout und Offline-Caching
- **Die Maßdatenbank ist noch leer.** Es werden keine Maße erfunden. Die Tabellen aus `WhatsApp.pdf` müssen noch sauber übertragen werden.

## Daten ergänzen

Datei `data/measurements.json` bearbeiten. Ein Datensatz hat dieses Format:

```json
{
  "system": "Kupfer",
  "fitting": "Pressbogen 90°",
  "name": "Pressbogen 90°",
  "size": "15 mm",
  "connection": "Press",
  "dimensions": [
    { "label": "Z-Maß", "value": "WERT AUS PDF" },
    { "label": "Länge", "value": "WERT AUS PDF" }
  ],
  "source": {
    "pdfPage": 5,
    "bookPage": "",
    "table": "Tabellenüberschrift aus dem PDF"
  }
}
```

Ersetze `WERT AUS PDF` ausschließlich durch einen eindeutig lesbaren Wert. Bei unklaren Ziffern keinen Datensatz mit geratenen Werten anlegen. `pdfPage` ist die Position im PDF-Viewer; `bookPage` ist die gedruckte Seitenzahl, sofern eindeutig lesbar.

## Veröffentlichung auf GitHub Pages

1. Dieses ZIP entpacken.
2. Auf GitHub ein neues Repository erstellen, zum Beispiel `dn-kenner`.
3. Alle Dateien und Ordner aus diesem Ordner in das Repository hochladen. `index.html` muss im Hauptordner liegen.
4. Im Repository **Settings → Pages** öffnen.
5. Bei **Build and deployment** `Deploy from a branch` auswählen.
6. Branch `main` und Ordner `/ (root` auswählen und speichern.
7. Nach Abschluss der Veröffentlichung die angezeigte GitHub-Pages-Adresse öffnen.

## Änderungen veröffentlichen

Wenn du Dateien in GitHub änderst und speicherst/committest, veröffentlicht Pages die neue Version automatisch. Bei Änderungen an Offline-Dateien kann es nötig sein, die installierte App einmal online zu öffnen; bei größerem Update die Cache-Version in `service-worker.js` ändern (`dn-kenner-v2`).

## Grenzen

Die Anzeige bestätigt nur, dass ein Wert aus dem PDF übernommen wurde. Sie ist keine unabhängige Prüfung gegen DIN/EN-Normen oder Herstellerdaten.
