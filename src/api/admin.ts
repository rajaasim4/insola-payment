function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AdminResponse {
  success: boolean;
  admin: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export async function loginAdmin(payload: LoginPayload): Promise<AdminResponse> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/admin/login`;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

export async function verifyAdmin(): Promise<{ success: boolean; admin: { email: string; adminId: string } }> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/admin/verify`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Verification failed");
  return data;
}

export async function logoutAdmin(): Promise<void> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/admin/logout`;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Logout failed");
  }
}
