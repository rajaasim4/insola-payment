import type { UpsellOption } from "../types";

export const upsellOptions: UpsellOption[] = [
  {
    id: 1,
    fromQuantity: 1,
    title: "קנה זוג אחד (₪99)",
    addPairs: 3,
    addPrice: 147,
    totalPairs: 4,
    totalPrice: 246, // 99 + 147 = 246
    perItemPrice: 49, // 147 ÷ 3 = 49
    hasDownsell: true,
    downsell: {
      addPairs: 1,
      addPrice: 57,
      totalPairs: 2,
      totalPrice: 156, // 99 + 57 = 156
    },
  },
  {
    id: 2,
    fromQuantity: 2,
    title: "קנה 2 זוגות (₪169)",
    addPairs: 2,
    addPrice: 117,
    totalPairs: 4,
    totalPrice: 286, // 169 + 117 = 286
    perItemPrice: 58.5, // 117 ÷ 2 = 58.5
    hasDownsell: true,
    downsell: {
      addPairs: 1,
      addPrice: 57,
      totalPairs: 3,
      totalPrice: 226, // 169 + 57 = 226
    },
  },
  {
    id: 3,
    fromQuantity: 3,
    title: "קנה 3 זוגות (₪249)", // Price corrected to match HTML (249 instead of 297)
    addPairs: 1,
    addPrice: 47,
    totalPairs: 4,
    totalPrice: 296, // 249 + 47 = 296
    perItemPrice: 47,
    hasDownsell: false,
  },
  {
    id: 4,
    fromQuantity: 4,
    title: "קנה 4 זוגות",
    addPairs: 0,
    addPrice: 0,
    totalPairs: 4,
    totalPrice: 0,
    perItemPrice: 0,
    hasDownsell: false,
  },
];
