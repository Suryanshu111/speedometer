
'use server';

import { suggestEmoji } from '@/ai/flows/emoji-suggestion';
import { guessTransportationMode, TransportationModeOutput } from '@/ai/flows/transport-mode-guesser';
import { getSpeedContext, SpeedContextOutput } from '@/ai/flows/speed-context-provider';

export async function getEmojiForSpeed(speedInKmh: number) {
  try {
    const validSpeed = Math.max(0, speedInKmh);
    const result = await suggestEmoji({ speed: validSpeed });
    return result.emoji;
  } catch (error) {
    console.error('Error getting emoji suggestion:', error);
    return '🤔';
  }
}

export async function getTransportationMode(averageSpeedKmh: number): Promise<TransportationModeOutput | null> {
    try {
        const result = await guessTransportationMode({ averageSpeedKmh });
        return result;
    } catch (error) {
        console.error('Error getting transportation mode:', error);
        return null;
    }
}

export async function getFunnySpeedContext(speedKmh: number): Promise<SpeedContextOutput | null> {
    try {
        const result = await getSpeedContext({ speedKmh });
        return result;
    } catch (error) {
        console.error('Error getting speed context:', error);
        return null;
    }
}
