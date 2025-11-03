// type Tone = "None" | "Neutral" | "Formal" | "Friendly" | "Conversational" | "Persuasive" | "Academic" | "Technical";

export const tones = [
  "None",
  // Casual
  "Friendly",
  "Conversational",
  // Balanced
  "Neutral",
  // Professional
  "Formal",
  "Professional",
  "Technical",
  "Academic",
  // Special
  "Persuasive",
  "Empathetic",
] as const;
type Tone = (typeof tones)[number];

export const creativity = ["None", "Low", "Medium", "High"];
type Creativity = (typeof creativity)[number];

export interface FormValues {
  role?: string;
  task: string;
  reference?: string;
  format?: string;
  tone?: Tone;
  audience?: string;
  creativity?: Creativity;
  example?: string;
  meta?: string;
  reasoning?: boolean;
  sources?: boolean;
  summary?: boolean;
  followup?: boolean;
}

export interface PreviewPromptProps {
  prompt: string;
}
