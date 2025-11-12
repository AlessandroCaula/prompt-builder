import { Action, ActionPanel, Clipboard, Icon, showHUD, showToast, Toast, useNavigation } from "@raycast/api";
import SaveTemplateForm from "./SaveTemplateForm";
import { FormValues, PromptFormActionsProp } from "../types";
import { validateForm } from "../utils/validation";
import buildPrompt from "../utils/buildPrompt";
import PreviewPrompt from "./PreviewPrompt";

const PromptFormActions = ({ formState, templateState }: PromptFormActionsProp) => {
  const { push } = useNavigation();
  const { formValues, resetForm, setTaskError } = formState;
  const { selectedTemplateId, setSelectedTemplateId, templates, addTemplate, updateTemplate, deleteTemplate } =
    templateState;

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
