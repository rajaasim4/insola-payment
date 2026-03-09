function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
}

export interface CreateOrderPayload {

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  
  
  city: string;
  streetAddress: string;
  postalCode: string;
  country?: string;
  

  quantity: number;
  price: number;
  totalAmount: number;
  shippingCost?: number;
  

  transactionId: string;
  paymentStatus: 'success' | 'failed' | 'pending';
  

  orderSource: 'main_checkout' | 'upsell' | 'downsell';
  

  isUpsell?: boolean;
  isDownsell?: boolean;
  originalOrderId?: string;
  
  // Marketing Preferences
  marketingEmails?: boolean;
  marketingSMS?: boolean;
}

export async function createOrder(payload: CreateOrderPayload) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/orders`;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to save order");
  return data;
}

export async function getGroupedOrders(filters?: {
  paymentStatus?: string;
  email?: string;
  search?: string;
  dateRange?: 'all' | '24h' | '7d' | '30d';
  limit?: number;
  skip?: number;
}) {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams();
  
  if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
  if (filters?.email) params.append('email', filters.email);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.dateRange) params.append('dateRange', filters.dateRange);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.skip) params.append('skip', filters.skip.toString());
  
  const url = `${baseUrl}/api/orders/grouped?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch grouped orders");
  return data;
}

export async function getOrders(filters?: {
  paymentStatus?: string;
  orderSource?: string;
  email?: string;
  search?: string;
  limit?: number;
  skip?: number;
}) {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams();
  
  if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
  if (filters?.orderSource) params.append('orderSource', filters.orderSource);
  if (filters?.email) params.append('email', filters.email);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.skip) params.append('skip', filters.skip.toString());
  
  const url = `${baseUrl}/api/orders?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
  return data;
}

export async function getOrderById(orderId: string) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/orders/${orderId}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch order");
  return data;
}

export async function getOrderStats() {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/api/orders/stats`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch stats");
  return data;
}
