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

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const savedTemplates = await LocalStorage.getItem<string>(TEMPLATE_KEY);
        if (!savedTemplates) return;
        const parsed: Template[] = JSON.parse(savedTemplates);
        setTemplates([defaultTemplate, ...parsed.filter((t) => t.id !== "none")]);
      } catch (error) {
        console.error("Failed to load templates", error);
        await LocalStorage.removeItem(TEMPLATE_KEY);
      }
    };

    loadTemplates();
  }, []);

  const saveTemplates = async (updater: (prev: Template[]) => Template[]) => {
    //updated: Template[]
    // const withoutNone = updated.filter((t) => t.id !== "none");
    // setTemplates([defaultTemplate, ...withoutNone]);
    // await LocalStorage.setItem(TEMPLATE_KEY, JSON.stringify(withoutNone));
    setTemplates((prev) => {
      const withoutNone = updater(prev).filter((t) => t.id !== "none");
      LocalStorage.setItem(TEMPLATE_KEY, JSON.stringify(withoutNone));
      return [defaultTemplate, ...withoutNone];
    });
  };

  const addTemplate = async (title: string, values: FormValues): Promise<string> => {
    const id = new Date().getTime().toString();
    const newTemplate: Template = { ...values, title, id };
    // const updated = [...templates, newTemplate];
    // await saveTemplates(updated);
    await saveTemplates((prev) => [...prev, newTemplate]);
    return id;
  };

  const updateTemplate = async (id: string, title: string, values: FormValues) => {
    // if (!templates.find((t) => t.id === id)) {
    //   throw new Error(`Template with id ${id} not found`);
    // }
    // const updated = templates.map((t) => (t.id === id ? { ...t, ...values, title: title ?? t.title } : t));
    // await saveTemplates(updated);
    // // await saveTemplates(prev => prev.map((t) => (t.id === id ? { ...t, ...values, title: title ?? t.title } : t)));
    await saveTemplates((prev) => {
      const found = prev.find((t) => t.id === id);
      if (!found) {
        throw new Error(`Template with id ${id} not found`);
      }
      return prev.map((t) => (t.id === id ? { ...t, ...values, title: title ?? t.title } : t));
    });
  };

  const removeTemplate = async (id: string) => {
    // const updated = templates.filter((t) => t.id !== id);
    await saveTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return { templates, defaultTemplate, addTemplate, updateTemplate, removeTemplate };
};
