// import { useEffect, useState, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { UpsellModal } from "../../components/UpsellModal";
// import { DownsellModal } from "../../components/DownsellModal";
// import { upsellOptions } from "../../data/upsellOptions";
// import { toast } from "sonner";
// import TagManager from "react-gtm-module";
// import Purchases from "../Order/components/Purchases";

// const ORDER_ID_KEY = "current_order_id";
// const ORDER_DATA_KEY = "current_order_data";
// const TIMER_END_KEY = "upsell_timer_end";

// interface OrderData {
//   quantity: number;
//   price: number;
//   timestamp: number;
//   upsellShown: boolean;
//   downsellShown: boolean;
//   upsellAccepted: boolean;
//   timerExpired: boolean;
//   completed: boolean;
//   initialTransactionId?: string;
//   upsellTransactionId?: string;
//   downsellTransactionId?: string;
// }

// const Success = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showUpsell, setShowUpsell] = useState(false);
//   const [showDownsell, setShowDownsell] = useState(false);
//   const [currentOption, setCurrentOption] = useState<
//     (typeof upsellOptions)[0] | null
//   >(null);
//   const [orderId, setOrderId] = useState<string>("");
//   const [isLoading, setIsLoading] = useState(true);

//   // Check if timer expired
//   const isTimerExpired = useCallback((id: string) => {
//     const endTimeStr = localStorage.getItem(`${TIMER_END_KEY}_${id}`);
//     if (!endTimeStr) return false;
//     return Date.now() > parseInt(endTimeStr, 10);
//   }, []);

//   useEffect(() => {
//     const initializeOrder = () => {
//       let existingOrderId = localStorage.getItem(ORDER_ID_KEY);
//       let orderData: OrderData | null = null;

//       try {
//         const storedData = localStorage.getItem(ORDER_DATA_KEY);
//         if (storedData) {
//           orderData = JSON.parse(storedData);
//         }
//       } catch (e) {
//         console.error("Failed to parse order data");
//       }

//       const freshQuantity = location.state?.quantity;
//       const freshPrice = location.state?.price;
//       const freshOrderId = location.state?.orderId;
//       const freshTransactionId = location.state?.initialTransactionId;

//       // Check if this is a new order (has fresh state and different from stored)
//       const isNewOrder =
//         freshOrderId && (!existingOrderId || existingOrderId !== freshOrderId);

//       if (isNewOrder) {
//         // New order - use provided UUID
//         const newOrderId = freshOrderId;
//         const newOrderData: OrderData = {
//           quantity: freshQuantity,
//           price: freshPrice || 99,
//           timestamp: Date.now(),
//           upsellShown: false,
//           downsellShown: false,
//           upsellAccepted: false,
//           timerExpired: false,
//           completed: false,
//           initialTransactionId: freshTransactionId,
//         };

//         localStorage.setItem(ORDER_ID_KEY, newOrderId);
//         localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(newOrderData));
//         setOrderId(newOrderId);

//         const option = upsellOptions.find(
//           (o) => o.fromQuantity === freshQuantity,
//         );

//         if (!option || option.id === 4) {
//           newOrderData.completed = true;
//           localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(newOrderData));
//           navigate("/thank-you", { replace: true });
//           return;
//         }

//         setCurrentOption(option);
//         setIsLoading(false);

//         // Show upsell after delay
//         setTimeout(() => {
//           setShowUpsell(true);
//           newOrderData.upsellShown = true;
//           localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(newOrderData));
//         }, 1500);
//       } else if (existingOrderId && orderData) {
//         // Existing order - restore state
//         setOrderId(existingOrderId);

//         if (orderData.completed) {
//           // Order already completed - redirect to home (prevent back navigation)
//           clearOrderData();
//           navigate("/", { replace: true });
//           return;
//         }

//         const option = upsellOptions.find(
//           (o) => o.fromQuantity === orderData!.quantity,
//         );
//         setCurrentOption(option || null);
//         setIsLoading(false);

//         // Determine what to show based on stored state and timer
//         const timerExpired = isTimerExpired(existingOrderId);
//         const shouldShowDownsell = timerExpired || orderData.timerExpired;

