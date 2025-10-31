import { Action, ActionPanel, Clipboard, Form, useNavigation } from "@raycast/api";

interface handleSubmitProps {
  role?: string;
  task?: string;
  reference?: string;
  format?: string;
  tone?: "Neutral" | "Formal" | "Friendly" | "Persuasive" | "Academic";
  audience?: string;
  example?: string;
  reasoning?: boolean;
  followup?: boolean;
}

const PromptForm = () => {

  const { push } = useNavigation();

  const handleGeneratePrompt = async (values: handleSubmitProps) => {
    // Build the prompt based on the form values
    console.log("Handle submit");
    
  }

  const handleCopyToClipboard = async (values: handleSubmitProps) => {
    // await Clipboard.copy
    console.log("Copy to clipboard")
  }

  return (
    <Form navigationTitle="Build your prompt" actions={
      <ActionPanel>
        <Action.SubmitForm title="Generate Prompt" onSubmit={handleGeneratePrompt} />
        <Action.SubmitForm title="Copy To Clipboard" onSubmit={handleCopyToClipboard} />
      </ActionPanel>
    }>
      <Form.Description text="Build your prompt" />
      <Form.TextField
        id="role"
        title="Role"
        placeholder="E.g. Expert AI prompt engineer"
        info="Who is the AI supposed to be?"
      />
      <Form.TextArea id="task" title="Task" placeholder="What do you want it to do?" enableMarkdown />
      <Form.TextArea id="reference" title="Reference (optional)" placeholder="Paste data, code or test (optional)" />
      <Form.TextArea id="format" title="Format / Constraints" placeholder="Length, style, JSON schema" />
      <Form.Dropdown id="tone" title="Tone" defaultValue="Neutral">
        <Form.Dropdown.Item value="Neutral" title="Neutral" />
        <Form.Dropdown.Item value="Formal" title="Formal" />
        <Form.Dropdown.Item value="Friendly" title="Friendly" />
        <Form.Dropdown.Item value="Persuasive" title="Persuasive" />
        <Form.Dropdown.Item value="Academic" title="Academic" />
      </Form.Dropdown>
      <Form.TextField id="audience" title="Audience (optional)" placeholder="Who is the output for?" />
      <Form.TextArea id="example" title="Example (optional)" placeholder="Example input/output for guidance" />
      <Form.Checkbox id="reasoning" label="Include reasoning style" />
      <Form.Checkbox id="followup" label="Include follow-up suggestion" />
      {/* <Form.Dropdown id="language" title="Language" defaultValue="English">
        <Form.Dropdown.Item value="English" title="English" />
        <Form.Dropdown.Item value="Italian" title="Italian" />
        <Form.Dropdown.Item value="Danish" title="Danish" />
      </Form.Dropdown> */}
    </Form>
  );
};

export default PromptForm;
