import { Template } from "../types";
import { LocalStorage } from "@raycast/api";

const TEMPLATE_KEY = "promptTemplateValues";

const defaultTemplate: Template = {
  id: "none",
  title: "None",
  role: "",
  task: "",
  reference: "",
  format: "",
  tone: "None",
  audience: "",
  creativity: "None",
  example: "",
  meta: "",
  reasoning: false,
  sources: false,
  summary: false,
  noEmDash: false,
};

const load = async (): Promise<Template[]> => {
  const storedTemplates = await LocalStorage.getItem<string>(TEMPLATE_KEY);
  if (!storedTemplates) return [];
  try {
    return JSON.parse(storedTemplates);
  } catch {
    await LocalStorage.removeItem(TEMPLATE_KEY);
    return [];
  }
};

const save = async (templates: Template[]) => {
  const filtered = templates.filter((t) => t.id !== "none");
  await LocalStorage.setItem(TEMPLATE_KEY, JSON.stringify(filtered));
};

const remove = async (id: string) => {
  const stored = await load();
  const updated = stored.filter((t) => t.id !== id);
  await save(updated);
};

export const templateService = {
  defaultTemplate,
  load,
  save,
  remove,
};
