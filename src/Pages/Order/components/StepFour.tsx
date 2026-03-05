import React from "react";
import { IoIosLock } from "react-icons/io";
import { useFormikContext, type FormikContextType } from "formik";
import { useAtom } from "jotai";
import { orderFormAtom } from "../../../store";
import type { FormValues } from "../../../types";

function formatCardNumber(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

const StepFour: React.FC = () => {
  const {
    submitForm,
    values,
    isSubmitting,
    // handleChange,
    handleBlur,
    touched,
    setFieldValue,
    errors,
  }: FormikContextType<FormValues> = useFormikContext<FormValues>();
  const [, setFormData] = useAtom(orderFormAtom);

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;
    setFormData(values);
    await submitForm();
  };

  const basePrice = Number(values.price) || 0;
  const quantity = Number(values.quantity) || 0;
  const shipping = Number(values.shippingCost) || 0;

  // const warrantyUnitPrice = 4;
  // const warrantyTotal = values.warranty ? warrantyUnitPrice * quantity : 0;

  const finalTotal = basePrice + shipping;
  // + warrantyTotal;

  return (
    <div>
      {/* Card Number */}
      {/* Order Summary */}
      {/* Order Summary */}
      <div className="mb-6 border border-gray-200 rounded p-4 bg-gray-50 text-right space-y-2">
        <div className="flex justify-between text-sm">
          <span>מחיר:</span>
          <span>₪{basePrice.toFixed(2)}</span>
        </div>

        {/* {values.warranty && (
          <div className="flex justify-between text-sm">
            <span>אחריות (₪4 × {quantity}):</span>
            <span>₪{warrantyTotal.toFixed(2)}</span>
          </div>
        )} */}

        <div className="flex justify-between text-sm">
          <span>משלוח עד הבית:</span>
          <span>₪{shipping.toFixed(2)}</span>
        </div>

        <div className="border-t pt-2 flex justify-between font-bold text-base">
          <span>סה״כ לתשלום:</span>
          <span>₪{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-right text-sm font-semibold mb-1">
          מספר כרטיס
        </label>
        <input
          type="text"
          name="cardNumber"
          placeholder="XXXX XXXX XXXX XXXX"
          value={values.cardNumber}
          onChange={(e) =>
            setFieldValue("cardNumber", formatCardNumber(e.target.value))
          }
          onBlur={handleBlur}
          inputMode="numeric"
          autoComplete="cc-number"
          className="w-full border border-gray-300 rounded px-3 py-2 text-right"
        />
        {touched.cardNumber && errors.cardNumber ? (
          <p className="text-red-500 text-xs mt-1 text-right">
            {errors.cardNumber}
          </p>
        ) : null}
      </div>
      {/* CVV and Expiry */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-right text-sm font-semibold mb-1">
            CVV/CVC/CSC
          </label>
          <input
            type="text"
            name="cvv"
            placeholder="XXX"
            value={values.cvv}
            onChange={(e) =>
              setFieldValue(
                "cvv",
                e.target.value.replace(/\D/g, "").slice(0, 4),
              )
            }
            onBlur={handleBlur}
            inputMode="numeric"
            autoComplete="cc-csc"
            className="w-full border border-gray-300 rounded px-3 py-2 text-right"
          />
          {touched.cvv && errors.cvv ? (
            <p className="text-red-500 text-xs mt-1 text-right">{errors.cvv}</p>
          ) : null}
        </div>
        <div>
          <label className="block text-right text-sm font-semibold mb-1">
            תוקף כרטיס
          </label>
          <input
            type="text"
            name="expiryDate"
            placeholder="MM / YY"
            value={values.expiryDate}
            onChange={(e) =>
              setFieldValue("expiryDate", formatExpiry(e.target.value))
            }
            onBlur={handleBlur}
            inputMode="numeric"
            autoComplete="cc-exp"
            className="w-full border border-gray-300 rounded px-3 py-2 text-right"
          />
          {touched.expiryDate && errors.expiryDate ? (
            <p className="text-red-500 text-xs mt-1 text-right">
              {errors.expiryDate}
            </p>
          ) : null}
        </div>
      </div>
      {/* Security Badges */}
      <div className="flex my-5 gap-4 justify-center">
        <img src="/images/pci.png" className="max-w-30" alt="" />
        <img src="/images/mcafee.png" className="max-w-30" alt="" />
      </div>
      {/* Terms Checkbox
      <div className="flex items-center justify-start gap-2 mb-4">
        <input
          type="checkbox"
          name="termsAccepted"
          checked={values.termsAccepted}
          onChange={handleChange}
          className="w-4 h-4"
        />
        <label className="text-sm text-right">
          אני מאשר/ת שקראתי ואני מסכים/ה ל-
          <a href="#" className="">
            תנאי השירות
          </a>{" "}
          ול-
          <a href="#" className="">
            מדיניות הפרטיות
          </a>
        </label>
      </div> */}
      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold py-3 px-6 rounded transition-colors disabled:bg-gray-400  ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isSubmitting ? "שולח..." : "כן, שלחו לי את ה-Insola שלי עכשיו!"}
      </button>
      {/* SSL Security Footer */}
      <div className="text-center mt-4">
        <div className="flex items-center justify-center gap-1 text-sm font-medium">
          <span>תשלום מאובטח SSL</span>
          <IoIosLock className="text-green-600" />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          הנתונים שלכם מוגנים באמצעות הצפנת SSL 256-bit
        </p>
      </div>
    </div>
  );
};

export default StepFour;
