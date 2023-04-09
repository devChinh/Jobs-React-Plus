import * as yup from "yup";

export const validationAddProject = yup.object({
  textField1: yup.string().required("Project name is required"),
});

export const validationAddWorkspace = yup.object({
  textField1: yup.string().required("Worspace name is required"),
});
