import { Action, ActionPanel, Form, showToast, Toast, useNavigation } from "@raycast/api";
import { FormValues } from "../types";

export interface TemplateForm {
  title: string;
}

export interface SaveTemplateFormProps {
  addTemplate: (title: string, values: FormValues) => Promise<string>;
  setSelectedTemplateId: React.Dispatch<React.SetStateAction<string>>;
  formValues: FormValues;
}

const SaveTemplateForm = ({ addTemplate, setSelectedTemplateId, formValues }: SaveTemplateFormProps) => {
  const { pop } = useNavigation();

  const handleSaveTemplate = async (values: TemplateForm) => {
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

  return (
    <Form
      navigationTitle="Save Template"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Template" onSubmit={handleSaveTemplate} />
        </ActionPanel>
      }
    >
      <Form.Description text="Save as Template" />

      <Form.TextField id="title" title="Template Title" />

    </Form>
  );
};

export default SaveTemplateForm;