//         if (!orderData.upsellAccepted && !orderData.downsellShown) {
//           if (shouldShowDownsell && option?.hasDownsell) {
//             // Timer expired, show downsell
//             setTimeout(() => {
//               setShowDownsell(true);
//               orderData!.downsellShown = true;
//               orderData!.timerExpired = true;
//               localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(orderData));
//             }, 500);
//           } else if (!orderData.upsellShown) {
//             // First time showing upsell
//             setTimeout(() => {
//               setShowUpsell(true);
//               orderData!.upsellShown = true;
//               localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(orderData));
//             }, 500);
//           } else {
//             // Upsell was shown, timer still running - show upsell again with remaining time
//             setTimeout(() => {
//               setShowUpsell(true);
//             }, 500);
//           }
//         } else if (orderData.downsellShown && !orderData.completed) {
//           // Downsell was shown but not completed - show again
//           setTimeout(() => {
//             setShowDownsell(true);
//           }, 500);
//         } else {
//           navigate("/thank-you", { replace: true });
//         }
//       } else {
//         // No order data and no fresh state - redirect home (direct access)
//         if (!freshOrderId) {
//           navigate("/", { replace: true });
//           return;
//         }
//         navigate("/", { replace: true });
//       }
//     };

//     initializeOrder();
//   }, [navigate, location.state, isTimerExpired]);

//   const updateOrderData = useCallback((updates: Partial<OrderData>) => {
//     try {
//       const stored = localStorage.getItem(ORDER_DATA_KEY);
//       if (stored) {
//         const data = JSON.parse(stored);
//         const updated = { ...data, ...updates };
//         localStorage.setItem(ORDER_DATA_KEY, JSON.stringify(updated));
//       }
//     } catch (e) {
//       console.error("Failed to update order data");
//     }
//   }, []);

//   const clearOrderData = useCallback(() => {
//     localStorage.removeItem(ORDER_ID_KEY);
//     localStorage.removeItem(ORDER_DATA_KEY);
//     if (orderId) {
//       localStorage.removeItem(`${TIMER_END_KEY}_${orderId}`);
//     }
//   }, [orderId]);

//   const handleUpsellAccept = async (quantity: number, price: number, transactionId: string) => {
//     try {
//       // Immediately close upsell modal
//       setShowUpsell(false);

//       TagManager.dataLayer({
//         dataLayer: {
//           event: "upsell_take_success",
//           value: price,
//           quantity: quantity,
//           transaction_id: transactionId,
//         },
//       });

//       updateOrderData({ upsellAccepted: true, completed: true, upsellTransactionId: transactionId });
//       toast.success("השידרוג בוצע בהצלחה!");

//       setTimeout(() => {
//         navigate("/thank-you", { state: { transactionId } });
//         clearOrderData();
//       }, 1000);
//     } catch (error) {
//       toast.error("אירעה שגיאה, אנא נסה שנית");
//     }
//   };

//   const handleUpsellDecline = () => {
//     setShowUpsell(false);
//     updateOrderData({ upsellShown: true });

//     if (currentOption?.hasDownsell && currentOption.downsell) {
//       setTimeout(() => {
//         setShowDownsell(true);
//         updateOrderData({ downsellShown: true });
//       }, 500);
//     } else {
//       updateOrderData({ completed: true });
//       setTimeout(() => {
//         const stored = localStorage.getItem(ORDER_DATA_KEY);
//         const orderData = stored ? JSON.parse(stored) : null;
//         const transactionId = orderData?.initialTransactionId;
//         clearOrderData();
//         navigate("/thank-you", { state: { transactionId } });
//       }, 500);
//     }
//   };

//   const handleUpsellExpire = () => {
//     // Called when timer actually expires
//     setShowUpsell(false);
//     updateOrderData({ upsellShown: true, timerExpired: true });

//     if (currentOption?.hasDownsell && currentOption.downsell) {
//       setTimeout(() => {
//         setShowDownsell(true);
//         updateOrderData({ downsellShown: true });
//       }, 500);
//     } else {
//       updateOrderData({ completed: true });
//       const stored = localStorage.getItem(ORDER_DATA_KEY);
//       const orderData = stored ? JSON.parse(stored) : null;
//       const transactionId = orderData?.initialTransactionId;
//       navigate("/thank-you", { state: { transactionId } });
//     }
//   };

//   const handleDownsellAccept = async (quantity: number, price: number, transactionId: string) => {
//     try {
//       TagManager.dataLayer({
//         dataLayer: {
//           event: "downsell_success",
//           value: price,
//           quantity: quantity,
//           transaction_id: transactionId,
//         },
//       });

//       updateOrderData({ completed: true, downsellTransactionId: transactionId });
//       toast.success("השידרוג בוצע בהצלחה!");

//       setTimeout(() => {
//         navigate("/thank-you", { state: { transactionId } });
//         clearOrderData();
//       }, 1000);
//     } catch (error) {
//       toast.error("אירעה שגיאה, אנא נסה שנית");
//     }
//   };

