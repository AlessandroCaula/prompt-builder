import { Action, ActionPanel, Form, Icon, popToRoot, showToast, Toast } from "@raycast/api";
import fs from "fs";
import { FormValues, Template } from "../types";
import { useTemplate } from "../hooks/useTemplate";
import { validateTemplate } from "../utils/validation";

const ImportTemplates = () => {
  const { templates, addTemplate } = useTemplate();

  const dedupeTitle = (title: string, existing: string[]) => {
    if (!existing.includes(title)) return title;
    let counter = 1;
    let newTitle = `${title} (${counter})`;
    while (existing.includes(newTitle)) {
      counter++;
      newTitle = `${title} (${counter})`;
    }
    return newTitle;
  };

  const handleImportTemplates = async (values: { file: string[] }) => {
    try {
      const filePath = values.file[0];

      if (!filePath || !fs.existsSync(filePath)) {
        showToast({ title: "Invalid file", style: Toast.Style.Failure });
        return;
      }
      const content = await fs.promises.readFile(filePath, "utf8");

      // Check JSON syntax
      let imported: unknown;
      try {
        imported = JSON.parse(content);
      } catch {
        showToast({ title: "Invalid JSON format", style: Toast.Style.Failure });
        return;
      }

      if (!Array.isArray(imported)) {
        showToast({ title: "Invalid JSON structure", style: Toast.Style.Failure });
        return;
      }

      const existingTitles = templates.map((t) => t.title);
      let countImported = 0;
      let countValidated = 0;

      for (const entry of imported) {
        countImported++;

        // Validate the template
        if (validateTemplate(entry)) {
          const { title, ...rest } = entry as Omit<Template, "id">;
          const formValues: FormValues = rest;

          const uniqueTitle = dedupeTitle(title, existingTitles);

          try {
            await addTemplate(uniqueTitle, formValues);
            existingTitles.push(uniqueTitle);
            countValidated++;
            await new Promise((resolve) => setTimeout(resolve, 50));
          } catch (error) {
            console.log(error);
            showToast({ title: "Invalid JSON format", style: Toast.Style.Failure });
          }
        } else {
          console.log("Skipped imported Template: \n", entry);
          continue;
        }
      }
      if (countValidated === countImported) {
        showToast({ title: "All Templates Successfully Imported", style: Toast.Style.Success });
      } else {
        showToast({
          title: `Successfully Imported ${countValidated}/${countImported} Templates`,
          style: Toast.Style.Success,
        });
      }
      popToRoot();
    } catch (error) {
      showToast({ title: "Unexpected error", style: Toast.Style.Failure });
      console.log(error);
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Import Templates" icon={{ source: Icon.Upload }} onSubmit={handleImportTemplates} />
        </ActionPanel>
      }
    >
      <Form.FilePicker
        id="file"
        title="Choose File"
        allowMultipleSelection={false}
        canChooseFiles
        canChooseDirectories={false}
      />
    </Form>
  );
};

export default ImportTemplates;
