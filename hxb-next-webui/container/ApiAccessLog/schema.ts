import * as yup from "yup";

export const validationSchema = yup.object({
  workspace: yup.string(),
  status: yup.string(),
  method: yup.string(),
  url: yup.string(),
  user: yup.string(),
});
