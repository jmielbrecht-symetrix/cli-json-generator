import { AnthropicChatApi } from 'llm-api';
import { z } from 'zod';
import { completion } from 'zod-gpt';
import process from 'process';
import path from 'path';

const pathToEnv = path.join(process.cwd(), '.env');
require('dotenv').config({path: pathToEnv, debug: process.env.DEBUG});

const client = new AnthropicChatApi({ apiKey: process.env.ANTHROPIC_KEY }, {model: 'claude-3-haiku-20240307' });

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
          row: z.number().describe('The x coordinate of the control relative to the top left of the panel'),
          rows: z.number().describe('The amount of rows that the control takes up (i.e. vertical space)'),
          col: z.number().describe('The y coordinate of the control relative to the top left of the panel'),
          cols: z.number().describe('The amount of columns that the control takes up (i.e. horizontal space)'),
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
