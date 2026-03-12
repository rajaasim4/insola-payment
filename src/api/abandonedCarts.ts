function getApiBaseUrl() {
  return (import.meta as any).env?.VITE_API_BASE_URL ?? "";
}

export interface AbandonedCartPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
  streetAddress?: string;
  postalCode?: string;
  country?: string;
  quantity?: number;
  size?: string;
  price?: number;
  shippingCost?: number;
  selectedProductId?: number;
}

export async function saveAbandonedCart(payload: AbandonedCartPayload): Promise<void> {
  const baseUrl = getApiBaseUrl();
  try {
    await fetch(`${baseUrl}/api/abandoned-carts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort
  }
}

export async function markCartConverted(email: string): Promise<void> {
  const baseUrl = getApiBaseUrl();
  try {
    await fetch(`${baseUrl}/api/abandoned-carts/convert`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  } catch {
    // best-effort
  }
}

export async function getAbandonedCarts(params: {
  search?: string;
  dateRange?: string;
  limit?: number;
  skip?: number;
}) {
  const baseUrl = getApiBaseUrl();
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.dateRange) qs.set("dateRange", params.dateRange);
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.skip !== undefined) qs.set("skip", String(params.skip));

  const res = await fetch(`${baseUrl}/api/abandoned-carts?${qs}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch abandoned carts");
  return res.json() as Promise<{
    success: boolean;
    records: (AbandonedCartPayload & { _id: string; createdAt: string; updatedAt: string; isConverted: boolean })[];
    total: number;
  }>;
}
