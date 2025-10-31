# 🤖 AGENTS.md - Instructions pour IA codeuses

> **Audience :** Ce document s’adresse aux agents IA (GPT-4, Claude, Copilot, etc.) travaillant sur le dépôt DawlessStudio.

-----

## ⚠️ AXIOMES FONDAMENTAUX - À RESPECTER ABSOLUMENT

### 1. **NE JAMAIS dévier de la vision décrite dans README.md**

- Chaque feature doit servir l’expérience utilisateur décrite
- En cas de doute, demander confirmation avant d’implémenter
- Ne pas ajouter de features non spécifiées sans accord explicite

### 2. **FIDÉLITÉ HARDWARE est CRITIQUE**

- Les clones de synthés doivent être **pixel-perfect** visuellement
- Les mappings MIDI CC# doivent être **identiques** au hardware réel
- Utiliser les tables MIDI fournies dans `/data/hardware/`
- Ne jamais inventer de mappings, toujours vérifier les manuels

### 3. **PERFORMANCE est NON-NÉGOCIABLE**

- Canvas 2D doit tourner à 60 FPS minimum
- Audio latency < 20ms
- Temps de chargement < 3s
- Optimiser avant d’ajouter des features

### 4. **CONFIDENTIALITÉ GPT absolue**

- L’historique DawlessGPT ne doit **JAMAIS** être exporté
- Chiffrement obligatoire en base de données
- Pas de logs des conversations
- Option de suppression accessible facilement

### 5. **CODE QUALITY > SPEED**

- Préférer du code propre et maintenable
- Tests unitaires **obligatoires** pour toute nouvelle feature
- Documentation inline pour logique complexe
- TypeScript strict mode activé

-----

## 📐 ARCHITECTURE TECHNIQUE - RÈGLES

### Frontend (React + TypeScript)

**Structure de composants :**

```
✅ CORRECT :
- Composants fonctionnels avec hooks
- Props typées avec interfaces TypeScript
- Pas de logique métier dans les composants (utiliser hooks custom)
- Memoization (React.memo, useMemo) pour perfs

❌ INTERDIT :
- Class components
- Any type (sauf cas extrêmes documentés)
- Logique inline complexe dans JSX
- Appels API directs dans composants
```

**State Management :**

```typescript
// ✅ Utiliser Zustand avec slices séparés
import create from 'zustand';

interface ProjectState {
  tempo: number;
  instruments: Instrument[];
  setTempo: (tempo: number) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  tempo: 120,
  instruments: [],
  setTempo: (tempo) => set({ tempo }),
}));

// ❌ NE PAS mélanger les concerns
// Pas de logique audio dans le store de projet
// Pas de logique UI dans le store audio
```

**Naming conventions :**

```typescript
// ✅ CORRECT
interface SynthParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
}

const handleParameterChange = (param: string, value: number) => {...}

// ❌ INTERDIT
interface synthparam { ... }  // PascalCase obligatoire pour interfaces
const HandleParameterChange = () => {...}  // camelCase pour fonctions
```

### Canvas & Audio Engine

**Canvas 2D :**

```typescript
// ✅ Utiliser OffscreenCanvas quand possible
const canvas = document.createElement('canvas');
const offscreen = canvas.transferControlToOffscreen();

// ✅ Batch les draw calls
const drawInstruments = (ctx: CanvasRenderingContext2D, instruments: Instrument[]) => {
  ctx.save();
  instruments.forEach(inst => drawInstrument(ctx, inst));
  ctx.restore();
};

// ❌ NE PAS redessiner tout le canvas à chaque frame
// Utiliser layers et dirty rectangles
```

**Audio (Tone.js) :**

```typescript
// ✅ Initialiser audio context au premier user interaction
const initAudio = async () => {
  await Tone.start();
  console.log('Audio context started');
};

// ✅ Cleanup proper des nodes audio
useEffect(() => {
  const synth = new Tone.Synth().toDestination();
  return () => {
    synth.dispose();
  };
}, []);

// ❌ NE JAMAIS oublier de dispose() les nodes audio
// Risque de memory leaks
```

**DSP Custom :**

