# 🎹 DawlessStudio

## Vue d’ensemble

**DawlessStudio** est un studio virtuel Dawless complet avec intelligence artificielle intégrée, conçu exclusivement pour la communauté Discord “Les Sondiers” de Knarf. Il combine la puissance d’un séquenceur professionnel, la fidélité de clones hardware réels, et l’assistance créative d’une IA musicale nommée **DawlessGPT**.

### Vision du projet

Créer l’outil ultime pour :

- **Composer** de la musique électronique avec un workflow Dawless
- **Apprendre** la production musicale avec assistance IA contextuelle
- **Exporter** des pistes MIDI professionnelles prêtes à l’emploi
- **Contrôler** du matériel hardware réel via MIDI
- **Partager** des créations avec la communauté

-----

## 🎯 Caractéristiques principales

### 1. Studio virtuel immersif

- Canvas 2D type “tableau de bord spatial”
- Représentations fidèles de synthétiseurs hardware
- Système de câblage virtuel (MIDI & Audio)
- Interface drag & drop intuitive

### 2. Bibliothèque hardware exhaustive

- **Clones fidèles** de centaines de synthétiseurs réels
- **Mappings MIDI CC#** identiques au matériel original
- **Manuels intégrés** pour chaque appareil
- **DSP modeling** pour sons authentiques
- Synthétiseurs génériques pour développement initial

### 3. Séquenceur maison ultra-complet

- Longueurs variables (16, 24, 32, 48, 64+ steps)
- **P-Locks** (parameter locks par step)
- **Automations avancées** : LFO, courbes exponentielles, enveloppes
- **Contrôle MIDI CC#** total par step
- **Gammes musicales** : majeures, mineures, modes, gammes mondiales
- Affichage personnalisable (grilles 1x16, 2x8, custom)
- Vélocité et probabilité par step

### 4. DawlessGPT - IA musicale intégrée

- **Accès total** au projet en temps réel
- **Actions directes** : modification de paramètres, création de patterns
- **Bases de connaissances** : progressions d’accords, techniques de production
- **Modes spécialisés** : Jam Buddy, Mixing Engineer, Sound Designer, Sensei
- Communication API bidirectionnelle avec le site
- Chain-of-Thought interne pour décisions intelligentes

### 5. Timeline & Arrangement

- Vue horizontale type DAW professionnel
- Glisser-déposer de patterns
- Banque de patterns avec organisation
- Lane d’automation MIDI CC# superposée
- Marqueurs d’arrangement (Intro, Verse, Chorus, Drop, etc.)

### 6. Export professionnel

- **Fichiers MIDI** (.mid) par piste ou complet
- **Vélocités** et **automations CC#** préservées
- **Stems audio** (optionnel)
- Compatibilité totale avec Logic Pro, Ableton, FL Studio, etc.
- Export de metadata (tempo, tonalité, tags)

### 7. Contrôle hardware réel

- Détection automatique des interfaces MIDI
- Configuration canaux MIDI (1-16)
- Mode “Hardware” : envoi direct vers synthés réels
- Synchronisation clock MIDI
- Mute audio virtuel pour écouter hardware

### 8. Système de partage universel

- **Export en code** (comme Mandelbulb3D)
- Projets entiers encodés en string clipboard
- Presets de synthés partageables
- Patterns encodables individuellement
- Import/Export sans historique GPT (confidentialité)

-----

## 📐 Architecture détaillée

### MODULE 1 : Authentification & Onboarding

#### Authentification

- Login obligatoire via Discord OAuth2
- Accès réservé aux membres “Les Sondiers”
- Profils utilisateurs personnalisés
- Sessions persistantes

#### Onboarding Studio

**Étape 1 : Bienvenue**

- Message d’accueil personnalisé
- Explication du concept
- Bouton “Commencer”

**Étape 2 : Sélection instruments**

- Liste déroulante de tous les synthés disponibles
- Bouton “+” pour ajouter un instrument
- Catégorisation par rôle :
  - Bass (synthés de basse)
  - Lead (synthés lead/mélodie)
  - Chords (synthés polyphoniques)
  - Drums (boîtes à rythmes)
  - FX (effets sonores)
  - Pads (nappes)
- Assignment instrument → rôle musical

**Étape 3 : Boîte à rythme**

- Sélection parmi :
  - TR-808, TR-909, TR-707, TR-606
  - Drumbrute, Tempest, Digitakt
  - Drum machine générique (MVP)

