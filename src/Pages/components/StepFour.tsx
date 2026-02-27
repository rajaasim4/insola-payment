// import React from "react";
// import { IoIosLock } from "react-icons/io";
// import { useFormikContext, type FormikContextType } from "formik";
// import { useAtom } from "jotai";
// import { orderFormAtom } from "../../store";
// import type { FormValues } from "../../types";

// const StepFour: React.FC = () => {
//   const { submitForm, values, isSubmitting }: FormikContextType<FormValues> =
//     useFormikContext<FormValues>();
//   const [, setFormData] = useAtom(orderFormAtom);

//   const handleSubmit = async (): Promise<void> => {
//     // Update Jotai state with current form values before submitting
//     setFormData(values);
//     await submitForm();
//   };

//   return (
//     <div>
//       <div className="flex items-center gap-0.5 mb-4">
//         <IoIosLock />
//         <h2 className="font-bold text-base">שלב 4: פרטי חיוב</h2>
//       </div>
//       <button
//         type="button"
//         onClick={handleSubmit}
//         disabled={isSubmitting}
//         className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
//       >
//         {isSubmitting ? "שולח..." : "Submit"}
//       </button>
//     </div>
//   );
// };

// export default StepFour;

import React, { useState } from "react";
import { IoIosLock } from "react-icons/io";
import { useFormikContext, type FormikContextType } from "formik";
import { useAtom } from "jotai";
import { orderFormAtom } from "../../store";
import type { FormValues } from "../../types";

const StepFour: React.FC = () => {
  const {
    submitForm,
    values,
    isSubmitting,
    validateForm,
    setTouched,
  }: FormikContextType<FormValues> = useFormikContext<FormValues>();
  const [, setFormData] = useAtom(orderFormAtom);
  const [showIframe, setShowIframe] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Replace with your actual Tranzilla terminal ID
  const TERMINAL_ID = "251";

  const validateAllSteps = async (): Promise<boolean> => {
    // Touch all fields to show errors
    await setTouched({
      size: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      country: true,
      city: true,
      streetAddress: true,
      region: true,
      postalCode: true,
    });

    const formErrors = await validateForm();

    // Check if there are any errors in previous steps
    const hasErrors =
      formErrors.size ||
      formErrors.firstName ||
      formErrors.lastName ||
      formErrors.email ||
      formErrors.phoneNumber ||
      formErrors.country ||
      formErrors.city ||
      formErrors.streetAddress ||
      formErrors.region ||
      formErrors.postalCode;

    if (hasErrors) {
      setValidationError("נא למלא את כל השדות בכל השלבים לפני המעבר לתשלום");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handlePaymentClick = async (): Promise<void> => {
    const isValid = await validateAllSteps();
    if (!isValid) return;

    setFormData(values);
    setShowIframe(true);
  };

  const handleIframeMessage = (e: MessageEvent): void => {
    if (e.origin !== "https://directng.tranzilla.com") return;

    const data = e.data as {
      status?: string;
      transactionId?: string;
      response?: string;
    };

    if (data.status === "success" || data.response === "000") {
      setFormData({
        ...values,
        // paymentMethod: "tranzilla",
        // transactionId: data.transactionId || "",
      });
      setShowIframe(false);
      submitForm();
    } else if (
      data.status === "failed" ||
      (data.response && data.response !== "000")
    ) {
      setValidationError("התשלום נכשל. אנא נסה שוב.");
      setShowIframe(false);
    }
  };

  // Build Tranzilla URL
  // const tranzillaUrl = `https://directng.tranzilla.com/payment/?terminal=${TERMINAL_ID}&amount=100&currency=1&lang=he&email=${encodeURIComponent(values.email)}&phone=${encodeURIComponent(values.phoneNumber)}`;

  return (
    <div>
      <div className="flex items-center gap-0.5 mb-4">
        <IoIosLock />
        <h2 className="font-bold text-base">שלב 4: פרטי חיוב</h2>
      </div>

      {validationError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {validationError}
        </div>
      )}

      {!showIframe ? (
        <button
          type="button"
          onClick={handlePaymentClick}
          disabled={isSubmitting}
          className="w-full bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 disabled:bg-gray-400 font-bold flex items-center justify-center gap-2"
        >
          <IoIosLock />
          {isSubmitting ? "שולח..." : "לתשלום מאובטח"}
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowIframe(false)}
            className="absolute -top-10 right-0 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 z-10"
          >
            ✕ סגור
          </button>
          <iframe
            src="https://directng.tranzila.com/251/iframenew.php"
            // src={tranzillaUrl}
            allow="payment"
            className="w-full h-[500px] border rounded"
            title="Tranzilla Payment"
            onLoad={() =>
              window.addEventListener("message", handleIframeMessage)
            }
          />
        </div>
      )}
    </div>
  );
};

export default StepFour;
