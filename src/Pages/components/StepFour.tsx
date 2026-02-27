// import React, { useMemo } from "react";
// import { IoIosLock } from "react-icons/io";
// import { useFormikContext, type FormikContextType } from "formik";
// import { useAtom } from "jotai";
// import { orderFormAtom } from "../../store";
// import type { FormValues } from "../../types";

// const StepFour: React.FC = () => {
//   const { values, isSubmitting }: FormikContextType<FormValues> =
//     useFormikContext<FormValues>();
//   const [, setFormData] = useAtom(orderFormAtom);

//   // Calculate total using ONLY your actual data fields
//   const calculations = useMemo(() => {
//     const price = parseFloat(values.price || "0");
//     const quantity = parseInt(values.quantity || "1");
//     const shippingCost = parseFloat(values.shippingCost || "15");

//     const subtotal = values.warranty ? quantity * 4 : 0;
//     const total = price + shippingCost + subtotal;

//     return {
//       subtotal,
//       shippingCost,
//       total,
//       quantity,
//     };
//   }, [values.price, values.quantity, values.shippingCost]);

//   // Tranzila terminal - replace with your actual terminal
//   const tranzilaTerminal = "test";

//   const handleFormSubmit = () => {
//     setFormData(values);
//   };

//   // Format phone
//   const fullPhone = `${values.phoneCountryCode || ""}${values.phoneNumber || ""}`;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <IoIosLock className="text-green-600" size={28} />
//         <h2 className="font-bold text-xl">שלב 4: סיכום הזמנה ותשלום</h2>
//       </div>

//       {/* Payment Iframe */}
//       <div className="mt-6 border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg bg-white">
//         <iframe
//           name="tranzilaPaymentIframe"
//           title="דף תשלום מאובטח - Tranzila"
//           width="100%"
//           height="650"
//           frameBorder="0"
//           scrolling="auto"
//           allow="payment"
//           sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups allow-popups-to-escape-sandbox"
//           className="w-full h-75"
//         />
//       </div>
//       {/* Payment Section */}
//       <div className="0">
//         <form
//           action={`https://direct.tranzila.com/${tranzilaTerminal}/iframe.php`}
//           method="POST"
//           target="tranzilaPaymentIframe"
//           onSubmit={handleFormSubmit}
//           className="space-y-4"
//         >
//           {/* Tranzila Parameters - Using ONLY your actual data */}
//           <input
//             type="hidden"
//             name="sum"
//             value={calculations.total.toFixed(2)}
//           />
//           <input type="hidden" name="currency" value="1" />
//           <input type="hidden" name="lang" value="il" />
//           <input
//             type="hidden"
//             name="pdesc"
//             value={`Order #${values.selectedProductId} - Size ${values.size} x${calculations.quantity}`}
//           />
//           <input type="hidden" name="email" value={values.email} />
//           <input type="hidden" name="phone" value={fullPhone} />
//           <input
//             type="hidden"
//             name="contact"
//             value={`${values.firstName} ${values.lastName}`}
//           />

//           {/* Address fields from your actual data */}
//           <input type="hidden" name="address" value={values.streetAddress} />
//           <input type="hidden" name="city" value={values.city} />
//           <input type="hidden" name="zip" value={values.postalCode} />

//           {/* Payment Button */}
//           <button
//             type="submit"
//             disabled={isSubmitting || calculations.total <= 0}
//             className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
//           >
//             {isSubmitting ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                     fill="none"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   />
//                 </svg>
//                 מעביר לדף תשלום...
//               </span>
//             ) : (
//               <>כן, שלחו לי את ה-Insola שלי עכשיו!</>
//             )}
//           </button>
//         </form>
//       </div>

//       {/* Security Footer */}
//       <div className="flex flex-col items-center justify-center gap-4 text-center text-sm text-gray-500 mt-4 pt-4 border-t">
//         <span className="flex items-center gap-1">
//           <IoIosLock size={14} />
//           SSL תשלום מאובטח
//         </span>
//         <span>המידע שלכם מוגן באמצעות הצפנת SSL 256-bit</span>
//       </div>
//     </div>
//   );
// };

// export default StepFour;

// components/StepFour.tsx
import React, { useMemo, useState } from "react";
import { IoIosLock } from "react-icons/io";
import { useFormikContext, type FormikContextType } from "formik";
import { useAtom } from "jotai";
import { orderFormAtom } from "../../store";
import type { FormValues } from "../../types";

