import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Package, User, MapPin, Calendar } from "lucide-react";

interface OrderData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  quantity: number;
  price: number;
  totalAmount: number;
  shippingCost: number;
  transactionId: string;
  paymentStatus: "success" | "failed" | "pending";
  orderSource: "main_checkout" | "upsell" | "downsell";
  isUpsell: boolean;
  isDownsell: boolean;
  originalOrderId?: string;
  marketingEmails: boolean;
  marketingSMS: boolean;
  createdAt: string;
  updatedAt: string;
  relatedOrders?: OrderData[];
  consolidatedTotalAmount?: number;
  consolidatedTotalQuantity?: number;
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
      case "success":
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
      case "success":
        return "הושלם";
      case "pending":
        return "ממתין";
      case "failed":
        return "נכשל";
      default:
        return status;
    }
  };

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
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
                    פרטי הזמנה #{order.transactionId}
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
                        תאריך: {new Date(order.createdAt).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(order.paymentStatus)}`}
                    >
                      {getStatusText(order.paymentStatus)}
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
                          <span className="text-gray-500">עלות משלוח:</span>{" "}
                          <span className="font-medium">
                            ₪{order.shippingCost}
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
                      
                      {/* Main Order */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">רכישה ראשית</h4>
                          <span className="text-sm font-medium text-gray-600">{order.quantity} זוג{order.quantity > 1 ? 'ות' : ''}</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <p>
                              <span className="text-gray-500">מחיר ליחידה:</span>{" "}
                              <span className="font-medium">₪{order.price}</span>
                            </p>
                            <p>
                              <span className="text-gray-500">כמות:</span>{" "}
                              <span className="font-medium">{order.quantity} יחידות</span>
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p>
                              <span className="text-gray-500">עלות משלוח:</span>{" "}
                              <span className="font-medium">₪{order.shippingCost}</span>
                            </p>
                            <p className="pt-1 border-t border-gray-200">
                              <span className="text-gray-500">סכום:</span>{" "}
                              <span className="font-bold text-green-600">₪{order.totalAmount}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Related Orders (Upsells/Downsells) */}
                      {order.relatedOrders && order.relatedOrders.length > 0 && (
                        <div className="space-y-3">
                          {order.relatedOrders.map((relatedOrder) => (
                            <div key={relatedOrder._id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {relatedOrder.isUpsell ? '✨ שדרוג לחבילה מורחבת' : '📦 הצעה נוספת'}
                                </h4>
                                <span className="text-sm font-medium text-gray-600">
                                  +{relatedOrder.quantity} זוג{relatedOrder.quantity > 1 ? 'ות' : ''} נוספ{relatedOrder.quantity > 1 ? 'ים' : ''}
                                </span>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                  <p>
                                    <span className="text-gray-500">מזהה עסקה:</span>{" "}
                                    <span className="font-medium">#{relatedOrder.transactionId}</span>
                                  </p>
                                  <p>
                                    <span className="text-gray-500">תאריך:</span>{" "}
                                    <span className="font-medium">
                                      {new Date(relatedOrder.createdAt).toLocaleDateString('he-IL')}
                                    </span>
                                  </p>
                                  <p className="text-xs text-green-600 font-medium">משלוח חינם!</p>
                                </div>
                                <div className="space-y-1">
                                  <p>
                                    <span className="text-gray-500">סטטוס:</span>{" "}
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(relatedOrder.paymentStatus)}`}>
                                      {getStatusText(relatedOrder.paymentStatus)}
                                    </span>
                                  </p>
                                  <p className="pt-1 border-t border-blue-200">
                                    <span className="text-gray-500">סכום:</span>{" "}
                                    <span className="font-bold text-green-600">₪{relatedOrder.totalAmount}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Consolidated Total */}
                      {order.consolidatedTotalAmount && order.consolidatedTotalAmount > order.totalAmount && (
                        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 mt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-700">סה"כ לתשלום</p>
                              <p className="text-xs text-gray-500 mt-1">
                                סה"כ {order.consolidatedTotalQuantity} מדרסי Insola
                              </p>
                              {order.relatedOrders && order.relatedOrders.length > 0 && (
                                <p className="text-xs text-green-600 font-medium mt-1">
                                  ✓ נהנית ממשלוח חינם על השדרוג!
                                </p>
                              )}
                            </div>
                            <span className="text-2xl font-bold text-green-600">₪{order.consolidatedTotalAmount}</span>
                          </div>
                        </div>
                      )}
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
