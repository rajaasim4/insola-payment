async function fetchPublicKey(): Promise<CryptoKey> {
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL ?? "";
  const pem = await fetch(`${baseUrl}/api/transactions/credit-card/public-key`).then((r) => r.text());

  const pemBody = pem.replace(/-----[^-]+-----/g, "").replace(/\s/g, "");
  const der = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "spki",
    der.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );
}

export async function encryptCard(data: {
  card_number: string;
  cvv: string;
  expire_month: number;
  expire_year: number;
}): Promise<string> {
  const key = await fetchPublicKey();
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, key, encoded);
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}
