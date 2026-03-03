import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import type { UpsellOption } from "../types";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  option: UpsellOption | null;
  originalQuantity: number;
  onAccept: (quantity: number, price: number) => void;
  onDecline: () => void;
}

export const UpsellModal = ({
  isOpen,
  onClose,
  option,
  originalQuantity,
  onAccept,
  onDecline,
}: UpsellModalProps) => {
  const [showClose, setShowClose] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (!isOpen) {
      setShowClose(false);
      setTimeLeft(180);
      return;
    }

    const closeTimer = setTimeout(() => setShowClose(true), 7000);
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(closeTimer);
      clearInterval(countdown);
    };
  }, [isOpen, onDecline]);

  if (!option) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => showClose && onClose()}
      >
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-right shadow-xl transition-all relative">
                {/* Close Button */}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <VscChromeClose className="w-5 h-5 text-gray-500" />
                  </button>
                )}

                {/* Success Message */}
                <div className="mb-6 text-center">
                  <p className="text-green-600 font-bold text-lg mb-2">
                    תודה! ההזמנה שלך בוצעה בהצלחה ✅
                  </p>
                  <p className="text-gray-600">רק לפני שנסיים…</p>
                </div>

                {/* Timer */}
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <p className="text-red-600 font-bold text-sm">
                    הצעה בלעדית עקב המצב הנוכחי – נותרו {formatTime(timeLeft)}
                  </p>
                </div>

                {/* Content */}
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

                  {/* Accept Button */}
                  <button
                    onClick={() =>
                      onAccept(option.totalPairs, option.totalPrice)
                    }
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
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

                  {/* Decline Link */}
                  <button
                    onClick={onDecline}
                    className="w-full text-gray-500 hover:text-gray-700 text-sm underline py-2"
                  >
                    לא תודה, אשמור על ההזמנה הנוכחית שלי
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
