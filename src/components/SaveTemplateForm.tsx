import { Action, ActionPanel, Form, showToast, Toast, useNavigation } from "@raycast/api";
import { FormValues } from "../types";
import { useState } from "react";

export interface TemplateForm {
  title: string;
}

export interface SaveTemplateFormProps {
  addTemplate: (title: string, values: FormValues) => Promise<string>;
  updateTemplate?: (id: string, title: string, values: FormValues) => Promise<void>;
  selectedTemplateId?: string;
  setSelectedTemplateId: React.Dispatch<React.SetStateAction<string>>;
  formValues: FormValues;
  isUpdate: boolean;
  initialTitle?: string;
}

const SaveTemplateForm = ({
  addTemplate,
  updateTemplate,
  selectedTemplateId,
  setSelectedTemplateId,
  formValues,
  isUpdate = false,
  initialTitle,
}: SaveTemplateFormProps) => {
  const { pop } = useNavigation();
  const [title, setTitle] = useState(initialTitle || "");

  const handleSave = async (values: TemplateForm) => {
    try {
      const id = await addTemplate(values.title, formValues);
      setSelectedTemplateId(id);

      await showToast({
        style: Toast.Style.Success,
        title: "Template saved",
      });

      pop();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to save template",
        message: String(error),
      });
    }
  };

  const handleUpdate = async (values: TemplateForm) => {
    try {
      if (!selectedTemplateId || !updateTemplate) return;
      await updateTemplate(selectedTemplateId, values.title, formValues);

      await showToast({
        style: Toast.Style.Success,
        title: "Template Updated",
      });

      pop();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to update template",
        message: String(error),
      });
    }
  };

  return (
    <Form
      navigationTitle={isUpdate ? "Update Template" : "Save Template"}
      actions={
        <ActionPanel>
          {isUpdate ? (
            <Action.SubmitForm title="Update Template" onSubmit={handleUpdate} />
          ) : (
            <Action.SubmitForm title="Save Template" onSubmit={handleSave} />
          )}
        </ActionPanel>
      }
    >
      <Form.Description text="Save as Template" />

      <Form.TextField id="title" title="Template Title" value={title} onChange={setTitle} />
    </Form>
  );
};

export default SaveTemplateForm;
