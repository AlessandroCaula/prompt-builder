import { useState } from "react";
import { FormValues } from "../types";
import { useTemplates } from "./useTemplates";
import { Alert, confirmAlert, showToast, Toast } from "@raycast/api";

export const useTemplateActions = (
  setFormValues: (values: FormValues) => void,
  resetForm: () => void,
) => {
  const { templates, addTemplate, updateTemplate, removeTemplate } = useTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("none");

  const loadTemplate = (templateId: string) => {
    const loadedTemplate = templates.find((t) => t.id === templateId);
    if (loadedTemplate) {
      setSelectedTemplateId(templateId);
      setFormValues(loadedTemplate);
    }
  };

  const handleTemplateDeletion = async () => {
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
    selectedTemplateId,
    setSelectedTemplateId,
    templates,
    addTemplate,
    updateTemplate,
    loadTemplate,
    handleTemplateDeletion,
  };
};
