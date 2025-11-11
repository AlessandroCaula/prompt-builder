import { useEffect, useState } from "react";
import { FormValues } from "../types";
import { LocalStorage } from "@raycast/api";

export const usePersistentForm = () => {
  const initialValues: FormValues = {
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
  };

  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  // Load saved values on mount
  useEffect(() => {
    const loadValues = async () => {
      const saved = await LocalStorage.getItem<string>("promptFormValues");
      if (saved) setFormValues(JSON.parse(saved));
    };
    loadValues();
  }, []);

  // Save values on change
  const handleChange = (id: keyof FormValues, value: string | boolean) => {
    const newValues = { ...formValues, [id]: value };
    setFormValues(newValues);
    LocalStorage.setItem("promptFormValues", JSON.stringify(newValues));
  };

  const resetForm = () => {
    setFormValues(initialValues);
    LocalStorage.setItem("promptFormValues", JSON.stringify(initialValues));
  };

  return { formValues, handleChange, setFormValues, resetForm };
};
