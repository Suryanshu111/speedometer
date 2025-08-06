"use client";

import { useMemo, useState, useEffect } from 'react';
import { Frown, Route, Smartphone, Gauge, Play, Square, Repeat, HelpCircle, Palette, Zap } from 'lucide-react';
import { AnalogueSpeedometer } from './analogue-speedometer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
    transportationMode,
    speedContext,
    theme,
    handleUnitToggle,
    handleViewToggle,
    handleStartJourney,
    handleEndJourney,
    handleResetJourney,
    handleThemeToggle,
  } = useSpeedometer();
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);


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
                    {transportationMode?.mode && (
                        <CardDescription className="flex items-center justify-center gap-2 pt-2">
                            <Zap className="h-4 w-4 text-accent" />
                            AI thinks you were... {transportationMode.mode}
                        </CardDescription>
                     )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                        <p className="text-4xl font-bold">{displayDistance}</p>
                        <p className="text-muted-foreground">{unit === 'kmh' || unit === 'mps' ? 'Kilometers' : 'Miles'}</p>
                      </div>
                      {transportationMode?.comment && (
                        <p className="text-sm italic text-muted-foreground">"{transportationMode.comment}"</p>
                      )}
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
                <div className="text-7xl md:text-8xl mb-4 transition-transform duration-500 ease-in-out transform hover:scale-110">
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
                {speedContext?.context && (
                    <p className="text-md italic text-muted-foreground mt-2 h-6">
                        "{speedContext.context}"
                    </p>
                )}
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
      <header className="absolute top-4 left-4">
        <h1 className="text-2xl font-bold text-foreground">Speedgrip</h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        {renderContent()}
      </main>
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
         <Button onClick={handleThemeToggle} variant="outline" size="icon">
           <Palette />
           <span className="sr-only">Toggle Theme</span>
         </Button>
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
              <div className="text-left space-y-4 pt-4">
                <p>
                  <strong>Speedometer Online</strong> is a browser-based speed measuring tool that uses GPS technology to display your current speed in real-time. Designed for simplicity and precision, it works seamlessly on smartphones, tablets, and desktops without needing any app or plugin.
                </p>

                <Accordion type="single" collapsible className="w-full border-t mt-6 pt-4">
                  <AccordionItem value="faq-section">
                    <AccordionTrigger>
                      <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>1. What is an online speedometer?</AccordionTrigger>
                          <AccordionContent>
                            An <strong>online speedometer</strong> is a digital tool that uses your device's GPS to measure and display your speed in real time. Unlike a car's built-in speedometer, it works anywhere you have a signal, making it perfect for various activities.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>2. How accurate is this speed checker?</AccordionTrigger>
                          <AccordionContent>
                            Our <strong>speed checker</strong> is highly accurate, often within 1-2 mph of a vehicle's speedometer. Accuracy depends on GPS signal strength, so it performs best in open areas with a clear sky view.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger>3. Do I need to install anything to use this speedometer?</AccordionTrigger>
                          <AccordionContent>
                            No, this is a web-based <strong>speedometer</strong> that runs directly in your browser. There are no apps or plugins to download, ensuring a fast and secure experience.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                          <AccordionTrigger>4. Can I use this speedometer online for my bike?</AccordionTrigger>
                          <AccordionContent>
                            Absolutely! This <strong>speedometer online</strong> is perfect for cycling, running, or any activity where you want to track your speed. It's a versatile tool for all your speed-tracking needs.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                          <AccordionTrigger>5. What units does the online speedometer support?</AccordionTrigger>
                          <AccordionContent>
                            This <strong>online speedometer</strong> supports kilometers per hour (km/h), miles per hour (mph), and meters per second (m/s). You can easily toggle between units with the click of a button.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-6">
                          <AccordionTrigger>6. Does this speed checker work offline?</AccordionTrigger>
                          <AccordionContent>
                            While the initial page load requires an internet connection, the core <strong>speed checker</strong> functionality uses GPS, which works without an active internet connection. Your speed will continue to be tracked as long as your device can receive a GPS signal.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-7">
                          <AccordionTrigger>7. Is my location data saved?</AccordionTrigger>
                          <AccordionContent>
                            We respect your privacy. All location data is processed directly on your device by the browser. Our <strong>speedometer</strong> does not store your location history or personal data on our servers.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-8">
                          <AccordionTrigger>8. Why does the speedometer need location access?</AccordionTrigger>
                          <AccordionContent>
                            To function, a GPS <strong>speedometer</strong> must access your device's location to calculate how fast you are moving between two points. Access is only required while you are using the tool.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-9">
                          <AccordionTrigger>9. What makes this the best online speedometer?</AccordionTrigger>
                          <AccordionContent>
                            Our <strong>online speedometer</strong> combines accuracy, a user-friendly interface, multiple unit options, and a commitment to privacy, making it a reliable and convenient <strong>speed checker</strong> for any user.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-10">
                          <AccordionTrigger>10. Can I track my total distance traveled?</AccordionTrigger>
                          <AccordionContent>
                            Yes! Our <strong>speedometer online</strong> includes a journey tracking feature. You can start, stop, and reset a journey to see the total distance you have traveled in either kilometers or miles.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
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
