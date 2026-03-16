function getApiBaseUrl() {
  return (import.meta as any).env?.VITE_API_BASE_URL ?? "";
}

export async function checkHasSavedCard(): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/transactions/credit-card/has-saved-card`;

  try {
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return false;
    const data = await res.json();
    return data.hasSavedCard === true;
  } catch {
    return false;
  }
}

export async function createPayWithSavedTransaction(payload: {
  txn_type: string;
  cvv: string;
  items: Array<{
    name: string;
    type: string;
    unit_price: number;
    units_number: number;
  }>;
  client?: Record<string, string>;
}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/transactions/credit-card/pay-with-saved`;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Payment failed");
  return data;
}