```typescript
// ✅ Utiliser AudioWorklet pour DSP complexe
class MoogFilterProcessor extends AudioWorkletProcessor {
  process(inputs: Float32Array[][], outputs: Float32Array[][]) {
    // Algorithme Moog ladder filter
    // ...
    return true;
  }
}

// ❌ Éviter ScriptProcessorNode (deprecated)
```

### Backend (Node.js + Express)

**Structure des routes :**

```typescript
// ✅ Router modulaire
// routes/projects.ts
import express from 'express';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getProjects);
router.post('/', auth, createProject);

// ❌ Pas de routes dans server.ts
// ❌ Pas de logique métier dans les routes (utiliser services)
```

**Services pattern :**

```typescript
// ✅ services/projectService.ts
export class ProjectService {
  async createProject(userId: string, data: ProjectData): Promise<Project> {
    // Validation
    // Business logic
    // Database save
    return project;
  }
}

// ❌ NE PAS mettre la logique métier dans les controllers
```

**Error handling :**

```typescript
// ✅ Custom error classes
export class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ✅ Middleware error handler global
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ❌ NE PAS utiliser throw dans async sans try/catch
// Utiliser async error wrapper
```

### DawlessGPT Integration

**Prompt engineering :**

```typescript
// ✅ Structure du prompt système
const buildSystemPrompt = (projectState: ProjectState): string => {
  return `
Tu es DawlessGPT, assistant musical de DawlessStudio.

PROJET ACTUEL :
${JSON.stringify(projectState, null, 2)}

ACTIONS DISPONIBLES :
${getAvailableActions()}

BASES DE CONNAISSANCES :
- Progressions d'accords : ${chordProgressionsDB}
- Techniques de production : ${productionTechniquesDB}

RÈGLES :
1. Toujours demander confirmation avant modification majeure
2. Expliquer les choix musicaux (théorie)
3. Être pédagogue et encourageant
  `.trim();
};

// ❌ NE PAS hardcoder le prompt dans le code
// Utiliser des templates dans /data/prompts/
```

**Actions handling :**

```typescript
// ✅ Actions typées et validées
interface GPTAction {
  type: string;
  parameters: Record<string, any>;
}

const executeAction = async (action: GPTAction): Promise<ActionResult> => {
  // Validation du schema
  const validated = actionSchema.parse(action);
  
  // Confirmation utilisateur si nécessaire
  if (requiresConfirmation(action.type)) {
    await requestUserConfirmation(action);
  }
  
  // Exécution
  return await actionHandlers[action.type](validated.parameters);
};

// ❌ NE PAS exécuter d'actions GPT sans validation
// ❌ NE PAS logger les conversations GPT
```

### Base de données

**PostgreSQL (données structurées) :**

```sql
-- ✅ Tables normalisées
CREATE TABLE hardware_specs (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  manufacturer VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  midi_mappings JSONB NOT NULL,
  manual_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ✅ Index sur colonnes fréquemment cherchées
CREATE INDEX idx_hardware_type ON hardware_specs(type);
CREATE INDEX idx_hardware_manufacturer ON hardware_specs(manufacturer);

-- ❌ Ne pas stocker de BLOB (utiliser S3)
-- ❌ Ne pas utiliser SELECT * (lister les colonnes)
```

**MongoDB (projets flexibles) :**

```typescript
// ✅ Schema validation
const projectSchema = new Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  tempo: { type: Number, min: 40, max: 300 },
  instruments: [instrumentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ✅ Indexes pour queries fréquentes
projectSchema.index({ userId: 1, createdAt: -1 });

// ❌ Ne pas stocker l'historique GPT en clair
// Utiliser chiffrement côté application
```

-----

## 🎨 UI/UX - GUIDELINES

### Design System

**Couleurs :**

```typescript
// ✅ Utiliser les variables CSS
const colors = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  background: 'var(--color-bg)',
  text: 'var(--color-text)',
};

// ❌ NE PAS hardcoder les couleurs hex
// ❌ backgroundColor: '#1a1a1a'  // INTERDIT
```

**Spacing :**

```typescript
// ✅ Utiliser le système de spacing (multiples de 4px)
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

// ❌ Pas de valeurs arbitraires
// ❌ padding: '13px'  // INTERDIT
```

**Animations :**

```typescript
// ✅ Performance-friendly (transform, opacity)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ❌ Éviter d'animer width, height, top, left
// Utiliser transform à la place
```

### Accessibilité

