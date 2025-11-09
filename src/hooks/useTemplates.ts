import { useEffect, useState } from "react";
import { FormValues } from "../types";
import { randomUUID } from "crypto";
import { LocalStorage } from "@raycast/api";

export interface Template {
  id: string;
  title: string;
}

export interface StoredTemplate extends FormValues {
  id: string;
}

const TEMPLATE_LIST_KEY = "promptTemplateList";
const TEMPLATE_VALUES_KEY = "promptTemplateValues";

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([{ id: "none", title: "None" }]);
  const [storedTemplates, setStoredTemplates] = useState<StoredTemplate[]>([
    {
      id: "none",
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

  useEffect(() => {
    const loadTemplates = async () => {
      const savedTemplates = await LocalStorage.getItem<string>(TEMPLATE_LIST_KEY);
      const savedValues = await LocalStorage.getItem<string>(TEMPLATE_VALUES_KEY);

      if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
      if (savedValues) setStoredTemplates(JSON.parse(savedValues));
    };

    loadTemplates();
  }, []);

  const addTemplate = async (title: string, values: FormValues): Promise<string> => {
    const id = randomUUID();

    const newTemplate: Template = { id, title };
    const newStoredTemplate: StoredTemplate = { id, ...values };

    const updatedTemplates = [...templates, newTemplate];
    const updatedStoredTemplates = [...storedTemplates, newStoredTemplate];

    setTemplates(updatedTemplates);
    setStoredTemplates(updatedStoredTemplates);

    await LocalStorage.setItem(TEMPLATE_LIST_KEY, JSON.stringify(updatedTemplates));
    await LocalStorage.setItem(TEMPLATE_VALUES_KEY, JSON.stringify(updatedStoredTemplates));

    return id;
  };

  const removeTemplate = async (id: string) => {
    const updatedTemplates = templates.filter((t) => t.id !== id);
    const updatedStoredTemplates = storedTemplates.filter((t) => t.id !== id);

    setTemplates(updatedTemplates);
    setStoredTemplates(updatedStoredTemplates);

    await LocalStorage.setItem(TEMPLATE_LIST_KEY, JSON.stringify(updatedTemplates));
    await LocalStorage.setItem(TEMPLATE_VALUES_KEY, JSON.stringify(updatedStoredTemplates));
  };

  const updateTemplate = async (id: string, title: string, values: FormValues) => {
    if (!templates.find((t) => t.id === id)) {
      throw new Error(`Template with id ${id} not found`);
    }
    
    const updatedTemplates = templates.map((t) => (t.id === id ? { ...t, title } : t));
    const updatedStoredTemplates = storedTemplates.map((t) => (t.id === id ? { ...t, ...values } : t));

    setTemplates(updatedTemplates);
    setStoredTemplates(updatedStoredTemplates);

    await LocalStorage.setItem(TEMPLATE_LIST_KEY, JSON.stringify(updatedTemplates));
    await LocalStorage.setItem(TEMPLATE_VALUES_KEY, JSON.stringify(updatedStoredTemplates));
  };

  return { templates, storedTemplates, addTemplate, updateTemplate, removeTemplate };
};
