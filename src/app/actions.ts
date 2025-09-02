'use server';

import { getPersonalizedEventStrategy, PersonalizedEventStrategyInput } from '@/ai/flows/ai-personalized-event-strategy';
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

export async function getStrategyRecommendations(input: PersonalizedEventStrategyInput) {
  try {
    const recommendation = await getPersonalizedEventStrategy(input);
    return { success: true, data: recommendation };
  } catch (error) {
    console_error('Error getting strategy recommendations:', error);
    return { success: false, error: 'Failed to get AI recommendations.' };
  }
}