```tsx
// ✅ ARIA labels obligatoires
<button
  aria-label="Play sequence"
  onClick={handlePlay}
>
  <PlayIcon />
</button>

// ✅ Keyboard navigation
<div
  role="slider"
  tabIndex={0}
  aria-valuemin={0}
  aria-valuemax={127}
  aria-valuenow={value}
  onKeyDown={handleKeyDown}
/>

// ❌ Pas de divs cliquables sans role
// ❌ <div onClick={...}> // INTERDIT sans role
```

-----

## 🔒 SÉCURITÉ

### Authentification

```typescript
// ✅ Vérifier le token à chaque requête
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ❌ NE JAMAIS exposer JWT_SECRET dans le code
// ❌ NE JAMAIS commit de .env
```

### Validation des entrées

```typescript
// ✅ Utiliser Zod pour validation
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  tempo: z.number().min(40).max(300),
  instruments: z.array(instrumentSchema),
});

const createProject = async (req, res) => {
  const validated = projectSchema.parse(req.body);
  // ...
};

// ❌ NE JAMAIS faire confiance aux inputs utilisateur
// ❌ NE PAS utiliser eval() ou Function() avec user input
```

### API Keys

```typescript
// ✅ Variables d'environnement
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ✅ Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests max
});

app.use('/api/', limiter);

// ❌ NE JAMAIS exposer les API keys côté client
// ❌ NE JAMAIS commit de clés dans le repo
```

-----

## 🧪 TESTING

### Tests unitaires (Jest)

```typescript
// ✅ Tester chaque fonction critique
describe('MIDINoteConverter', () => {
  it('should convert MIDI note to frequency', () => {
    expect(midiToFrequency(69)).toBe(440); // A4
    expect(midiToFrequency(60)).toBe(261.63); // C4
  });
  
  it('should handle edge cases', () => {
    expect(midiToFrequency(0)).toBe(8.18); // C-1
    expect(midiToFrequency(127)).toBe(12543.85); // G9
  });
});

// ❌ Pas de tests qui dépendent d'API externes
// Utiliser des mocks
```

### Tests d’intégration

```typescript
// ✅ Tester les flows complets
describe('Project Creation Flow', () => {
  it('should create project with instruments', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        name: 'Test Project',
        tempo: 128,
        instruments: [mockInstrument],
      });
    
    expect(response.status).toBe(201);
    expect(response.body.project.name).toBe('Test Project');
  });
});
```

### Coverage minimum

```bash
# ✅ Objectifs de coverage
Statements   : 80%
Branches     : 75%
Functions    : 80%
Lines        : 80%

# ❌ Ne pas merge de PR avec coverage < 70%
```

-----

## 📦 DÉPLOIEMENT

### CI/CD Pipeline

```yaml
# ✅ .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - run: npm run lint
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      - run: vercel --prod

# ❌ Ne jamais déployer sans tests qui passent
```

### Environment variables

```bash
# ✅ .env.example (commit ce fichier)
NODE_ENV=development
DATABASE_URL=
OPENAI_API_KEY=
JWT_SECRET=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# ❌ .env (NE PAS COMMIT)
# Contient les vraies valeurs
```

-----

## 🐛 DEBUGGING

### Logging

```typescript
// ✅ Structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

logger.info('Project created', { projectId, userId });

// ❌ Pas de console.log en production
// ❌ Ne jamais logger de tokens, passwords, ou données sensibles
```

### Error tracking

```typescript
// ✅ Intégrer Sentry
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// ❌ Ne pas exposer les stack traces complètes en prod
```

-----

## 📝 DOCUMENTATION

### Code comments

```typescript
// ✅ Documenter le "pourquoi", pas le "quoi"
/**
 * Applique le filtre Moog ladder 4-pole.
 * 
 * Utilise l'algorithme de Huovilainen (2004) pour une émulation
 * fidèle du filtre analogique original.
 * 
 * @param input - Signal d'entrée
 * @param cutoff - Fréquence de coupure (20-20000 Hz)
 * @param resonance - Résonance (0-1, au-delà self-oscillation)
 */
const moogFilter = (input: number, cutoff: number, resonance: number): number => {
  // ...
};

// ❌ Pas de commentaires évidents
// ❌ // Incrémente i de 1
// ❌ i++;
```

### Commit messages

