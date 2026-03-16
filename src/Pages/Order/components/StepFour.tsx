import React from "react";
import { IoIosLock } from "react-icons/io";
import { useFormikContext, type FormikContextType } from "formik";
import { useAtom } from "jotai";
import { orderFormAtom } from "../../../store";
import type { FormValues } from "../../../types";

const StepFour: React.FC = () => {
  const {
    values,
    isSubmitting,
  }: FormikContextType<FormValues> = useFormikContext<FormValues>();
  const [, setFormData] = useAtom(orderFormAtom);

  const basePrice = Number(values.price) || 0;
  const shipping = Number(values.shippingCost) || 0;
  const finalTotal = basePrice + shipping;

  return (
    <div>
      {/* Order Summary */}
      <div className="mb-6 border border-gray-200 rounded p-4 bg-gray-50 text-right space-y-2">
        <div className="flex justify-between text-sm">
          <span>מחיר:</span>
          <span>₪{basePrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>משלוח עד הבית:</span>
          <span>₪{shipping.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold text-base">
          <span>סה״כ לתשלום:</span>
          <span>₪{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Hosted Fields — Tranzila injects iframes into these containers */}
      <div className="mb-4">
        <label className="block text-right text-sm font-semibold mb-1">
          מספר כרטיס
        </label>
        <div
          id="tzla-card-number"
          className="w-full border border-gray-300 rounded bg-white"
          style={{ height: "42px", padding: "0 12px", boxSizing: "border-box" }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-right text-sm font-semibold mb-1">
            CVV
          </label>
          <div
            id="tzla-cvv"
            className="w-full border border-gray-300 rounded bg-white"
            style={{ height: "42px", padding: "0 12px", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label className="block text-right text-sm font-semibold mb-1">
            תוקף כרטיס
          </label>
          <div
            id="tzla-expiry"
            className="w-full border border-gray-300 rounded bg-white"
            style={{ height: "42px", padding: "0 12px", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* Card error display */}
      <div id="tzla-card-errors" className="text-red-500 text-xs mb-3 text-right" />

      {/* Security Badges */}
      <div className="flex my-5 gap-4 justify-center">
        <img src="/images/pci.png" className="max-w-30" alt="" />
        <img src="/images/mcafee.png" className="max-w-30" alt="" />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        onClick={() => setFormData(values)}
        disabled={isSubmitting}
        className={`w-full bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold py-3 px-6 rounded transition-colors disabled:bg-gray-400 ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
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
