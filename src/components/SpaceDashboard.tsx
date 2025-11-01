import React, { useEffect, useRef, useState } from 'react';
import { gptService } from '@features/ai/GPTService';
import { actionExecutor } from '@features/ai/ActionExecutor';

/**
 * Space Dashboard - Tableau de bord spatial type vaisseau spatial
 * Interface principale d'intégration totale GPT-Programme
 * 
 * Concept: L'utilisateur est aux commandes d'un vaisseau spatial (le studio)
 * avec DawlessGPT comme copilote intelligent ayant accès à tous les systèmes
 */
export const SpaceDashboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [systemStatus, setSystemStatus] = useState({
    audio_engine: 'operational',
    sequencer: 'operational',
    gpt_copilot: 'standby',
    midi_routing: 'operational',
  });

  const [telemetry, setTelemetry] = useState({
    cpu_usage: 0,
    memory_usage: 0,
    active_voices: 0,
    latency_ms: 0,
    gpt_response_time: 0,
  });

  useEffect(() => {
    // Initialize dashboard canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Animation loop for dashboard
    let animationFrame: number;
    const animate = () => {
      drawDashboard(ctx, canvas.width, canvas.height);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  /**
   * Draw the space dashboard interface
   */
  const drawDashboard = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw grid background (space-like)
    drawGrid(ctx, width, height);

    // Draw system status panels
    drawSystemStatus(ctx, 50, 50);

    // Draw telemetry
    drawTelemetry(ctx, width - 350, 50);

    // Draw GPT integration status
    drawGPTStatus(ctx, 50, height - 250);

    // Draw waveform visualization
    drawWaveform(ctx, width / 2 - 300, height - 150);
  };

  /**
   * Draw grid background
   */
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    const gridSize = 50;

    // Vertical lines
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  /**
   * Draw system status panel
   */
  const drawSystemStatus = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Panel background
    ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
    ctx.fillRect(x, y, 300, 200);

    // Border
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 300, 200);

    // Title
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 16px "Courier New"';
    ctx.fillText('SYSTEM STATUS', x + 10, y + 25);

    // Status indicators
    const systems = [
      { name: 'Audio Engine', status: systemStatus.audio_engine },
      { name: 'Sequencer', status: systemStatus.sequencer },
      { name: 'GPT Copilot', status: systemStatus.gpt_copilot },
      { name: 'MIDI Routing', status: systemStatus.midi_routing },
    ];

    systems.forEach((system, index) => {
      const yPos = y + 60 + index * 30;

      // Status light
      const color =
        system.status === 'operational'
          ? '#00ff00'
          : system.status === 'standby'
          ? '#ffff00'
          : '#ff0000';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + 20, yPos, 5, 0, Math.PI * 2);
      ctx.fill();

      // System name
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px "Courier New"';
      ctx.fillText(system.name, x + 35, yPos + 5);

      // Status text
      ctx.fillStyle = color;
      ctx.font = '12px "Courier New"';
      ctx.fillText(system.status.toUpperCase(), x + 200, yPos + 5);
    });
  };

  /**
   * Draw telemetry panel
   */
  const drawTelemetry = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Panel background
    ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
    ctx.fillRect(x, y, 300, 200);

    // Border
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 300, 200);

    // Title
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 16px "Courier New"';
    ctx.fillText('TELEMETRY', x + 10, y + 25);

    // Metrics
    const metrics = [
      { label: 'CPU Usage', value: `${telemetry.cpu_usage}%`, max: 100 },
      { label: 'Memory', value: `${telemetry.memory_usage}%`, max: 100 },
      { label: 'Active Voices', value: telemetry.active_voices.toString(), max: 64 },
      { label: 'Latency', value: `${telemetry.latency_ms}ms`, max: 50 },
      { label: 'GPT Response', value: `${telemetry.gpt_response_time}ms`, max: 2000 },
    ];

    metrics.forEach((metric, index) => {
      const yPos = y + 60 + index * 25;

      // Label
      ctx.fillStyle = '#aaaaaa';
      ctx.font = '12px "Courier New"';
      ctx.fillText(metric.label, x + 10, yPos);

      // Value
      ctx.fillStyle = '#00ff00';
      ctx.font = 'bold 12px "Courier New"';
      ctx.fillText(metric.value, x + 200, yPos);
    });
  };

  /**
   * Draw GPT integration status
   */
  const drawGPTStatus = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Panel background
    ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
    ctx.fillRect(x, y, 400, 180);

    // Border (pulsing effect)
    const pulseAlpha = 0.5 + Math.sin(Date.now() / 500) * 0.3;
    ctx.strokeStyle = `rgba(0, 255, 255, ${pulseAlpha})`;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, 400, 180);

    // Title
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 18px "Courier New"';
    ctx.fillText('🤖 DAWLESSGPT COPILOT', x + 10, y + 30);

    // Status
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px "Courier New"';
    ctx.fillText('● CONNECTED - FULL SYSTEM ACCESS', x + 10, y + 55);

    // Capabilities
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '12px "Courier New"';
    const capabilities = [
      '✓ Real-time project state monitoring',
      '✓ Direct parameter control',
      '✓ Pattern generation & mutation',
      '✓ Mix analysis & optimization',
      '✓ Creative suggestions',
    ];

    capabilities.forEach((cap, index) => {
      ctx.fillText(cap, x + 20, y + 85 + index * 18);
    });
  };

  /**
   * Draw waveform visualization
   */
  const drawWaveform = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const width = 600;
    const height = 100;

    // Background
    ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
    ctx.fillRect(x, y, width, height);

    // Border
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Waveform (animated)
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const time = Date.now() / 1000;
    for (let i = 0; i < width; i++) {
      const t = i / width;
      const wave =
        Math.sin(t * Math.PI * 4 + time) * 0.3 +
        Math.sin(t * Math.PI * 8 + time * 2) * 0.2 +
        Math.sin(t * Math.PI * 16 + time * 3) * 0.1;

      const yPos = y + height / 2 + wave * (height / 2 - 10);

      if (i === 0) {
        ctx.moveTo(x + i, yPos);
      } else {
        ctx.lineTo(x + i, yPos);
      }
    }

    ctx.stroke();
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Canvas Dashboard */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ imageRendering: 'crisp-edges' }}
      />

      {/* Overlay UI Elements */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black bg-opacity-70 border-2 border-cyan-400 rounded-lg px-6 py-3">
          <h1 className="text-cyan-400 font-mono text-2xl font-bold tracking-wider">
            🎹 DAWLESS STUDIO COMMAND CENTER
          </h1>
        </div>
      </div>

      {/* Help Overlay */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black bg-opacity-70 border border-cyan-400 rounded-lg px-4 py-2">
          <p className="text-cyan-400 font-mono text-xs">
            Press <kbd className="bg-cyan-900 px-2 py-1 rounded">SPACE</kbd> to open GPT Chat
          </p>
        </div>
      </div>
    </div>
  );
};
