import { Action, ActionPanel, Form, showToast, Toast } from "@raycast/api";
import { useTemplates } from "../hooks/useTemplates";
import { usePersistentForm } from "../hooks/usePersistentForm";

export interface TemplateForm {
  title: string;
}

const SaveTemplateForm = () => {

  const { addTemplate } = useTemplates();
  const { formValues } = usePersistentForm();

  const handleSaveTemplate = async (values: TemplateForm) => {
    console.log(values.title);
    try {
      console.log(values.title, formValues);
      addTemplate(values.title, formValues);
      await showToast({
        style: Toast.Style.Success,
        title: "Template saved",
      })

    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to save template",
        message: String(error),
      })
    }
  };

  return (
    <Form
      navigationTitle="Save Template"
      actions={
        <ActionPanel>
          <Action.SubmitForm 
            title="Save Template" 
            onSubmit={handleSaveTemplate}
          />
        </ActionPanel>
      }
    >
      <Form.Description text="Save as Template" />

      <Form.TextField id="title" title="Template Title" />
    </Form>
  );
};

export default SaveTemplateForm;
