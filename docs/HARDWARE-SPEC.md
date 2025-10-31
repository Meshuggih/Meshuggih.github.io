# 🎹 Hardware Specification Format

## Overview

Each hardware instrument is defined by a JSON file following this specification. This ensures consistency across all clones and enables automated rendering, MIDI mapping, and manual integration.

## File Naming Convention

```
/data/hardware/{category}/{manufacturer}/{model_id}.json
```

**Examples:**

- `/data/hardware/synths/moog/sub37.json`
- `/data/hardware/drums/roland/tr808.json`
- `/data/hardware/effects/eventide/h9.json`

## JSON Schema

### Complete Example: Moog Subsequent 37

```json
{
  "$schema": "https://dawless.studio/schemas/hardware-v1.json",
  "id": "moog_sub37",
  "version": "1.0.0",
  "metadata": {
    "name": "Moog Subsequent 37",
    "manufacturer": "Moog Music",
    "year": 2016,
    "category": "synth",
    "subcategory": "monophonic",
    "tags": ["bass", "lead", "analog", "paraphonic"],
    "description": "Analog paraphonic synthesizer with dual oscillators and Moog ladder filter",
    "website": "https://www.moogmusic.com/products/subsequent-37",
    "manual_url": "/manuals/moog_sub37.pdf",
    "price_usd": 1499
  },
  "specifications": {
    "architecture": "analog",
    "polyphony": 2,
    "voiceMode": "paraphonic",
    "oscillators": 2,
    "lfo": 2,
    "envelopes": 2,
    "filterType": "ladder_24db",
    "filterSlope": "24dB/oct",
    "midiChannels": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    "dimensions": {
      "width_mm": 546,
      "depth_mm": 279,
      "height_mm": 102,
      "weight_kg": 5.8
    },
    "connectivity": {
      "midi": ["din5_in", "din5_out", "din5_thru", "usb"],
      "audio": ["jack_ts_out_left", "jack_ts_out_right", "headphone"],
      "cv": ["cv_in", "gate_in"],
      "other": []
    }
  },
  "visuals": {
    "dimensions": {
      "canvas_width": 800,
      "canvas_height": 400
    },
    "images": {
      "front": "/images/hardware/moog_sub37_front.png",
      "back": "/images/hardware/moog_sub37_back.png",
      "top": "/images/hardware/moog_sub37_top.png",
      "angled": "/images/hardware/moog_sub37_angled.png"
    },
    "colors": {
      "primary": "#1a1a1a",
      "secondary": "#d4af37",
      "accent": "#ff4500",
      "panel": "#2a2a2a",
      "text": "#ffffff"
    }
  },
  "controls": [
    {
      "id": "osc1_octave",
      "type": "rotary_switch",
      "label": "OSC 1 OCTAVE",
      "position": { "x": 50, "y": 100 },
      "size": { "width": 40, "height": 40 },
      "parameter": "osc1_octave",
      "values": ["32'", "16'", "8'", "4'", "2'"],
      "default": "8'",
      "midiCC": null,
      "tooltip": "Oscillator 1 octave range"
    },
    {
      "id": "osc1_waveform",
      "type": "rotary_switch",
      "label": "OSC 1 WAVE",
      "position": { "x": 100, "y": 100 },
      "size": { "width": 40, "height": 40 },
      "parameter": "osc1_waveform",
      "values": ["triangle", "saw_triangle", "sawtooth", "square", "pulse"],
      "default": "sawtooth",
      "midiCC": null,
      "tooltip": "Oscillator 1 waveform"
    },
    {
      "id": "filter_cutoff",
      "type": "knob",
      "label": "CUTOFF",
      "position": { "x": 400, "y": 150 },
      "size": { "width": 50, "height": 50 },
      "parameter": "filter_cutoff",
      "range": { "min": 0, "max": 127 },
      "default": 64,
      "midiCC": 74,
      "unit": "none",
      "curve": "linear",
      "tooltip": "Filter cutoff frequency"
    },
    {
      "id": "filter_resonance",
      "type": "knob",
      "label": "RESONANCE",
      "position": { "x": 460, "y": 150 },
      "size": { "width": 50, "height": 50 },
      "parameter": "filter_resonance",
      "range": { "min": 0, "max": 127 },
      "default": 0,
      "midiCC": 71,
      "unit": "none",
      "curve": "linear",
      "tooltip": "Filter resonance (Q factor)"
    },
    {
      "id": "attack",
      "type": "fader",
      "label": "ATTACK",
      "position": { "x": 600, "y": 120 },
      "size": { "width": 30, "height": 100 },
      "parameter": "envelope_attack",
      "range": { "min": 0, "max": 127 },
      "default": 0,
      "midiCC": 70,
      "unit": "ms",
      "curve": "exponential",
      "tooltip": "Envelope attack time"
    },
    {
      "id": "glide",
      "type": "knob",
      "label": "GLIDE",
      "position": { "x": 200, "y": 200 },
      "size": { "width": 40, "height": 40 },
      "parameter": "glide",
      "range": { "min": 0, "max": 127 },
      "default": 0,
      "midiCC": 5,
      "unit": "ms",
      "curve": "exponential",
      "tooltip": "Portamento/glide time"
    },
    {
      "id": "sub_osc_level",
      "type": "knob",
      "label": "SUB OSC",
      "position": { "x": 150, "y": 150 },
      "size": { "width": 40, "height": 40 },
      "parameter": "sub_osc_level",
      "range": { "min": 0, "max": 127 },
      "default": 0,
      "midiCC": 18,
      "unit": "none",
      "curve": "linear",
      "tooltip": "Sub-oscillator level"
    },
    {
      "id": "mod_wheel",
      "type": "wheel",
      "label": "MOD",
      "position": { "x": 20, "y": 100 },
      "size": { "width": 20, "height": 80 },
      "parameter": "mod_wheel",
      "range": { "min": 0, "max": 127 },
      "default": 0,
      "midiCC": 1,
      "unit": "none",
      "curve": "linear",
      "tooltip": "Modulation wheel"
    }
  ],
  "ports": [
    {
      "id": "midi_in",
      "type": "midi",
      "direction": "in",
      "standard": "din5",
      "position": { "x": 50, "y": 380 },
      "label": "MIDI IN"
    },
    {
      "id": "midi_out",
      "type": "midi",
      "direction": "out",
      "standard": "din5",
      "position": { "x": 100, "y": 380 },
      "label": "MIDI OUT"
    },
    {
      "id": "midi_thru",
      "type": "midi",
      "direction": "thru",
      "standard": "din5",
      "position": { "x": 150, "y": 380 },
      "label": "MIDI THRU"
    },
    {
      "id": "audio_out_left",
      "type": "audio",
      "direction": "out",
      "standard": "jack_ts",
      "position": { "x": 650, "y": 380 },
      "label": "OUT L"
    },
    {
      "id": "audio_out_right",
      "type": "audio",
      "direction": "out",
      "standard": "jack_ts",
      "position": { "x": 700, "y": 380 },
      "label": "OUT R"
    },
    {
      "id": "cv_in",
      "type": "cv",
      "direction": "in",
      "standard": "jack_ts",
      "position": { "x": 250, "y": 380 },
      "label": "CV IN"
    }
  ],
  "parameters": {
    "osc1_octave": {
      "name": "Oscillator 1 Octave",
      "type": "discrete",
      "values": ["32'", "16'", "8'", "4'", "2'"],
      "default": "8'",
      "description": "Sets the octave range for oscillator 1"
    },
    "osc1_waveform": {
      "name": "Oscillator 1 Waveform",
      "type": "discrete",
      "values": ["triangle", "saw_triangle", "sawtooth", "square", "pulse"],
      "default": "sawtooth",
      "description": "Selects the waveform for oscillator 1"
    },
    "filter_cutoff": {
      "name": "Filter Cutoff",
      "type": "continuous",
      "range": { "min": 20, "max": 20000 },
      "default": 1000,
      "unit": "Hz",
      "curve": "exponential",
      "description": "Controls the filter cutoff frequency"
    },
    "filter_resonance": {
      "name": "Filter Resonance",
      "type": "continuous",
      "range": { "min": 0, "max": 30 },
      "default": 1,
      "unit": "Q",
      "curve": "linear",
      "description": "Controls the filter resonance (emphasis at cutoff frequency)"
    },
    "envelope_attack": {
      "name": "Envelope Attack",
      "type": "continuous",
      "range": { "min": 0, "max": 10000 },
      "default": 1,
      "unit": "ms",
      "curve": "exponential",
      "description": "Attack time of the amplitude envelope"
    }
  },
  "midi": {
    "receiveChannels": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    "transmitChannels": [1],
    "ccMappings": {
      "1": { "parameter": "mod_wheel", "label": "Mod Wheel" },
      "5": { "parameter": "glide", "label": "Portamento Time" },
      "18": { "parameter": "sub_osc_level", "label": "Sub Osc Level" },
      "70": { "parameter": "envelope_attack", "label": "VCF Attack" },
      "71": { "parameter": "filter_resonance", "label": "VCF Resonance" },
      "74": { "parameter": "filter_cutoff", "label": "VCF Cutoff" }
    },
    "nrpnMappings": {},
    "sysexFormat": "f0 04 {device_id} ... f7"
  },
  "audio": {
    "dsp": {
      "engine": "tone.js",
      "customProcessor": null,
      "oscillators": [
        {
          "id": "osc1",
          "type": "Oscillator",
          "config": {
            "type": "sawtooth",
            "frequency": 440
          }
        },
        {
          "id": "osc2",
          "type": "Oscillator",
          "config": {
            "type": "sawtooth",
            "frequency": 440,
            "detune": 0
          }
        },
        {
          "id": "sub_osc",
          "type": "Oscillator",
          "config": {
            "type": "square",
            "frequency": 220
          }
        }
      ],
      "filters": [
        {
          "id": "main_filter",
          "type": "MoogLadderFilter",
          "config": {
            "frequency": 1000,
            "resonance": 1,
            "rolloff": -24
          }
        }
      ],
      "envelopes": [
        {
          "id": "filter_env",
          "type": "Envelope",
          "config": {
            "attack": 0.001,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 0.1
          }
        },
        {
          "id": "amp_env",
          "type": "Envelope",
          "config": {
            "attack": 0.001,
            "decay": 0.1,
            "sustain": 0.7,
            "release": 0.3
          }
        }
      ],
      "lfos": [
        {
          "id": "lfo1",
          "type": "LFO",
          "config": {
            "frequency": 4,
            "type": "sine"
          }
        }
      ]
    }
  },
  "presets": [
    {
      "id": "default",
      "name": "Init Patch",
      "parameters": {
        "osc1_octave": "8'",
        "osc1_waveform": "sawtooth",
        "filter_cutoff": 64,
        "filter_resonance": 0,
        "envelope_attack": 0
      }
    },
    {
      "id": "fat_bass",
      "name": "Fat Bass",
      "parameters": {
        "osc1_octave": "16'",
        "osc1_waveform": "sawtooth",
        "sub_osc_level": 80,
        "filter_cutoff": 40,
        "filter_resonance": 60,
        "envelope_attack": 1
      }
    }
  ]
}
```

