/**
 * Примеры кода для использования GitHub AI API
 */

export const codeExamples = {
  curl: {
    basic: `# Базовый запрос к AI
curl -X POST "http://localhost:3000/api/v1/ai-question" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "userMessage": "Расскажи о преимуществах NestJS",
    "model": "gpt-4o-mini"
  }'`,

    withApiKey: `# Запрос с API ключом
curl -X POST "http://localhost:3000/api/v1/ai-question" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{
    "userMessage": "Создай JSON структуру для пользователя",
    "model": "gpt-4o",
    "response_format": { "type": "json_object" }
  }'`,

    healthCheck: `# Проверка состояния системы
curl -X GET "http://localhost:3000/api/v1/health" \\
  -H "Accept: application/json"`,

    apiInfo: `# Получение информации об API
curl -X GET "http://localhost:3000/api/v1/api/info" \\
  -H "Accept: application/json"`,
  },

  javascript: {
    basic: `// Базовый запрос с использованием fetch
async function sendAIQuestion() {
  const response = await fetch('http://localhost:3000/api/v1/ai-question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({
      userMessage: 'Расскажи о преимуществах NestJS',
      model: 'gpt-4o-mini'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Ошибка:', error);
    return;
  }

  const result = await response.json();
  console.log('Ответ AI:', result.botMessage);
}

sendAIQuestion();`,

    withErrorHandling: `// Запрос с полной обработкой ошибок
async function sendAIQuestionWithRetry(message, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('http://localhost:3000/api/v1/ai-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_JWT_TOKEN'
        },
        body: JSON.stringify({
          userMessage: message,
          model: 'gpt-4o-mini'
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.botMessage;
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 60;
        console.log(\`Rate limited. Retry after \${retryAfter} seconds. Attempt \${attempt}/\${maxRetries}\`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      const error = await response.json();
      throw new Error(\`\${error.code}: \${error.message}\`);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.log(\`Attempt \${attempt} failed. Retrying...\`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Использование
sendAIQuestionWithRetry('Как работает async/await в JavaScript?')
  .then(response => console.log(response))
  .catch(error => console.error('Все попытки неудачны:', error.message));`,

    classBased: `// Класс для работы с API
class GitHubAIClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async askAI(message, options = {}) {
    const payload = {
      userMessage: message,
      model: options.model || 'gpt-4o-mini',
      ...options
    };

    const response = await fetch(\`\${this.baseUrl}/api/v1/ai-question\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(\`\${error.code}: \${error.message}\`);
    }

    return await response.json();
  }

  async healthCheck() {
    const response = await fetch(\`\${this.baseUrl}/api/v1/health\`);
    return await response.json();
  }
}

// Использование
const client = new GitHubAIClient('http://localhost:3000', 'YOUR_API_KEY');

client.askAI('Что такое микросервисы?')
  .then(result => console.log(result.botMessage))
  .catch(error => console.error(error));`,
  },

  typescript: {
    basic: `// TypeScript с типами
interface AIQuestionRequest {
  userMessage: string;
  model?: 'gpt-4o-mini' | 'gpt-4o' | 'gpt-3.5-turbo';
  response_format?: { type: 'text' | 'json_object' };
}

interface AIQuestionResponse {
  botMessage: string;
}

interface ErrorResponse {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
  timestamp: string;
  path: string;
}

class GitHubAIClient {
  private baseUrl: string;
  private apiKey?: string;
  private jwtToken?: string;

  constructor(baseUrl: string, options: { apiKey?: string; jwtToken?: string }) {
    this.baseUrl = baseUrl;
    this.apiKey = options.apiKey;
    this.jwtToken = options.jwtToken;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    } else if (this.jwtToken) {
      headers['Authorization'] = \`Bearer \${this.jwtToken}\`;
    }

    return headers;
  }

  async askAI(request: AIQuestionRequest): Promise<AIQuestionResponse> {
    const response = await fetch(\`\${this.baseUrl}/api/v1/ai-question\`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(\`\${error.code}: \${error.message}\`);
    }

    return await response.json();
  }
}

// Использование
const client = new GitHubAIClient('http://localhost:3000', {
  apiKey: process.env.API_KEY
});

client.askAI({
  userMessage: 'Объясни принципы SOLID',
  model: 'gpt-4o'
})
  .then(response => console.log(response.botMessage))
  .catch(error => console.error(error));`,

    advanced: `// Продвинутый TypeScript клиент с retry и rate limiting
class AdvancedGitHubAIClient {
  private baseUrl: string;
  private apiKey?: string;
  private jwtToken?: string;
  private rateLimiter: Map<string, number[]> = new Map();

  constructor(baseUrl: string, options: { apiKey?: string; jwtToken?: string }) {
    this.baseUrl = baseUrl;
    this.apiKey = options.apiKey;
    this.jwtToken = options.jwtToken;
  }

  private async checkRateLimit(key: string, limit: number, windowMs: number): Promise<void> {
    const now = Date.now();
    const requests = this.rateLimiter.get(key) || [];

    // Удаляем старые запросы
    const validRequests = requests.filter(time => now - time < windowMs);

    if (validRequests.length >= limit) {
      const oldestRequest = Math.min(...validRequests);
      const waitTime = windowMs - (now - oldestRequest);
      throw new Error(\`Rate limit exceeded. Wait \${Math.ceil(waitTime / 1000)} seconds\`);
    }

    validRequests.push(now);
    this.rateLimiter.set(key, validRequests);
  }

  async askAIWithRetry(
    request: AIQuestionRequest,
    options: { maxRetries?: number; retryDelay?: number } = {}
  ): Promise<AIQuestionResponse> {
    const { maxRetries = 3, retryDelay = 1000 } = options;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Rate limiting check
        await this.checkRateLimit('ai-questions', 60, 60000);

        const response = await fetch(\`\${this.baseUrl}/api/v1/ai-question\`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(request)
        });

        if (response.ok) {
          return await response.json();
        }

        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
          console.log(\`Rate limited. Waiting \${retryAfter} seconds...\`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }

        const error: ErrorResponse = await response.json();
        throw new Error(\`\${error.code}: \${error.message}\`);
      } catch (error) {
        if (attempt === maxRetries) throw error;

        console.log(\`Attempt \${attempt} failed. Retrying in \${retryDelay * attempt}ms...\`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }

    throw new Error('All retry attempts failed');
  }
}`,
  },

  python: {
    basic: `import requests
import json

# Базовый запрос
def ask_ai_question():
    url = "http://localhost:3000/api/v1/ai-question"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_JWT_TOKEN"
    }
    data = {
        "userMessage": "Расскажи о преимуществах Python",
        "model": "gpt-4o-mini"
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        result = response.json()
        print(f"Ответ AI: {result['botMessage']}")
    else:
        error = response.json()
        print(f"Ошибка: {error['code']} - {error['message']}")

ask_ai_question()`,

    withErrorHandling: `import requests
import time
from typing import Optional, Dict, Any

class GitHubAIClient:
    def __init__(self, base_url: str, api_key: Optional[str] = None, jwt_token: Optional[str] = None):
        self.base_url = base_url
        self.api_key = api_key
        self.jwt_token = jwt_token
        self.session = requests.Session()

    def _get_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["X-API-Key"] = self.api_key
        elif self.jwt_token:
            headers["Authorization"] = f"Bearer {self.jwt_token}"
        return headers

    def ask_ai_with_retry(
        self,
        message: str,
        model: str = "gpt-4o-mini",
        max_retries: int = 3
    ) -> str:
        url = f"{self.base_url}/api/v1/ai-question"
        data = {
            "userMessage": message,
            "model": model
        }

        for attempt in range(1, max_retries + 1):
            try:
                response = self.session.post(
                    url,
                    headers=self._get_headers(),
                    json=data,
                    timeout=30
                )

                if response.status_code == 200:
                    result = response.json()
                    return result["botMessage"]

                elif response.status_code == 429:
                    retry_after = int(response.headers.get("Retry-After", 60))
                    print(f"Rate limited. Waiting {retry_after} seconds...")
                    time.sleep(retry_after)
                    continue

                else:
                    error = response.json()
                    raise Exception(f"{error['code']}: {error['message']}")

            except Exception as e:
                if attempt == max_retries:
                    raise
                print(f"Attempt {attempt} failed. Retrying...")
                time.sleep(attempt)

        raise Exception("All retry attempts failed")

    def health_check(self) -> Dict[str, Any]:
        url = f"{self.base_url}/api/v1/health"
        response = self.session.get(url)
        return response.json()

# Использование
client = GitHubAIClient("http://localhost:3000", api_key="YOUR_API_KEY")

try:
    response = client.ask_ai_with_retry("Что такое декораторы в Python?")
    print(f"Ответ: {response}")
except Exception as e:
    print(f"Ошибка: {e}")`,

    async: `import aiohttp
import asyncio
import json
from typing import Optional, Dict, Any

class AsyncGitHubAIClient:
    def __init__(self, base_url: str, api_key: Optional[str] = None, jwt_token: Optional[str] = None):
        self.base_url = base_url
        self.api_key = api_key
        self.jwt_token = jwt_token

    def _get_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["X-API-Key"] = self.api_key
        elif self.jwt_token:
            headers["Authorization"] = f"Bearer {self.jwt_token}"
        return headers

    async def ask_ai(self, message: str, model: str = "gpt-4o-mini") -> str:
        url = f"{self.base_url}/api/v1/ai-question"
        data = {
            "userMessage": message,
            "model": model
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=self._get_headers(), json=data) as response:
                if response.status == 200:
                    result = await response.json()
                    return result["botMessage"]
                else:
                    error = await response.json()
                    raise Exception(f"{error['code']}: {error['message']}")

    async def ask_multiple(self, questions: list[str]) -> list[str]:
        tasks = [self.ask_ai(question) for question in questions]
        return await asyncio.gather(*tasks)

# Использование
async def main():
    client = AsyncGitHubAIClient("http://localhost:3000", api_key="YOUR_API_KEY")

    questions = [
        "Что такое list comprehension?",
        "Объясни концепцию async/await",
        "Как работают генераторы?"
    ]

    try:
        responses = await client.ask_multiple(questions)
        for i, response in enumerate(responses):
            print(f"Вопрос {i+1}: {questions[i]}")
            print(f"Ответ: {response}\n")
    except Exception as e:
        print(f"Ошибка: {e}")

if __name__ == "__main__":
    asyncio.run(main())`,
  },

  java: {
    basic: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import com.fasterxml.jackson.databind.ObjectMapper;

public class GitHubAIClient {
    private final String baseUrl;
    private final String apiKey;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GitHubAIClient(String baseUrl, String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
        this.objectMapper = new ObjectMapper();
    }

    public String askAI(String message) throws Exception {
        String requestBody = String.format(
            "{\\"userMessage\\": \\"%s\\", \\"model\\": \\"gpt-4o-mini\\"}",
            message
        );

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + "/api/v1/ai-question"))
            .header("Content-Type", "application/json")
            .header("X-API-Key", apiKey)
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .timeout(Duration.ofSeconds(30))
            .build();

        HttpResponse<String> response = httpClient.send(
            request,
            HttpResponse.BodyHandlers.ofString()
        );

        if (response.statusCode() == 200) {
            JsonNode jsonResponse = objectMapper.readTree(response.body());
            return jsonResponse.get("botMessage").asText();
        } else {
            JsonNode errorResponse = objectMapper.readTree(response.body());
            throw new Exception(
                errorResponse.get("code").asText() + ": " +
                errorResponse.get("message").asText()
            );
        }
    }

    public static void main(String[] args) {
        GitHubAIClient client = new GitHubAIClient(
            "http://localhost:3000",
            "YOUR_API_KEY"
        );

        try {
            String response = client.askAI("Что такое Spring Boot?");
            System.out.println("Ответ AI: " + response);
        } catch (Exception e) {
            System.err.println("Ошибка: " + e.getMessage());
        }
    }
}`,

    spring: `import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.annotation.JsonProperty;