```bash
# ✅ Format: type(scope): description
feat(sequencer): add p-lock functionality
fix(audio): resolve latency issue in Safari
docs(readme): update installation instructions
refactor(canvas): optimize rendering performance

# ❌ Messages vagues interdits
# ❌ "fix stuff"
# ❌ "updates"
# ❌ "WIP"
```

-----

## 🚨 ERREURS COURANTES À ÉVITER

### 1. Performance

```typescript
// ❌ INTERDIT - Re-render à chaque frame
const Component = () => {
  const [value, setValue] = useState(0);
  
  requestAnimationFrame(() => {
    setValue(v => v + 1); // CAUSE INFINITE LOOP
  });
};

// ✅ CORRECT - Utiliser refs
const Component = () => {
  const frameRef = useRef<number>();
  
  useEffect(() => {
    const animate = () => {
      // Update canvas, pas de state
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameRef.current!);
  }, []);
};
```

### 2. Memory leaks

```typescript
// ❌ INTERDIT - Event listeners non nettoyés
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // Manque le cleanup !
}, []);

// ✅ CORRECT
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### 3. Audio context

```typescript
// ❌ INTERDIT - Créer multiple contexts
const Synth1 = () => {
  const synth = new Tone.Synth(); // Crée un nouveau context
};
const Synth2 = () => {
  const synth = new Tone.Synth(); // Crée ENCORE un context
};

// ✅ CORRECT - Context unique global
// Initialiser Tone une seule fois
await Tone.start();
// Tous les instruments utilisent le même context
```

### 4. Type safety

```typescript
// ❌ INTERDIT
const processData = (data: any) => { // any est interdit !
  return data.value.toFixed(2);
};

// ✅ CORRECT
interface DataPoint {
  value: number;
  timestamp: number;
}

const processData = (data: DataPoint): string => {
  return data.value.toFixed(2);
};
```

-----

## ✅ CHECKLIST AVANT CHAQUE PR

Avant de soumettre une Pull Request, vérifier :

- [ ] Tous les tests passent (`npm test`)
- [ ] Pas d’erreurs ESLint (`npm run lint`)
- [ ] TypeScript compile sans erreur (`npm run type-check`)
- [ ] Code coverage > 70%
- [ ] Documentation mise à jour si nécessaire
- [ ] Pas de `console.log` oubliés
- [ ] Pas de TODOs non résolus critiques
- [ ] Performance testée (FPS, latence audio)
- [ ] Accessibilité vérifiée (keyboard navigation, ARIA)
- [ ] Testé sur Chrome, Firefox, Safari
- [ ] Pas de secrets/tokens dans le code
- [ ] Commit messages suivent la convention
- [ ] Code review demandée

-----

## 🎓 RESSOURCES

**Documentation officielle :**

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tone.js](https://tonejs.github.io/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API)

**Références audio :**

- [The Audio Programmer](https://www.youtube.com/@TheAudioProgrammer)
- [Sound On Sound - Synth Secrets](https://www.soundonsound.com/series/synth-secrets-sound-sound)

**MIDI specs :**

- [MIDI 1.0 Specification](https://www.midi.org/specifications)
- [MIDI CC List](https://www.midi.org/specifications-old/item/table-3-control-change-messages-data-bytes-2)

-----

## 🆘 EN CAS DE DOUTE

**Hiérarchie de décision :**

1. **Vérifier README.md** - La vision y est décrite
1. **Consulter ce fichier (AGENTS.md)** - Les règles techniques
1. **Chercher dans les issues GitHub** - Peut-être déjà discuté
1. **Demander sur Discord #dawless-dev** - La communauté peut aider
1. **Contacter Meshuggih directement** - En dernier recours

**Principe de précaution :**

> En cas de doute sur une implémentation, toujours privilégier la solution la plus simple et maintenable, même si elle est moins “fancy”.

-----

## 📞 CONTACT

**Lead Developer :** Meshuggih
**Discord :** `#dawless-dev` channel
**Repository :** github.com/les-sondiers/dawless-studio (private)

-----

**Ce document est vivant.** Il doit être mis à jour régulièrement au fil du projet. Toute IA travaillant sur ce repo DOIT le lire entièrement avant de contribuer.

**Version :** 1.0.0  
**Dernière mise à jour :** 2025-10-31