**Étape 4 : Effets**

- Reverb : Eventide H9, Strymon BigSky, générique
- Delay : Eventide H90, Strymon Timeline, générique
- Autres : Chorus, Phaser, Flanger, Distortion

**Étape 5 : Table de mixage**

- Sélection du nombre de canaux (8/16/24/32)
- Modèles : Allen & Heath, Mackie, générique

**Étape 6 : Validation**

- Récapitulatif du setup
- Bouton “Créer mon studio”

### MODULE 2 : Canvas/Workspace 2D

#### Interface principale

- **Canvas HTML5** plein écran
- Zoom : molette souris (50% → 200%)
- Pan : clic molette ou espace + glisser
- Grid magnétique optionnelle

#### Éléments visuels

Chaque synthé est une représentation 2D fidèle incluant :

- **Potentiomètres** rotatifs (0-127)
- **Faders** linéaires (0-127)
- **Boutons** (on/off, momentary)
- **Écrans** LCD/LED (affichage valeurs)
- **Entrées/sorties** :
  - MIDI IN/OUT/THRU (DIN 5 broches)
  - Audio OUT (jack 6.35mm)
  - CV/Gate (pour modulaires)
  - USB (si applicable)

#### Interactions

- **Drag & drop** : déplacer les éléments
- **Clic** sur potard : ajuster la valeur
- **Molette** sur potard : précision fine
- **Double-clic** : reset à valeur défaut
- **Clic droit** : menu contextuel
- **Hover** : tooltip avec nom paramètre et valeur

#### Organisation spatiale

- Zone “Synthés & Drums” (haut)
- Zone “Effets” (milieu)
- Zone “Mixage” (bas)
- Libre repositionnement possible

### MODULE 3 : Système de Routing/Patching

#### Types de câbles

1. **Câbles MIDI** (jaune)
- MIDI IN → MIDI OUT
- Canaux MIDI (1-16) configurables
- Visualisation du canal sur le câble
1. **Câbles Audio** (bleu/rouge)
- Mono (jack TS - bleu)
- Stéréo (jack TRS - rouge)
- XLR (pour mixeur)
1. **Câbles CV/Gate** (vert)
- Voltage control
- Trigger/Gate

#### Mécanisme de câblage

- **Clic** sur sortie → **clic** sur entrée
- Animation du câble qui “suit” le curseur
- **Snap** automatique aux connecteurs proches
- **Clic droit** sur câble → supprimer
- **Couleurs** différentes par type

#### Validation intelligente

Le système vérifie :

- ✅ Tous les synthés ont un câble MIDI IN
- ✅ Tous les sons vont vers le mixeur
- ✅ Pas de boucle audio (feedback)
- ✅ Clock MIDI définie (master)
- ❌ Alertes si manquant

Messages d’aide contextuels :

- “Le Moog Sub 37 n’est pas connecté en MIDI”
- “La sortie audio du TB-303 n’est pas routée”
- “Suggestion : brancher la reverb en send/return”

#### Vue alternative : Matrix

- Tableau sources (lignes) × destinations (colonnes)
- Cases à cocher pour connexions rapides
- Basculer entre vue 2D et Matrix

### MODULE 4 : Bibliothèque Hardware

#### Phase 1 - Instruments génériques (MVP)

**Synth Chord Générique**

- Oscillateurs : 2x (saw, square, triangle, sine)
- Mixer oscillateurs (balance)
- Filtre passe-bas résonant (cutoff, resonance)
- Enveloppe ADSR (Attack, Decay, Sustain, Release)
- LFO : vitesse, intensité, destination (pitch, filter, amp)
- Polyphonie : 6 voix
- Effets intégrés : chorus

**Synth Lead Générique**

- Oscillateurs : 2x + sub-oscillateur
- Filtre passe-bas/haut (switchable)
- ADSR x2 (filter + amp)
- LFO x2
- Portamento/Glide
- Monophonique
- Distortion intégrée

**Synth Bass Générique**

- Oscillateur : saw/square
- Sub-oscillateur (-1 octave)
- Filtre passe-bas 24dB
- Enveloppe ultra-rapide (pour punchy bass)
- Compression intégrée
- Overdrive

**Drum Machine Générique (909-style)**

- 11 sons : Kick, Snare, Clap, CHH, OHH, Crash, Ride, Tom1, Tom2, Tom3, Rimshot
- Chaque son : Tune, Decay, Level
- Séquenceur 16 steps intégré
- Accent (vélocité 127)
- Shuffle/Swing global

