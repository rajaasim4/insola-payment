import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UpsellModal } from "../../components/UpsellModal";
import { DownsellModal } from "../../components/DownsellModal";
import { upsellOptions } from "../../data/upsellOptions";
import { toast } from "sonner";
import TagManager from "react-gtm-module";
import Purchases from "../Order/components/Purchases";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDownsell, setShowDownsell] = useState(false);
  const [currentOption, setCurrentOption] = useState<
    (typeof upsellOptions)[0] | null
  >(null);

  // Get quantity from location state or default to 1
  const originalQuantity = location.state?.quantity || 1;
  const originalPrice = location.state?.price || 99;

  useEffect(() => {
    // Find matching upsell option
    const option = upsellOptions.find(
      (o) => o.fromQuantity === originalQuantity,
    );

    if (!option || option.id === 4) {
      // No upsell for 4 packs, redirect to thank you
      navigate("/thank-you", { replace: true });
      return;
    }

    // Small delay to show success page briefly, then open modal
    const timer = setTimeout(() => {
      setCurrentOption(option);
      setShowUpsell(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [originalQuantity, navigate]);

  const handleUpsellAccept = async (quantity: number, price: number) => {
    try {
      // API call to add to order
      // await addToOrder({ quantity, price });

      TagManager.dataLayer({
        dataLayer: {
          event: "upsell_take_success",
          value: price,
          quantity: quantity,
        },
      });

      toast.success("השידרוג בוצע בהצלחה!");
      navigate("/thank-you");
    } catch (error) {
      toast.error("אירעה שגיאה, אנא נסה שנית");
    }
  };

  const handleUpsellDecline = () => {
    setShowUpsell(false);

    // Check if has downsell
    if (currentOption?.hasDownsell && currentOption.downsell) {
      setTimeout(() => setShowDownsell(true), 500);
    } else {
      navigate("/thank-you");
    }
  };

  const handleDownsellAccept = async (quantity: number, price: number) => {
    try {
      // API call to add to order
      // await addToOrder({ quantity, price });

      TagManager.dataLayer({
        dataLayer: {
          event: "downsell_success",
          value: price,
          quantity: quantity,
        },
      });

      toast.success("השידרוג בוצע בהצלחה!");
      navigate("/thank-you");
    } catch (error) {
      toast.error("אירעה שגיאה, אנא נסה שנית");
    }
  };

  const handleDownsellDecline = () => {
    setShowDownsell(false);
    navigate("/thank-you");
  };

  const handleCloseUpsell = () => {
    // X button clicked - treat as decline but show downsell if available
    handleUpsellDecline();
  };

  const handleCloseDownsell = () => {
    // X button clicked on downsell
    setShowDownsell(false);
    navigate("/thank-you");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Purchases />
      {/* Background Success Message */}
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          תודה! ההזמנה שלך בוצעה בהצלחה ✅
        </h1>
        <p className="text-gray-600">מעבדים את ההזמנה שלך...</p>
      </div>

      {/* Upsell Modal */}
      <UpsellModal
        isOpen={showUpsell}
        onClose={handleCloseUpsell}
        option={currentOption}
        originalQuantity={originalQuantity}
        onAccept={handleUpsellAccept}
        onDecline={handleUpsellDecline}
      />

      {/* Downsell Modal */}
      {currentOption?.downsell && (
        <DownsellModal
          isOpen={showDownsell}
          onClose={handleCloseDownsell}
          originalQuantity={originalQuantity}
          addPairs={currentOption.downsell.addPairs}
          addPrice={currentOption.downsell.addPrice}
          totalPairs={currentOption.downsell.totalPairs}
          totalPrice={currentOption.downsell.totalPrice}
          onAccept={handleDownsellAccept}
          onDecline={handleDownsellDecline}
        />
      )}
    </div>
  );
};

export default Success;
