import * as Yup from "yup";
function luhnCheck(value: string) {
  const digits = value.replace(/\D/g, "");
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (Number.isNaN(digit)) return false;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return digits.length >= 12 && sum % 10 === 0;
}

export const validationSchema = Yup.object({
  // Step 1
  selectedProductId: Yup.number().required(),
  size: Yup.string().required("נא לבחור מידה"),
  warranty: Yup.boolean(),
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
  // phoneNumber: Yup.string()
  //   .required("נא להזין מספר טלפון")
  //   .test('phone-digits', 'מספר טלפון חייב להכיל 3-15 ספרות', (value) => {
  //     if (!value) return false;
  //     const digits = value.replace(/\D/g, '');
  //     return digits.length >= 3 && digits.length <= 15;
  //   }),
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
  // Step 4
  cardNumber: Yup.string()
    .required("נא להזין מספר כרטיס")
    .test("card-number", "מספר כרטיס לא תקין", (value) => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      if (digits.length < 12 || digits.length > 19) return false;
      return luhnCheck(digits);
    }),

  cvv: Yup.string()
    .required("נא להזין CVV")
    .matches(/^\d{3,4}$/, "CVV לא תקין"),
  expiryDate: Yup.string()
    .required("נא להזין תוקף כרטיס")
    .matches(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2}|\d{4})$/, "תוקף לא תקין (MM/YY)"),
  termsAccepted: Yup.boolean().oneOf([true], "נא לאשר את התנאים"),
});
