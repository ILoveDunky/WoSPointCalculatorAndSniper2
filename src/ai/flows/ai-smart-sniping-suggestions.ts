'use server';
/**
 * @fileOverview AI-powered smart sniping suggestions flow.
 *
 * - aiSmartSnipingSuggestions - A function that provides smart sniping suggestions based on target point gap and budget strategy.
 * - AiSmartSnipingSuggestionsInput - The input type for the aiSmartSnipingSuggestions function.
 * - AiSmartSnipingSuggestionsOutput - The return type for the aiSmartSnipingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSmartSnipingSuggestionsInputSchema = z.object({
  eventData: z.any().describe('The current event data including available items and their points.'),
  targetGap: z.number().describe('The target point gap to reach.'),
  budgetStrategy: z
    .enum(['efficient', 'quick', 'balanced', 'premium'])
    .describe('The budget strategy to use for the suggestions.'),
  minShards: z
    .number()
    .optional()
    .describe('The minimum number of shards to use per item, if applicable.'),
});
export type AiSmartSnipingSuggestionsInput = z.infer<
  typeof AiSmartSnipingSuggestionsInputSchema
>;

const AiSmartSnipingSuggestionsOutputSchema = z.array(z.object({
  item: z.string().describe('The name of the item.'),
  quantity: z.number().describe('The quantity of the item to use.'),
  points: z.number().describe('The total points gained from using the item.'),
}));
export type AiSmartSnipingSuggestionsOutput = z.infer<
  typeof AiSmartSnipingSuggestionsOutputSchema
>;

export async function aiSmartSnipingSuggestions(
  input: AiSmartSnipingSuggestionsInput
): Promise<AiSmartSnipingSuggestionsOutput> {
  return aiSmartSnipingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSmartSnipingSuggestionsPrompt',
  input: {
    schema: AiSmartSnipingSuggestionsInputSchema,
  },
  output: {
    schema: AiSmartSnipingSuggestionsOutputSchema,
  },
  prompt: `You are an expert in optimizing resource usage in Whiteout Survival events.

  Based on the provided event data, target point gap, and budget strategy, suggest the most efficient combination of items to use for smart sniping.

  Event Data: {{{eventData}}}
  Target Point Gap: {{{targetGap}}}
  Budget Strategy: {{{budgetStrategy}}}

  Provide a list of items with the quantity to use and the total points gained.
  Only suggest items that are present in the provided event data.
  If the item is "1 Minute of Speedups", suggest the total number of minutes, not quantities of speedup items (e.g., suggest 600, not 2x '5 hour speedup').

  Make sure the numbers you generate add up correctly, and that you don't exceed the target point gap.
  Your suggestions should be an array of objects with "item", "quantity", and "points".
  `,
});

const aiSmartSnipingSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiSmartSnipingSuggestionsFlow',
    inputSchema: AiSmartSnipingSuggestionsInputSchema,
    outputSchema: AiSmartSnipingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
