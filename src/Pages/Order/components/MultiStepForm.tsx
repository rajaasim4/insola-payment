import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";
import StepThree from "../components/StepThree";
import { Formik, Form, type FormikHelpers, useFormikContext } from "formik";
import { useAtom } from "jotai";
import { orderFormAtom } from "../../../store";
import StepFour from "../components/StepFour";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createOrder } from "../../../api/orders";
import { validationSchema } from "../../../utils/schema/validationSchema";
import type { FormValues } from "../../../types";
import { v4 as uuidv4 } from "uuid";
import TagManager from "react-gtm-module";
import { useEffect, useRef } from "react";
import { saveAbandonedCart, markCartConverted } from "../../../api/abandonedCarts";
import { saveFailedTransaction } from "../../../api/failedTransactions";

declare global {
  interface Window {
    TzlaHostedFields: any;
  }
}

// Auto-save abandoned cart after user fills key fields and stops for 5 sec
function CartAutoSave() {
  const { values, isSubmitting } = useFormikContext<FormValues>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedRef = useRef(false);

  useEffect(() => {
    savedRef.current = false;
  }, [values.email, values.firstName, values.lastName, values.phoneNumber]);

  useEffect(() => {
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

function chargeHostedFields(
  fields: any,
  params: Record<string, any>,
): Promise<{ err: any; response: any }> {
  return new Promise((resolve) => {
    fields.charge(params, (err: any, response: any) => {
      resolve({ err, response });
    });
  });
}

const MultiStepForm = () => {
  const [formData, setFormData] = useAtom(orderFormAtom);
  const navigate = useNavigate();
  const hostedFieldsRef = useRef<any>(null);
  const terminalName = (import.meta as any).env?.VITE_TRANZILA_TERMINAL ?? "";

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
  };

  // Initialize Tranzila Hosted Fields after DOM renders
  useEffect(() => {
    const init = () => {
      if (!window.TzlaHostedFields) return;
      hostedFieldsRef.current = window.TzlaHostedFields.create({
        sandbox: false,
        terminal_name: terminalName,
        fields: {
          credit_card_number: {
            selector: "#tzla-card-number",
            placeholder: "4580 4580 4580 4580",
            tabindex: 1,
          },
          cvv: {
            selector: "#tzla-cvv",
            placeholder: "123",
            tabindex: 2,
          },
          expiry: {
            selector: "#tzla-expiry",
            placeholder: "12/26",
            version: "1",
          },
        },
        styles: {
          input: {
            "font-size": "14px",
            "font-family": "inherit",
            color: "#111827",
            "line-height": "1.5",
          },
          select: {
            "font-size": "14px",
            "font-family": "inherit",
          },
        },
      });
    };

    if (window.TzlaHostedFields) {
      init();
    } else {
      const interval = setInterval(() => {
        if (window.TzlaHostedFields) {
          init();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    try {
      setFormData(values);

      if (!hostedFieldsRef.current) {
        toast.error("מערכת התשלום לא נטענה, אנא רענן את הדף");
        return;
      }

      const unitPrice = Number(values.price);
      const unitsNumber = Number(values.quantity);
      const shippingCost = Number(values.shippingCost) || 0;
      const totalWithShipping = unitPrice + shippingCost;

      // 1. Get handshake token from our backend
      const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

      const handshakeRes = await fetch(`${baseUrl}/api/handshake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalWithShipping }),
      });

      if (!handshakeRes.ok) {
        const errData = await handshakeRes.json().catch(() => ({}));
        throw new Error((errData as any).message || "שגיאה באתחול התשלום");
      }

      const { thtk } = await handshakeRes.json();

      // 2. Charge via Hosted Fields (card data stays in Tranzila iframes)
      const { err, response } = await chargeHostedFields(
        hostedFieldsRef.current,
        {
          terminal_name: terminalName,
          amount: totalWithShipping,
          thtk,
          tokenize: true,
          contact: `${values.firstName} ${values.lastName}`.trim(),
          email: values.email || undefined,
          address: values.streetAddress || undefined,
          city: values.city || undefined,
          response_language: "hebrew",
        },
      );

      // 3. Handle errors from Hosted Fields
      if (err) {
        const msgs = err.messages as Array<{ param: string; message: string }>;
        const msg = msgs?.[0]?.message || "שגיאה בפרטי כרטיס האשראי";
        const errEl = document.getElementById("tzla-card-errors");
        if (errEl) errEl.textContent = msg;
        toast.error(msg);
        return;
      }

      const txnResponse = response?.transaction_response;

      if (!txnResponse?.success) {
        const errorMessage = txnResponse?.error || "התשלום נכשל";
        toast.error(errorMessage);
        saveFailedTransaction({
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
          shippingCost,
          errorMessage,
        }).catch(() => {});
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
              shippingCost,
            },
          },
        });
        return;
      }

      // 4. Success — clear card error display
      const errEl = document.getElementById("tzla-card-errors");
      if (errEl) errEl.textContent = "";

      const orderId = uuidv4();
      const transactionId = String(txnResponse.transaction_id || orderId);

      // 5. Save token to backend so upsell (pay-with-saved) works
      const token = txnResponse.token;
      const expireMonth = txnResponse.expiry_month;
      const expireYear = txnResponse.expiry_year;
      if (token) {
        fetch(`${baseUrl}/api/transactions/credit-card/save-token`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            expire_month: expireMonth ? Number(expireMonth) : undefined,
            expire_year: expireYear ? Number(expireYear) : undefined,
          }),
        }).catch(() => {});
      }

      // 6. Save order to our backend
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
          shippingCost,
          transactionId,
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

      // 7. Mark abandoned cart as converted
      if (values.email) {
        markCartConverted(values.email).catch(() => {});
      }

      try { TagManager.dataLayer({ dataLayer: { event: "payment_success" } }); } catch {}

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
    } catch (e) {
      const msg = e instanceof Error ? e.message : "שגיאה בתשלום";
      toast.error(msg);
      try { TagManager.dataLayer({ dataLayer: { event: "payment_error" } }); } catch {}

      const unitPrice = Number(values.price);
      const shippingCost = Number(values.shippingCost) || 0;

      saveFailedTransaction({
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
        price: unitPrice,
        totalAmount: unitPrice + shippingCost,
        shippingCost,
        errorMessage: msg,
      }).catch(() => {});

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
            price: unitPrice,
            totalAmount: unitPrice + shippingCost,
            shippingCost,
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
