import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import type { UpsellOption } from "../types";
import {
  createPayWithSavedTransaction,
  checkHasSavedCard,
} from "../api/backend";
import { toast } from "sonner";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  option: UpsellOption | null;
  originalQuantity: number;
  onAccept: (quantity: number, price: number, transactionId: string) => void;
  onDecline: () => void;
  onExpire: () => void;
  orderId: string;
}

const TIMER_DURATION = 300; // 5 minutes
const TIMER_END_KEY = "upsell_timer_end";

export const UpsellModal = ({
  isOpen,
  onClose,
  option,
  originalQuantity,
  onAccept,
  onDecline,
  onExpire,
  orderId,
}: UpsellModalProps) => {
  const [showClose, setShowClose] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [showCvvModal, setShowCvvModal] = useState(false);
  const [isAcceptFlowActive, setIsAcceptFlowActive] = useState(false);
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials = [
    {
      text: "שדרגתי ל-4 זוגות, אחד לכל סוג נעל. שינה לי את החיים לגמרי, אין יותר כאבי גב",
      author: "שירה מ., תל אביב",
    },
    {
      text: "קניתי 3 זוגות נוספים למשפחה. הבן שלי כבר לא מתלונן על כאבי רגליים אחרי אימונים",
      author: "יוסי כ., חיפה",
    },
    {
      text: "לקחתי זוג לעבודה וזוג לספורט. ההבדל מורגש תוך דקות, ממליצה בחום",
      author: "מיכל א., רעננה",
    },
    {
      text: "אחרי שבוע עם Insola הכאבים נעלמו. הזמנתי עוד 3 זוגות, אחד לכל זוג נעליים",
      author: "דוד ל., ירושלים",
    },
    {
      text: "המדרסים האלה הצילו אותי. עובדת על הרגליים 10 שעות ביום ואין לי שום כאב",
      author: "רונית ש., באר שבע",
    },
  ];

  const getTimerKey = useCallback(
    () => `${TIMER_END_KEY}_${orderId}`,
    [orderId],
  );

  const getRemainingTime = useCallback(() => {
    const endTimeStr = localStorage.getItem(getTimerKey());
    if (!endTimeStr) return TIMER_DURATION;
    const endTime = parseInt(endTimeStr, 10);
    const remaining = Math.ceil((endTime - Date.now()) / 1000);
    return Math.max(0, remaining);
  }, [getTimerKey]);

  // Timer effect
  useEffect(() => {
    if (!isOpen) {
      setShowClose(false);
      return;
    }

    const timerKey = getTimerKey();
    let endTime = localStorage.getItem(timerKey);

    if (!endTime) {
      endTime = String(Date.now() + TIMER_DURATION * 1000);
      localStorage.setItem(timerKey, endTime);
    }

    const isCvvStepActive = showCvvModal || isAcceptFlowActive || isProcessing;
    const remaining = getRemainingTime();
    if (remaining <= 0 && !isCvvStepActive) {
      onExpire();
      return;
    }

    setTimeLeft(Math.max(0, remaining));

    const closeTimer = setTimeout(() => setShowClose(true), 7000);
    const interval = setInterval(() => {
      const current = getRemainingTime();
      setTimeLeft(Math.max(0, current));
      if (current <= 0 && !isCvvStepActive) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => {
      clearTimeout(closeTimer);
      clearInterval(interval);
    };
  }, [
    isOpen,
    orderId,
    onExpire,
    getTimerKey,
    getRemainingTime,
    showCvvModal,
    isAcceptFlowActive,
    isProcessing,
  ]);

  // Testimonials rotation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isOpen, testimonials.length]);

  if (!option) return null;

  const oldTotal = option.addPairs * 99;
  const perPairPrice = Math.round(option.addPrice / option.addPairs);
  const gridCols =
    option.totalPairs <= 2
      ? "grid-cols-2"
      : option.totalPairs === 3
        ? "grid-cols-3"
        : "grid-cols-4";

  const buildPairsHTML = () => {
    const pairs = [];
    for (let i = 0; i < originalQuantity; i++) {
      pairs.push(
        <div
          key={`orig-${i}`}
          className="bg-gray-100 border border-gray-200 rounded-xl p-2 text-center"
        >
          <img
            src="/images/insola-product.png"
            alt="Insola"
            className="w-9 h-9 mx-auto mb-1 object-cover rounded-lg"
          />
          <span className="text-xs font-semibold text-gray-600">
            {i === 0 ? "הזוג שלך" : `זוג ${i + 1}`}
          </span>
          <span className="text-[10px] text-green-600 font-bold block mt-0.5">
            Insola
          </span>
        </div>,
      );
    }

    const newLabels = [
      "יום-יום",
      "ספורט / עבודה",
      "הליכה / אירועים",
      "מתנה לאהוב",
    ];
    for (let i = 0; i < option.addPairs; i++) {
      pairs.push(
        <div
          key={`new-${i}`}
          className="bg-amber-50 border-2 border-amber-400 rounded-xl p-2 text-center relative"
        >
          <span className="absolute -top-2 -right-1 bg-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-amber-800">
            חדש!
          </span>
          <img
            src="/images/insola-product.png"
            alt="Insola"
            className="w-9 h-9 mx-auto mb-1 object-cover rounded-lg"
          />
          <span className="text-xs font-semibold text-gray-600">
            {option.addPairs === 1 ? "זוג נוסף" : newLabels[i]}
          </span>
          <span className="text-[10px] text-green-600 font-bold block mt-0.5">
            Insola
          </span>
        </div>,
      );
    }
    return pairs;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleAccept = async () => {
    setIsAcceptFlowActive(true);
    const hasSavedCard = await checkHasSavedCard();
    if (!hasSavedCard) {
      toast.error("לא נמצא כרטיס שמור. אנא צור קשר עם התמיכה.");
      setIsAcceptFlowActive(false);
      return;
    }
    setCvv("");
    setShowCvvModal(true);
  };

  const handleConfirmPayment = async () => {
    if (isProcessing || !option) return;

    const trimmed = cvv.replace(/\D/g, "").slice(0, 4);
    if (trimmed.length !== 3 && trimmed.length !== 4) {
      toast.error("אנא הזן/י CVV תקין (3-4 ספרות)");
      return;
    }

    setIsProcessing(true);

    try {
      const items = [
        {
          name: `שדרוג ל-${option.totalPairs} זוגות Insola`,
          type: "I",
          unit_price: option.addPrice,
          units_number: 1,
        },
      ];

      const result = await createPayWithSavedTransaction({
        txn_type: "debit",
        cvv: trimmed,
        items,
      });

      if (result.tranzila.error_code === 0) {
        localStorage.removeItem(getTimerKey());
        setIsAcceptFlowActive(false);
        setShowCvvModal(false);
        onAccept(
          option.addPairs,
          option.addPrice,
          result.stored_transaction_id,
        );
      } else {
        toast.error(result.tranzila.message || "התשלום נכשל");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "התשלום נכשל";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = () => {
    localStorage.removeItem(getTimerKey());
    onDecline();
  };

  const handleClose = () => {
    if (showCvvModal || isAcceptFlowActive || isProcessing) {
      return;
    }

    if (showClose) {
      localStorage.removeItem(getTimerKey());
      onClose();
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/55" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-3">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-[480px] transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all relative"
                  dir="rtl"
                >
                  {/* Close Button */}
                  {showClose && (
                    <button
                      onClick={handleClose}
                      className="absolute top-3 left-3 z-[100] w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Success Bar */}
                  <div className="bg-green-700 text-white text-center py-2 px-4 text-sm font-bold">
                    תודה! ההזמנה שלך בוצעה בהצלחה ✓
                  </div>

                  {/* Top Banner */}
                  <div className="bg-gradient-to-r from-green-700 to-green-500 px-5 pt-5 pb-4 text-center text-white">
                    <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3.5 py-1 text-xs font-semibold mb-2">
                      ✓ ההזמנה שלך אושרה!
                    </div>
                    <h1 className="text-xl font-extrabold leading-tight mb-1">
                      רגע לפני שסיימנו
                      <br />
                      יש לנו הצעה אחת חד פעמית עבורך:
                    </h1>
                    <p className="text-xs opacity-90">
                      הצעה בלעדית עד סוף הטיימר שלא תחזור
                    </p>
                  </div>

                  {/* Countdown */}
                  <div className="bg-amber-100 border-b-2 border-amber-400 py-2 px-4 flex items-center justify-center gap-2 text-sm font-bold text-amber-800 flex-wrap">
                    <span>⏰ הצעה בלעדית :</span>
                    <span className="bg-red-600 text-white rounded-md px-2.5 py-1 text-lg font-black tabular-nums min-w-[58px] text-center">
                      {formatTime(timeLeft)}
                    </span>
                    <span>דקות הקרובות בלבד!</span>
                  </div>

                  {/* Social Proof */}
                  <div className="flex items-center justify-center gap-2 bg-green-50 border-b border-green-200 py-2 px-4 text-xs font-semibold text-green-700 min-h-[38px]">
                    <div className="flex">
                      {[1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={`w-6 h-6 rounded-full border-2 border-white text-xs flex items-center justify-center ${i === 1 ? "bg-green-200" : i === 2 ? "bg-green-300" : "bg-green-400"}`}
                        >
                          😊
                        </span>
                      ))}
                    </div>
                    <span>127 לקוחות שדרגו את ההזמנה שלהם היום</span>
                  </div>

                  {/* Body */}
                  <div className="pt-5 pb-2 px-5">
                    {/* Product Image */}
                    <div className="text-center mb-4">
                      <img
                        src="/images/insola-product.png"
                        alt="מדרסי Insola"
                        className="max-w-45 w-full mx-auto rounded-xl"
                      />
                    </div>

                    {/* Customers Note */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-gray-600 text-center leading-relaxed">
                      רוב הלקוחות לוקחים עוד זוגות כדי לא להעביר בין נעליים כל
                      יום. או סתם לפנק עוד מישהו שאוהבים.
                    </div>

                    {/* Savings Hero */}
                    <div className="relative bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-400 rounded-xl p-5 pt-6 text-center mb-5">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-extrabold py-1 px-4 rounded-full whitespace-nowrap">
                        🔥 הצעת בזק: מבצע בלעדי עד סוף הטיימר
                      </span>
                      <div className="text-sm font-bold text-gray-600 mb-2 mt-1">
                        הוסף{" "}
                        {option.addPairs === 1
                          ? "זוג מדרסי Insola נוסף"
                          : option.addPairs + " זוגות מדרסי Insola נוספים"}
                      </div>
                      <div className="text-xs text-gray-500 font-semibold mb-1">
                        רק ב-
                      </div>
                      <div className="flex items-baseline justify-center gap-2.5 mb-1">
                        <span className="text-lg text-gray-400 line-through">
                          ₪{oldTotal}
                        </span>
                        <span className="text-4xl font-black text-green-700 leading-none">
                          <sup className="text-lg">₪</sup>
                          {option.addPrice}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        ₪{perPairPrice} לזוג במקום ₪99
                      </div>
                      <div className="text-sm font-extrabold text-green-700 mt-1.5">
                        + משלוח חינם על השידרוג!
                      </div>
                    </div>

                    {/* What You Get */}
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-gray-700 text-center mb-2.5">
                        מה מקבלים בסה"כ:
                      </h3>
                      <div className={`grid ${gridCols} gap-2`}>
                        {buildPairsHTML()}
                      </div>
                    </div>

                    {/* Stock Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 font-semibold mb-1.5">
                        <span>זמינות במלאי</span>
                        <span className="text-red-600 font-bold">
                          נותרו 14 יחידות בלבד!
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="w-[73%] h-full bg-gradient-to-l from-amber-400 to-red-600 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-gray-100 border-r-4 border-green-500 rounded-lg p-3 mb-4 text-xs text-gray-700 leading-relaxed  duration-700">
                      <div className="text-amber-400 text-sm mb-1">★★★★★</div>
                      <span className=" duration-500">
                        "{testimonials[testimonialIndex].text}"
                      </span>
                      <div className="font-bold text-green-600 mt-1 text-xs duration-500">
                        {testimonials[testimonialIndex].author} ✓ רכישה מאומתת
                      </div>
                    </div>

                    {/* Perks */}
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                        <span className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-base shrink-0">
                          📦
                        </span>
                        <span>
                          <strong>משלוח חינם</strong> עד הדלת, מתווסף להזמנה
                          הנוכחית
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                        <span className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-base shrink-0">
                          ⚡
                        </span>
                        <span>
                          <strong>ללא הזנת פרטים מחדש</strong>, מתווסף בלחיצה
                          אחת
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="px-5 pb-2">
                    <button
                      onClick={handleAccept}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-b from-green-500 to-green-700 text-white border-none rounded-xl py-4 px-5 text-lg font-black cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all relative overflow-hidden disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      <span className="block">
                        ✓ כן! תוסיף לי {option.addPairs}{" "}
                        {option.addPairs === 1 ? "זוג" : "זוגות"} ב-₪
                        {option.addPrice} בלבד
                      </span>
                      <span className="text-[11px] font-semibold opacity-90 leading-tight block">
                        רכישה בלחיצה אחת, הוספה להזמנה הקיימת שלך
                        <br />
                        ללא הזנת פרטים מחדש
                      </span>
                    </button>
                  </div>

                  {/* No Thanks */}
                  <button
                    onClick={handleDecline}
                    className="block w-full text-center text-gray-400 text-xs py-3 px-5 cursor-pointer hover:text-gray-600 hover:underline transition-colors"
                  >
                    לא תודה, אני מוותר על ההצעה
                  </button>

                  {/* Legal */}
                  <div className="px-5 pb-4 text-center">
                    <div className="text-[11px] text-gray-400 leading-relaxed">
                      בלחיצה אני מאשר/ת הוספה להזמנה וחיוב חד-פעמי נוסף של ₪
                      {option.addPrice}. ההטבה תקפה לרכישה זו בלבד וכוללת גם
                      משלוח חינם על השידרוג.
                    </div>
                    <div className="text-sm font-bold text-gray-700 mt-1.5">
                      סה"כ כולל משלוח עד הדלת: ₪{option.totalPrice} ש"ח בעבור{" "}
                      {option.totalPairs} מדרסי Insola
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-100 border-t border-gray-200 py-2.5 px-5 flex items-center justify-center gap-3 flex-wrap text-[11px]">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://dailyhealthinsider.net/%d7%aa%d7%a0%d7%90%d7%99-%d7%a9%d7%99%d7%9e%d7%95%d7%a9/"
                      className="text-gray-400 no-underline hover:text-gray-600 hover:underline"
                    >
                      תנאי שימוש
                    </a>
                    <span className="text-gray-300 text-[10px]">|</span>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://dailyhealthinsider.net/privacy-policy/"
                      className="text-gray-400 no-underline hover:text-gray-600 hover:underline"
                    >
                      מדיניות פרטיות
                    </a>
                    <span className="text-gray-300 text-[10px]">|</span>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://dailyhealthinsider.net/%d7%9e%d7%93%d7%99%d7%a0%d7%99%d7%95%d7%aa-%d7%9e%d7%a9%d7%9c%d7%95%d7%97%d7%99%d7%9d/"
                      className="text-gray-400 no-underline hover:text-gray-600 hover:underline"
                    >
                      מדיניות משלוחים
                    </a>
                    <span className="text-gray-300 text-[10px]">|</span>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://dailyhealthinsider.net/%d7%9e%d7%93%d7%99%d7%a0%d7%99%d7%95%d7%aa-%d7%94%d7%97%d7%96%d7%a8%d7%95%d7%aa-%d7%95%d7%94%d7%97%d7%96%d7%a8%d7%99%d7%9d/"
                      className="text-gray-400 no-underline hover:text-gray-600 hover:underline"
                    >
                      מדיניות ביטולים/החזרות
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* CVV Modal */}
      {showCvvModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div
            className="w-full max-w-sm rounded-lg bg-white p-6 text-right shadow-2xl"
            dir="rtl"
          >
            <div className="text-xl font-bold mb-4">
              הזן/י CVV לאישור התשלום
            </div>
            <p className="text-sm text-gray-600 mb-4">
              לאבטחת התשלום, אנא הזן/י את קוד ה-CVV של הכרטיס
            </p>
            <input
              type="text"
              value={cvv}
              onChange={(e) =>
                setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="CVV"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-right text-lg focus:border-green-500 focus:outline-none"
              autoFocus
            />
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
                onClick={() => {
                  setShowCvvModal(false);
                  setCvv("");
                  setIsAcceptFlowActive(false);
                }}
                disabled={isProcessing}
              >
                ביטול
              </button>
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
              >
                {isProcessing ? "מעבד..." : "אישור תשלום"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
