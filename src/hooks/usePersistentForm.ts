import { useEffect, useRef, useState } from "react";
import { FormValues } from "../types";
import { LocalStorage } from "@raycast/api";

const FORM_VALUES_KEY = "promptFormValues";
const DEBOUNCE_DELAY = 500;

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
    noEmDash: false,
  };

  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const loadValues = async () => {
      const saved = await LocalStorage.getItem<string>(FORM_VALUES_KEY);
      if (saved) setFormValues(JSON.parse(saved));
    };
    loadValues();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      LocalStorage.setItem(FORM_VALUES_KEY, JSON.stringify(formValues));
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [formValues]);

  const handleChange = (id: keyof FormValues, value: string | boolean) => {
    const newValues = { ...formValues, [id]: value };
    setFormValues(newValues);
  };

  const resetForm = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setFormValues(initialValues);
    LocalStorage.setItem(FORM_VALUES_KEY, JSON.stringify(initialValues));
  };

  return { formValues, handleChange, setFormValues, resetForm };
};
