
"use client";

import { useMemo } from 'react';
import { Frown, Route } from 'lucide-react';
import Image from 'next/image';
import { AnalogueSpeedometer } from './analogue-speedometer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSpeedometer } from '@/hooks/use-speedometer';
import { Button } from './ui/button';
import { LoadingIndicator } from './loading-indicator';

export function Speedometer() {
  const {
    speed,
    permissionStatus,
    error,
    emoji,
    viewMode,
    unit,
    journeyStatus,
    journeyDistance,
    handleUnitToggle,
    handleViewToggle,
    handleStartJourney,
    handleEndJourney,
    handleResetJourney
  } = useSpeedometer();

  const displaySpeed = useMemo(() => {
    if (speed === null) return '0';
    if (unit === 'kmh') return (speed * 3.6).toFixed(0);
    if (unit === 'mph') return (speed / 0.44704).toFixed(0);
    return speed.toFixed(0); // For 'mps'
  }, [speed, unit]);
  
  const maxSpeed = useMemo(() => {
    if (unit === 'kmh') return 220;
    if (unit === 'mph') return 140;
    return 60; // Max speed for m/s
  }, [unit]);

  const displayDistance = useMemo(() => {
    if (unit === 'kmh' || unit === 'mps') return journeyDistance.toFixed(2); // show km for both
    return (journeyDistance * 0.621371).toFixed(2); // show miles for mph
  }, [journeyDistance, unit]);

  const nextUnit = useMemo(() => {
    if (unit === 'kmh') return 'MPH';
    if (unit === 'mph') return 'M/S';
    return 'KM/H';
  }, [unit]);
  
  const currentUnitLabel = useMemo(() => {
    if (unit === 'kmh') return 'km/h';
    if (unit === 'mph') return 'mph';
    return 'm/s';
  }, [unit]);


  const renderContent = () => {
    switch (permissionStatus) {
      case 'pending':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <LoadingIndicator />
            <h2 className="text-2xl font-semibold">Getting Location...</h2>
            <p className="text-muted-foreground">Please allow location access to start.</p>
          </div>
        );
      case 'denied':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <Frown className="h-12 w-12 text-destructive" />
            <h2 className="text-2xl font-semibold">Location Access Denied</h2>
            <p className="text-muted-foreground max-w-sm">{error}</p>
          </div>
        );
      case 'granted':
        if (journeyStatus === 'finished') {
          return (
             <div className="flex flex-col items-center gap-4 text-center">
                <Card className="w-80 text-center">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Route className="h-6 w-6" /> Journey Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-4xl font-bold">{displayDistance}</p>
                      <p className="text-muted-foreground">{unit === 'kmh' || unit === 'mps' ? 'Kilometers' : 'Miles'}</p>
                  </CardContent>
                </Card>
                <Button onClick={handleResetJourney} size="lg">Start New Journey</Button>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-center justify-center text-center">
            {viewMode === 'digital' ? (
              <>
                <div className="text-7xl md:text-8xl mb-6 transition-transform duration-500 ease-in-out transform hover:scale-110">
                  {emoji}
                </div>
                <div
                  className="font-headline font-black text-8xl md:text-9xl tracking-tighter transition-all duration-300"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {displaySpeed}
                </div>
                <p className="text-xl md:text-2xl text-muted-foreground mt-1">
                  {currentUnitLabel}
                </p>
              </>
            ) : (
                <AnalogueSpeedometer speed={Number(displaySpeed)} maxSpeed={maxSpeed} unit={unit} />
            )}
            <div className="mt-8 flex flex-col gap-4">
              <Button onClick={handleUnitToggle}>Switch to {nextUnit}</Button>
              <Button onClick={handleViewToggle}>Switch to {viewMode === 'digital' ? 'Analogue' : 'Digital'}</Button>
              {journeyStatus === 'idle' && (
                <Button onClick={handleStartJourney} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700">Start Journey</Button>
              )}
              {journeyStatus === 'tracking' && (
                <Button onClick={handleEndJourney}>End Journey</Button>
              )}
            </div>
             {journeyStatus === 'tracking' && (
              <div className="mt-4 text-lg">
                <p>Distance: {displayDistance} {unit === 'kmh' || unit === 'mps' ? 'km' : 'mi'}</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      {renderContent()}
    </div>
  );
}