## Field Descriptions

### Top-Level Fields

|Field           |Type  |Required|Description                   |
|----------------|------|--------|------------------------------|
|`$schema`       |string|Yes     |Schema version URL            |
|`id`            |string|Yes     |Unique identifier (snake_case)|
|`version`       |string|Yes     |Spec version (semver)         |
|`metadata`      |object|Yes     |General information           |
|`specifications`|object|Yes     |Technical specs               |
|`visuals`       |object|Yes     |Rendering data                |
|`controls`      |array |Yes     |UI controls                   |
|`ports`         |array |Yes     |I/O connectors                |
|`parameters`    |object|Yes     |Parameter definitions         |
|`midi`          |object|Yes     |MIDI configuration            |
|`audio`         |object|Yes     |DSP configuration             |
|`presets`       |array |No      |Factory presets               |

### Control Types

#### Knob

```json
{
  "type": "knob",
  "range": { "min": 0, "max": 127 },
  "default": 64,
  "curve": "linear" | "exponential" | "logarithmic"
}
```

#### Fader

```json
{
  "type": "fader",
  "range": { "min": 0, "max": 127 },
  "default": 0,
  "orientation": "vertical" | "horizontal"
}
```

#### Button

```json
{
  "type": "button",
  "mode": "toggle" | "momentary",
  "default": false
}
```

