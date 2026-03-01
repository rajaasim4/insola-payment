import { atom } from "jotai";

import { atomWithStorage } from "jotai/utils";
import type { FormValues } from "./types";

export const orderFormAtom = atomWithStorage<FormValues>("orderForm", {
  selectedProductId: 4,
  size: "S-M",
  warranty: false,
  firstName: "",
  lastName: "",
  email: "",
  marketingEmails: false,
  marketingSMS: false,
  phoneCountryCode: "92",
  phoneNumber: "",
  country: "",
  city: "",
  streetAddress: "",
  region: "",
  postalCode: "",
  shippingMethod: "standard",
  shippingCost: "15",
  price: "248.00",
  quantity: "4",
  cardNumber: "",
  cvv: "",
  expiryDate: "",
  termsAccepted: false,
});

export const formValidationAtom = atom((get) => {
  const form = get(orderFormAtom);
  return {
    step1Valid: form.selectedProductId && form.size,
    step2Valid:
      form.firstName && form.lastName && form.email && form.phoneNumber,
    step3Valid:
      form.city && form.streetAddress && form.region && form.postalCode,
  };
});
