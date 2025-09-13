// frontEnd/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔹 Login
export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }
  return res.json();
}

// 🔹 Get Pets
export async function getPets(token: string) {
  const res = await fetch(`${API_URL}/pets`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch pets");
  }
  return res.json();
}
