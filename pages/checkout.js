import { useState } from "react";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import { useCart, DEMO_USER_ID } from "../context/CartContext";
import { orderApi } from "../lib/api";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handlePlaceOrder() {
    setStatus("placing");
    setMessage("");
    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      }));
      const order = await orderApi.checkout(DEMO_USER_ID, orderItems);
      clearCart();
      setStatus("success");
      setMessage(`Order #${order.id} confirmed.`);
    } catch (err) {
      setStatus("error");
      if (err.status === 409) {
        setMessage("Sorry, one or more items just went out of stock.");
      } else if (err.status === 502) {
        setMessage(
          "Inventory service is unavailable right now. Please try again shortly.",
        );
      } else {
        setMessage(err.message || "Something went wrong placing your order.");
      }
    }
  }

  if (items.length === 0 && status !== "success") {
    return (
      <div className="container">
        <Nav />
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Nav />
      <h1>Checkout</h1>

      {status !== "success" && (
        <>
          {items.map((item) => (
            <div key={item.productId} className="cart-row">
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
            </div>
          ))}
          <p className="total">Total: ${total.toFixed(2)}</p>
          <button
            className="btn"
            onClick={handlePlaceOrder}
            disabled={status === "placing"}
          >
            {status === "placing" ? "Placing order..." : "Place order"}
          </button>
        </>
      )}

      {status === "success" && (
        <>
          <p className="success">{message}</p>
          <button className="btn" onClick={() => router.push("/")}>
            Continue shopping
          </button>
        </>
      )}

      {status === "error" && <p className="error">{message}</p>}
    </div>
  );
}
