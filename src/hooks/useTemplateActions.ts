import { useState } from "react";
import { FormValues } from "../types";
import { useTemplates } from "./useTemplates";
import { Alert, confirmAlert, LocalStorage, showToast, Toast } from "@raycast/api";

export const useTemplateActions = (setFormValues: (values: FormValues) => void, resetForm: () => void) => {
  const { templates, addTemplate, updateTemplate, removeTemplate } = useTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("none");

  // useEffect(() => {
  //   if (templates.length <= 1) return; // only default template available

  //   const restoreLastTemplate = async () => {
  //     const lastId = await LocalStorage.getItem<string>("lastTemplateId");
  //     if (!lastId) return;

  //     const found = templates.find((t) => t.id === lastId);
  //     if (found) {
  //       setSelectedTemplateId(lastId);
  //       setFormValues(found);
  //     }
  //   };

  //   restoreLastTemplate();
  // }, [templates]);

  const loadTemplate = async (templateId: string) => {
    const loadedTemplate = templates.find((t) => t.id === templateId);
    if (!loadedTemplate) return;

    setSelectedTemplateId(templateId);
    setFormValues(loadedTemplate);
    await LocalStorage.setItem("lastTemplateId", templateId);
  };

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
    selectedTemplateId,
    setSelectedTemplateId,
    templates,
    addTemplate,
    updateTemplate,
    loadTemplate,
    deleteTemplate,
  };
};
