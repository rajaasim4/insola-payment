import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const Purchases = () => {
  const allpurchases = [
    { name: "אבי א׳", city: "רמת השרון", quantity: 4, gender: "male" },
    { name: "נועה ל׳", city: "סביון", quantity: 4, gender: "female" },
    { name: "דניאל ש׳", city: "הרצליה פיתוח", quantity: 4, gender: "male" },
    {
      name: "מיכל ק׳",
      city: "רמת אביב – תל אביב",
      quantity: 4,
      gender: "female",
    },
    { name: "יואב מ׳", city: "כפר שמריהו", quantity: 4, gender: "male" },
    { name: "לילך פ׳", city: "רעננה", quantity: 3, gender: "female" },
    { name: "רון ג׳", city: "הוד השרון", quantity: 4, gender: "male" },
    { name: "טלי נ׳", city: "כפר סבא", quantity: 4, gender: "female" },
    { name: "אלון ד׳", city: "גבעתיים", quantity: 3, gender: "male" },
    { name: "ענבל ס׳", city: "צהלה – תל אביב", quantity: 4, gender: "female" },
    { name: "איתי ר׳", city: "תל ברוך – תל אביב", quantity: 4, gender: "male" },
    { name: "שרית ח׳", city: "מודיעין", quantity: 2, gender: "female" },
    { name: "גיא ב׳", city: "קריית אונו", quantity: 4, gender: "male" },
    { name: "סיון ת׳", city: "נתניה", quantity: 3, gender: "female" },
    { name: "תומר י׳", city: "ראשון לציון", quantity: 4, gender: "male" },
  ];

  const indexRef = useRef(0);
  const timeoutRef = useRef<number | undefined>(undefined);
  const lastToastTimeRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const showToast = () => {
      // Don't show if tab is hidden
      if (document.hidden) {
        return;
      }

      const purchase = allpurchases[indexRef.current];

      toast(
        <div className="text-right flex">
          <img src="/images/1.png" alt="" className="max-w-12 object-contain" />
          <div className="">
            <p className="font-semibold md:text-sm">
              {purchase.name}, {purchase.city} –{" "}
              {purchase.gender === "male" ? "ביצע רכישה." : "ביצעה רכישה."}
            </p>
            <p className="md:text-xs text-sm text-gray-500 mt-1 font-semibold">
              X{purchase.quantity} זוגות מדרסי Insola כבר נמכרו!
            </p>
          </div>
        </div>,
        {
          autoClose: 5000,
        },
      );

      lastToastTimeRef.current = Date.now();
      indexRef.current = (indexRef.current + 1) % allpurchases.length;
    };

    const scheduleNext = () => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Only schedule if visible
      if (!document.hidden) {
        timeoutRef.current = window.setTimeout(() => {
          showToast();
          scheduleNext();
        }, 7000);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab hidden: clear timeout
        isVisibleRef.current = false;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
      } else {
        // Tab visible again: resume with delay check
        isVisibleRef.current = true;

        // Check if enough time passed while hidden
        const timeSinceLastToast = Date.now() - lastToastTimeRef.current;
        const delay = Math.max(0, 7000 - timeSinceLastToast);

        timeoutRef.current = window.setTimeout(
          () => {
            showToast();
            scheduleNext();
          },
          delay > 2000 ? delay : 2000,
        ); // Minimum 2s delay
      }
    };

    // Start the loop
    const initialDelay = 2000;
    timeoutRef.current = window.setTimeout(() => {
      showToast();
      scheduleNext();
    }, initialDelay);

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return null;
};

export default Purchases;
