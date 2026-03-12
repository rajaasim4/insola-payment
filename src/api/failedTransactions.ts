function getApiBaseUrl() {
  return (import.meta as any).env?.VITE_API_BASE_URL ?? "";
}

export interface FailedTransactionPayload {
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
  totalAmount?: number;
  shippingCost?: number;
  errorMessage?: string;
}

export async function saveFailedTransaction(payload: FailedTransactionPayload): Promise<void> {
  const baseUrl = getApiBaseUrl();
  try {
    await fetch(`${baseUrl}/api/failed-transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort, don't block UX
  }
}

export async function getFailedTransactions(params: {
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

  const res = await fetch(`${baseUrl}/api/failed-transactions?${qs}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch failed transactions");
  return res.json() as Promise<{
    success: boolean;
    records: FailedTransactionPayload & { _id: string; createdAt: string }[];
    total: number;
  }>;
}
