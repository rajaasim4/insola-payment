import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UpsellModal } from "../../components/UpsellModal";
import { DownsellModal } from "../../components/DownsellModal";
import { upsellOptions } from "../../data/upsellOptions";
import { toast } from "sonner";
import TagManager from "react-gtm-module";
import Purchases from "../Order/components/Purchases";

const ORDER_ID_KEY = "current_order_id";
const ORDER_DATA_KEY = "current_order_data";
const TIMER_END_KEY = "upsell_timer_end";

interface OrderData {
  quantity: number;
  price: number;
  timestamp: number;
  upsellShown: boolean;
  downsellShown: boolean;
  upsellAccepted: boolean;
  timerExpired: boolean;
  completed: boolean;
}

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDownsell, setShowDownsell] = useState(false);
  const [currentOption, setCurrentOption] = useState<
    (typeof upsellOptions)[0] | null
  >(null);
  const [orderId, setOrderId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Check if timer expired
  const isTimerExpired = useCallback((id: string) => {
    const endTimeStr = localStorage.getItem(`${TIMER_END_KEY}_${id}`);
    if (!endTimeStr) return false;
    return Date.now() > parseInt(endTimeStr, 10);
  }, []);

  useEffect(() => {
    const initializeOrder = () => {
      let existingOrderId = localStorage.getItem(ORDER_ID_KEY);
      let orderData: OrderData | null = null;

      try {
        const storedData = localStorage.getItem(ORDER_DATA_KEY);
        if (storedData) {
          orderData = JSON.parse(storedData);
        }
      } catch (e) {
        console.error("Failed to parse order data");
      }

      const freshQuantity = location.state?.quantity;
      const freshPrice = location.state?.price;
      const freshOrderId = location.state?.orderId;

      // Check if this is a new order (has fresh state and different from stored)
      const isNewOrder =
        freshOrderId && (!existingOrderId || existingOrderId !== freshOrderId);

      if (isNewOrder) {
        // New order - use provided UUID
        const newOrderId = freshOrderId;
        const newOrderData: OrderData = {
          quantity: freshQuantity,
          price: freshPrice || 99,
          timestamp: Date.now(),
          upsellShown: false,
          downsellShown: false,
          upsellAccepted: false,
          timerExpired: false,
          completed: false,
        };

        localStorage.setItem(ORDER_ID_KEY, newOrderId);
        localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(newOrderData));
        setOrderId(newOrderId);

        const option = upsellOptions.find(
          (o) => o.fromQuantity === freshQuantity,
        );

        if (!option || option.id === 4) {
          newOrderData.completed = true;
          localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(newOrderData));
          navigate("/thank-you", { replace: true });
          return;
        }

        setCurrentOption(option);
        setIsLoading(false);

        // Show upsell after delay
        setTimeout(() => {
          setShowUpsell(true);
          newOrderData.upsellShown = true;
          localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(newOrderData));
        }, 1500);
      } else if (existingOrderId && orderData) {
        // Existing order - restore state
        setOrderId(existingOrderId);

        if (orderData.completed) {
          navigate("/thank-you", { replace: true });
          return;
        }

        const option = upsellOptions.find(
          (o) => o.fromQuantity === orderData!.quantity,
        );
        setCurrentOption(option || null);
        setIsLoading(false);

        // Determine what to show based on stored state and timer
        const timerExpired = isTimerExpired(existingOrderId);
        const shouldShowDownsell = timerExpired || orderData.timerExpired;

        if (!orderData.upsellAccepted && !orderData.downsellShown) {
          if (shouldShowDownsell && option?.hasDownsell) {
            // Timer expired, show downsell
            setTimeout(() => {
              setShowDownsell(true);
              orderData!.downsellShown = true;
              orderData!.timerExpired = true;
              localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(orderData));
            }, 500);
          } else if (!orderData.upsellShown) {
            // First time showing upsell
            setTimeout(() => {
              setShowUpsell(true);
              orderData!.upsellShown = true;
              localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(orderData));
            }, 500);
          } else {
            // Upsell was shown, timer still running - show upsell again with remaining time
            setTimeout(() => {
              setShowUpsell(true);
            }, 500);
          }
        } else if (orderData.downsellShown && !orderData.completed) {
          // Downsell was shown but not completed - show again
          setTimeout(() => {
            setShowDownsell(true);
          }, 500);
        } else {
          navigate("/thank-you", { replace: true });
        }
      } else {
        // No order data - redirect home
        navigate("/", { replace: true });
      }
    };

    initializeOrder();
  }, [navigate, location.state, isTimerExpired]);

  const updateOrderData = useCallback((updates: Partial<OrderData>) => {
    try {
      const stored = localStorage.getItem(ORDER_DATA_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        const updated = { ...data, ...updates };
        localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Failed to update order data");
    }
  }, []);

  const clearOrderData = useCallback(() => {
    localStorage.removeItem(ORDER_ID_KEY);
    localStorage.removeItem(ORDER_DATA_KEY);
    if (orderId) {
      localStorage.removeItem(`${TIMER_END_KEY}_${orderId}`);
    }
  }, [orderId]);

  const handleUpsellAccept = async (quantity: number, price: number) => {
    try {
      TagManager.dataLayer({
        dataLayer: {
          event: "upsell_take_success",
          value: price,
          quantity: quantity,
        },
      });

      updateOrderData({ upsellAccepted: true, completed: true });
      toast.success("השידרוג בוצע בהצלחה!");

      setTimeout(() => {
        clearOrderData();
      }, 1000);

      navigate("/thank-you");
    } catch (error) {
      toast.error("אירעה שגיאה, אנא נסה שנית");
    }
  };

  const handleUpsellDecline = () => {
    setShowUpsell(false);
    updateOrderData({ upsellShown: true });

    if (currentOption?.hasDownsell && currentOption.downsell) {
      setTimeout(() => {
        setShowDownsell(true);
        updateOrderData({ downsellShown: true });
      }, 500);
    } else {
      updateOrderData({ completed: true });
      setTimeout(() => {
        clearOrderData();
        navigate("/thank-you");
      }, 500);
    }
  };

  const handleUpsellExpire = () => {
    // Called when timer actually expires
    setShowUpsell(false);
    updateOrderData({ upsellShown: true, timerExpired: true });

    if (currentOption?.hasDownsell && currentOption.downsell) {
      setTimeout(() => {
        setShowDownsell(true);
        updateOrderData({ downsellShown: true });
      }, 500);
    } else {
      updateOrderData({ completed: true });
      navigate("/thank-you");
    }
  };

  const handleDownsellAccept = async (quantity: number, price: number) => {
    try {
      TagManager.dataLayer({
        dataLayer: {
          event: "downsell_success",
          value: price,
          quantity: quantity,
        },
      });

      updateOrderData({ completed: true });
      toast.success("השידרוג בוצע בהצלחה!");

      setTimeout(() => {
        clearOrderData();
      }, 1000);

      navigate("/thank-you");
    } catch (error) {
      toast.error("אירעה שגיאה, אנא נסה שנית");
    }
  };

  const handleDownsellDecline = () => {
    setShowDownsell(false);
    updateOrderData({ completed: true });

    setTimeout(() => {
      clearOrderData();
      navigate("/thank-you");
    }, 500);
  };

  const handleCloseUpsell = () => {
    handleUpsellDecline();
  };

  const handleCloseDownsell = () => {
    handleDownsellDecline();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Purchases />
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

      <UpsellModal
        isOpen={showUpsell}
        onClose={handleCloseUpsell}
        option={currentOption}
        originalQuantity={currentOption?.fromQuantity || 1}
        onAccept={handleUpsellAccept}
        onDecline={handleUpsellDecline}
        onExpire={handleUpsellExpire}
        orderId={orderId}
      />

      {currentOption?.downsell && (
        <DownsellModal
          isOpen={showDownsell}
          onClose={handleCloseDownsell}
          originalQuantity={currentOption.fromQuantity}
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