#### Rotary Switch

```json
{
  "type": "rotary_switch",
  "values": ["option1", "option2", "option3"],
  "default": "option1"
}
```

### Port Types

|Type   |Standards                   |Directions         |
|-------|----------------------------|-------------------|
|`midi` |`din5`, `usb`               |`in`, `out`, `thru`|
|`audio`|`jack_ts`, `jack_trs`, `xlr`|`in`, `out`        |
|`cv`   |`jack_ts`                   |`in`, `out`        |

### DSP Configuration

The `audio.dsp` section defines how the instrument is synthesized using Tone.js or custom AudioWorklet processors.

**Standard Tone.js:**

```json
{
  "engine": "tone.js",
  "oscillators": [...],
  "filters": [...],
  "envelopes": [...],
  "lfos": [...]
}
```

**Custom AudioWorklet:**

```json
{
  "engine": "custom",
  "customProcessor": "/processors/moog_ladder_filter.js",
  "config": {...}
}
```

## Validation

All hardware specs must pass JSON Schema validation:

```bash
npm run validate-hardware data/hardware/synths/moog/sub37.json
```

Validation checks:

- ✅ All required fields present
- ✅ MIDI CC# mappings unique and valid (0-127)
- ✅ Control positions don’t overlap
- ✅ Port positions don’t overlap
- ✅ Image files exist
- ✅ Manual PDF exists

## Usage in Code

```typescript
import sub37Spec from '@/data/hardware/synths/moog/sub37.json';

// Load hardware
const instrument = HardwareFactory.create(sub37Spec);

// Render on canvas
InstrumentRenderer.render(canvas, instrument);

// Set parameter
instrument.setParameter('filter_cutoff', 80);

// Get MIDI mapping
const cutoffCC = sub37Spec.midi.ccMappings['74']; // { parameter: 'filter_cutoff', ... }
```

## Adding New Hardware

1. Create JSON file following this spec
1. Add images to `/public/images/hardware/`
1. Add manual PDF to `/public/manuals/`
1. Run validation: `npm run validate-hardware <file>`
1. Test rendering: `npm run test-hardware <id>`
1. Submit PR

-----

**Schema Version:** 1.0.0  
**Last Updated:** 2025-10-31