**Table de mixage générique**

- 16 canaux
- Par canal : Gain, EQ 3 bandes, Pan, Fader, Mute, Solo
- 2 bus send/return (reverb, delay)
- Master out : compressor, limiter

**Reverb générique**

- Type : Room, Hall, Plate, Spring
- Paramètres : Size, Decay, Pre-delay, Mix

**Delay générique**

- Type : Digital, Analog, Tape
- Paramètres : Time (ms ou sync), Feedback, Mix, Filter

#### Phase 2 - Clones hardware réels

Chaque clone inclut :

- **Spécifications techniques complètes**
  - Nombre d’oscillateurs
  - Type de filtre (Moog ladder, SEM, etc.)
  - Polyphonie
  - Architecture (analogique, numérique, hybride)
- **Manuel PDF intégré**
  - Accessible via bouton “?” sur le synthé
  - Viewer PDF in-app
  - Recherche dans le manuel
- **Table MIDI CC# mapping exacte**
  - Exemple TB-303 :
    - CC#74 → Cutoff
    - CC#71 → Resonance
    - CC#73 → Envelope Mod
    - CC#75 → Decay
    - CC#76 → Accent
  - Stocké en JSON par appareil
- **Photos haute résolution**
  - Vue de face (pour UI)
  - Vue connectique arrière
  - Détails contrôles
- **DSP Modeling**
  - Algorithmes de synthèse fidèles
  - Emulation des circuits analogiques
  - Utilisation de Web Audio API + Tone.js
  - Bibliothèques tierces si nécessaire (WebPd, etc.)

**Priorités de clonage :**

*Synthétiseurs analogiques monophoniques :*

- Roland TB-303 (bass)
- Moog Minimoog Model D
- Moog Subsequent 37
- Moog Mother-32
- ARP Odyssey
- Korg MS-20
- Sequential Pro-One

*Synthétiseurs polyphoniques :*

- Oberheim OB-6
- Sequential Prophet-6
- Korg Minilogue XD
- Moog Matriarch
- Roland Juno-106
- Yamaha CS-80 (ambitieux)

*Boîtes à rythmes :*

- Roland TR-808
- Roland TR-909
- Roland TR-707
- Roland TR-606
- Elektron Digitakt (patterns style)
- LinnDrum

*Effets hardware :*

- Eventide H9/H90
- Strymon BigSky (reverb)
- Strymon Timeline (delay)
- Boss RE-20 Space Echo
- Chase Bliss pedals

**Structure de données par appareil :**

```json
{
  "id": "moog_sub37",
  "name": "Moog Subsequent 37",
  "manufacturer": "Moog",
  "type": "synthesizer",
  "category": "bass",
  "year": 2016,
  "polyphony": 1,
  "oscillators": 2,
  "filter_type": "ladder_24db",
  "manual_url": "/manuals/moog_sub37.pdf",
  "image_front": "/images/moog_sub37_front.png",
  "image_back": "/images/moog_sub37_back.png",
  "midi_mappings": {
    "74": {"param": "cutoff", "min": 0, "max": 127},
    "71": {"param": "resonance", "min": 0, "max": 127},
    "70": {"param": "attack", "min": 0, "max": 127}
  },
  "controls": [
    {
      "id": "osc1_waveform",
      "type": "knob",
      "position": {"x": 50, "y": 100},
      "values": ["saw", "triangle", "square"],
      "default": "saw"
    }
  ]
}
```

### MODULE 5 : Séquenceur Maison

#### Architecture générale

- **Multi-pistes** illimité
- **Indépendance** : chaque piste a son séquenceur
- **Synchronisation** : clock master commun
- **Résolution** : 96 PPQN (pulses per quarter note)

#### Interface séquenceur

**Layout customisable :**

- 1 ligne de 16 steps (909-style)
- 2 lignes de 8 steps (Elektron-style)
- 4 lignes de 4 steps (grid)
- 1 ligne de 32/64 steps (long patterns)
- Personnalisable : NxM steps

**Éléments visuels :**

- **Trigs** (triggers) : cases pour activer notes
- **Couleurs** par vélocité :
  - Rouge : forte (100-127)
  - Orange : moyenne (64-99)
  - Jaune : faible (1-63)
- **Indicateur** : LED qui suit la position actuelle
- **Numérotation** : afficher les numéros de steps

#### Édition basique

**Notes :**

