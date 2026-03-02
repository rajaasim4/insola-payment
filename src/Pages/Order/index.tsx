import { BsFillPatchCheckFill } from "react-icons/bs";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAtom } from "jotai";
import { orderFormAtom } from "../../store";
import StepFour from "./components/StepFour";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createCreditCardTransaction } from "../../api/backend";

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

const validationSchema = Yup.object({
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
  phoneCountryCode: Yup.string(),
  phoneNumber: Yup.string()
    .required("נא להזין מספר טלפון")
    .matches(/^\d{6,15}$/, "מספר טלפון לא תקין"),

  // Step 3
  country: Yup.string().required("נא להזין עיר"),
  city: Yup.string().required("נא להזין עיר"),
  streetAddress: Yup.string().required("נא להזין כתובת"),
  region: Yup.string().required("נא להזין מחוז/אזור"),
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
    .matches(
      /^(0[1-9]|1[0-2])\s*\/\s*(\d{2}|\d{4})$/,
      "תוקף לא תקין (MM/YY)",
    ),
  termsAccepted: Yup.boolean().oneOf([true], "נא לאשר את התנאים"),
});

function parseExpiryDate(expiryDate: string) {
  const cleaned = String(expiryDate).replace(/\s+/g, "");
  const [mmRaw, yyRaw] = cleaned.split("/");

  const expire_month = Number(mmRaw);
  const yy = String(yyRaw ?? "");
  const expire_year = yy.length === 2 ? Number(`20${yy}`) : Number(yy);

  if (!Number.isFinite(expire_month) || expire_month < 1 || expire_month > 12) {
    return null;
  }

  if (!Number.isFinite(expire_year) || expire_year < 2000 || expire_year > 2100) {
    return null;
  }

  return { expire_month, expire_year };
}

const Order = () => {
  const [formData, setFormData] = useAtom(orderFormAtom);
  console.log(formData);
  const navigate = useNavigate();

  const initialValues = {
    selectedProductId: formData.selectedProductId || 4,
    size: formData.size || "S-M",
    warranty: formData.warranty || false,
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    email: formData.email || "",
    marketingEmails: formData.marketingEmails || false,
    marketingSMS: formData.marketingSMS || false,
    phoneCountryCode: formData.phoneCountryCode || "92",
    phoneNumber: formData.phoneNumber || "",
    country: formData.country || "",
    city: formData.city || "",
    streetAddress: formData.streetAddress || "",
    region: formData.region || "",
    postalCode: formData.postalCode || "",
    shippingMethod: formData.shippingMethod || "standard",
    shippingCost: formData.shippingCost || "15",
    price: formData.price || "248.00",
    quantity: formData.quantity || "4",
    cardNumber: formData.cardNumber || "",
    cvv: formData.cvv || "",
    expiryDate: formData.expiryDate || "",
    termsAccepted: formData.termsAccepted || false,
  };

  return (
    <div className="pb-20">
      {/* Header  */}
      <div className="h-70 lg:pt-20 lg:pb-5 bg-[url('/images/header-bg.jpg')] w-full bg-cover bg-center">
        <div className="w-full   mx-auto max-w-5xl flex justify-between lg:flex-row flex-col">
          <div className="lg:w-1/2 max-lg:flex justify-center">
            <img
              src="/images/logo_insola-transparent.png"
              className="max-w-40 "
              alt=""
            />
            <div className="space-y-2.5 font-semibold max-lg:hidden">
              {[
                "מפחית כאבים מגנטי",
                "נוחות מיידית",
                "עיסוי ותמיכה לכף הרגל",
              ].map((text, i) => (
                <div key={i} className="flex gap-2">
                  <BsFillPatchCheckFill className="text-green-400 text-2xl font-bold" />
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 max-lg:flex justify-center">
            <img
              src="/images/product-v3.png"
              className="lg:max-w-90  object-contain w-9/12 lg:w-full h-full"
              alt=""
            />
          </div>
        </div>
      </div>
      {/* Steps */}
      <div className="bg-gray-100 lg:p-5 p-3">
        <div className="max-w-5xl mx-auto lg:py-10 py-5">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setFormData(values);

                const expiry = parseExpiryDate(values.expiryDate);
                if (!expiry) {
                  toast.error("Invalid expiry date. Use MM/YY");
                  return;
                }
                const { expire_month, expire_year } = expiry;

                const unitPrice = Number(values.price);
                const unitsNumber = Number(values.quantity);

                const client: Record<string, string> = {};
                const fullName = `${values.firstName} ${values.lastName}`.trim();
                if (fullName) client.name = fullName;
                if (values.email) client.email = values.email;
                if (values.phoneCountryCode) client.phone_country_code = values.phoneCountryCode;
                if (values.phoneNumber) client.phone_number = values.phoneNumber;
                if (values.city) client.city = values.city;
                if (values.streetAddress) client.address_line_1 = values.streetAddress;
                if (values.postalCode) client.zip = values.postalCode;

                const result = await createCreditCardTransaction({
                  txn_type: "debit",
                  expire_month,
                  expire_year,
                  cvv: values.cvv,
                  card_number: values.cardNumber.replace(/\s+/g, ""),
                  items: [
                    {
                      name: "Insola Order",
                      type: "I",
                      unit_price: unitPrice,
                      units_number: unitsNumber,
                    },
                  ],
                  client: Object.keys(client).length ? (client as any) : undefined,
                });

                if (result.tranzila.error_code === 0) {
                  navigate("/success");
                  return;
                }

                toast.error(result.tranzila.message || "Payment failed");
                navigate("/error");
              } catch (e) {
                const msg = e instanceof Error ? e.message : "Payment failed";
                toast.error(msg);
                navigate("/error");
              } finally {
                setSubmitting(false);
              }
            }}
            enableReinitialize
          >
            {({
              values,
              setFieldValue,
              handleChange,
              handleBlur,
              errors,
              touched,
            }) => (
              <Form>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="bg-white p-5 rounded-md flex flex-col gap-y-10">
                    <StepOne
                      values={values}
                      setFieldValue={setFieldValue}
                      handleChange={handleChange}
                      errors={errors}
                      touched={touched}
                      handleBlur={handleBlur}
                    />
                    <StepTwo
                      values={values}
                      setFieldValue={setFieldValue}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="bg-white p-5 rounded-md flex flex-col gap-y-10">
                    <StepThree
                      values={values}
                      setFieldValue={setFieldValue}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      errors={errors}
                      touched={touched}
                    />
                    <StepFour />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Order;
