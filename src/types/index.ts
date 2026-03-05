// types/form.ts

export interface Product {
  id: number;
  quantity: string;
  description: string;
  discount: string;
  originalPrice: string;
  discountedPrice: string;
  toplabel: string;
  bottomLable: string;
  img: string;
}

export interface FormValues {
  // Step 1: Product selection
  selectedProductId: number;
  size: string;
  // warranty: boolean;
  price: string;
  quantity: string;

  // Step 2: Customer details
  firstName: string;
  lastName: string;
  email: string;
  marketingEmails: boolean;
  marketingSMS: boolean;
  // phoneCountryCode: string;
  phoneNumber: string;

  // Step 3: Shipping address
  country: string;
  city: string;
  streetAddress: string;
  // region: string;
  postalCode: string;
  shippingMethod: string;
  shippingCost: string;

  // Step 4: Payment
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  // termsAccepted: boolean;
}

export interface StepProps {
  values: FormValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export interface UpsellOption {
  id: number;
  fromQuantity: number;
  title: string;
  addPairs: number;
  addPrice: number;
  totalPairs: number;
  totalPrice: number;
  perItemPrice: number;
  hasDownsell: boolean;
  downsell?: {
    addPairs: number;
    addPrice: number;
    totalPairs: number;
    totalPrice: number;
  };
}
