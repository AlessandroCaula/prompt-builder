import { FormValues } from "../types";

const buildPrompt = (values: FormValues): string => {
  let finalPrompt: string = "";

  // Add the role if present
  if (values.role) {
    finalPrompt += `You are a ${values.role} \n \n`;
  }
  // Add the task. Need to exists, otherwise fails the validation.
  finalPrompt += `Your goal is to ${values.task} \n \n`;
  // Add the Reference if present.
  if (values.reference) {
    finalPrompt += `Here's the input you'll work with: \n${values.reference} \n \n`;
  }
  // Add the output constraints if present.
  if (values.format) {
    finalPrompt += `Follow these constraints: \n${values.format} \n \n`;
  }
  // Add the tone if present.
  if (values.tone !== "None") {
    finalPrompt += `Use a ${values.tone} tone \n \n`;
  }
  // Add the audience if present
  if (values.audience) {
    finalPrompt += `Target audience: \n${values.audience} \n \n`;
  }
  // Add an example if present
  if (values.example) {
    finalPrompt += `Here's an example to guide your response: \n${values.example} \n \n`;
  }
  // Add the output expectation if present
  if (values.output) {
    finalPrompt += `Output a ${values.output} \n \n`;
  }
  // Add reasoning if present
  if (values.reasoning) {
    finalPrompt += `Explain your reasoning step-by-step but use natural language. \n`;
  }
  // Add followup if present
  if (values.reasoning) {
    finalPrompt += `At the end, suggest one related topic I could explore next. \n`;
  }

  return finalPrompt.trim();
};

export default buildPrompt;