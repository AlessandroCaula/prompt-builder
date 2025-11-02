import { Action, ActionPanel, Clipboard, Form, Icon, showHUD, useNavigation } from "@raycast/api";
import { useState } from "react";
import buildPrompt from "../utils/buildPrompt";
import { FormValues } from "../types";
import PreviewPrompt from "./PreviewPrompt";
import { validateForm } from "../utils/validation";

const PromptForm = () => {
  const { push } = useNavigation();
  const [taskError, setTaskError] = useState<string | undefined>();
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handlePreviewPrompt = async (values: FormValues) => {
    // Validate the form values
    const errors = validateForm(values);
    if (errors.task) {
      setTaskError(errors.task);
      return;
    }

    // Generate the prompt
    const generatedPrompt = buildPrompt(values);
    // Navigate to another page showing the prompt
    push(<PreviewPrompt prompt={generatedPrompt} />);
  };

  const handleCopyToClipboard = async (values: FormValues) => {
    // Validate the form values
    const errors = validateForm(values);
    if (errors.task) {
      setTaskError(errors.task);
      return;
    }

    // Copy to clipboard
    try {
      // Generate the prompt
      const generatedPrompt = buildPrompt(values);
      // await Clipboard.copy(generatedPrompt);
      await Clipboard.copy(generatedPrompt.replace(/\n/g, "\n"));
      await showHUD("Copied to Clipboard");
    } catch (error) {
      await showHUD("Failed to Copy Prompt");
      console.log("Clipboard error:", error);
    }
  };

  return (
    <Form
      navigationTitle="Build your prompt"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Copy to Clipboard" onSubmit={handleCopyToClipboard} />
          <Action.SubmitForm
            title="Preview Prompt"
            icon={Icon.Eye}
            onSubmit={handlePreviewPrompt}
            shortcut={{ modifiers: ["cmd"], key: "v" }}
          />
        </ActionPanel>
      }
    >
      <Form.Description text="Build your prompt" />

      <Form.TextField
        id="role"
        title="Role"
        placeholder="E.g. Data Scientist, Writer..."
        info="Who is the AI supposed to be?"
      />

      <Form.TextArea
        id="task"
        title="Task"
        placeholder="E.g. Summarize this article."
        info="What should the AI do?"
        enableMarkdown
        error={taskError}
        onChange={(value) => {
          if (taskError && value.trim().length > 0) setTaskError(undefined);
        }}
      />

      <Form.TextArea
        id="reference"
        title="Reference"
        placeholder="E.g. Text, data, code..."
        info="Optional: Provide context the AI can use"
      />

      <Form.TextField
        id="format"
        title="Format / Constraints"
        placeholder="E.g. JSON, ≤200 words, Avoid jargon, keep it concise..."
        info="Optional: How should it answer?"
      />

      <Form.Checkbox id="showAdvance" label="Show advanced options" onChange={(checked) => setShowAdvanced(checked)} />

      {showAdvanced && (
        <>
          <Form.Dropdown id="tone" title="Tone" defaultValue="None" info="Choose the writing tone.">
            <Form.Dropdown.Item value="None" title="None" />
            <Form.Dropdown.Item value="Neutral" title="Neutral" />
            <Form.Dropdown.Item value="Formal" title="Formal" />
            <Form.Dropdown.Item value="Friendly" title="Friendly" />
            <Form.Dropdown.Item value="Persuasive" title="Persuasive" />
            <Form.Dropdown.Item value="Academic" title="Academic" />
          </Form.Dropdown>

          <Form.TextField
            id="audience"
            title="Audience"
            placeholder="E.g. Students, Developers..."
            info="Who is it for?"
          />

          <Form.TextArea
            id="example"
            title="Example"
            placeholder="E.g. Input → Output"
            info="Show the style you want."
          />

          <Form.Checkbox id="reasoning" label="Include reasoning style" info="AI explains its thought process." />

          <Form.Checkbox id="followup" label="Include follow-up suggestion" info="AI suggests next topic" />
        </>
      )}
    </Form>
  );
};

export default PromptForm;
