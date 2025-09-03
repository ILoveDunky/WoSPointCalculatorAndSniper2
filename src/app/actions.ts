'use server';

import { aiSmartSnipingSuggestions, AiSmartSnipingSuggestionsInput } from '@/ai/flows/ai-smart-sniping-suggestions';

export async function getSnipingSuggestions(input: AiSmartSnipingSuggestionsInput) {
  try {
    const suggestions = await aiSmartSnipingSuggestions(input);
    return { success: true, data: suggestions };
  } catch (error) {
    console.error('Error getting sniping suggestions:', error);
    return { success: false, error: 'Failed to get AI suggestions.' };
  }
}
