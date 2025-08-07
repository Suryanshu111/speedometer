
"use client";

import { Speedometer } from '@/components/speedometer';
import { useSpeedometer } from '@/hooks/use-speedometer';
import { useEffect } from 'react';

export default function Home() {
  const { theme } = useSpeedometer();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
      <Speedometer />
  );
}
