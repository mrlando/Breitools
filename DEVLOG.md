# DEVLOG

## 2026-07-12 — Sokkentool: voetomtrek automatisch geschat via EU-maat (Regia-opzettabel)
Voetomtrek moest tot nu toe met de hand ingevuld worden (default bleef vaak op 21 staan, ook als dat niet klopte voor de gekozen maat) — gebruiker mat dit zelf nooit, wilde het afleiden uit een echte maattabel. Regia 4-ply's officiële opzetsteken-per-EU-maat-tabel (uit een foto van het garenlabel/patroon) toegevoegd als `SIZE_TABLE` (paren van maatbruggen 22/23 t/m 46/47, lineair geïnterpoleerd tussen middelpunten). Bij het invullen van de EU-maat wordt nu ook `circumference` berekend: opzetsteken uit de tabel → effectieve omtrek via de eigen gauge-invoer (`sts / (gauge/10)`) → terug naar ruwe voetomtrek via de eigen ease-invoer (`effectiveCirc / (1 - ease/100)`), zodat het resultaat de eigen gauge/ease van de gebruiker blijft respecteren i.p.v. Regia's vaste garen. Geverifieerd: EU 41 → 64 opzetsteken, EU 39 → 60 opzetsteken, beide exact gelijk aan de tabel.

## 2026-07-12 — Sokkentool stap 3: hiel-rows werden niet afgetrokken van het voet-aantal
`footRounds` was berekend als `voetlengte − teenlengte`, zonder rekening te houden met de hiel: de German short row hiel-turn kost zelf ook rows (hiel-diepte), maar die zaten nog steeds in het getoonde rows/cm-aantal voor het rechte voetstuk. Hiel-berekening (`heelSts`/`centerSts`/`turnsPerSide`, eerder verwijderd toen de losse hiel-stap wegviel) teruggezet — nu puur intern gebruikt om `heelRows` (turnsPerSide × 2) te bepalen en af te trekken: `footRounds = totalFootRows − heelRows − toeRounds`. Stap 3 toont nu expliciet "(hiel: {heelRows} rows, niet meegerekend)" zodat duidelijk is dat dat aantal al is uitgesloten.

## 2026-07-12 — Sokkentool stap 3 herformuleerd + verouderde subtitel gefixt
Stap 3-tekst gebruikte "samen" (suggereerde een totaal), terwijl het al alleen het stuk vanaf einde hiel tot teen was — herschreven naar "{footRounds} rows vanaf einde hiel tot teen" / "{cm} cm vanaf einde hiel tot teen" zonder het woord "samen". Ook de tool-kaart-subtitel op `index.html` was nog blijven hangen op de oude "boord, hiel, voet en teen (cuff-down/toe-up)"-tekst sinds de toe-up-verwijdering — teruggebracht naar "Volledig recept: boord tot teen (German short row hiel)", gelijk aan de subtitel op de sokkentool-pagina zelf.

## 2026-07-12 — App-titel: "Breitools" → "Monika's breitools"
Hernoemd op alle plekken: `<title>`/`<h1>` in `index.html`, `<title>` van de 3 tool-pagina's, en `name`/`short_name` in `manifest.json` (bepaalt het label onder het "Zet op beginscherm"-icoon).

## 2026-07-12 — Sokkentool: toe-up verwijderd, hernoemd naar sokkentool.html
Volledige toe-up-constructie uit `sokmaat.html` verwijderd (toggle-knoppen, `setConstruction`, toe-up-tak in `calculate()`, en de daaraan gekoppelde variabelen `heelSts`/`centerSts`/`turnsPerSide`/`toeUpStartSts`) — cuff-down is nu de enige constructiemethode. Rondes/steken-teksten in stap 3 herschreven naar rows/stitches, stap 3 (hiel) is eerder al vervallen. Hint-zin over de German short row hiel onderaan verwijderd (verwees naar een hiel-stap die niet meer bestaat). Bestand hernoemd naar `sokkentool.html` (`git mv`), link in `index.html` bijgewerkt.

