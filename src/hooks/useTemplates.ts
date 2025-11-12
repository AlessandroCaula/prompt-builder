import { useEffect, useState } from "react";
import { FormValues, Template } from "../types";
import { LocalStorage } from "@raycast/api";

const TEMPLATE_KEY = "promptTemplateValues";

export const useTemplates = () => {
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

  const [templates, setTemplates] = useState<Template[]>([defaultTemplate]);

  const saveTemplates = async (updated: Template[]) => {
    const withoutNone = updated.filter((t) => t.id !== "none");
    setTemplates([defaultTemplate, ...withoutNone]);
    await LocalStorage.setItem(TEMPLATE_KEY, JSON.stringify(updated));
  };

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const savedTemplates = await LocalStorage.getItem<string>(TEMPLATE_KEY);
        if (!savedTemplates) return;

        const parsed: Template[] = JSON.parse(savedTemplates);
        // setTemplates(parsed);
        setTemplates([defaultTemplate, ...parsed.filter((t) => t.id !== "none")]);
      } catch (error) {
        console.error("Failed to load templates", error);
        await LocalStorage.removeItem(TEMPLATE_KEY);
      }
    };

    loadTemplates();
  }, []);

  const addTemplate = async (title: string, values: FormValues): Promise<string> => {
    const id = new Date().getTime().toString();
    const newStoredTemplate: Template = { ...values, title, id };
    const updatedStoredTemplates = [...templates, newStoredTemplate];
    saveTemplates(updatedStoredTemplates);

    return id;
  };

  const removeTemplate = async (id: string) => {
    const updatedStoredTemplates = templates.filter((t) => t.id !== id);
    saveTemplates(updatedStoredTemplates);
  };

  const updateTemplate = async (id: string, title: string, values: FormValues) => {
    if (!templates.find((t) => t.id === id)) {
      throw new Error(`Template with id ${id} not found`);
    }

    const updatedStoredTemplates = templates.map((t) => (t.id === id ? { ...t, ...values, title } : t));
    saveTemplates(updatedStoredTemplates);
  };

  return { templates, addTemplate, updateTemplate, removeTemplate };
};
