import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Package, User, MapPin, Calendar } from "lucide-react";

interface OrderData {
  id: string;
  date: string;
  selectedProductId: number;
  size: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  shippingMethod: string;
  shippingCost: string;
  price: string;
  quantity: string;
  warranty: boolean;
  marketingEmails: boolean;
  marketingSMS: boolean;
  status: "completed" | "pending" | "failed";
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "הושלם";
      case "pending":
        return "ממתין";
      case "failed":
        return "נכשל";
      default:
        return status;
    }
  };

  const getProductName = (productId: number) => {
    const products: Record<number, string> = {
      1: "Insola - 1 זוג",
      2: "Insola - 2 זוגות",
      3: "Insola - 3 זוגות",
      4: "Insola - 4 זוגות (הכי פופולארי)",
    };
    return products[productId] || `מוצר #${productId}`;
  };

  const totalPrice = (
    parseFloat(order.price) * parseInt(order.quantity)
  ).toFixed(2);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-right align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-blue-500 px-6 py-4 flex items-center justify-between">
                  <Dialog.Title className="text-lg font-bold text-white">
                    פרטי הזמנה #{order.id}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        תאריך: {order.date}
                      </span>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="h-5 w-5 text-blue-500" />
                        <h3 className="font-bold text-gray-900">פרטי לקוח</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-500">שם מלא:</span>{" "}
                          <span className="font-medium">
                            {order.firstName} {order.lastName}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-500">אימייל:</span>{" "}
                          <span className="font-medium">{order.email}</span>
                        </p>
                        <p>
                          <span className="text-gray-500">טלפון:</span>{" "}
                          <span className="font-medium">
                            {order.phoneNumber}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-500">דיוור אימייל:</span>{" "}
                          <span className="font-medium">
                            {order.marketingEmails ? "כן" : "לא"}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-500">דיוור SMS:</span>{" "}
                          <span className="font-medium">
                            {order.marketingSMS ? "כן" : "לא"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <h3 className="font-bold text-gray-900">
                          כתובת למשלוח
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-500">מדינה:</span>{" "}
                          <span className="font-medium">{order.country}</span>
                        </p>
                        <p>
                          <span className="text-gray-500">עיר:</span>{" "}
                          <span className="font-medium">{order.city}</span>
                        </p>
                        <p>
                          <span className="text-gray-500">רחוב:</span>{" "}
                          <span className="font-medium">
                            {order.streetAddress}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-500">מיקוד:</span>{" "}
                          <span className="font-medium">
                            {order.postalCode}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-500">שיטת משלוח:</span>{" "}
                          <span className="font-medium">
                            {order.shippingMethod === "standard"
                              ? "רגיל"
                              : "מהיר"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="h-5 w-5 text-blue-500" />
                        <h3 className="font-bold text-gray-900">פרטי מוצר</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-gray-500">מוצר:</span>{" "}
                            <span className="font-medium">
                              {getProductName(order.selectedProductId)}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-500">מידה:</span>{" "}
                            <span className="font-medium">{order.size}</span>
                          </p>
                          <p>
                            <span className="text-gray-500">כמות:</span>{" "}
                            <span className="font-medium">
                              {order.quantity} יחידות
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-500">אחריות:</span>{" "}
                            <span className="font-medium">
                              {order.warranty ? "3 שנים (+₪4 ליחידה)" : "ללא"}
                            </span>
                          </p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-gray-500">מחיר ליחידה:</span>{" "}
                            <span className="font-medium">₪{order.price}</span>
                          </p>
                          <p>
                            <span className="text-gray-500">עלות משלוח:</span>{" "}
                            <span className="font-medium">
                              ₪{order.shippingCost}
                            </span>
                          </p>
                          <p className="pt-2 border-t border-gray-200">
                            <span className="text-gray-500">סה"כ:</span>
                            <span className="font-bold text-lg text-green-600 mr-2">
                              ₪{totalPrice}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    סגור
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

export default OrderDetailsModal;
