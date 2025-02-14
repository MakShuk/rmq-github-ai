export interface ChatCompletionsResponseFormat {
  type: "text" | "json_object";
}

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
  