//   const handleDownsellDecline = () => {
//     setShowDownsell(false);
//     updateOrderData({ completed: true });

//     setTimeout(() => {
//       const stored = localStorage.getItem(ORDER_DATA_KEY);
//       const orderData = stored ? JSON.parse(stored) : null;
//       const transactionId = orderData?.initialTransactionId;
//       clearOrderData();
//       navigate("/thank-you", { state: { transactionId } });
//     }, 500);
//   };

//   const handleCloseUpsell = () => {
//     handleUpsellDecline();
//   };

//   const handleCloseDownsell = () => {
//     handleDownsellDecline();
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <Purchases />
//       <div className="text-center">
//         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <svg
//             className="w-10 h-10 text-green-600"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         </div>
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">
//           תודה! ההזמנה שלך בוצעה בהצלחה ✅
//         </h1>
//         <p className="text-gray-600">מעבדים את ההזמנה שלך...</p>
//       </div>

//       <UpsellModal
//         isOpen={showUpsell}
//         onClose={handleCloseUpsell}
//         option={currentOption}
//         originalQuantity={currentOption?.fromQuantity || 1}
//         onAccept={handleUpsellAccept}
//         onDecline={handleUpsellDecline}
//         onExpire={handleUpsellExpire}
//         orderId={orderId}
//       />

//       {currentOption?.downsell && !showUpsell && (
//         <DownsellModal
//           isOpen={showDownsell}
//           onClose={handleCloseDownsell}
//           originalQuantity={currentOption.fromQuantity}
//           addPairs={currentOption.downsell.addPairs}
//           addPrice={currentOption.downsell.addPrice}
//           totalPairs={currentOption.downsell.totalPairs}
//           totalPrice={currentOption.downsell.totalPrice}
//           onAccept={handleDownsellAccept}
//           onDecline={handleDownsellDecline}
//         />
//       )}
//     </div>
//   );
// };

// export default Success;

