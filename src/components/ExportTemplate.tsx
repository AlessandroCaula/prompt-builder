import { Action, ActionPanel, Form, Icon, popToRoot, showToast, Toast } from "@raycast/api";
import { useTemplate } from "../hooks/useTemplate";
import fs from "fs";

const ExportTemplate = () => {
  const { templates } = useTemplate();
  const filteredTemplates = templates.filter((t) => t.id !== "none");

  const handleExportTemplates = async (values: { folders: string[]; filename: string }) => {
    try {
      const cleanTemplates = filteredTemplates.filter((t) => t.id !== "none").map(({ id, ...rest }) => rest);

      if (cleanTemplates.length === 0) {
        showToast({ title: "No Templates to Export", style: Toast.Style.Failure });
        return;
      }

      const folder = values.folders[0];
      if (!fs.existsSync(folder) || !fs.lstatSync(folder).isDirectory()) {
        showToast({ title: "Folder not selected", style: Toast.Style.Failure });
        return;
      }

      const templatesContent = JSON.stringify(cleanTemplates, null, 2);
      let filename = values.filename || "prompt-templates.json";
      if (!filename.includes(".json")) filename = filename.concat(".json");
      const templatesPath = `${folder}/${filename}`;
      await fs.promises.writeFile(templatesPath, templatesContent);
      await showToast({ title: "Templates exported", style: Toast.Style.Success });
      popToRoot();
    } catch (error) {
      console.log(error);
      await showToast({ title: "Failed to export templates", style: Toast.Style.Failure });
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Export Templates" icon={{ source: Icon.Upload }} onSubmit={handleExportTemplates} />
        </ActionPanel>
      }
    >
      {filteredTemplates.length === 0 ? (
        <Form.Description text="No templates to export. Create a new template before exporting" />
      ) : (
        <>
          <Form.FilePicker
            id="folders"
            title="Choose Export Folder"
            allowMultipleSelection={false}
            canChooseDirectories
            canChooseFiles={false}
            info="Choose a folder to export all your templates"
          />
          <Form.TextField id="filename" title="Filename" placeholder="prompt-templates.json" />
        </>
      )}
    </Form>
  );
};

export default ExportTemplate;
