// Server-side code (getServerSideProps) runs INSIDE the frontend container,
// so it must use Docker Compose's internal service name. Client-side code
// (the browser, e.g. the checkout button) runs OUTSIDE Docker entirely, so
// it must use localhost + the port mapped to the host machine.
const isServer = typeof window === "undefined";

const CATALOG_API = isServer
  ? process.env.CATALOG_API_INTERNAL || "http://localhost:8080"
  : process.env.NEXT_PUBLIC_CATALOG_API || "http://localhost:8080";

const ORDER_API = isServer
  ? process.env.ORDER_API_INTERNAL || "http://localhost:8082"
  : process.env.NEXT_PUBLIC_ORDER_API || "http://localhost:8082";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `Request failed with ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json();
}

export const catalogApi = {
  listProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${CATALOG_API}/products${qs ? `?${qs}` : ""}`).then(handle);
  },
  getProduct: (id) => fetch(`${CATALOG_API}/products/${id}`).then(handle),
};

export const orderApi = {
  checkout: (userId, items) =>
    fetch(`${ORDER_API}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, items }),
    }).then(handle),
  getOrders: (userId) => fetch(`${ORDER_API}/orders/${userId}`).then(handle),
};
