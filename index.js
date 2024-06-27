import { AnthropicChatAPi } from 'llm-api';
import { completion } from 'zod-gpt';

const client = new AnthropicChatAPi({ apiKey: process.env.ANTHROPIC_KEY });

const controlPanelSchema = z.object({
    name: z.string().describe('The name of the panel'),
    description: z.string().describe('Control panel descriptions'),
});

const response = await completion(client, 'Generate a startup idea', {
  schema: controlPanelSchema,
});

// data will be typed as { name: string; description: string }
console.log(response.data);