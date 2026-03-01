import React from "react";
import { IoIosLock } from "react-icons/io";
import { useFormikContext, type FormikContextType } from "formik";
import { useAtom } from "jotai";
import { orderFormAtom } from "../../../store";
import type { FormValues } from "../../../types";

const StepFour: React.FC = () => {
  const {
    submitForm,
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    errors,
    touched,
  }: FormikContextType<FormValues> = useFormikContext<FormValues>();
  const [, setFormData] = useAtom(orderFormAtom);

  const handleSubmit = async (): Promise<void> => {
    setFormData(values);
    await submitForm();
  };

  return (
    <div>
      {/* Card Number */}
      <div className="mb-4">
        <label className="block text-right text-sm font-semibold mb-1">
          מספר כרטיס
        </label>
        <input
          type="text"
          name="cardNumber"
          placeholder="XXXX XXXX XXXX XXXX"
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full border border-gray-300 rounded px-3 py-2 text-right"
        />
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
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded px-3 py-2 text-right"
          />
        </div>
        <div>
          <label className="block text-right text-sm font-semibold mb-1">
            תוקף כרטיס
          </label>
          <input
            type="text"
            name="expiryDate"
            placeholder="MM / YY"
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border border-gray-300 rounded px-3 py-2 text-right"
          />
        </div>
      </div>

      {/* Security Badges */}

      {/* Terms Checkbox */}
      <div className="flex items-center justify-start gap-2 mb-4">
        <input
          type="checkbox"
          name="termsAccepted"
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
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold py-3 px-6 rounded transition-colors disabled:bg-gray-400"
      >
        {isSubmitting ? "שולח..." : "כן, שלחו לי את ה-AKUSOLI שלי עכשיו!"}
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
