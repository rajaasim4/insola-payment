import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import type { UpsellOption } from "../types";
import { createPayWithSavedTransaction, checkHasSavedCard } from "../api/backend";
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

const TIMER_DURATION = 180; // 3 minutes
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
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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

  useEffect(() => {
    if (!isOpen) {
      setShowClose(false);
      return;
    }

    const timerKey = getTimerKey();
    let endTime = localStorage.getItem(timerKey);

    // Only set new end time if not exists
    if (!endTime) {
      endTime = String(Date.now() + TIMER_DURATION * 1000);
      localStorage.setItem(timerKey, endTime);
    }

    const remaining = getRemainingTime();

    if (remaining <= 0) {
      // Timer already expired, trigger expire handler
      onExpire();
      return;
    }

    setTimeLeft(remaining);

    // Show close button after 7 seconds (only once)
    const closeTimer = setTimeout(() => setShowClose(true), 7000);

    // Countdown
    const interval = setInterval(() => {
      const current = getRemainingTime();
      setTimeLeft(current);

      if (current <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => {
      clearTimeout(closeTimer);
      clearInterval(interval);
    };
  }, [isOpen, orderId, onExpire, getTimerKey, getRemainingTime]);

  const handleAccept = async () => {
    // Check if saved card exists via backend API (httpOnly cookies)
    const hasSavedCard = await checkHasSavedCard();
    
    if (!hasSavedCard) {
      toast.error("לא נמצא כרטיס שמור. אנא צור קשר עם התמיכה.");
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
        setShowCvvModal(false);
        onAccept(option.totalPairs, option.totalPrice, result.stored_transaction_id);
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
    if (showClose) {
      localStorage.removeItem(getTimerKey());
      onClose();
    }
  };

  if (!option) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
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
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-right shadow-xl transition-all relative">
                {showClose && (
                  <button
                    onClick={handleClose}
                    className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}

                <div className="mb-6 text-center">
                  <p className="text-green-600 font-bold text-lg mb-2">
                    תודה! ההזמנה שלך בוצעה בהצלחה ✅
                  </p>
                  <p className="text-gray-600">רק לפני שנסיים…</p>
                </div>

                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-red-600 font-bold text-sm">
                    הצעה בלעדית עקב המצב הנוכחי – נותרו {formatTime(timeLeft)}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    הצעה חד פעמית לרוכשים: אל תישארו עם {originalQuantity}{" "}
                    {originalQuantity === 1 ? "זוג" : "זוגות"} בלבד.
                    <br />
                    רוב הלקוחות מעדיפים להשאיר מדרס קבוע בכל זוג נעליים ולא
                    להעביר ביניהם כל יום.
                  </p>

                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>✔ זוג לנעלי יום־יום</li>
                    <li>
                      ✔ זוג לנעלי ספורט / עבודה / הליכה ארוכה / אירועים מיוחדים
                    </li>
                    <li>✔ ואולי גם לפנק מישהו שאתם אוהבים</li>
                  </ul>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
                    <p className="font-bold text-red-600 mb-2">🔥 מבצע בזק:</p>
                    <p className="text-sm text-gray-800">
                      הוסף {option.addPairs}{" "}
                      {option.addPairs === 1 ? "זוג" : "זוגות"} נוספים ב־₪
                      {option.addPrice} בלבד!
                      <br />
                      <span className="text-xs text-gray-600">
                        (רק ₪{option.perItemPrice} לכל מדרס Insola נוסף! במקום
                        ₪99)
                      </span>
                      <br />+ משלוח חינם על השידרוג עד פתח הדלת!
                    </p>
                    <p className="font-bold text-lg mt-2 text-green-700">
                      בסה״כ רק: ₪{option.totalPrice}
                    </p>
                  </div>

                  <button
                    onClick={handleAccept}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg disabled:bg-gray-400"
                  >
                    כן! השלם לחבילת {option.totalPairs} זוגות מדרסים
                    <br />
                    <span className="text-sm font-normal">
                      (תוספת של ₪{option.addPrice} – אין צורך למלא שוב פרטים)
                    </span>
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    בלחיצה תאשר הוספה להזמנה ותחויב בסכום המוצג באמצעות אמצעי
                    התשלום שכבר אושר. ההטבה תקפה לרכישה זו בלבד וכוללת גם משלוח
                    חינם על השידרוג.
                  </p>

                  <button
                    onClick={handleDecline}
                    className="w-full text-gray-500 hover:text-gray-700 text-sm underline py-2"
                  >
                    לא תודה, אשמור על ההזמנה הנוכחית שלי
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* CVV Modal */}
        {showCvvModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 text-right shadow-2xl">
              <div className="text-xl font-bold mb-4">הזן/י CVV לאישור התשלום</div>
              <p className="text-sm text-gray-600 mb-4">
                לאבטחת התשלום, אנא הזן/י את קוד ה-CVV של הכרטיס
              </p>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
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
      </Dialog>
    </Transition>
  );
};
