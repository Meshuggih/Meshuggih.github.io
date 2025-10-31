# 📐 DawlessStudio - Architecture Overview

> **Quick Reference for AI Coding Agents**

## 🎯 Mission Statement

Create the ultimate **Dawless virtual studio** for electronic music production with:

- Faithful hardware synthesizer clones
- Professional sequencer with P-Locks
- AI assistant (DawlessGPT) deeply integrated
- MIDI export for real hardware control
- Community sharing system

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACE                        │
│  (React + Canvas 2D + Timeline)                         │
└───────────┬─────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────┐
│                   STATE MANAGEMENT                       │
│  (Zustand stores: project, audio, ui, gpt)             │
└───────────┬─────────────────────────────────────────────┘
            │
    ┌───────┴────────┬─────────────┬──────────────┐
    │                │             │              │
┌───▼────┐  ┌───────▼──────┐  ┌──▼─────┐  ┌─────▼──────┐
│ CANVAS │  │ AUDIO ENGINE │  │SEQUENCE│  │ DawlessGPT │
│ SYSTEM │  │  (Tone.js)   │  │  ENGINE│  │    API     │
└────────┘  └──────────────┘  └────────┘  └────────────┘
     │             │                │             │
     └─────────────┴────────────────┴─────────────┘
                          │
                 ┌────────▼────────┐
                 │   PERSISTENCE   │
                 │ (MongoDB + S3)  │
                 └─────────────────┘
```

## 📦 Module Breakdown

### MODULE 1: Authentication & Onboarding

**Path:** `/src/features/auth`
**Tech:** Discord OAuth2, JWT
**Key Files:**

- `AuthProvider.tsx`
- `OnboardingWizard.tsx`
- `StudioSetup.tsx`

**API Endpoints:**

- `POST /api/auth/discord`
- `GET /api/auth/verify`

### MODULE 2: Canvas Workspace

**Path:** `/src/features/canvas`
**Tech:** HTML5 Canvas, OffscreenCanvas
**Key Files:**

- `CanvasEngine.ts` - Core rendering
- `InstrumentRenderer.ts` - Draw hardware
- `CableSystem.ts` - Routing visuals
- `InteractionManager.ts` - Click/drag handling

**Performance Target:** 60 FPS with 20+ instruments

### MODULE 3: Routing/Patching System

**Path:** `/src/features/routing`
**Key Files:**

- `RoutingEngine.ts` - Cable logic
- `MIDIRouter.ts` - MIDI connections
- `AudioRouter.ts` - Audio connections
- `ValidationEngine.ts` - Connection rules

**Data Structure:**

```typescript
interface Cable {
  id: string;
  type: 'midi' | 'audio' | 'cv';
  from: { instrumentId: string; port: string };
  to: { instrumentId: string; port: string };
  midiChannel?: 1-16;
}
```

### MODULE 4: Hardware Library

**Path:** `/src/features/hardware`
**Data Path:** `/data/hardware/`

**Structure:**

```
/data/hardware/
  /synths/
    /moog/
      sub37.json          # Spec file
      sub37_manual.pdf    # User manual
      sub37_front.png     # Visual asset
  /drums/
    /roland/
      tr808.json
  /effects/
    /eventide/
      h9.json
