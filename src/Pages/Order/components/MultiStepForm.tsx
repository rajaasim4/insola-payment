import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";
import StepThree from "../components/StepThree";
import { Formik, Form, type FormikHelpers } from "formik";
import { useAtom } from "jotai";
import { orderFormAtom, clearSensitiveDataAtom } from "../../../store";
import StepFour from "../components/StepFour";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createCreditCardTransaction } from "../../../api/backend";
import { validationSchema } from "../../../utils/schema/validationSchema";
import type { FormValues } from "../../../types";
import { v4 as uuidv4 } from "uuid";

function parseExpiryDate(expiryDate: string) {
  const cleaned = String(expiryDate).replace(/\s+/g, "");
  const [mmRaw, yyRaw] = cleaned.split("/");

  const expire_month = Number(mmRaw);
  const yy = String(yyRaw ?? "");
  const expire_year = yy.length === 2 ? Number(`20${yy}`) : Number(yy);

  if (!Number.isFinite(expire_month) || expire_month < 1 || expire_month > 12) {
    return null;
  }

  if (
    !Number.isFinite(expire_year) ||
    expire_year < 2000 ||
    expire_year > 2100
  ) {
    return null;
  }

  return { expire_month, expire_year };
}

const MultiStepForm = () => {
  const [formData, setFormData] = useAtom(orderFormAtom);
  const [, clearSensitive] = useAtom(clearSensitiveDataAtom);
  const navigate = useNavigate();

  const initialValues: FormValues = {
    selectedProductId: formData.selectedProductId || 4,
    size: formData.size || "S-M",
    // warranty: formData.warranty || false,
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    email: formData.email || "",
    marketingEmails: formData.marketingEmails || false,
    marketingSMS: formData.marketingSMS || false,
    phoneNumber: formData.phoneNumber || "",
    country: formData.country || "ישראל",
    city: formData.city || "",
    streetAddress: formData.streetAddress || "",
    postalCode: formData.postalCode || "",
    shippingMethod: formData.shippingMethod || "standard",
    shippingCost: formData.shippingCost || "15",
    price: formData.price || "299.00",
    quantity: formData.quantity || "4",
    cardNumber: formData.cardNumber || "",
    cvv: formData.cvv || "",
    expiryDate: formData.expiryDate || "",
    // termsAccepted: formData.termsAccepted || false,
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
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
        // Clear sensitive data immediately after successful payment
        clearSensitive();

        const orderId = uuidv4();
        const transactionId = result.stored_transaction_id || orderId;

        navigate("/success", {
          state: {
            orderId,
            quantity: unitsNumber,
            price: unitPrice * unitsNumber,
            initialTransactionId: transactionId,
          },
        });
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
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
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
          <div className="grid 900:grid-cols-2 gap-10">
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
  );
};

export default MultiStepForm;
