import React, { useEffect, useRef } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { saveFailedTransaction } from "../../api/failedTransactions";

const PaymentError: React.FC = () => {
  const location = useLocation();
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;

    const state = location.state as any;
    if (state?.userInfo) {
      saveFailedTransaction({
        firstName: state.userInfo.firstName,
        lastName: state.userInfo.lastName,
        email: state.userInfo.email,
        phoneNumber: state.userInfo.phoneNumber,
        city: state.userInfo.city,
        streetAddress: state.userInfo.streetAddress,
        postalCode: state.userInfo.postalCode,
        country: state.userInfo.country,
        quantity: state.userInfo.quantity,
        size: state.userInfo.size,
        price: state.userInfo.price,
        totalAmount: state.userInfo.totalAmount,
        shippingCost: state.userInfo.shippingCost,
        errorMessage: state.errorMessage,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center space-y-6 shadow-lg">
        <div className="flex justify-center">
          <div className="bg-red-100 rounded-full p-4">
            <IoIosCloseCircle className="text-red-600 text-6xl" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">התשלום נכשל</h1>

        <p className="text-gray-600">
          אירעה שגיאה בעיבוד התשלום. אנא נסה שוב או צור קשר עם התמיכה.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            נסה שוב
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
          >
            חזור לדף הבית
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;