- Clic sur trig → activer/désactiver
- Clic long → éditer vélocité (slider)
- Shift+clic → select multiple
- Alt+glisser → copier pattern

**Longueur de pattern :**

- Dropdown : 16, 24, 32, 48, 64, 96, 128 steps
- Custom : saisir n’importe quel nombre

**Playback :**

- Play/Pause/Stop
- Loop activé par défaut
- Tempo : 40-300 BPM
- Swing/Shuffle : 0-75%

#### P-Locks (Parameter Locks)

Principe : modifier un paramètre synthé **uniquement pour un step donné**.

**Interface :**

- Sélectionner un step avec trig actif
- Panneau latéral “P-Locks” s’affiche
- Liste de tous les paramètres du synthé
- Clic sur paramètre → activer P-Lock
- Ajuster valeur avec knob virtuel

**Visualisation :**

- Petite icône sur le step (🔒)
- Couleur différente si P-Lock actif
- Hover → tooltip montrant les P-Locks

**Exemple d’usage :**

- Step 1 : Cutoff = 50
- Step 5 : Cutoff = 127 (P-Lock)
- Step 9 : Cutoff = 20 (P-Lock)
- Step 16 : Cutoff = 80 (P-Lock)

#### Automations avancées

**LFO assignables :**

- **Formes** : Sine, Triangle, Saw Up, Saw Down, Square, Random, Sample & Hold
- **Vitesse** : Hz ou sync (1/16, 1/8, 1/4, 1/2, 1 bar)
- **Phase** : 0-360°
- **Intensité** : -100% à +100%
- **Destination** : n’importe quel paramètre MIDI CC#

Interface :

- Bouton “+ LFO” dans panneau séquenceur
- Choisir destination (dropdown)
- Régler paramètres
- Visualisation de la forme d’onde

**Courbes dessinables :**

- Clic sur “Draw Automation”
- Canvas apparaît au-dessus du séquenceur
- Dessiner avec souris (linéaire, exponentielle, logarithmique)
- Outils : crayon, ligne, gomme
- Quantification : par step ou libre
- Appliquer à n’importe quel CC#

**Enveloppes multi-points :**

- Créer des enveloppes complexes
- Points éditables (glisser/déposer)
- Courbes Bézier entre points
- Présets : ADSR classique, pluck, pad, etc.

#### Contrôle MIDI CC# par step

**Par step :**

- Chaque step peut envoyer des CC# différents
- Jusqu’à 128 CC# modifiables
- Interface : tableau CC# avec sliders

**Vélocité :**

- 1-127 par step
- Randomisation : +/- X%
- Courbe de vélocité globale

#### Gammes musicales (Scales)

**Sélection de gamme :**

- Dropdown avec toutes les gammes :
  - **Majeures** : Major, Major Pentatonic
  - **Mineures** : Natural Minor, Harmonic Minor, Melodic Minor, Pentatonic Minor
  - **Modes** : Dorien, Phrygien, Lydien, Mixolydien, Locrien, Aeolien
  - **Exotiques** : Hirajoshi, Pelog, Whole Tone, Chromatic
  - **Jazz** : Bebop, Altered, Diminished
  - **Personnalisée** : sélectionner notes manuellement

**Note fondamentale :**

- Dropdown : C, C#, D, D#, E, F, F#, G, G#, A, A#, B
- Octave : -2 à +8

**Quantification automatique :**

- Les notes jouées/séquencées sont forcées dans la gamme
- Toggle on/off
- Utile pour éviter les fausses notes

**Affichage :**

- Clavier visuel montrant les notes de la gamme (en surbrillance)
- Piano roll coloré

#### Fonctionnalités avancées

**Randomisation :**

- **Euclidean Rhythms** : générer patterns mathématiques
  - Steps : 16
  - Hits : 7
  - Rotation : 0-15
- **Probabilité** : chaque step a X% de chance de jouer
- **Humanisation** : micro-variations timing/vélocité

**Mutations :**

- Rotate : décaler pattern de N steps
- Reverse : inverser pattern
- Double : doubler longueur en répétant
- Half : diviser par 2
- Invert : inverser vélocités (127 - v)

**Copier/Coller :**

- Entre steps
- Entre patterns
- Entre pistes
- Avec/sans P-Locks

### MODULE 6 : Timeline & Arrangement

#### Vue d’ensemble

Interface horizontale similaire à Logic Pro / Ableton :

- **Axe horizontal** : temps (mesures)
- **Axe vertical** : pistes (une par instrument)
- **Zoom** : molette (time) / +-keys (tracks)

