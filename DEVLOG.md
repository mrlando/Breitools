# DEVLOG

(oudere entries: zie DEVLOG_ARCHIVE.md)

## 2026-07-12 — Fix: ease-slider deed niets meer zodra EU-maat was ingevuld
Vorige entry (hieronder) liet `updateCircFromEuSize()` ook draaien bij elke wijziging van `gauge`/`ease`, met de bedoeling het opzetstekenaantal vast te houden aan de Regia-tabel. Bijwerking: dat trekt de ease-waarde eerst eruit en past 'm er meteen weer overheen — algebraïsch heft dat elkaar exact op, dus de ease-slider had daarna geen enkel effect meer op het aantal opzetsteken zodra een EU-maat was ingevuld (bevestigd: 64 stitches bleef 64 bij ease 10% én bij ease 15%). Root cause: de voetomtrek moet als vaste fysieke maat behandeld worden zodra hij één keer is afgeleid uit de tabel, niet telkens opnieuw teruggerekend naar diezelfde tabel. Fix: `updateCircFromEuSize()` draait nu alleen nog bij het invullen van de EU-maat zelf (gebruikt de op dat moment geldende gauge/ease als aanname om de voetomtrek te schatten); latere aanpassingen aan `gauge`/`ease` gaan terug naar de normale `calculate()`-listener zonder de voetomtrek opnieuw af te leiden. Geverifieerd: EU 41 → 64 stitches bij ease 10%, → 60 stitches bij ease 15% (voetomtrek blijft intern vast op 23,7 cm).

Kanttekening: onbevestigd of Regia's tabel zelf al met ~10% negatieve ease rekent — de gefotografeerde tabel bevat alleen schoenmaat→opzetsteken-paren, geen toelichting op de onderliggende aannames.

## 2026-07-12 — Sokkentool: breitermen naar Engels + voetomtrek-veld weg
Op verzoek: alle breitechniektermen consistent Engels (steken→stitches, rijen→rows, ronde→round, opzetten→cast on, recht/averecht→knit/purl, boord→cuff, hiel→heel, teen→toe), rest van de UI blijft Nederlands. Daarnaast het handmatige "Voetomtrek"-veld verwijderd — dat werd toch al automatisch afgeleid uit de EU-schoenmaat en stond gebruikers soms op een verkeerde default (21). `circumference` is nu een verborgen `<input type="hidden">`, alleen gevuld via `updateCircFromEuSize()` (zie fix hierboven voor hoe die functie zich uiteindelijk gedraagt).

## 2026-07-12 — Sokkentool: voetomtrek automatisch geschat via EU-maat (Regia-opzettabel)
Voetomtrek moest tot nu toe met de hand ingevuld worden (default bleef vaak op 21 staan, ook als dat niet klopte voor de gekozen maat) — gebruiker mat dit zelf nooit, wilde het afleiden uit een echte maattabel. Regia 4-ply's officiële opzetsteken-per-EU-maat-tabel (uit een foto van het garenlabel/patroon) toegevoegd als `SIZE_TABLE` (paren van maatbruggen 22/23 t/m 46/47, lineair geïnterpoleerd tussen middelpunten). Bij het invullen van de EU-maat werd `circumference` berekend: opzetsteken uit de tabel → effectieve omtrek via de eigen gauge-invoer (`sts / (gauge/10)`) → terug naar ruwe voetomtrek via de eigen ease-invoer (`effectiveCirc / (1 - ease/100)`), zodat het resultaat de eigen gauge/ease van de gebruiker blijft respecteren i.p.v. Regia's vaste garen. Geverifieerd: EU 41 → 64 opzetsteken, EU 39 → 60 opzetsteken, beide exact gelijk aan de tabel. (Zie ook de entry hierboven — het veld zelf is inmiddels verborgen.)

## 2026-07-12 — Sokkentool stap 3: hiel-rows werden niet afgetrokken van het voet-aantal
`footRounds` was berekend als `voetlengte − teenlengte`, zonder rekening te houden met de hiel: de German short row hiel-turn kost zelf ook rows (hiel-diepte), maar die zaten nog steeds in het getoonde rows/cm-aantal voor het rechte voetstuk. Hiel-berekening (`heelSts`/`centerSts`/`turnsPerSide`, eerder verwijderd toen de losse hiel-stap wegviel) teruggezet — nu puur intern gebruikt om `heelRows` (turnsPerSide × 2) te bepalen en af te trekken: `footRounds = totalFootRows − heelRows − toeRounds`. Stap 3 toont nu expliciet "(heel: {heelRows} rows, niet meegerekend)" zodat duidelijk is dat dat aantal al is uitgesloten.

## 2026-07-12 — Sokkentool stap 3 herformuleerd + verouderde subtitel gefixt
Stap 3-tekst gebruikte "samen" (suggereerde een totaal), terwijl het al alleen het stuk vanaf einde hiel tot teen was — herschreven zonder het woord "samen". Ook de tool-kaart-subtitel op `index.html` was nog blijven hangen op de oude "boord, hiel, voet en teen (cuff-down/toe-up)"-tekst sinds de toe-up-verwijdering — teruggebracht naar dezelfde subtitel als de sokkentool-pagina zelf.

## 2026-07-12 — App-titel: "Breitools" → "Monika's breitools"
Hernoemd op alle plekken: `<title>`/`<h1>` in `index.html`, `<title>` van de 3 tool-pagina's, en `name`/`short_name` in `manifest.json` (bepaalt het label onder het "Zet op beginscherm"-icoon).
