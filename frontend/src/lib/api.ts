const API_BASE = "/api/v1";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("fd_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export const api = {
  // Auth
  register: (data: {
    email: string;
    password: string;
    full_name: string;
    company_name?: string;
    phone?: string;
  }) => request<{ access_token: string }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    request<{ access_token: string }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  me: () => request<{ id: string; email: string; full_name: string; role: string }>("/auth/me"),

  // Cases
  createCase: (data: {
    title: string;
    description: string;
    violation_type: string;
    region?: string;
    priority?: string;
  }) => request<any>("/cases", { method: "POST", body: JSON.stringify(data) }),

  sosReport: (data: {
    title: string;
    description: string;
    violation_type: string;
    region?: string;
  }) => request<any>("/cases/sos", { method: "POST", body: JSON.stringify(data) }),

  listCases: () => request<any[]>("/cases"),

  getCase: (id: string) => request<any>(`/cases/${id}`),

  updateStatus: (id: string, status: string) =>
    request<any>(`/cases/${id}/status?new_status=${status}`, { method: "PATCH" }),

  // Chat
  chat: (message: string, caseContext?: string) =>
    request<{ reply: string }>("/chat", {
      method: "POST",
      body: JSON.stringify({ message, case_context: caseContext }),
    }),
};
