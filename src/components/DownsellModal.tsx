import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";

interface DownsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalQuantity: number;
  addPairs: number;
  addPrice: number;
  totalPairs: number;
  totalPrice: number;
  onAccept: (quantity: number, price: number) => void;
  onDecline: () => void;
}

export const DownsellModal = ({
  isOpen,
  onClose,
  originalQuantity,
  addPairs,
  addPrice,
  totalPairs,
  totalPrice,
  onAccept,
  onDecline,
}: DownsellModalProps) => {
  const [showClose, setShowClose] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowClose(false);
      return;
    }
    const timer = setTimeout(() => setShowClose(true), 7000);
    return () => clearTimeout(timer);
  }, [isOpen]);

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
                {/* Close Button - No Timer */}
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
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <p className="text-gray-700">
                    יש לנו הצעה אחרונה לפני שנסיים ונשלח אלייך את המדרסים
                    האהובים של Insola
                  </p>
                  <p className="text-gray-600">
                    אולי במקום {originalQuantity + 2} זוגות יתאימו לך יותר{" "}
                    {totalPairs} זוגות?
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-bold text-blue-800 mb-2">הצעה אחרונה:</p>
                    <p className="text-sm text-gray-800">
                      הוסף {addPairs} {addPairs === 1 ? "זוג" : "זוגות"} נוספים
                      ב־₪{addPrice} בלבד!
                      <br />
                      (במקום ₪99 למדרס Insola)
                      <br />+ משלוח חינם על השידרוג עד פתח הדלת!
                    </p>
                    <p className="font-bold text-lg mt-2 text-blue-700">
                      ותקבלו סה״כ {totalPairs} זוגות מדרסים
                      <br />
                      <span className="text-green-600">
                        בסה״כ: ₪{totalPrice}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => onAccept(totalPairs, totalPrice)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
                  >
                    כן! השלם לחבילת {totalPairs} זוגות מדרסים
                    <br />
                    <span className="text-sm font-normal">
                      (תוספת של ₪{addPrice} – אין צורך למלא שוב פרטים)
                    </span>
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    בלחיצה תאשר הוספה להזמנה ותחויב בסכום המוצג באמצעות אמצעי
                    התשלום שכבר אושר. ההטבה תקפה לרכישה זו בלבד וכוללת גם משלוח
                    חינם על השידרוג.
                  </p>

                  <button
                    onClick={onDecline}
                    className="w-full text-gray-500 hover:text-gray-700 text-sm underline py-2"
                  >
                    לא תודה, אשמור על ההזמנה המקורית
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
