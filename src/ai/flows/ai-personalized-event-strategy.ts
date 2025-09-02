'use server';

/**
 * @fileOverview An AI agent that provides personalized event strategy recommendations.
 *
 * - getPersonalizedEventStrategy - A function that handles the generation of personalized event strategies.
 * - PersonalizedEventStrategyInput - The input type for the getPersonalizedEventStrategy function.
 * - PersonalizedEventStrategyOutput - The return type for the getPersonalizedEventStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEventStrategyInputSchema = z.object({
  event: z.string().describe('The name of the current event.'),
  availableResources: z.string().describe('A list of available resources and their quantities.'),
  currentScore: z.number().describe('The player\'s current score in the event.'),
  timeRemaining: z.string().describe('The amount of time remaining in the event.'),
  spendingStyle: z.string().describe('The player spending style (e.g., efficient, quick, balanced).'),
});
export type PersonalizedEventStrategyInput = z.infer<typeof PersonalizedEventStrategyInputSchema>;

const PersonalizedEventStrategyOutputSchema = z.object({
  recommendations: z.string().describe('A list of personalized recommendations for maximizing event score and rewards.'),
});
export type PersonalizedEventStrategyOutput = z.infer<typeof PersonalizedEventStrategyOutputSchema>;

export async function getPersonalizedEventStrategy(
  input: PersonalizedEventStrategyInput
): Promise<PersonalizedEventStrategyOutput> {
  return personalizedEventStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedEventStrategyPrompt',
  input: {schema: PersonalizedEventStrategyInputSchema},
  output: {schema: PersonalizedEventStrategyOutputSchema},
  prompt: `You are an expert game strategist specializing in Whiteout Survival events.

You will analyze the player's current event progress, resource allocation, and spending style to provide personalized recommendations for maximizing their score and rewards.

Consider the following information:

Event: {{{event}}}
Available Resources: {{{availableResources}}}
Current Score: {{{currentScore}}}
Time Remaining: {{{timeRemaining}}}
Spending Style: {{{spendingStyle}}}

Provide clear, actionable recommendations that the player can immediately implement. Focus on item usage, resource management, and strategic decision-making.
`,
});

const personalizedEventStrategyFlow = ai.defineFlow(
  {
    name: 'personalizedEventStrategyFlow',
    inputSchema: PersonalizedEventStrategyInputSchema,
    outputSchema: PersonalizedEventStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
