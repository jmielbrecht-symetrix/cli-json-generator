import { OpenAIChatApi } from 'llm-api';
import { completion } from 'zod-gpt';

const openai = new OpenAIChatApi({ apiKey: 'YOUR_OPENAI_KEY' });

const siteSchema = z.object({
    name: z.string().describe('The name of the startup'),
    description: z.string().describe('What does this startup do?'),
});

const response = await completion(openai, 'Generate a startup idea', {
  schema: siteSchema,
});

// data will be typed as { name: string; description: string }
console.log(response.data);