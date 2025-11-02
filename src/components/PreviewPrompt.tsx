import { Action, ActionPanel, Detail } from "@raycast/api";
import { PreviewPromptProps } from "../types";

const PreviewPrompt = ({ prompt }: PreviewPromptProps) => {
  // Generate the prompt
  return (
    <Detail
      navigationTitle="Generated Prompt"
      markdown={`\`\`\`\n${prompt}\n\`\`\``}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Prompt" content={prompt} />
          {/* <Action.Push icon={Icon.Pencil} title="Edit Prompt" shortcut={{ modifiers: ["cmd"], key: "e" }} /> */}
        </ActionPanel>
      }
    />
  );
};

export default PreviewPrompt;
