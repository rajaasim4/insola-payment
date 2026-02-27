import { BsFillPatchCheckFill } from "react-icons/bs";
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAtom } from "jotai";
import { orderFormAtom } from "../store";
import StepFour from "./components/StepFour";

const validationSchema = Yup.object({
  // Step 1
  selectedProductId: Yup.number().required(),
  size: Yup.string().required("נא לבחור מידה"),
  warranty: Yup.boolean(),

  // Step 2
  firstName: Yup.string().required("נא להזין שם פרטי"),
  lastName: Yup.string().required("נא להזין שם משפחה"),
  email: Yup.string().email('כתובת דוא"ל לא תקינה').required('נא להזין דוא"ל'),
  marketingEmails: Yup.boolean(),
  marketingSMS: Yup.boolean(),
  phoneCountryCode: Yup.string(),
  phoneNumber: Yup.string().required("נא להזין מספר טלפון"),

  // Step 3
  country: Yup.string().required("נא להזין עיר"),
  city: Yup.string().required("נא להזין עיר"),
  streetAddress: Yup.string().required("נא להזין כתובת"),
  region: Yup.string().required("נא להזין מחוז/אזור"),
  postalCode: Yup.string().required("נא להזין מיקוד"),
  shippingMethod: Yup.string(),
  shippingCost: Yup.string(),
});

const Order = () => {
  const [formData, setFormData] = useAtom(orderFormAtom);

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

    // paymentMethod: formData.paymentMethod || "",
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
            onSubmit={(values) => {
              setFormData(values);
              console.log("Form submitted:", values);
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
