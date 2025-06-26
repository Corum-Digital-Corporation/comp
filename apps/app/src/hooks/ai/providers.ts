import { groq } from '@ai-sdk/groq';
import { openrouter } from '@openrouter/ai-sdk-provider';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';

export const model = customProvider({
 /* languageModels: {
    'deepseek-r1-distill-llama-70b': wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: 'think',
      }),
      model: groq('deepseek-r1-distill-llama-70b'),
    }),
  },*/
  languageModels: {
    'openai/gpt-4-turbo': wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: 'think',
      }),
      model: groq('openai/gpt-4-turbo'),
    }),
    'openai/gpt-4o': wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: 'think',
      }),
      model: groq('openai/gpt-4o'),
    }),
    'anthropic/claude-3.7-sonnet': wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: 'think',
      }),
      model: groq('anthropic/claude-3.7-sonnet'),
    }),
    'google/gemini-2.0-flash-001': wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: 'think',
      }),
      model: groq('google/gemini-2.0-flash-001'),
    }),
    'google/gemini-2.5-flash-preview-05-20': wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: 'think',
      }),
      model: groq('google/gemini-2.5-flash-preview-05-20'),
    }),
  },
});

export type modelID = Parameters<(typeof model)['languageModel']>['0'];
