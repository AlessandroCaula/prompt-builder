import { FormValues } from "../types";

export const validateForm = (values: FormValues) => {
  const errors: { task?: string; title?: string } = {};
  
  if (!values.title || values.title.trim().length === 0) {
    errors.title = "The title field is required";
  }

  if (!values.task || values.task.trim().length === 0) {
    errors.task = "The task field is required";
  }

  return errors;
};
