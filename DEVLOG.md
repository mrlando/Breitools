# DEVLOG

(oudere entries: zie DEVLOG_ARCHIVE.md)

## 2026-07-12 — Sokkentool: breitermen naar Engels + voetomtrek-veld weg (ease stuurt de pasvorm)
Op verzoek: alle breitechniektermen consistent Engels (steken→stitches, rijen→rows, ronde→round, opzetten→cast on, recht/averecht→knit/purl, boord→cuff, hiel→heel, teen→toe), rest van de UI blijft Nederlands. Daarnaast het handmatige "Voetomtrek"-veld verwijderd — dat werd toch al automatisch afgeleid uit de EU-schoenmaat en stond gebruikers soms op een verkeerde default (21). `circumference` is nu een verborgen `<input type="hidden">`, alleen gevuld via `updateCircFromEuSize()`. Belangrijk: die functie hangt nu ook aan de `gauge`- en `ease`-inputs (niet meer alleen aan `euSize`), zodat het aantal opzetsteken (afgeleid van de Regia-tabel) intact blijft als je later de ease bijstelt — ease past de effectieve omtrek aan, niet het opzetstekenaantal. Geverifieerd: EU 41 → 64 stitches bij ease 10%, blijft 64 stitches bij ease 15% (alleen de interne cm-waarde schuift mee).

## 2026-07-12 — Sokkentool: voetomtrek automatisch geschat via EU-maat (Regia-opzettabel)
Voetomtrek moest tot nu toe met de hand ingevuld worden (default bleef vaak op 21 staan, ook als dat niet klopte voor de gekozen maat) — gebruiker mat dit zelf nooit, wilde het afleiden uit een echte maattabel. Regia 4-ply's officiële opzetsteken-per-EU-maat-tabel (uit een foto van het garenlabel/patroon) toegevoegd als `SIZE_TABLE` (paren van maatbruggen 22/23 t/m 46/47, lineair geïnterpoleerd tussen middelpunten). Bij het invullen van de EU-maat werd `circumference` berekend: opzetsteken uit de tabel → effectieve omtrek via de eigen gauge-invoer (`sts / (gauge/10)`) → terug naar ruwe voetomtrek via de eigen ease-invoer (`effectiveCirc / (1 - ease/100)`), zodat het resultaat de eigen gauge/ease van de gebruiker blijft respecteren i.p.v. Regia's vaste garen. Geverifieerd: EU 41 → 64 opzetsteken, EU 39 → 60 opzetsteken, beide exact gelijk aan de tabel. (Zie ook de entry hierboven — het veld zelf is inmiddels verborgen.)

## 2026-07-12 — Sokkentool stap 3: hiel-rows werden niet afgetrokken van het voet-aantal
`footRounds` was berekend als `voetlengte − teenlengte`, zonder rekening te houden met de hiel: de German short row hiel-turn kost zelf ook rows (hiel-diepte), maar die zaten nog steeds in het getoonde rows/cm-aantal voor het rechte voetstuk. Hiel-berekening (`heelSts`/`centerSts`/`turnsPerSide`, eerder verwijderd toen de losse hiel-stap wegviel) teruggezet — nu puur intern gebruikt om `heelRows` (turnsPerSide × 2) te bepalen en af te trekken: `footRounds = totalFootRows − heelRows − toeRounds`. Stap 3 toont nu expliciet "(heel: {heelRows} rows, niet meegerekend)" zodat duidelijk is dat dat aantal al is uitgesloten.

## 2026-07-12 — Sokkentool stap 3 herformuleerd + verouderde subtitel gefixt
Stap 3-tekst gebruikte "samen" (suggereerde een totaal), terwijl het al alleen het stuk vanaf einde hiel tot teen was — herschreven zonder het woord "samen". Ook de tool-kaart-subtitel op `index.html` was nog blijven hangen op de oude "boord, hiel, voet en teen (cuff-down/toe-up)"-tekst sinds de toe-up-verwijdering — teruggebracht naar dezelfde subtitel als de sokkentool-pagina zelf.

## 2026-07-12 — App-titel: "Breitools" → "Monika's breitools"
Hernoemd op alle plekken: `<title>`/`<h1>` in `index.html`, `<title>` van de 3 tool-pagina's, en `name`/`short_name` in `manifest.json` (bepaalt het label onder het "Zet op beginscherm"-icoon).

## 2026-07-12 — Sokkentool: toe-up verwijderd, hernoemd naar sokkentool.html
Volledige toe-up-constructie uit `sokmaat.html` verwijderd (toggle-knoppen, `setConstruction`, toe-up-tak in `calculate()`) — cuff-down is nu de enige constructiemethode. Bestand hernoemd naar `sokkentool.html` (`git mv`), link in `index.html` bijgewerkt.
