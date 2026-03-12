import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";
import StepThree from "../components/StepThree";
import { Formik, Form, type FormikHelpers, useFormikContext } from "formik";
import { useAtom } from "jotai";
import { orderFormAtom, clearSensitiveDataAtom } from "../../../store";
import StepFour from "../components/StepFour";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createCreditCardTransaction } from "../../../api/backend";
import { encryptCard } from "../../../utils/encryptCard";
import { createOrder } from "../../../api/orders";
import { validationSchema } from "../../../utils/schema/validationSchema";
import type { FormValues } from "../../../types";
import { v4 as uuidv4 } from "uuid";
import TagManager from "react-gtm-module";
import { useEffect, useRef } from "react";
import { saveAbandonedCart, markCartConverted } from "../../../api/abandonedCarts";

function CartAutoSave() {
  const { values, isSubmitting } = useFormikContext<FormValues>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedRef = useRef(false);

  // Reset saved flag when key fields change (user edited again)
  useEffect(() => {
    savedRef.current = false;
  }, [values.email, values.firstName, values.lastName, values.phoneNumber]);

  useEffect(() => {
    // Require minimum fields before considering it an abandoned cart
    const hasMinFields =
      values.firstName.trim() &&
      values.lastName.trim() &&
      values.email.trim() &&
      values.phoneNumber.trim();

    if (!hasMinFields || isSubmitting || savedRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      savedRef.current = true;
      saveAbandonedCart({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        city: values.city || undefined,
        streetAddress: values.streetAddress || undefined,
        postalCode: values.postalCode || undefined,
        country: values.country || undefined,
        quantity: values.quantity ? Number(values.quantity) : undefined,
        size: values.size || undefined,
        price: values.price ? Number(values.price) : undefined,
        shippingCost: values.shippingCost ? Number(values.shippingCost) : undefined,
        selectedProductId: values.selectedProductId || undefined,
      });
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    values.firstName,
    values.lastName,
    values.email,
    values.phoneNumber,
    values.city,
    values.streetAddress,
    values.selectedProductId,
    values.quantity,
    values.size,
    isSubmitting,
  ]);

  return null;
}

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
    size: formData.size || "S-M: 36-42",
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
      const shippingCost = Number(values.shippingCost) || 0;
      const totalWithShipping = unitPrice + shippingCost;

      const client: Record<string, string> = {};
      const fullName = `${values.firstName} ${values.lastName}`.trim();
      if (fullName) client.name = fullName;
      if (values.email) client.email = values.email;
      if (values.phoneNumber) client.phone_number = values.phoneNumber;
      if (values.city) client.city = values.city;
      if (values.streetAddress) client.address_line_1 = values.streetAddress;
      if (values.postalCode) client.zip = values.postalCode;

      const encrypted_card = await encryptCard({
        card_number: values.cardNumber.replace(/\s+/g, ""),
        cvv: values.cvv,
        expire_month,
        expire_year,
      });

      const result = await createCreditCardTransaction({
        txn_type: "debit",
        encrypted_card,
        items: [
          {
            name: "Insola Order",
            type: "I",
            unit_price: totalWithShipping,
            units_number: 1,
          },
        ],
        client: Object.keys(client).length ? (client as any) : undefined,
      });

      if (result.tranzila.error_code === 0) {
        clearSensitive();

        const orderId = uuidv4();
        const transactionId = result.stored_transaction_id || orderId;

        try {
          await createOrder({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            city: values.city,
            streetAddress: values.streetAddress,
            postalCode: values.postalCode,
            country: values.country || "Israel",
            quantity: unitsNumber,
            size: values.size,
            price: unitPrice,

            totalAmount: totalWithShipping,
            shippingCost: shippingCost,
            transactionId: transactionId,
            paymentStatus: "success",
            orderSource: "main_checkout",
            isUpsell: false,
            isDownsell: false,
            marketingEmails: values.marketingEmails,
            marketingSMS: values.marketingSMS,
          });
        } catch (orderError) {
          console.error("Failed to save order:", orderError);
        }

        if (values.email) {
          markCartConverted(values.email).catch(() => {});
        }

        TagManager.dataLayer({
          dataLayer: {
            event: "payment_success",
          },
        });

        navigate("/success", {
          state: {
            orderId,
            quantity: unitsNumber,
            price: totalWithShipping,
            initialTransactionId: transactionId,
            userInfo: {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phoneNumber: values.phoneNumber,
              city: values.city,
              size: values.size,
              streetAddress: values.streetAddress,
              postalCode: values.postalCode,
              country: values.country || "Israel",
              marketingEmails: values.marketingEmails,
              marketingSMS: values.marketingSMS,
            },
          },
        });
        return;
      }

      const errorMessage = result.tranzila.message || "Payment failed";
      toast.error(errorMessage);
      navigate("/error", {
        state: {
          errorMessage,
          userInfo: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            city: values.city,
            streetAddress: values.streetAddress,
            postalCode: values.postalCode,
            country: values.country || "Israel",
            quantity: unitsNumber,
            size: values.size,
            price: unitPrice,
            totalAmount: totalWithShipping,
            shippingCost: shippingCost,
          },
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Payment failed";
      toast.error(msg);
      TagManager.dataLayer({
        dataLayer: {
          event: "payment_error",
        },
      });
      const _unitPrice = Number(values.price);
      const _shippingCost = Number(values.shippingCost) || 0;
      navigate("/error", {
        state: {
          errorMessage: msg,
          userInfo: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            city: values.city,
            streetAddress: values.streetAddress,
            postalCode: values.postalCode,
            country: values.country || "Israel",
            quantity: Number(values.quantity),
            size: values.size,
            price: _unitPrice,
            totalAmount: _unitPrice + _shippingCost,
            shippingCost: _shippingCost,
          },
        },
      });
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
          <CartAutoSave />
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
