import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { FormValues } from "./types";

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
  idNumber: string;
}

export const persistentFormAtom = atomWithStorage<PersistentFormData>(
  "orderForm",
  {
    selectedProductId: 4,
    size: "S-M: 36-42",
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
    idNumber: "",
  },
);

// Combined atom — card data no longer stored (handled by Tranzila Hosted Fields)
export const orderFormAtom = atom(
  (get) => get(persistentFormAtom) as FormValues,
  (get, set, update: Partial<FormValues>) => {
    const prev = get(persistentFormAtom);
    set(persistentFormAtom, { ...prev, ...update });
  },
);

export const formValidationAtom = atom((get) => {
  const form = get(orderFormAtom);
  return {
    step1Valid: form.selectedProductId && form.size,
    step2Valid:
      form.firstName && form.lastName && form.email && form.phoneNumber,
    step3Valid: form.city && form.streetAddress && form.postalCode,
  };
});

export const queryParamsAtom = atom<{ [key: string]: string }>({});