@Service
public class GitHubAIService {
    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String apiKey;

    public GitHubAIService(RestTemplateBuilder builder,
                          @Value("\${github-ai.base-url}") String baseUrl,
                          @Value("\${github-ai.api-key}") String apiKey) {
        this.restTemplate = builder.build();
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    public AIResponse askAI(AIRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-API-Key", apiKey);

        HttpEntity<AIRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<AIResponse> response = restTemplate.exchange(
                baseUrl + "/api/v1/ai-question",
                HttpMethod.POST,
                entity,
                AIResponse.class
            );

            return response.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при запросе к AI: " + e.getMessage());
        }
    }

    // DTO классы
    public static class AIRequest {
        @JsonProperty("userMessage")
        private String userMessage;

        @JsonProperty("model")
        private String model = "gpt-4o-mini";

        // getters and setters
    }

    public static class AIResponse {
        @JsonProperty("botMessage")
        private String botMessage;

        // getters and setters
    }
}`,
  },

  go: {
    basic: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"
)

type AIRequest struct {
    UserMessage    string                 \`json:"userMessage"\`
    Model          string                 \`json:"model,omitempty"\`
    ResponseFormat map[string]interface{} \`json:"response_format,omitempty"\`
}

type AIResponse struct {
    BotMessage string \`json:"botMessage"\`
}

type ErrorResponse struct {
    Code      string \`json:"code"\`
    Message   string \`json:"message"\`
    Timestamp string \`json:"timestamp"\`
    Path      string \`json:"path"\`
}

type GitHubAIClient struct {
    BaseURL string
    APIKey  string
    Client  *http.Client
}

func NewGitHubAIClient(baseURL, apiKey string) *GitHubAIClient {
    return &GitHubAIClient{
        BaseURL: baseURL,
        APIKey:  apiKey,
        Client: &http.Client{
            Timeout: 30 * time.Second,
        },
    }
}

func (c *GitHubAIClient) AskAI(message string) (string, error) {
    request := AIRequest{
        UserMessage: message,
        Model:       "gpt-4o-mini",
    }

    requestBody, err := json.Marshal(request)
    if err != nil {
        return "", fmt.Errorf("ошибка кодирования запроса: %v", err)
    }

    req, err := http.NewRequest("POST", c.BaseURL+"/api/v1/ai-question", bytes.NewBuffer(requestBody))
    if err != nil {
        return "", fmt.Errorf("ошибка создания запроса: %v", err)
    }

    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("X-API-Key", c.APIKey)

    resp, err := c.Client.Do(req)
    if err != nil {
        return "", fmt.Errorf("ошибка выполнения запроса: %v", err)
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return "", fmt.Errorf("ошибка чтения ответа: %v", err)
    }

    if resp.StatusCode == http.StatusOK {
        var aiResponse AIResponse
        if err := json.Unmarshal(body, &aiResponse); err != nil {
            return "", fmt.Errorf("ошибка декодирования ответа: %v", err)
        }
        return aiResponse.BotMessage, nil
    }

    var errorResp ErrorResponse
    if err := json.Unmarshal(body, &errorResp); err != nil {
        return "", fmt.Errorf("ошибка декодирования ошибки: %v", err)
    }

    return "", fmt.Errorf("%s: %s", errorResp.Code, errorResp.Message)
}

func main() {
    client := NewGitHubAIClient("http://localhost:3000", "YOUR_API_KEY")

    response, err := client.AskAI("Что такое горутины в Go?")
    if err != nil {
        fmt.Printf("Ошибка: %v\\n", err)
        return
    }

    fmt.Printf("Ответ AI: %s\\n", response)
}`,

    advanced: `package main

import (
    "bytes"
    "context"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "sync"
    "time"
)

type RateLimiter struct {
    requests chan struct{}
    ticker   *time.Ticker
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
    rl := &RateLimiter{
        requests: make(chan struct{}, limit),
        ticker:   time.NewTicker(window),
    }

    go func() {
        for range rl.ticker.C {
            // Сбрасываем лимит
            for len(rl.requests) > 0 {
                <-rl.requests
            }
        }
    }()

    return rl
}

func (rl *RateLimiter) Wait() {
    rl.requests <- struct{}{}
}

type AdvancedGitHubAIClient struct {
    BaseURL     string
    APIKey      string
    Client      *http.Client
    RateLimiter *RateLimiter
}

func NewAdvancedGitHubAIClient(baseURL, apiKey string) *AdvancedGitHubAIClient {
    return &AdvancedGitHubAIClient{
        BaseURL:     baseURL,
        APIKey:      apiKey,
        Client:      &http.Client{Timeout: 30 * time.Second},
        RateLimiter: NewRateLimiter(60, time.Minute), // 60 запросов в минуту
    }
}

func (c *AdvancedGitHubAIClient) AskAIWithRetry(ctx context.Context, message string, maxRetries int) (string, error) {
    for attempt := 1; attempt <= maxRetries; attempt++ {
        // Ждем разрешения от rate limiter
        c.RateLimiter.Wait()

        response, err := c.askAI(ctx, message)
        if err == nil {
            return response, nil
        }

        if attempt == maxRetries {
            return "", fmt.Errorf("все попытки неудачны: %v", err)
        }

        // Экспоненциальный backoff
        backoff := time.Duration(attempt) * time.Second
        select {
        case <-time.After(backoff):
            // Продолжаем следующую попытку
        case <-ctx.Done():
            return "", ctx.Err()
        }
    }

    return "", fmt.Errorf("не удалось получить ответ после %d попыток", maxRetries)
}

func (c *AdvancedGitHubAIClient) askAI(ctx context.Context, message string) (string, error) {
    request := AIRequest{
        UserMessage: message,
        Model:       "gpt-4o-mini",
    }

    requestBody, err := json.Marshal(request)
    if err != nil {
        return "", fmt.Errorf("ошибка кодирования запроса: %v", err)
    }

    req, err := http.NewRequestWithContext(ctx, "POST", c.BaseURL+"/api/v1/ai-question", bytes.NewBuffer(requestBody))
    if err != nil {
        return "", fmt.Errorf("ошибка создания запроса: %v", err)
    }

    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("X-API-Key", c.APIKey)

    resp, err := c.Client.Do(req)
    if err != nil {
        return "", fmt.Errorf("ошибка выполнения запроса: %v", err)
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return "", fmt.Errorf("ошибка чтения ответа: %v", err)
    }

    if resp.StatusCode == http.StatusOK {
        var aiResponse AIResponse
        if err := json.Unmarshal(body, &aiResponse); err != nil {
            return "", fmt.Errorf("ошибка декодирования ответа: %v", err)
        }
        return aiResponse.BotMessage, nil
    }

    if resp.StatusCode == http.StatusTooManyRequests {
        return "", fmt.Errorf("rate limit exceeded")
    }

    var errorResp ErrorResponse
    if err := json.Unmarshal(body, &errorResp); err != nil {
        return "", fmt.Errorf("ошибка декодирования ошибки: %v", err)
    }

    return "", fmt.Errorf("%s: %s", errorResp.Code, errorResp.Message)
}

func (c *AdvancedGitHubAIClient) AskMultiple(ctx context.Context, messages []string) ([]string, error) {
    var wg sync.WaitGroup
    results := make([]string, len(messages))
    errors := make([]error, len(messages))

    for i, message := range messages {
        wg.Add(1)
        go func(index int, msg string) {
            defer wg.Done()
            result, err := c.AskAIWithRetry(ctx, msg, 3)
            if err != nil {
                errors[index] = err
                return
            }
            results[index] = result
        }(i, message)
    }

    wg.Wait()

    // Проверяем ошибки
    for _, err := range errors {
        if err != nil {
            return results, fmt.Errorf("один из запросов завершился с ошибкой: %v", err)
        }
    }

    return results, nil
}

func main() {
    client := NewAdvancedGitHubAIClient("http://localhost:3000", "YOUR_API_KEY")

    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
    defer cancel()

    messages := []string{
        "Что такое интерфейсы в Go?",
        "Объясни концепцию горутин",
        "Как работают каналы?",
    }

    responses, err := client.AskMultiple(ctx, messages)
    if err != nil {
        fmt.Printf("Ошибка: %v\\n", err)
        return
    }

    for i, response := range responses {
        fmt.Printf("Вопрос %d: %s\\n", i+1, messages[i])
        fmt.Printf("Ответ: %s\\n\\n", response)
    }
}`,
  },
};