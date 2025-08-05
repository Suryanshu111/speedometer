
"use client";

import { useMemo, useState } from 'react';
import { Frown, Route, Smartphone, Gauge, Play, Square, Repeat, HelpCircle } from 'lucide-react';
import { AnalogueSpeedometer } from './analogue-speedometer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSpeedometer } from '@/hooks/use-speedometer';
import { Button } from './ui/button';
import { LoadingIndicator } from './loading-indicator';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

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
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);


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
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        {renderContent()}
      </main>
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
         <Button onClick={handleViewToggle} variant="outline" size="icon">
           {viewMode === 'digital' ? <Gauge /> : <Smartphone />}
           <span className="sr-only">Toggle View</span>
         </Button>
         <Button onClick={handleUnitToggle} variant="outline" size="icon">
           <span className="font-bold text-sm">
            {unit === 'kmh' ? 'mph' : unit === 'mph' ? 'm/s' : 'km/h'}
           </span>
            <span className="sr-only">Toggle Unit</span>
         </Button>
         {journeyStatus === 'idle' && (
            <Button onClick={handleStartJourney} variant="outline" size="icon">
              <Play />
              <span className="sr-only">Start Journey</span>
            </Button>
         )}
         {journeyStatus === 'tracking' && (
            <Button onClick={handleEndJourney} variant="outline" size="icon">
              <Square />
               <span className="sr-only">End Journey</span>
            </Button>
         )}
         {journeyStatus === 'finished' && (
            <Button onClick={handleResetJourney} variant="outline" size="icon">
              <Repeat />
               <span className="sr-only">New Journey</span>
            </Button>
         )}
         <Button onClick={() => setAboutDialogOpen(true)} variant="outline" size="icon">
            <HelpCircle />
            <span className="sr-only">About this app</span>
         </Button>
      </div>

       <AlertDialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
        <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>About Speedometer Online</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <section className="text-left space-y-4 pt-4">
                <h2 className="text-lg font-semibold mt-4">What is Speedometer Online?</h2>
                <p>
                  <strong>Speedometer Online</strong> is a browser-based speed measuring tool that uses GPS technology to display your current speed in real-time. Designed for simplicity and precision, it works seamlessly on smartphones, tablets, and desktops without needing any app or plugin.
                </p>

                <h2 className="text-lg font-semibold mt-4">Why Use Our Live Speedometer?</h2>
                <p>
                  The <strong>live speedometer</strong> on our platform offers an instant speed reading based on your device’s GPS. Whether you're driving, cycling, or walking, it helps you monitor your movement accurately. The speed is displayed in kilometers per hour (km/h) or miles per hour (mph), based on your location or preference.
                </p>

                <h2 className="text-lg font-semibold mt-4">How Does It Work?</h2>
                <p>
                  When you visit the site, your browser will request permission to access location data. Once granted, the <em>live speedometer</em> fetches your real-time speed using built-in geolocation APIs. No login, no downloads—just open the page and see your speed instantly.
                </p>

                <h2 className="text-lg font-semibold mt-4">Features of Speedometer Online</h2>
                <ul>
                  <li>100% free and secure to use</li>
                  <li>Instant GPS-based speed tracking</li>
                  <li>Works across devices and operating systems</li>
                  <li>No registration required</li>
                  <li>Lightweight and ad-free interface</li>
                </ul>

                <h2 className="text-lg font-semibold mt-4">Is Speedometer Online Accurate?</h2>
                <p>
                  Yes. The accuracy of the <strong>Speedometer Online</strong> tool depends on your device's GPS quality and signal strength. For best results, use it outdoors with a clear view of the sky. Accuracy may vary slightly in indoor or obstructed areas.
                </p>

                <h2 className="text-lg font-semibold mt-4">Use Cases</h2>
                <p>
                  Our speedometer tool is ideal for:
                </p>
                <ul>
                  <li>Checking vehicle speed without a physical meter</li>
                  <li>Measuring cycling or jogging pace</li>
                  <li>Testing GPS speed on new devices</li>
                  <li>Outdoor adventure tracking</li>
                </ul>

                <h2 className="text-lg font-semibold mt-4">Start Using Speedometer Online Now</h2>
                <p>
                  If you're looking for a reliable and easy-to-use speed tracking solution, <strong>Speedometer Online</strong> is your go-to tool. It’s fast, intuitive, and works directly in your browser.
                </p>
              </section>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