```

**Spec Schema:** (see HARDWARE-SPEC.md)

### MODULE 5: Sequencer Engine

**Path:** `/src/features/sequencer`
**Key Files:**

- `SequencerEngine.ts` - Core sequencer
- `PatternManager.ts` - Pattern CRUD
- `PLockSystem.ts` - Parameter locks
- `AutomationEngine.ts` - LFO/curves
- `ScaleSystem.ts` - Musical scales

**Features:**

- Variable length (16-128 steps)
- Per-step: note, velocity, probability, P-Locks
- Global: tempo, swing, time signature
- Automations: LFO, drawable curves, envelopes

### MODULE 6: Timeline & Arrangement

**Path:** `/src/features/timeline`
**Key Files:**

- `TimelineEngine.ts`
- `TrackManager.ts`
- `PatternLibrary.ts`
- `MarkerSystem.ts`

**UI Paradigm:** Horizontal DAW-style view

### MODULE 7: DawlessGPT Integration

**Path:** `/src/features/ai`
**Tech:** OpenAI API (GPT-4), streaming responses

**Key Files:**

- `GPTService.ts` - API communication
- `ActionExecutor.ts` - Execute AI actions
- `PromptBuilder.ts` - Build system prompts
- `KnowledgeBase.ts` - Chord progressions, techniques

**Action Examples:**

```typescript
interface GPTAction {
  type: 'set_parameter' | 'create_pattern' | 'suggest_chords';
  parameters: Record<string, any>;
  requiresConfirmation: boolean;
}
```

**Security:**

- ✅ Conversations encrypted in DB
- ✅ No logging of GPT history
- ✅ User can delete history anytime

### MODULE 8: Export System

**Path:** `/src/features/export`
**Key Files:**

- `MIDIExporter.ts` - .mid file generation
- `AudioExporter.ts` - Stems rendering
- `ProjectEncoder.ts` - Clipboard sharing
- `PresetManager.ts` - Synth preset sharing

## 🔧 Technology Stack

### Frontend

- **Framework:** React 18 + TypeScript
- **State:** Zustand (with slices)
- **Styling:** TailwindCSS + CSS Modules
- **Canvas:** HTML5 Canvas API
- **Audio:** Tone.js + Web Audio API
- **MIDI:** Web MIDI API

### Backend

- **Runtime:** Node.js (Express)
- **Database:** MongoDB (projects), PostgreSQL (users, hardware specs)
- **Storage:** AWS S3 (manuals, audio samples)
- **Auth:** Discord OAuth2 + JWT
- **AI:** OpenAI API

### DevOps

- **Hosting:** Vercel (frontend), Railway (backend)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (errors), LogRocket (sessions)

## 📁 Repository Structure

```
dawless-studio/
├── src/
│   ├── features/          # Feature modules
│   │   ├── auth/
│   │   ├── canvas/
│   │   ├── routing/
│   │   ├── hardware/
│   │   ├── sequencer/
│   │   ├── timeline/
│   │   ├── ai/
│   │   └── export/
│   ├── core/              # Core utilities
│   │   ├── audio/         # Audio engine
│   │   ├── midi/          # MIDI utilities
│   │   └── types/         # TypeScript definitions
│   ├── components/        # Shared UI components
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # Zustand stores
│   └── utils/             # Helper functions
├── data/                  # Static data
│   ├── hardware/          # Hardware specs
│   ├── scales/            # Musical scales
│   ├── chords/            # Chord progressions
│   └── prompts/           # GPT system prompts
├── docs/                  # Documentation
│   ├── OVERVIEW.md        # This file
│   ├── ARCHITECTURE.md    # Detailed architecture
│   ├── HARDWARE-SPEC.md   # Hardware JSON schema
│   ├── API.md             # Backend API docs
│   └── SEQUENCER.md       # Sequencer deep dive
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── README.md              # Public (minimal)
├── AGENTS.md              # AI coding rules
└── package.json
```

## 🚀 Development Phases

### Phase 0: Foundation (Current)

- [x] README_1.md vision
- [x] AGENTS.md rules
- [ ] Complete documentation suite
- [ ] Repository structure
- [ ] Dev environment setup

### Phase 1: MVP (Generic Hardware)

**Goal:** Functional studio with generic instruments

1. Authentication + Onboarding
1. Canvas system (drag/drop)
1. Generic synth (chord, lead, bass)
1. Generic drum machine (909-style)
1. Basic sequencer (16 steps, no P-Locks)
1. Simple MIDI export

**Timeline:** 4-6 weeks

### Phase 2: Sequencer Power

1. P-Locks system
1. Automations (LFO, curves)
1. Variable lengths
1. Scales & quantization
1. Pattern library

**Timeline:** 3-4 weeks

### Phase 3: Real Hardware Clones

1. TB-303 clone (first priority)
1. TR-808 clone
1. Moog Sub37 clone
1. MIDI CC# mapping system
1. PDF manual viewer

**Timeline:** Ongoing (1 instrument/week)

### Phase 4: DawlessGPT Integration

1. GPT-4 API integration
1. Action execution system
1. Knowledge bases
1. Specialized modes
1. Chat UI

**Timeline:** 4-5 weeks

### Phase 5: Timeline & Arrangement

1. DAW-style timeline
1. Pattern clips
1. Automation lanes
1. Markers

**Timeline:** 3-4 weeks

### Phase 6: Polish & Export

1. Audio export (stems)
1. Project sharing (clipboard)
1. Hardware MIDI control
1. Performance optimization

**Timeline:** 2-3 weeks

## 🎯 Critical Success Factors

1. **Performance**
- Canvas: 60 FPS minimum
- Audio: <20ms latency
- Load time: <3s
1. **Fidelity**
- Hardware clones: pixel-perfect UI
- MIDI mappings: 100% accurate
- DSP: authentic sound
1. **UX**
- Intuitive for beginners
- Powerful for pros
- DawlessGPT feels natural
1. **Security**
- Discord-only access
- GPT conversations private
- No data leaks

## 📖 Next Steps for AI Agents

**Before coding, read:**

1. This file (OVERVIEW.md) ✅
1. AGENTS.md - Technical rules
1. ARCHITECTURE.md - Deep dive
1. Module-specific docs in `/docs`

**Then:**

1. Check current phase in GitHub Projects
1. Pick an unassigned task
1. Read relevant module docs
1. Follow conventions in AGENTS.md
1. Write tests first (TDD)
1. Submit PR with clear description

**Questions?**

- Check `/docs` folder first
- Search GitHub issues
- Ask on Discord #dawless-dev
- Tag @Meshuggih if urgent

-----

**Version:** 1.0.0  
**Last Updated:** 2025-10-31  
**Status:** Foundation Phase