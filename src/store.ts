// import { atom } from "jotai";

// import { atomWithStorage } from "jotai/utils";
// import type { FormValues } from "./types";

// export const orderFormAtom = atomWithStorage<FormValues>("orderForm", {
//   selectedProductId: 4,
//   size: "S-M",
//   warranty: false,
//   firstName: "",
//   lastName: "",
//   email: "",
//   marketingEmails: false,
//   marketingSMS: false,
//   // phoneCountryCode: "92",
//   phoneNumber: "",
//   country: "ישראל",
//   city: "",
//   streetAddress: "",
//   // region: "",
//   postalCode: "",
//   shippingMethod: "standard",
//   shippingCost: "15",
//   price: "299.00",
//   quantity: "4",
//   cardNumber: "",
//   cvv: "",
//   expiryDate: "",
//   termsAccepted: false,
// });

// export const formValidationAtom = atom((get) => {
//   const form = get(orderFormAtom);
//   return {
//     step1Valid: form.selectedProductId && form.size,
//     step2Valid:
//       form.firstName && form.lastName && form.email && form.phoneNumber,
//     step3Valid: form.city && form.streetAddress && form.postalCode,
//   };
// });

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { FormValues } from "./types";

// Sensitive fields that should NEVER be stored in localStorage
interface SensitiveFormData {
  cardNumber: string;
  cvv: string;
  expiryDate: string;
}

// Non-sensitive fields that can be persisted
interface PersistentFormData {
  selectedProductId: number;
  size: string;
  warranty: boolean;
  firstName: string;
  lastName: string;
  email: string;
  marketingEmails: boolean;
  marketingSMS: boolean;
  phoneNumber: string;
  country: string;
  city: string;
  streetAddress: string;
  postalCode: string;
  shippingMethod: string;
  shippingCost: string;
  price: string;
  quantity: string;
  termsAccepted: boolean;
}

// Persistent atom (localStorage) - NO sensitive data
export const persistentFormAtom = atomWithStorage<PersistentFormData>(
  "orderForm",
  {
    selectedProductId: 4,
    size: "S-M",
    warranty: false,
    firstName: "",
    lastName: "",
    email: "",
    marketingEmails: false,
    marketingSMS: false,
    phoneNumber: "",
    country: "ישראל",
    city: "",
    streetAddress: "",
    postalCode: "",
    shippingMethod: "standard",
    shippingCost: "15",
    price: "299.00",
    quantity: "4",
    termsAccepted: false,
  },
);

// Memory-only atom (resets on refresh) - sensitive data only
export const sensitiveFormAtom = atom<SensitiveFormData>({
  cardNumber: "",
  cvv: "",
  expiryDate: "",
});

// Combined atom for reading full form data
export const orderFormAtom = atom(
  (get) => {
    const persistent = get(persistentFormAtom);
    const sensitive = get(sensitiveFormAtom);
    return { ...persistent, ...sensitive } as FormValues;
  },
  (get, set, update: Partial<FormValues>) => {
    const persistent = get(persistentFormAtom);
    const sensitive = get(sensitiveFormAtom);

    // Split update into persistent and sensitive
    const persistentUpdate: Partial<PersistentFormData> = {};
    const sensitiveUpdate: Partial<SensitiveFormData> = {};

    (Object.keys(update) as Array<keyof FormValues>).forEach((key) => {
      if (key === "cardNumber" || key === "cvv" || key === "expiryDate") {
        (sensitiveUpdate as any)[key] = update[key];
      } else {
        (persistentUpdate as any)[key] = update[key];
      }
    });

    if (Object.keys(persistentUpdate).length > 0) {
      set(persistentFormAtom, { ...persistent, ...persistentUpdate });
    }
    if (Object.keys(sensitiveUpdate).length > 0) {
      set(sensitiveFormAtom, { ...sensitive, ...sensitiveUpdate });
    }
  },
);

// Clear sensitive data atom
export const clearSensitiveDataAtom = atom(null, (_, set) => {
  set(sensitiveFormAtom, {
    cardNumber: "",
    cvv: "",
    expiryDate: "",
  });
});

export const formValidationAtom = atom((get) => {
  const form = get(orderFormAtom);
  return {
    step1Valid: form.selectedProductId && form.size,
    step2Valid:
      form.firstName && form.lastName && form.email && form.phoneNumber,
    step3Valid: form.city && form.streetAddress && form.postalCode,
  };
});
