import { AnthropicChatApi } from 'llm-api';
import { z } from 'zod';
import { completion } from 'zod-gpt';
import process from 'process';

require('dotenv').config();

const client = new AnthropicChatApi({ apiKey: process.env.ANTHROPIC_KEY });

console.log('key: ' + process.env.ANTHROPIC_KEY);
const controlPanelSchema = z.object({
  name: z.string().describe('The name of the panel'),
  description: z.string().describe('Control panel descriptions'),
  width: z.number().describe('The width of the panel'),
  height: z.number().describe('The height of the panel'),
  controls: z.array(
      z.object({
          name: z.string().describe('The name of the control'),
          description: z.string().describe('Control descriptions'),
          type: z.string().describe('Control types'),
          x: z.number().describe('The x position of the control'),
          y: z.number().describe('The y position of the control'),
      })
  )
});

async function promptLLM(startingInput: string) {
  const response = await completion(
    client, 
	startingInput, 
    {
      schema: controlPanelSchema,
    }
);
  
  // data will be typed as { name: string; description: string }
  console.log(response.data);
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function getInput(query: string, validate: (input: string) => boolean) {
	readline.question(query, (input: string) => {
	if (validate(input)) {
		promptLLM(input);
		readline.close();
	} else {
		console.log('Invalid input, try again.');
		getInput(query, validate);
	}
	});
}

getInput('Give directions for generating a control panel... ', (input: string) => input.trim() !== '');
