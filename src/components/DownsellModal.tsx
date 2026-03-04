import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { createPayWithSavedTransaction, checkHasSavedCard } from "../api/backend";
import { toast } from "sonner";

interface DownsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalQuantity: number;
  addPairs: number;
  addPrice: number;
  totalPairs: number;
  totalPrice: number;
  onAccept: (quantity: number, price: number, transactionId: string) => void;
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
  const [showCvvModal, setShowCvvModal] = useState(false);
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-right shadow-xl transition-all relative">
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
                    onClick={async () => {
                      const hasSavedCard = await checkHasSavedCard();
                      if (!hasSavedCard) {
                        toast.error("לא נמצא כרטיס שמור. אנא צור קשר עם התמיכה.");
                        return;
                      }
                      setCvv("");
                      setShowCvvModal(true);
                    }}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:bg-gray-400"
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

        {/* CVV Modal */}
        {showCvvModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
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
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-right text-lg focus:border-blue-500 focus:outline-none"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
                  onClick={async () => {
                    if (isProcessing) return;

                    const trimmed = cvv.replace(/\D/g, "").slice(0, 4);
                    if (trimmed.length !== 3 && trimmed.length !== 4) {
                      toast.error("אנא הזן/י CVV תקין (3-4 ספרות)");
                      return;
                    }

                    setIsProcessing(true);

                    try {
                      const items = [
                        {
                          name: `שדרוג ל-${totalPairs} זוגות Insola`,
                          type: "I",
                          unit_price: addPrice,
                          units_number: 1,
                        },
                      ];

                      const result = await createPayWithSavedTransaction({
                        txn_type: "debit",
                        cvv: trimmed,
                        items,
                      });

                      if (result.tranzila.error_code === 0) {
                        setShowCvvModal(false);
                        onAccept(totalPairs, totalPrice, result.stored_transaction_id);
                      } else {
                        toast.error(result.tranzila.message || "התשלום נכשל");
                      }
                    } catch (e) {
                      const msg = e instanceof Error ? e.message : "התשלום נכשל";
                      toast.error(msg);
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
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
