import { Action, ActionPanel, Clipboard, Icon, showHUD, showToast, Toast, useNavigation } from "@raycast/api";
import SaveTemplateForm from "./SaveTemplateForm";
import { FormValues, Template } from "../types";
import { validateForm } from "../utils/validation";
import buildPrompt from "../utils/buildPrompt";
import PreviewPrompt from "./PreviewPrompt";
// import { useTemplateActions } from "../hooks/useTemplateActions";

export interface PromptFormActionsProp {
  formValues: FormValues;
  setFormValues: (values: FormValues) => void;
  resetForm: () => void;
  setTaskError: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedTemplateId: string;
  setSelectedTemplateId: React.Dispatch<React.SetStateAction<string>>;
  templates: Template[];
  addTemplate: (title: string, values: FormValues) => Promise<string>;
  updateTemplate: (id: string, title: string, values: FormValues) => Promise<void>;
  deleteTemplate: () => Promise<void>;
}

const PromptFormActions = ({
  formValues,
  resetForm,
  setTaskError,
  selectedTemplateId,
  setSelectedTemplateId,
  templates,
  addTemplate,
  updateTemplate,
  deleteTemplate
}: PromptFormActionsProp) => {
  const { push } = useNavigation();

  // const { selectedTemplateId, setSelectedTemplateId, templates, addTemplate, updateTemplate, handleTemplateDeletion } =
  //   useTemplateActions(setFormValues, resetForm);

  const validateAndGetPrompt = (values: FormValues): string | undefined => {
    const errors = validateForm(values);
    if (errors.task) {
      setTaskError(errors.task);
      return;
    }
    const generatedPrompt = buildPrompt(values);
    return generatedPrompt;
  };

  const handlePreviewPrompt = async (values: FormValues) => {
    const prompt = validateAndGetPrompt(values);
    if (!prompt) return;

    push(<PreviewPrompt prompt={prompt} />);
  };

  const handleCopyToClipboard = async (values: FormValues) => {
    try {
      const prompt = validateAndGetPrompt(values);
      if (!prompt) return;

      await Clipboard.copy(prompt);
      await showHUD("Copied to Clipboard");
    } catch (error) {
      await showHUD("Failed to Copy Prompt");
      console.log("Clipboard error:", error);
    }
  };

  return (
    <ActionPanel>
      <Action.SubmitForm title="Copy to Clipboard" onSubmit={handleCopyToClipboard} />
      <Action.SubmitForm
        title="Preview Prompt"
        icon={Icon.Eye}
        onSubmit={handlePreviewPrompt}
        shortcut={{ modifiers: ["cmd"], key: "y" }}
      />
      <Action.Push
        title="Save as Template"
        icon={Icon.SaveDocument}
        shortcut={{ modifiers: ["cmd"], key: "s" }}
        target={
          <SaveTemplateForm
            addTemplate={addTemplate}
            setSelectedTemplateId={setSelectedTemplateId}
            templates={templates}
            formValues={formValues}
            isUpdate={false}
            initialTitle={templates.find((t) => t.id === selectedTemplateId && t.id !== "none")?.title ?? ""}
          />
        }
      />

      {selectedTemplateId !== "none" && (
        <>
          <Action.Push
            title="Update Template"
            icon={Icon.Repeat}
            shortcut={{ modifiers: ["cmd"], key: "u" }}
            target={
              <SaveTemplateForm
                addTemplate={addTemplate}
                updateTemplate={updateTemplate}
                selectedTemplateId={selectedTemplateId}
                setSelectedTemplateId={setSelectedTemplateId}
                templates={templates}
                formValues={formValues}
                isUpdate={true}
                initialTitle={templates.find((t) => t.id === selectedTemplateId)?.title ?? ""}
              />
            }
          />
          <Action
            title="Delete Template"
            icon={Icon.Trash}
            style={Action.Style.Destructive}
            shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
            onAction={deleteTemplate}
          />
          <Action
            title="New Empty Template"
            icon={Icon.BlankDocument}
            shortcut={{ modifiers: ["cmd"], key: "n" }}
            onAction={() => {
              setSelectedTemplateId("none");
              resetForm();
            }}
          />
        </>
      )}

      <Action
        title="Clear All"
        icon={Icon.Trash}
        style={Action.Style.Destructive}
        shortcut={{ modifiers: ["cmd"], key: "d" }}
        onAction={async () => {
          resetForm();
          setTaskError(undefined);
          await showToast({
            style: Toast.Style.Success,
            title: "Form cleared",
          });
        }}
      />
    </ActionPanel>
  );
};

export default PromptFormActions;
