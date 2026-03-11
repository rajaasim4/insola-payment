import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { upsellOptions } from "../../data/upsellOptions";
import { sendOrderToZapier } from "../../utils/helper";
import { useAtomValue, useSetAtom } from "jotai";
import { queryParamsAtom } from "../../store";

interface OrderSummary {
  originalQuantity: number;
  originalPrice: number;
  upgradedQuantity?: number;
  upgradedPrice?: number;
  totalQuantity: number;
  totalPrice: number;
  shipping: number;
  transactionId: string;
  upgradeType?: "upsell" | "downsell" | "none";
}

const ThankYou = () => {
  const queryParams = useAtomValue(queryParamsAtom);
  const clearQueryParams = useSetAtom(queryParamsAtom);

  const location = useLocation();
  const navigate = useNavigate();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  const transactionId = location.state?.transactionId;
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!transactionId) {
      navigate("/", { replace: true });
      return;
    }

    // Try to get order data from location state first, then from localStorage
    if (orderData) {
      setOrderSummary(orderData);
    } else {
      // Fallback to localStorage
      try {
        const storedData = localStorage.getItem("current_order_data");
        if (storedData) {
          const parsed = JSON.parse(storedData);

          // Check if upsell was accepted
          if (
            parsed.upsellAccepted &&
            parsed.upsellTransactionId === transactionId
          ) {
            const option = upsellOptions.find(
              (o) => o.fromQuantity === parsed.quantity,
            );
            if (option) {
              setOrderSummary({
                originalQuantity: parsed.quantity,
                originalPrice: parsed.price,
                upgradedQuantity: option.addPairs,
                upgradedPrice: option.addPrice,
                totalQuantity: option.totalPairs,
                totalPrice: option.totalPrice,
                shipping: 0, // Free shipping on upgrade
                transactionId,
                upgradeType: "upsell",
              });
            }
          }
          // Check if downsell was accepted
          else if (parsed.downsellTransactionId === transactionId) {
            const option = upsellOptions.find(
              (o) => o.fromQuantity === parsed.quantity,
            );
            if (option?.downsell) {
              setOrderSummary({
                originalQuantity: parsed.quantity,
                originalPrice: parsed.price,
                upgradedQuantity: option.downsell.addPairs,
                upgradedPrice: option.downsell.addPrice,
                totalQuantity: option.downsell.totalPairs,
                totalPrice: option.downsell.totalPrice,
                shipping: 15, // Regular shipping for downsell
                transactionId,
                upgradeType: "downsell",
              });
            }
          }
          // Original order only
          else {
            setOrderSummary({
              originalQuantity: parsed.quantity,
              originalPrice: parsed.price,
              totalQuantity: parsed.quantity,
              totalPrice: parsed.price,
              shipping: 15,
              transactionId,
              upgradeType: "none",
            });
          }
        }
      } catch (e) {
        console.error("Failed to parse order data");
      }
    }

    // Prevent back navigation
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [transactionId, navigate, orderData]);

  // useEffect(() => {
  //   localStorage.removeItem("orderForm");
  // }, []);

  console.log(orderSummary);
  console.log(JSON.stringify(localStorage.getItem("orderForm")));

  useEffect(() => {
    if (!orderSummary) return;

    try {
      const storedForm = localStorage.getItem("orderForm");
      const formData = storedForm ? JSON.parse(storedForm) : null;

      const payload = {
        transactionId: orderSummary.transactionId,

        // Customer
        firstName: formData?.firstName || "",
        lastName: formData?.lastName || "",
        email: formData?.email || "",
        phoneNumber: formData?.phoneNumber || "",
        city: formData?.city || "",
        streetAddress: formData?.streetAddress || "",
        postalCode: formData?.postalCode || "",
        country: formData?.country || "",
        size: formData?.size || "",

        // Quantities
        originalQuantity: orderSummary.originalQuantity,
        upgradedQuantity: orderSummary.upgradedQuantity || 0,
        totalQuantity: orderSummary.totalQuantity,

        // Prices
        originalPrice: orderSummary.originalPrice,
        upgradedPrice: orderSummary.upgradedPrice || 0,
        shippingPrice: formData?.shippingCost || 15,
        totalPrice:
          orderSummary.originalPrice + orderSummary?.upgradedPrice! ||
          orderSummary.totalPrice,

        // Funnel
        upgradeType: orderSummary.upgradeType ?? "none",

        // Marketing
        marketingEmails: formData?.marketingEmails ?? false,
        marketingSMS: formData?.marketingSMS ?? false,
        utms: queryParams,
      };

      console.log("Data sent to zapier", payload);

      sendOrderToZapier(payload);

      // ✅ Clear order form AFTER sending
      localStorage.removeItem("orderForm");
      clearQueryParams({});
    } catch (error) {
      console.error("Failed to send order to Zapier:", error);
    }
  }, [orderSummary]);

  const formatPrice = (price: number) => `₪${price.toFixed(0)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          תודה רבה על הרכישה! 🎉
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          ההזמנה שלך התקבלה בהצלחה
        </p>

        {/* Order Summary */}
        {orderSummary && (
          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-right">
              📦 סיכום הזמנה
            </h2>

            {/* Original Order */}
            <div className="flex justify-between items-center py-2 text-sm text-gray-600 border-b border-gray-200">
              <span className="font-medium">
                {orderSummary.originalQuantity}{" "}
                {orderSummary.originalQuantity === 1 ? "זוג" : "זוגות"}
                Insola
                <span className="text-red-500">( מדרסי)</span>
              </span>
              <span>{formatPrice(orderSummary.originalPrice - 15)}</span>
            </div>

            {/* Shipping */}
            {/* {orderSummary.shipping !== 0 && ( */}
            <div className="flex justify-between items-center py-2 text-sm text-gray-600 border-b border-gray-200">
              <span className="font-medium">משלוח</span>
              <span>₪15</span>
            </div>
            {/* )} */}

            {/* Upgrade Section (if applicable) */}
            {orderSummary.upgradeType && (
              <div className="bg-green-50 rounded-lg p-3 my-2 border border-green-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-green-700">
                    {orderSummary.upgradeType === "upsell"
                      ? "✨ שדרוג לחבילה מורחבת"
                      : "✨ תוספת אחרונה"}
                  </span>
                  <span className="text-green-700 font-bold">
                    {formatPrice(orderSummary.upgradedPrice || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
                  <span>
                    + {orderSummary.upgradedQuantity}{" "}
                    {orderSummary.upgradedQuantity === 1
                      ? "זוג נוסף"
                      : "זוגות נוספים"}
                  </span>
                  <span className="text-green-600">משלוח חינם!</span>
                </div>
              </div>
            )}

            {/* Shipping */}
            <div className="flex justify-between items-center py-2 text-sm text-gray-600 border-b border-gray-200">
              <span className="font-medium">משלוח עד הבית</span>
              {orderSummary.upgradeType ? (
                <span className="text-green-600 font-bold flex items-center gap-5">
                  <div className=" text-xs line-through">
                    <span className="font-medium">משלוח</span>
                    <span>15</span>
                  </div>
                  חינם!
                </span>
              ) : (
                <span className="text-gray-500">כלול במחיר</span>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 mt-1 text-base font-bold">
              <span className="text-gray-800">סה"כ לתשלום</span>
              <span className="text-green-700 text-lg flex items-center">
                {formatPrice(
                  orderSummary.originalPrice +
                    (orderSummary.upgradedPrice || 0),
                )}
              </span>
            </div>

            {/* Total Items Summary */}
            <div className="mt-3 pt-2 text-center text-xs text-gray-500 border-t border-gray-200">
              סה"כ {orderSummary.totalQuantity} מדרסי Insola
              {orderSummary.upgradeType === "upsell" && (
                <span className="block text-green-600 font-medium mt-1">
                  ✓ נהנית ממשלוח חינם על השדרוג!
                </span>
              )}
            </div>
          </div>
        )}

        {/* Order Number */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            מספר הזמנה:{" "}
            <span className="font-mono font-bold text-gray-700">
              #{transactionId?.slice(-8)}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            קבלה נשלחה לכתובת האימייל שלך
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {/* <button
            onClick={() => window.print()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors text-sm"
          >
            🖨️ הדפסת קבלה
          </button> */}

          <button
            onClick={() => navigate("/")}
            className="w-full text-gray-500 cursor-pointer hover:text-gray-700 text-sm underline py-2 transition-colors"
          >
            חזרה לדף הבית
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