## 2026-07-12 — Sokmaat cuff-down: stap 4 teruggebracht tot alleen voet-rondes
Vorige samenvoeging van voet+teen in stap 4 bleek niet de bedoeling — stap 4 moet alleen de rondes van na de hiel tot de teen tonen (net als stap 2 z'n been-rondes toont), zonder de teen-afname erin. Titel/detail herschreven naar "{footRounds} rondes voet breien" / "In de ronde op alle {sockSts} steken, tot de teen — samen {cm} cm vanaf de hiel." Teen-instructies blijven vervallen (stap 5 blijft weg, zoals eerder gevraagd).

## 2026-07-12 — Sokmaat cuff-down: voet + teen samengevoegd tot één stap
Stap 4 (voet) en stap 5 (teen) in de cuff-down-volgorde samengevoegd tot één stap 4, in dezelfde stijl als stap 2 (been): titel toont het totaal aantal rondes, detailtekst splitst uit in de twee onderdelen die samen dat totaal vormen. Losse teen-stap is vervallen; `sokmaat.html` gaat nu van 5 naar 4 stappen voor cuff-down.

## 2026-07-12 — Client-side cache-busting via VERSION-check
GitHub Pages cachet zelf al maar 10 min (`max-age=600`, niet aanpasbaar op de gratis tier zonder custom headers), maar browser/PWA-cache (vooral "Zet op beginscherm" op iOS) hield pagina's soms langer vast. `version-check.js` toegevoegd: haalt bij elke page load `VERSION` op met `cache: 'no-store'` (paar bytes, verwaarloosbare impact), vergelijkt met `localStorage`, en forceert alleen een verse reload (cache-bustende `?_v=`-query, daarna weer opgeschoond via `history.replaceState`) als de versie écht is veranderd sinds het vorige bezoek. Opgenomen in de `<head>` van alle 5 pagina's.

## 2026-07-12 — Buildnummer op startscherm + responsive layout voor iPad/landscape
Onopvallend versienummer (`v<span id="buildVersion">`) onderaan `index.html`, opgehaald uit `VERSION`. Wordt automatisch opgehoogd via een git pre-commit hook (`.githooks/pre-commit`, geactiveerd met `git config core.hooksPath .githooks`) die bij elke commit `VERSION` +1 doet en het cijfer in `index.html` bijwerkt — dus geen handmatige stap nodig bij toekomstige deploys.
Daarnaast een `@media (min-width: 700px)` block in `style.css` toegevoegd: de vaste 420px-kolom (bedoeld voor iPhone-portrait) wordt op iPad/landscape 640px breed met iets grotere iconen/padding/tekst, in plaats van een smal kolommetje midden op een groot scherm.

## 2026-07-12 — Fix: toetsenbord bleef staan na invoer (geen "klaar"-toets)
`inputmode="decimal"` toont op iOS een numeriek toetsenbord zonder return/klaar-toets, dus het toetsenbord bleef in beeld tot je handmatig een ander veld aantikte. Klik-buiten-invoerveld sluit het toetsenbord nu automatisch: `document`-click-listener die het actieve `INPUT` blurt zodra er buiten dat veld geklikt wordt. Toegevoegd aan `sokmaat.html`, `switchgewicht.html`, `garenschatting.html`.

## 2026-07-12 — Fix: EU-placeholder kwam niet overeen met default cm-waarde
Placeholder `bv. 39` in het EU-schoenmaat-veld hoorde niet bij de bestaande default van `26` cm in het voetlengte-veld (39 → 24,5 cm via de vuistregel). Placeholder aangepast naar `bv. 41` (→ 25,8 cm, sluit aan bij de 26 cm default) in `sokmaat.html`.

## 2026-07-12 — Fix: EU-schoenmaat → voetlengte vuistregel klopte niet
`EU × ⅔ cm` (zonder correctie) overschatte de voetlengte structureel met 1,0–1,4 cm t.o.v. de Ziengs-maattabellen (ziengs.nl/maatwijzer) — ⅔ is wel de juiste Franse-schoenmaat-factor, maar mist de teenspeling-marge die in een schoenleest zit. Formule in `sokmaat.html` aangepast naar `EU × ⅔ cm − 1,5 cm`, brengt de afwijking terug naar ±0,6 cm over het hele volwassen bereik (EU 36–50). Field-hint tekst bijgewerkt.

## 2026-07-10 — Switchgewicht calculator
Simpele single-file HTML app (`index.html`): vraagt startgewicht bol + gewenst restgewicht, berekent bij welk gewicht je switcht van increases naar decreases in de Sophie Shawl (symmetrische increase/decrease helften, dus switchpunt = start - (start-restgewicht)/2).

## 2026-07-10 — Optie A gekozen als hoofdstructuur
Multi-page aanpak (losse HTML-bestanden per tool + gedeelde `style.css`, startscherm met tool-kaarten). Nieuwe tools toevoegen = nieuw `.html`-bestand + kaart in `index.html`'s `.tool-list`.

## 2026-07-10 — iOS liquid-glass restyle + zachter kleurenpalet
Frosted-glass cards (`backdrop-filter`), comma/punt input parsing, spring-easing animaties. Kleurenpalet vervangen naar roze/lavendel (`--wool-rose` #d98e94, `--wool-lavender` #a692b8) i.p.v. mosterd/salie; terracotta blijft hoofdaccent.

## 2026-07-10 — Fix: zichtbaar lijntje in glass-cards
Root cause: `::before`/`::after` pseudo-elementen renderen als aparte compositing-laag bovenop `backdrop-filter`, wat een naad geeft op de laagrand (niet caching, niet squircle, niet banding). Opgelost door highlights direct te bakken in de `background`-property zelf (gestapelde gradients in één declaratie op `.glass`/`.result-card`), geen pseudo-elementen meer.

## 2026-07-11 — Sokmaat herbouwd tot volledig sokkenpatroon (cuff-down/toe-up)
Root cause vorige versie: losse, niet-samenhangende getallen (steken hier, rondes daar) i.p.v. een doorlopend recept — bevestigd via web-research naar echte sokken-calculators (KnitCalculator, Super Sock Calculator, GoodKnit Kisses), die allemaal een stap-voor-stap recept geven.
`sokmaat.html` herbouwd als recept-generator: boord → been → hiel (German short row, geen gusset) → voet → teen (2-fase magic-formula afname/toename), met een cuff-down/toe-up schakelaar (`.toggle-row`/`.toggle-btn` in `style.css`) en genummerde stappenlijst (`.steps`/`.step`). EU-schoenmaat-autofill (EU × ⅔ cm) behouden. Kaart in `index.html` hernoemd naar "Sokkenpatroon".

## 2026-07-11 — Sokmaat: ribpatroon als recht×averecht, losse boordlengte, scroll-top knop
Ribpatroon-veelvoud was verwarrend als los invoerveld (naam onduidelijk, gebruiker rekende per ongeluk × i.p.v. +). Opgesplitst in twee velden `ribKnit`/`ribPurl` (bv. 2 en 2 voor "2x2 rib"), app telt zelf op tot het veelvoud. Daarnaast bleek beenlengte geen apart boordlengte-veld te hebben — stap-tekst suggereerde dat de hele beenlengte in rib gebreid werd. Nieuw veld `cuffLength` toegevoegd; rijen worden nu gesplitst in `cuffRows` (rib) + `stockinetteRows`, som = totale beenlengte (expliciet in de field-hint: "inclusief de boord, niet erbovenop optellen"). Ook een scroll-naar-boven knop (`.scroll-top-btn` in `style.css`, rechtsonder, verschijnt vanaf `scrollY > 300`) toegevoegd aan `sokmaat.html`, `switchgewicht.html` en `garenschatting.html`.

## 2026-07-11 — PWA: manifest + app-icoon voor "Zet op beginscherm"
Voor testen op telefoon: `manifest.json` toegevoegd (naam, standalone display, terracotta theme-color) + icoon gegenereerd met Pillow (`icon-512.png`, `icon-192.png`, `apple-touch-icon.png`, `favicon-32.png` — garenbol met kruisende breinaalden, roze/terracotta gradient, geen SVG-tooling nodig/beschikbaar dus rechtstreeks als PNG getekend). Head-tags (`manifest`, `theme-color`, `apple-touch-icon`, `apple-mobile-web-app-capable`) toegevoegd aan alle 5 pagina's. Resultaat: "Zet op beginscherm" op iOS/Android opent nu fullscreen met eigen icoon i.p.v. een Safari-snapshot.

## 2026-07-11 — Fix: witte rand als PWA op iPhone
Twee losse randjes na "Zet op beginscherm": (1) onderaan wit door ontbrekende `viewport-fit=cover` — safe-area (home-indicator) werd niet door de achtergrond gedekt. Toegevoegd aan alle 5 pagina's + `env(safe-area-inset-*)` padding op `body` en `.scroll-top-btn`. (2) dun randje aan weerszijden op bredere telefoons (bv. Pro Max) — achtergrond (gradient-vlekken + chevron-patroon) zat op `body`, die maar `max-width: 420px` is en centreert; `html` erachter had alleen de vlakke kleur. Achtergrond volledig verplaatst van `body` naar `html` zodat hij altijd de hele viewportbreedte dekt; `body` is nu transparant.

## 2026-07-11 — App-icoon vervangen door OpenArt-generatie (GPT Image 2)
Zelfgetekende Pillow-icoon verving door een AI-gegenereerd icoon via OpenArt (`gpt-image-2`, text2image, 2K): garenbol met kruisende breinaalden, roze→terracotta gradient, iOS-liquid-glass highlight linksboven. Bron opgeslagen als 1360×1360 PNG, daaruit `icon-512.png`/`icon-192.png`/`apple-touch-icon.png` geresized (Lanczos). `favicon-32.png` apart verwerkt met een strakkere crop + extra contrast/sharpening, anders vervaagde de garenbol-textuur op 32px.

## 2026-07-11 — Fix: terugknop viel onder de klok op iPhone
`.back-link` had een vaste `top: 18px`, zonder rekening met de iOS safe-area (statusbalk/klok/Dynamic Island). Zelfde patroon toegepast als bij de scroll-top-knop: `top: calc(18px + env(safe-area-inset-top))` (`style.css`). Geldt voor alle 3 pagina's met `.back-link` (`switchgewicht.html`, `sokmaat.html`, `garenschatting.html`).

## 2026-07-10 — Echte Lucide/Heroicons iconen + subtiel achtergrondpatroon
`opties.html` uitgebreid met meerdere echte Lucide/Heroicons SVG's (scale, weight, gauge, package, ruler e.a.) naast custom varianten. Gekozen: Lucide "scale" voor Switchgewicht, Lucide "package" voor Garenschatting — toegepast in `index.html`, `switchgewicht.html`, `garenschatting.html`. Achtergrond in `style.css` uitgebreid met een combinatie van de bestaande radiale kleurvlekken plus een zeer subtiel chevron-SVG-patroon (`background-image` tiled laag, opacity 0.08) via `background-color`/`background-image`/`background-size`.
