import { WEBHOOK_URL } from "./constants";

export interface ZapierPayload {
  transactionId: string;

  // Customer
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  country: string;

  // Quantities
  originalQuantity: number;
  upgradedQuantity: number;
  totalQuantity: number;

  // Prices
  originalPrice: number;
  upgradedPrice: number;
  shippingPrice: number;
  totalPrice: number;

  // Funnel info
  upgradeType?: "upsell" | "downsell" | "none";

  // Marketing
  marketingEmails: boolean;
  marketingSMS: boolean;
}

export const sendOrderToZapier = async (data: ZapierPayload) => {
  if (!WEBHOOK_URL) return;

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Zapier webhook failed:", error);
  }
};