import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UpsellModal } from "../../components/UpsellModal";
import { DownsellModal } from "../../components/DownsellModal";
import { upsellOptions } from "../../data/upsellOptions";
import { toast } from "sonner";
import TagManager from "react-gtm-module";
import Purchases from "../Order/components/Purchases";
import { createOrder } from "../../api/orders";

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
  initialTransactionId?: string;
  upsellTransactionId?: string;
  downsellTransactionId?: string;
  // Store user info for upsell/downsell orders
  userInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    streetAddress: string;
    postalCode: string;
    country: string;
  };
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
      const freshTransactionId = location.state?.initialTransactionId;
      const freshUserInfo = location.state?.userInfo;

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
          initialTransactionId: freshTransactionId,
          userInfo: freshUserInfo,
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
          
          navigate("/thank-you", { 
            replace: true,
            state: {
              transactionId: freshTransactionId,
              orderData: {
                originalQuantity: freshQuantity,
                originalPrice: freshPrice,
                totalQuantity: freshQuantity,
                totalPrice: freshPrice,
                shipping: 15,
                transactionId: freshTransactionId,
                upgradeType: null
              }
            }
          });
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
          // Order already completed - redirect to home (prevent back navigation)
          clearOrderData();
          navigate("/", { replace: true });
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
        // No order data and no fresh state - redirect home (direct access)
        if (!freshOrderId) {
          navigate("/", { replace: true });
          return;
        }
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

  const handleUpsellAccept = async (
    quantity: number,
    price: number,
    transactionId: string,
  ) => {
    try {
      // Immediately close upsell modal
      setShowUpsell(false);

      TagManager.dataLayer({
        dataLayer: {
          event: "upsell_take_success",
          value: price,
          quantity: quantity,
          transaction_id: transactionId,
        },
      });

      // Save upsell order to database
      const stored = localStorage.getItem(ORDER_DATA_KEY);
      const orderData = stored ? JSON.parse(stored) : null;
      if (orderData?.userInfo) {
        try {
          await createOrder({
            ...orderData.userInfo,
            quantity: quantity,
            price: price / quantity,
            totalAmount: price,
            shippingCost: 0,
            transactionId: transactionId,
            paymentStatus: 'success',
            orderSource: 'upsell',
            isUpsell: true,
            isDownsell: false,
            originalOrderId: orderData.initialTransactionId,
          });
          console.log('✅ Upsell order saved successfully');
        } catch (orderError) {
          console.error('❌ Failed to save upsell order:', orderError);
        }
      }

      updateOrderData({
        upsellAccepted: true,
        completed: true,
        upsellTransactionId: transactionId,
      });
      toast.success("השידרוג בוצע בהצלחה!");

      setTimeout(() => {
        const stored = localStorage.getItem(ORDER_DATA_KEY);
        const orderData = stored ? JSON.parse(stored) : null;
        const option = upsellOptions.find((o) => o.fromQuantity === orderData?.quantity);
        
        navigate("/thank-you", { 
          state: { 
            transactionId,
            orderData: option ? {
              originalQuantity: orderData.quantity,
              originalPrice: orderData.price,
              upgradedQuantity: option.addPairs,
              upgradedPrice: option.addPrice,
              totalQuantity: option.totalPairs,
              totalPrice: option.totalPrice,
              shipping: 0,
              transactionId,
              upgradeType: "upsell"
            } : null
          } 
        });
        clearOrderData();
      }, 1000);
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
        const stored = localStorage.getItem(ORDER_DATA_KEY);
        const orderData = stored ? JSON.parse(stored) : null;
        const transactionId = orderData?.initialTransactionId;
        
        navigate("/thank-you", { 
          state: { 
            transactionId,
            orderData: {
              originalQuantity: orderData.quantity,
              originalPrice: orderData.price,
              totalQuantity: orderData.quantity,
              totalPrice: orderData.price,
              shipping: 15,
              transactionId,
              upgradeType: null
            }
          } 
        });
        clearOrderData();
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
      const stored = localStorage.getItem(ORDER_DATA_KEY);
      const orderData = stored ? JSON.parse(stored) : null;
      const transactionId = orderData?.initialTransactionId;
      
      navigate("/thank-you", { 
        state: { 
          transactionId,
          orderData: {
            originalQuantity: orderData.quantity,
            originalPrice: orderData.price,
            totalQuantity: orderData.quantity,
            totalPrice: orderData.price,
            shipping: 15,
            transactionId,
            upgradeType: null
          }
        } 
      });
    }
  };

  const handleDownsellAccept = async (
    quantity: number,
    price: number,
    transactionId: string,
  ) => {
    try {
      TagManager.dataLayer({
        dataLayer: {
          event: "downsell_success",
          value: price,
          quantity: quantity,
          transaction_id: transactionId,
        },
      });

      // Save downsell order to database
      const stored = localStorage.getItem(ORDER_DATA_KEY);
      const orderData = stored ? JSON.parse(stored) : null;
      if (orderData?.userInfo) {
        try {
          await createOrder({
            ...orderData.userInfo,
            quantity: quantity,
            price: price / quantity,
            totalAmount: price,
            shippingCost: 0,
            transactionId: transactionId,
            paymentStatus: 'success',
            orderSource: 'downsell',
            isUpsell: false,
            isDownsell: true,
            originalOrderId: orderData.initialTransactionId,
          });
          console.log('✅ Downsell order saved successfully');
        } catch (orderError) {
          console.error('❌ Failed to save downsell order:', orderError);
        }
      }

      updateOrderData({
        completed: true,
        downsellTransactionId: transactionId,
      });
      toast.success("השידרוג בוצע בהצלחה!");

      setTimeout(() => {
        const stored = localStorage.getItem(ORDER_DATA_KEY);
        const orderData = stored ? JSON.parse(stored) : null;
        const option = upsellOptions.find((o) => o.fromQuantity === orderData?.quantity);
        
        navigate("/thank-you", { 
          state: { 
            transactionId,
            orderData: option?.downsell ? {
              originalQuantity: orderData.quantity,
              originalPrice: orderData.price,
              upgradedQuantity: option.downsell.addPairs,
              upgradedPrice: option.downsell.addPrice,
              totalQuantity: option.downsell.totalPairs,
              totalPrice: option.downsell.totalPrice,
              shipping: 15,
              transactionId,
              upgradeType: "downsell"
            } : null
          } 
        });
        clearOrderData();
      }, 1000);
    } catch (error) {
      toast.error("אירעה שגיאה, אנא נסה שנית");
    }
  };

  const handleDownsellDecline = () => {
    setShowDownsell(false);
    updateOrderData({ completed: true });

    setTimeout(() => {
      const stored = localStorage.getItem(ORDER_DATA_KEY);
      const orderData = stored ? JSON.parse(stored) : null;
      const transactionId = orderData?.initialTransactionId;
      
      navigate("/thank-you", { 
        state: { 
          transactionId,
          orderData: {
            originalQuantity: orderData.quantity,
            originalPrice: orderData.price,
            totalQuantity: orderData.quantity,
            totalPrice: orderData.price,
            shipping: 15,
            transactionId,
            upgradeType: null
          }
        } 
      });
      clearOrderData();
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

      {currentOption?.downsell && !showUpsell && (
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
