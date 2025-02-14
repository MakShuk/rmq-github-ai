import { Injectable } from '@nestjs/common';
import { AzureKeyCredential } from "@azure/core-auth";
import ModelClient from '@azure-rest/ai-inference';
import { AzureApiError, ChatCompletionResponse } from 'app.interface';

/**
 * Сервис для работы с Azure AI Inference API
 */
@Injectable()
export class AppService {
  private readonly apiKey: string;
  private readonly apiEndpoint: string = "https://models.inference.ai.azure.com";
  private readonly modelConfiguration = {
    name: "gpt-4o-mini",
    maxTokens: 1000
  };

  constructor() {
    const apiKey = process.env["GITHUB_TOKEN"];
    if (!apiKey) {
      throw new Error('Отсутствует GITHUB_TOKEN в переменных окружения');
    }
    this.apiKey = apiKey;
  }

  /**
   * Инициализация клиента Azure AI
   * @throws {Error} Если отсутствует API ключ
   */
  private initializeAzureClient(): ReturnType<typeof ModelClient> {
    try {
      const credentials = new AzureKeyCredential(this.apiKey);
      return ModelClient(this.apiEndpoint, credentials);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка инициализации Azure клиента: ${errorMessage}`);
    }
  }

  /**
   * Отправка запроса к API и получение ответа
   * @param userMessage - Сообщение пользователя
   * @throws {Error} При ошибке запроса или неверном ответе
   */
  async run(userMessage: string): Promise<string> {
    try {
      const client = this.initializeAzureClient();
      const response = await client.path("/chat/completions").post({
        body: {
          messages: [
            { role: "user", content: userMessage }
          ],
          max_tokens: this.modelConfiguration.maxTokens,
          model: this.modelConfiguration.name
        }

        
      });

      if (response.status !== "200") {
        if ('error' in response.body) {
          const apiError = response.body.error as AzureApiError;
          throw new Error(`Ошибка API: ${apiError.message} (Код: ${apiError.code})`);
        }
        throw new Error(`Неизвестная ошибка. Статус: ${response.status}`);
      }

      const body = response.body as ChatCompletionResponse;
      if (!body.choices?.length) {
        throw new Error('Получен пустой ответ от API');
      }

      const content = body.choices[0].message.content;
      if (!content) {
        throw new Error('Получен пустой контент в ответе');
      }

      return content;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка при обработке запроса: ${errorMessage}`);
    }
  }
}
