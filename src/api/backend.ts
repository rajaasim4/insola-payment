type CreateCreditCardTransactionPayload = {
  txn_type?: "debit" | "credit" | "verify" | "force" | "cancel" | "reversal" | "sto";
  expire_month: number;
  expire_year: number;
  cvv?: string | null;
  card_number: string;
  items: Array<{
    name: string;
    type?: string;
    unit_price: number;
    units_number: number;
  }>;
  remarks?: string | null;
  response_language?: "english" | "hebrew";
  client?: {
    name?: string | null;
    email?: string | null;
    phone_country_code?: string | null;
    phone_number?: string | null;
    city?: string | null;
    address_line_1?: string | null;
    zip?: string | null;
    country_code?: string | null;
  };
};

type TranzilaProxyResponse = {
  tranzila: {
    error_code: number;
    message: string;
    transaction_result?: any;
  };
  stored_transaction_id: string;
};

function getApiBaseUrl() {
  return (import.meta as any).env?.VITE_API_BASE_URL ?? "";
}

export async function createCreditCardTransaction(payload: CreateCreditCardTransactionPayload) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/transactions/credit-card`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as TranzilaProxyResponse | { error: string; message: string };

  if (!res.ok) {
    const err = data as { error: string; message: string };
    throw new Error(err.message || "Payment failed");
  }

  return data as TranzilaProxyResponse;
}
