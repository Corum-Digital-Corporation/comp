'use client';

import type { modelID } from '@/hooks/ai/providers';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@comp/ui/select';

interface ModelPickerProps {
  selectedModel: modelID;
  setSelectedModel: (model: modelID) => void;
}

const MODELS: Record<modelID, string> = {
  'anthropic/claude-3.7-sonnet': 'Claude 3.7 Sonnet',
  'openai/gpt-4-turbo': 'GPT-4 Turbo',
  'openai/gpt-4o': 'GPT-4o',
  'google/gemini-2.0-flash-001': 'Gemini 2.0 Flash',
  'google/gemini-2.5-flash-preview-05-20': 'Gemini 2.5 Flash Preview',
};

export const ModelPicker = ({ selectedModel, setSelectedModel }: ModelPickerProps) => {
  return (
    <div className="absolute bottom-2 left-2 flex flex-col gap-2">
      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className="">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(MODELS).map(([modelId]) => (
              <SelectItem key={modelId} value={modelId}>
                {modelId}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
