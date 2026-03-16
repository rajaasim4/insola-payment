const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

export async function encryptCard(data: {
  card_number: string;
  cvv: string;
  expire_month: number;
  expire_year: number;
}): Promise<string> {
  const pemRes = await fetch(`${baseUrl}/api/transactions/credit-card/public-key`);
  if (!pemRes.ok) throw new Error("Failed to load encryption key");
  const pem = await pemRes.text();

  const pemContents = pem
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const publicKey = await crypto.subtle.importKey(
    "spki",
    binaryDer.buffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );

  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, encoded);
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}
