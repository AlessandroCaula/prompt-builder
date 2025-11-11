import { useEffect, useState } from "react";
import { FormValues, Template } from "../types";
import { randomUUID } from "crypto";
import { LocalStorage } from "@raycast/api";

const TEMPLATE_KEY = "promptTemplateValues";

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
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
      followup: false,
    },
  ]);

  const saveTemplates = async (updated: Template[]) => {
    setTemplates(updated);
    await LocalStorage.setItem(TEMPLATE_KEY, JSON.stringify(updated));
  };

  useEffect(() => {
    const loadTemplates = async () => {
      const savedTemplates = await LocalStorage.getItem<string>(TEMPLATE_KEY);
      if (savedTemplates) {
        try {
          setTemplates(JSON.parse(savedTemplates));
        } catch (error) {
          console.log("Failed to parse saved templates", error);
          await LocalStorage.removeItem(TEMPLATE_KEY);
        }
      }
    };

    loadTemplates();
  }, []);

  const addTemplate = async (title: string, values: FormValues): Promise<string> => {
    const id = randomUUID();
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
