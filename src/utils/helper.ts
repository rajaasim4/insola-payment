import { Zapier_Hook } from "./constants";

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
  if (!Zapier_Hook) return;

  try {
    await fetch(Zapier_Hook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Zapier webhook failed:", error);
  }
};
