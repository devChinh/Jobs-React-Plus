import * as yup from "yup";

export const validationAddCard = yup.object({
  cardNumber: yup.number().required("card number is required"),
  cvc: yup.number().required("cvc is required"),
});
