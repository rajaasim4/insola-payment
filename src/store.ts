import { atom } from "jotai";

// Order form data atom
export const orderFormAtom = atom({
  // Step 1: Product selection
  selectedProductId: 4,
  size: "S-M",
  warranty: false,

  // Step 2: Customer details
  firstName: "",
  lastName: "",
  email: "",
  marketingEmails: false,
  marketingSMS: false,
  phoneCountryCode: "92",
  phoneNumber: "",

  // Step 3: Shipping address
  country: "",
  city: "",
  streetAddress: "",
  region: "",
  postalCode: "",
  shippingMethod: "standard",
  shippingCost: "15",

  // Step 4: Payment (to be added)
  //   paymentMethod: "",
});

// Derived atom for form validation status
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
