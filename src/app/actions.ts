
'use server';

import { suggestEmoji } from '@/ai/flows/emoji-suggestion';

export async function getEmojiForSpeed(speedInKmh: number) {
  try {
    // Ensure speed is a non-negative number
    const validSpeed = Math.max(0, speedInKmh);
    const result = await suggestEmoji({ speed: validSpeed });
    return result.emoji;
  } catch (error) {
    console.error('Error getting emoji suggestion:', error);
    // Return a default emoji in case of an error with the AI flow
    return '🤔';
  }
}
