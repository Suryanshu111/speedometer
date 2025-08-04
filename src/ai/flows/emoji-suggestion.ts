// This file is machine-generated - changes may be lost.

'use server';

/**
 * @fileOverview A flow that suggests an emoji based on the given speed.
 *
 * - suggestEmoji - A function that suggests an emoji based on the given speed.
 * - EmojiSuggestionInput - The input type for the suggestEmoji function.
 * - EmojiSuggestionOutput - The return type for the suggestEmoji function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmojiSuggestionInputSchema = z.object({
  speed: z
    .number()
    .describe('The current speed of the user in kilometers per hour.'),
});
export type EmojiSuggestionInput = z.infer<typeof EmojiSuggestionInputSchema>;

const EmojiSuggestionOutputSchema = z.object({
  emoji: z.string().describe('An emoji that represents the given speed.'),
});
export type EmojiSuggestionOutput = z.infer<typeof EmojiSuggestionOutputSchema>;

export async function suggestEmoji(input: EmojiSuggestionInput): Promise<EmojiSuggestionOutput> {
  return suggestEmojiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emojiSuggestionPrompt',
  input: {schema: EmojiSuggestionInputSchema},
  output: {schema: EmojiSuggestionOutputSchema},
  prompt: `You are an emoji suggestion bot. You will suggest an emoji that represents the speed of the user.

  Consider these emojis:
  - 0 km/h: 🚶
  - 1-10 km/h: 🐌
  - 11-30 km/h: 🚶‍♀️
  - 31-50 km/h: 🚴
  - 51-70 km/h: 🚗
  - 71-90 km/h: 🚕
  - 91-110 km/h: 🏎️
  - 111+ km/h: 🚀

  Speed: {{{speed}}} km/h
  Emoji: `,
});

const suggestEmojiFlow = ai.defineFlow(
  {
    name: 'suggestEmojiFlow',
    inputSchema: EmojiSuggestionInputSchema,
    outputSchema: EmojiSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
