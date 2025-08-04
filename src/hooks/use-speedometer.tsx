
"use client";

import { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { getEmojiForSpeed } from '@/app/actions';
import { getDistanceFromLatLonInKm } from '@/lib/utils';

type Unit = 'kmh' | 'mph' | 'mps';
type PermissionStatus = 'pending' | 'granted' | 'denied';
type ViewMode = 'digital' | 'analogue';
type JourneyStatus = 'idle' | 'tracking' | 'finished';

interface Coordinates {
  lat: number;
  lng: number;
}

interface SpeedometerContextType {
  speed: number | null;
  unit: Unit;
  permissionStatus: PermissionStatus;
  error: string | null;
  emoji: string;
  viewMode: ViewMode;
  journeyStatus: JourneyStatus;
  journeyPath: Coordinates[];
  journeyDistance: number;
  handleUnitToggle: () => void;
  handleViewToggle: () => void;
  handleStartJourney: () => void;
  handleEndJourney: () => void;
  handleResetJourney: () => void;
}

const SpeedometerContext = createContext<SpeedometerContextType | undefined>(undefined);

export function SpeedometerProvider({ children }: { children: ReactNode }) {
  const [speed, setSpeed] = useState<number | null>(null);
  const [unit, setUnit] = useState<Unit>('kmh');
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('pending');
  const [error, setError] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string>('🤔');
  const [viewMode, setViewMode] = useState<ViewMode>('digital');

  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus>('idle');
  const [journeyPath, setJourneyPath] = useState<Coordinates[]>([]);
  const [journeyDistance, setJourneyDistance] = useState<number>(0);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !navigator.geolocation) {
      setPermissionStatus('denied');
      setError("Your browser doesn't support geolocation.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setPermissionStatus('granted');
        const { speed: currentSpeedInMps, latitude, longitude } = position.coords;

        if (currentSpeedInMps !== null && currentSpeedInMps > 0) {
          const speedKmh = currentSpeedInMps * 3.6;
          setSpeed(currentSpeedInMps);

          if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
          }

          debounceTimeout.current = setTimeout(async () => {
            const newEmoji = await getEmojiForSpeed(speedKmh);
            setEmoji(newEmoji);
          }, 500);
        } else {
          setSpeed(0);
          setEmoji('🚶');
        }

        if (journeyStatus === 'tracking') {
          const newCoord = { lat: latitude, lng: longitude };
          setJourneyPath(prevPath => {
            if (prevPath.length > 0) {
              const lastCoord = prevPath[prevPath.length - 1];
              const distanceIncrement = getDistanceFromLatLonInKm(lastCoord.lat, lastCoord.lng, newCoord.lat, newCoord.lng);
              setJourneyDistance(prevDistance => prevDistance + distanceIncrement);
            }
            return [...prevPath, newCoord];
          });
        }
      },
      (err) => {
        setPermissionStatus('denied');
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Please enable location services to use the speedometer.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("The request to get user location timed out.");
            break;
          default:
            setError("An unknown error occurred.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [journeyStatus]);

  const handleUnitToggle = () => {
    setUnit((prevUnit) => {
      if (prevUnit === 'kmh') return 'mph';
      if (prevUnit === 'mph') return 'mps';
      return 'kmh';
    });
  };

  const handleViewToggle = () => {
    setViewMode((prevMode) => (prevMode === 'digital' ? 'analogue' : 'digital'));
  };

  const handleStartJourney = () => {
    setJourneyStatus('tracking');
    setJourneyPath([]);
    setJourneyDistance(0);
  }

  const handleEndJourney = () => {
    setJourneyStatus('finished');
  }

  const handleResetJourney = () => {
    setJourneyStatus('idle');
    setJourneyPath([]);
    setJourneyDistance(0);
  }

  const value = {
    speed,
    unit,
    permissionStatus,
    error,
    emoji,
    viewMode,
    journeyStatus,
    journeyPath,
    journeyDistance,
    handleUnitToggle,
    handleViewToggle,
    handleStartJourney,
    handleEndJourney,
    handleResetJourney,
  };

  return <SpeedometerContext.Provider value={value}>{children}</SpeedometerContext.Provider>;
}

export function useSpeedometer() {
  const context = useContext(SpeedometerContext);
  if (context === undefined) {
    throw new Error('useSpeedometer must be used within a SpeedometerProvider');
  }
  return context;
}
