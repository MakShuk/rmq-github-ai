import { ChatCompletionsResponseFormat } from '@azure-rest/ai-inference';

export interface ChatCompletionChoice {
  message: {
    content: string;
  };
}

export interface ChatCompletionResponse {
  choices?: ChatCompletionChoice[];
  error?: {
    message: string;
    code: string;
  };
}

export interface AzureApiError {
  message: string;
  code: string;
}

export interface ChatCompletionConfig {
  model?: string;
  response_format?: ChatCompletionsResponseFormat;
}