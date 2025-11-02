type Tone = "None" | "Neutral" | "Formal" | "Friendly" | "Persuasive" | "Academic";

export interface FormValues {
  title: string;
  role?: string;
  task: string;
  reference?: string;
  format?: string;
  tone?: Tone;
  audience?: string;
  example?: string;
  output?: string;
  reasoning?: boolean;
  followup?: boolean;
}

export interface PreviewPromptProps {
  prompt: string;
}
