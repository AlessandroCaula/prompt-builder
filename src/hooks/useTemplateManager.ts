import { useState } from "react";
import { useTemplates } from "./useTemplates";
import { FormValues } from "../types";
import { Alert, confirmAlert, showToast, Toast } from "@raycast/api";

// const LAST_TEMPLATE_ID = "lastTemplateId";

export const useTemplateManager = () => {
  const {
    templates,
    defaultTemplate,
    addTemplate: addTemplateStorage,
    updateTemplate: updateTemplateStorage,
    removeTemplate,
  } = useTemplates();
  const [formValues, setFormValues] = useState<FormValues>({ ...defaultTemplate });
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("none");

  const handleChange = (id: keyof FormValues, value: string | boolean) => {
    // const newValues = { ...formValues, [id]: value };
    // setFormValues(newValues);
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormValues(defaultTemplate);
  };

  const openTemplate = async (templateId: string) => {
    const loadedTemplate = templates.find((t) => t.id === templateId);
    if (!loadedTemplate) return;
    setSelectedTemplateId(templateId);
    setFormValues(loadedTemplate);
    // if (templateId !== "none") {
    //   await LocalStorage.setItem(LAST_TEMPLATE_ID, templateId);
    // }
  };

  const addTemplate = async (title: string, values: FormValues): Promise<string> => {
    const newId = await addTemplateStorage(title, values);

    await new Promise(resolve => setTimeout(resolve, 0));
    
    setSelectedTemplateId(newId);
    return newId;
  };

  const updateTemplate = async (id: string, title: string, values: FormValues) => {
    await updateTemplateStorage(id, title, values);
    if (id === selectedTemplateId) {
      setFormValues(values);
    }
  }

  const deleteTemplate = async () => {
    const confirmed = await confirmAlert({
      title: "Delete Template",
      message: "Are you sure you want to delete this template?",
      primaryAction: { title: "Delete", style: Alert.ActionStyle.Destructive },
    });

    if (!confirmed) return;

    try {
      setSelectedTemplateId("none");
      await removeTemplate(selectedTemplateId);
      resetForm();
      await showToast({
        style: Toast.Style.Success,
        title: "Template deleted",
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to delete template",
        message: String(error),
      });
    }
  };

  return {
    templates,
    formValues,
    selectedTemplateId,
    setSelectedTemplateId,
    setFormValues,
    handleChange,
    openTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    resetForm,
  };
};
