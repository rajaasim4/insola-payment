import * as Yup from "yup";

export const validationSchema = Yup.object({
  // Step 1
  selectedProductId: Yup.number().required(),
  size: Yup.string().required("נא לבחור מידה"),
  // warranty: Yup.boolean(),
  price: Yup.string(),
  quantity: Yup.string(),

  // Step 2
  firstName: Yup.string().required("נא להזין שם פרטי"),
  lastName: Yup.string().required("נא להזין שם משפחה"),
  email: Yup.string().email('כתובת דוא"ל לא תקינה').required('נא להזין דוא"ל'),
  marketingEmails: Yup.boolean(),
  marketingSMS: Yup.boolean(),
  // phoneCountryCode: Yup.string(),
  phoneNumber: Yup.string()
    .required("נא להזין מספר טלפון")
    .matches(/^05\d{8}$/, "מספר טלפון לא תקין"),

  // Step 3
  country: Yup.string().required("נא להזין עיר"),
  city: Yup.string().required("נא להזין עיר"),
  streetAddress: Yup.string().required("נא להזין כתובת"),
  // region: Yup.string().required("נא להזין מחוז/אזור"),
  postalCode: Yup.string()
    .required("נא להזין מיקוד")
    .matches(/^\d{3,10}$/, "מיקוד לא תקין"),
  shippingMethod: Yup.string(),
  shippingCost: Yup.string(),
  // Step 4: card fields handled by Tranzila Hosted Fields — no Yup validation needed
  // termsAccepted: Yup.boolean().oneOf([true], "נא לאשר את התנאים"),
});
