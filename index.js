"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const llm_api_1 = require("llm-api");
const zod_1 = require("zod");
const zod_gpt_1 = require("zod-gpt");
const process_1 = __importDefault(require("process"));
require('dotenv').config();
const client = new llm_api_1.AnthropicChatApi({ apiKey: process_1.default.env.ANTHROPIC_KEY });
console.log('key: ' + process_1.default.env.ANTHROPIC_KEY);
const controlPanelSchema = zod_1.z.object({
    name: zod_1.z.string().describe('The name of the panel'),
    description: zod_1.z.string().describe('Control panel descriptions'),
    width: zod_1.z.number().describe('The width of the panel'),
    height: zod_1.z.number().describe('The height of the panel'),
    controls: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().describe('The name of the control'),
        description: zod_1.z.string().describe('Control descriptions'),
        type: zod_1.z.string().describe('Control types'),
        x: zod_1.z.number().describe('The x position of the control'),
        y: zod_1.z.number().describe('The y position of the control'),
    }))
});
async function promptLLM(startingInput) {
    const response = await (0, zod_gpt_1.completion)(client, startingInput, {
        schema: controlPanelSchema,
    });
    // data will be typed as { name: string; description: string }
    console.log(response.data);
}
const readline = require('readline').createInterface({
    input: process_1.default.stdin,
    output: process_1.default.stdout
});
function getInput(query, validate) {
    readline.question(query, (input) => {
        if (validate(input)) {
            promptLLM(input);
            readline.close();
        }
        else {
            console.log('Invalid input, try again.');
            getInput(query, validate);
        }
    });
}
getInput('Give directions for generating a control panel... ', (input) => input.trim() !== '');
