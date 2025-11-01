import { describe, it, expect } from 'vitest';

/**
 * Example test suite for DawlessStudio
 * This demonstrates the testing patterns to follow
 */

// Example: Testing a utility function
describe('MIDI Note Converter', () => {
  const midiToFrequency = (midiNote: number): number => {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  };

  it('should convert MIDI note 69 (A4) to 440Hz', () => {
    expect(midiToFrequency(69)).toBeCloseTo(440, 2);
  });

  it('should convert MIDI note 60 (C4) to 261.63Hz', () => {
    expect(midiToFrequency(60)).toBeCloseTo(261.63, 2);
  });

  it('should convert MIDI note 0 (C-1) to 8.18Hz', () => {
    expect(midiToFrequency(0)).toBeCloseTo(8.18, 2);
  });

  it('should convert MIDI note 127 (G9) to 12543.85Hz', () => {
    expect(midiToFrequency(127)).toBeCloseTo(12543.85, 2);
  });
});

// Example: Testing scale quantization
describe('Scale Quantization', () => {
  const quantizeToScale = (note: number, scale: number[]): number => {
    const octave = Math.floor(note / 12);
    const noteInOctave = note % 12;

    // Find closest note in scale
    let closest = scale[0];
    let minDistance = Math.abs(noteInOctave - closest);

    for (const scaleNote of scale) {
      const distance = Math.abs(noteInOctave - scaleNote);
      if (distance < minDistance) {
        minDistance = distance;
        closest = scaleNote;
      }
    }

    return octave * 12 + closest;
  };

  const majorScale = [0, 2, 4, 5, 7, 9, 11]; // C major

  it('should quantize C# (1) to C (0) in C major', () => {
    expect(quantizeToScale(1, majorScale)).toBe(0);
  });

  it('should quantize D# (3) to E (4) in C major', () => {
    expect(quantizeToScale(3, majorScale)).toBe(4);
  });

  it('should keep notes already in scale unchanged', () => {
    expect(quantizeToScale(4, majorScale)).toBe(4); // E
    expect(quantizeToScale(7, majorScale)).toBe(7); // G
  });
});

// Example: Testing GPT action validation
describe('GPT Action Validation', () => {
  interface GPTAction {
    type: string;
    parameters: Record<string, any>;
    requires_confirmation: boolean;
  }

  const validateAction = (action: GPTAction): { valid: boolean; error?: string } => {
    if (!action.type) {
      return { valid: false, error: 'Action type is required' };
    }

    if (typeof action.requires_confirmation !== 'boolean') {
      return { valid: false, error: 'requires_confirmation must be a boolean' };
    }

    if (!action.parameters || typeof action.parameters !== 'object') {
      return { valid: false, error: 'parameters must be an object' };
    }

    return { valid: true };
  };

  it('should validate a correct action', () => {
    const action: GPTAction = {
      type: 'set_parameter',
      parameters: { instrument_id: 'bass', parameter: 'cutoff', value: 80 },
      requires_confirmation: false,
    };

    const result = validateAction(action);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject action without type', () => {
    const action = {
      parameters: {},
      requires_confirmation: false,
    } as GPTAction;

    const result = validateAction(action);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Action type is required');
  });

  it('should reject action without requires_confirmation', () => {
    const action = {
      type: 'set_parameter',
      parameters: {},
    } as any;

    const result = validateAction(action);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('requires_confirmation must be a boolean');
  });
});
