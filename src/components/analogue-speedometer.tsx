
"use client";

import React, { useMemo } from 'react';

interface AnalogueSpeedometerProps {
  speed: number;
  maxSpeed: number;
  unit: 'kmh' | 'mph' | 'mps';
}

export function AnalogueSpeedometer({ speed, maxSpeed, unit }: AnalogueSpeedometerProps) {
  const minAngle = -150;
  const maxAngle = 150;

  const speedToAngle = (s: number) => {
    const percentage = Math.min(s / maxSpeed, 1);
    return minAngle + percentage * (maxAngle - minAngle);
  };

  const angle = speedToAngle(speed);
  
  const tickInterval = useMemo(() => {
    if (unit === 'kmh') return 10;
    if (unit === 'mph') return 10;
    return 5; // m/s
  }, [unit]);
  
  const majorTickInterval = useMemo(() => {
    if (unit === 'kmh') return 20;
    if (unit === 'mph') return 20;
    return 10; // m/s
  }, [unit]);

  const renderTicks = () => {
    const ticks = [];
    const totalTicks = maxSpeed / tickInterval;
    for (let i = 0; i <= totalTicks; i++) {
      const tickSpeed = i * tickInterval;
      const tickAngle = speedToAngle(tickSpeed);
      
      const isMajorTick = tickSpeed % majorTickInterval === 0;

      ticks.push(
        <g key={`tick-${i}`} transform={`rotate(${tickAngle} 150 150)`}>
          <line
            x1="150"
            y1="25"
            x2="150"
            y2={isMajorTick ? 45 : 35}
            stroke={"hsl(var(--foreground))"}
            strokeOpacity={isMajorTick ? 1 : 0.5}
            strokeWidth={isMajorTick ? "2.5" : "1.5"}
            strokeLinecap="round"
          />
          {isMajorTick && (
             <text
                x={150}
                y={60}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="hsl(var(--foreground))"
                fontSize="16"
                fontWeight="bold"
                transform={`rotate(${-tickAngle} 150 60)`}
             >
                {tickSpeed}
            </text>
          )}
        </g>
      );
    }
    return ticks;
  };

  const renderGaugeArc = () => {
    const segments = 100;
    const arc = [];
    const totalAngleRange = maxAngle - minAngle;

    for(let i = 0; i < segments; i++) {
      const startAngle = minAngle + (i / segments) * totalAngleRange;
      const endAngle = minAngle + ((i + 1) / segments) * totalAngleRange;
      
      const start = {
        x: 150 + 120 * Math.cos((startAngle - 90) * Math.PI / 180),
        y: 150 + 120 * Math.sin((startAngle - 90) * Math.PI / 180),
      };
      const end = {
        x: 150 + 120 * Math.cos((endAngle - 90) * Math.PI / 180),
        y: 150 + 120 * Math.sin((endAngle - 90) * Math.PI / 180),
      };

      const color = `hsl(${276 + (i/segments) * (231 - 276)}, 100%, 73%)`;

      arc.push(
        <path
          key={`arc-${i}`}
          d={`M ${start.x} ${start.y} A 120 120 0 0 1 ${end.x} ${end.y}`}
          stroke={color}
          strokeWidth="20"
          fill="none"
        />
      );
    }
    return arc;
  }
  
  const unitLabel = useMemo(() => {
    if (unit === 'kmh') return 'km/h';
    if (unit === 'mph') return 'mph';
    return 'm/s';
  }, [unit]);

  return (
    <div className="relative w-80 h-80 drop-shadow-lg">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <defs>
            <linearGradient id="needleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent))" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
        </defs>
        
        {/* Background circle */}
        <circle cx="150" cy="150" r="140" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
        
        {/* Gradient Arc */}
        <g style={{filter: 'url(#glow)'}} opacity="0.8">
          {renderGaugeArc()}
        </g>
        
        {/* Ticks and labels */}
        {renderTicks()}
        
        {/* Needle */}
        <g transform={`rotate(${angle} 150 150)`}>
            <path d="M 150 40 L 146 155 C 146 157.76, 153.24 157.76, 154 155 L 150 40 Z" fill="url(#needleGradient)" />
            <circle cx="150" cy="150" r="10" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="2" />
        </g>
        
        {/* Center info */}
        <foreignObject x="100" y="190" width="100" height="70">
            <div className="flex flex-col items-center justify-center text-center w-full h-full">
                 <div
                  className="font-headline font-black text-5xl tracking-tighter text-foreground"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {speed}
                </div>
                <p className="text-xl text-muted-foreground uppercase font-bold">
                  {unitLabel}
                </p>
            </div>
        </foreignObject>
      </svg>
    </div>
  );
}
