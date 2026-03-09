import { WEBHOOK_URL } from "./constants";

export interface ZapierPayload {
  orderId: string;
  transactionId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  country: string;
  quantity: number;
  price: number;
  shippingCost: number;
  totalAmount: number;
  marketingEmails: boolean;
  marketingSMS: boolean;
}

export const sendOrderToZapier = async (data: ZapierPayload) => {
  if (!WEBHOOK_URL) return;

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Zapier webhook failed:", error);
  }
};