#### Pistes (Tracks)

**Création :**

- Bouton “+ Piste”
- Assignment automatique à un instrument du setup
- Couleur personnalisable
- Nom éditable

**Contrôles par piste :**

- **M** : Mute
- **S** : Solo
- **R** : Record enable
- **Icon** : type d’instrument (affiche miniature)
- **Volume** : fader vertical
- **Pan** : knob

#### Patterns & Clips

**Pattern = séquence MIDI** de longueur définie (ex: 1-4 bars)

**Manipulation :**

- Drag & drop depuis banque de patterns
- Resize : bords du clip
- Loop : option pour répéter automatiquement
- Split : couper en deux
- Duplicate : copier instantanément

**Banque de patterns :**

- Sidebar avec tous les patterns sauvegardés
- Organisation :
  - Par dossier (Bass, Drums, Leads, etc.)
  - Par tag (#techno, #ambient, #120bpm)
- Search bar
- Preview audio en hover

**Actions :**

- Créer nouveau pattern : enregistrement ou dessin
- Sauvegarder pattern : donner nom + tags
- Charger pattern : glisser sur timeline
- Modifier pattern : double-clic → ouvre séquenceur

#### Automation Lanes

**Principe :** automations MIDI CC# affichées sous chaque piste

**Interface :**

- Bouton “A” sur piste → affiche/masque lane
- Dropdown : choisir quel CC# afficher
- Plusieurs lanes possibles simultanément

**Édition :**

- Dessin direct avec souris
- Points éditables (breakpoints)
- Courbes : linéaire, exponentiel, S-curve
- Copier/coller sections

**Visualisation :**

- Couleur différente par CC#
- Labels : “Cutoff”, “Resonance”, etc.
- Grille alignée sur mesures

#### Marqueurs (Markers)

**Types de marqueurs :**

- **Structure** : Intro, Verse, Chorus, Bridge, Drop, Break, Outro
- **Techniques** : Build-up, Fill, Transition
- **Personnalisés** : texte libre

**Affichage :**

- Bande supérieure de la timeline
- Couleur par type
- Texte visible
- Clic pour jump

**Édition :**

- Clic droit sur timeline → “Add Marker”
- Glisser pour déplacer
- Resize pour définir durée (sections)

#### Tempo & Time Signature

**Tempo master :**

- Affichage global (ex: 128 BPM)
- Automation de tempo possible
  - Ralentir progressivement
  - Breaks avec tempo réduit

**Time signature :**

- Default : 4/4
- Changements possibles (7/8, 5/4, etc.)
- Marqueurs visuels sur la grille

#### Grid & Snap

**Grid :**

- 1/4, 1/8, 1/16, 1/32, Triplets
- Adaptive zoom (affiche subdivision adaptée)

**Snap :**

- Toggle on/off
- Snap to grid
- Snap to markers
- Snap to other clips

### MODULE 7 : DawlessGPT - IA Intégrée

#### Architecture technique

**Communication :**

```
User → Chat UI → Backend → OpenAI API (GPT-4)
                    ↕
            Project State (JSON)
                    ↕
            Actions Engine → Update UI
```

**Project State = JSON complet** :

```json
{
  "tempo": 128,
  "time_signature": "4/4",
  "key": "Am",
  "instruments": [
    {
      "id": "synth_1",
      "type": "moog_sub37",
      "role": "bass",
      "parameters": {
        "cutoff": 74,
        "resonance": 45,
        ...
      }
    }
  ],
  "patterns": [...],
  "timeline": [...],
  "routing": [...]
}
```

#### Prompt système (interne)

```
Tu es DawlessGPT, l'assistant musical expert intégré dans DawlessStudio.

CONTEXTE :
- Tu es dans un environnement de création musicale Dawless virtuel
- L'utilisateur compose de la musique électronique
- Tu as un accès COMPLET en lecture/écriture au projet

ÉTAT DU PROJET ACTUEL :
{project_state_json}

CAPACITÉS D'ACTIONS :
Tu peux effectuer les actions suivantes (exemples) :
- set_parameter(instrument_id, parameter, value)
- create_pattern(instrument_id, notes, length)
- add_automation(track_id, cc_number, curve)
- suggest_chord_progression(key, mood)
- analyze_mix()
- route_cable(from, to, type)
[Liste complète des fonctions disponibles]

BASES DE CONNAISSANCES DISPONIBLES :
- Progressions d'accords par genre
- Tables de compatibilité harmonique
- Techniques de sound design par synthé
- Protocoles d'arrangement (structure de tracks)
- Standards de mixage

RÈGLES IMPORTANTES :
1. Toujours demander confirmation avant modification majeure
2. Expliquer tes choix musicaux (théorie, justification)
3. Être pédagogue et encourageant
4. Proposer des alternatives si demandé
5. Ne jamais dire "je ne peux pas" sans proposer solution alternative
6. Utiliser le jargon musical approprié mais expliquer si besoin

PERSONNALITÉ :
- Expert mais accessible
- Créatif et inspirant
- Patient et pédagogue
- Passion pour la musique électronique

Mission : Aider {user_name} à créer de la musique exceptionnelle.
```

#### Interface Chat

**Position :**

- Fenêtre flottante
- Toujours accessible (bouton en bas à droite)
- Draggable
- Resizable
- Collapsible (minimiser)

**Design :**

- Style messagerie moderne
- Bubbles : utilisateur (droite), IA (gauche)
- Avatar DawlessGPT (logo custom)
- Timestamp sur chaque message
- Typing indicator (“DawlessGPT is typing…”)

**Fonctionnalités :**

- Markdown support (gras, code, listes)
- Code blocks avec syntax highlighting
- Boutons d’action rapide générés par l’IA
  - Ex: [Appliquer cette progression] [Voir alternatives]
- Historique scrollable
- Search dans l’historique

#### Modes spécialisés

**1. Mode “Jam Buddy”**
Activé par : “Mode jam” ou détection auto

Comportements :

- Écoute en temps réel ce que l’utilisateur joue
- Suggère des variations/continuations
- “Cette mélodie est cool ! Tu veux que j’ajoute une contre-mélodie ?”
- Propose des accords qui fonctionnent

Actions typiques :

- `continue_melody(last_notes, style)`
- `add_counter_melody(existing_melody)`
- `suggest_harmonies(melody)`

**2. Mode “Mixing Engineer”**
Activé par : “Aide-moi à mixer” ou “analyse mon mix”

Comportements :

- Analyse spectrale du projet
- Détection de conflits de fréquences
- Suggestions de volumes/pan/EQ
- Comparaison avec références

Actions typiques :

- `analyze_frequency_conflicts()`
- `suggest_eq_settings(track_id)`
- `balance_levels()`
- `check_headroom()`

Exemple de réponse :

```
J'ai analysé ton mix. Voici ce que j'observe :

🔴 Problèmes détectés :
- La basse et le kick se battent autour de 80Hz
- Le lead manque de présence (trop de médiums)

💡 Suggestions :
1. Baisser les graves de la basse à 70Hz (-3dB)
2. Booster le kick à 60Hz (+2dB) pour plus de punch
3. Ajouter de l'air sur le lead à 8kHz (+2dB)

[Appliquer ces réglages] [Plus de détails]
```

**3. Mode “Sound Designer”**
Activé par : descriptions sonores

Exemples de requêtes :

- “Je veux un son de basse growl méchant”
- “Crée-moi un pad ambient éthéré”
- “Un lead acide qui déchire”

Comportements :

- Analyse la description (adjectifs, genre)
- Cherche dans base de descripteurs sonores
- Configure le synthé approprié

Base de descripteurs :

```json
{
  "growl": {
    "oscillators": ["saw", "square"],
    "filter_cutoff": "low_modulated",
    "resonance": "high",
    "lfo_rate": "fast",
    "distortion": true
  },
  "ethereal": {
    "oscillators": ["sine", "triangle"],
    "filter_cutoff": "high",
    "reverb": "large",
    "attack": "slow"
  }
}
```

**4. Mode “Sensei” (pédagogique)**
Activé par : questions théoriques ou “explique”

Comportements :

- Explications théoriques
- Analyse des choix de l’utilisateur
- Cours contextuels
- Défis créatifs

Exemples :

```
User: "Pourquoi cet accord fonctionne bien ici ?"

DawlessGPT: "Excellente question ! Tu es passé de Am à F, 
ce qui est une modulation vers le relatif majeur (VI degré). 
C'est très utilisé en musique pop/électronique car ça apporte 
de la luminosité tout en restant dans la même tonalité.

Des artistes comme Daft Punk utilisent souvent cette progression.

🎵 Degré en Am : i (Am) → VI (F) → iv (Dm) → V (E)
💡 Astuce
```