const StepFour: React.FC = () => {
  const { values, isSubmitting }: FormikContextType<FormValues> =
    useFormikContext<FormValues>();
  const [, setFormData] = useAtom(orderFormAtom);

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const tranzilaTerminal = "truelead251";

  // ── Dynamic price calculation ──
  const calculations = useMemo(() => {
    const unitPrice = parseFloat(values.price || "0") || 0;
    const quantity = parseInt(values.quantity || "1", 10) || 1;
    const shippingCost = parseFloat(values.shippingCost || "15") || 15;

    const subtotal = unitPrice;
    const warrantyCost = values.warranty ? quantity * 4 : 0;
    const total = subtotal + warrantyCost + shippingCost;

    return {
      unitPrice,
      quantity,
      subtotal,
      warrantyCost,
      shippingCost,
      total,
    };
  }, [values.price, values.quantity, values.shippingCost, values.warranty]);

  // Format phone
  const fullPhone = `${values.phoneCountryCode || ""}${values.phoneNumber || ""}`;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(values); // save form data
    setIsPaymentLoading(true);
    // The form will submit natively → payment loads in iframe
  };

  // ── Optional: Auto-submit on mount (uncomment if you want payment to load immediately) ──
  // const formRef = React.useRef<HTMLFormElement>(null);
  // React.useEffect(() => {
  //   if (formRef.current && calculations.total > 0) {
  //     formRef.current.submit();
  //   }
  // }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <IoIosLock className="text-green-600" size={32} />
        <h2 className="font-bold text-2xl">שלב 4: סיכום הזמנה ותשלום</h2>
      </div>

      {/* Payment Form & Iframe */}
      <div>
        <form
          // ref={formRef}  // uncomment for auto-submit
          action={`https://direct.tranzila.com/${tranzilaTerminal}/iframe.php`}
          method="POST"
          target="tranzilaPaymentIframe"
          onSubmit={handleFormSubmit}
          className="space-y-6"
        >
          {/* Hidden Tranzila parameters */}
          <input
            type="hidden"
            name="sum"
            value={calculations.total.toFixed(2)}
          />
          <input type="hidden" name="currency" value="1" /> {/* ILS */}
          <input type="hidden" name="lang" value="il" /> {/* Hebrew */}
          <input
            type="hidden"
            name="pdesc"
            value={`הזמנה ${calculations.quantity}x - ${values.firstName || ""} ${values.lastName || ""} (${values.size || ""})`}
          />
          <input type="hidden" name="email" value={values.email || ""} />
          <input type="hidden" name="phone" value={fullPhone} />
          <input
            type="hidden"
            name="contact"
            value={`${values.firstName || ""} ${values.lastName || ""}`}
          />
          <input
            type="hidden"
            name="address"
            value={values.streetAddress || ""}
          />
          <input type="hidden" name="city" value={values.city || ""} />
          <input type="hidden" name="zip" value={values.postalCode || ""} />
          {/* Recommended params for better iframe experience */}
          <input type="hidden" name="nologo" value="1" />
          <input type="hidden" name="hidesum" value="0" />
          <input type="hidden" name="tranmode" value="A" />
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || calculations.total <= 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-8 rounded-xl text-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                מעביר לתשלום...
              </>
            ) : (
              <>
                כן, שלחו לי את ה-Insola שלי עכשיו! (₪
                {calculations.total.toFixed(0)})
              </>
            )}
          </button>
        </form>

        {/* Iframe Container */}
        <div className="mt-8 border-2 border-gray-300 rounded-xl overflow-hidden shadow-2xl bg-white">
          {isPaymentLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center">
                <svg
                  className="animate-spin h-12 w-12 mx-auto text-green-600 mb-4"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-lg font-medium">טוען טופס תשלום מאובטח...</p>
              </div>
            </div>
          )}

          <iframe
            name="tranzilaPaymentIframe"
            title="דף תשלום מאובטח - Tranzila"
            width="100%"
            height="650"
            frameBorder="0"
            scrolling="auto"
            allow="payment"
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups allow-popups-to-escape-sandbox"
            onLoad={() => setIsPaymentLoading(false)}
            className="w-full min-h-125"
          />
        </div>
      </div>

      {/* Security Note */}
      <div className="text-center text-sm text-gray-500 mt-6 pt-4 border-t">
        <div className="flex items-center justify-center gap-2 mb-2">
          <IoIosLock size={16} />
          <span>תשלום מאובטח 256-bit SSL</span>
        </div>
        <p>המידע שלך מוגן ולא נשמר אצלנו – Tranzila מטפלת בכל פרטי התשלום</p>
      </div>
    </div>
  );
};

export default StepFour;
