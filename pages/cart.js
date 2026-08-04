import { useRouter } from "next/router";
import Nav from "../components/Nav";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeItem, total } = useCart();
  const router = useRouter();

  return (
    <div className="container">
      <Nav />
      <h1>Your cart</h1>
      {items.length === 0 && <p>Your cart is empty.</p>}
      {items.map((item) => (
        <div key={item.productId} className="cart-row">
          <span>{item.name}</span>
          <span>Qty: {item.quantity}</span>
          <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
          <button className="link-btn" onClick={() => removeItem(item.productId)}>
            Remove
          </button>
        </div>
      ))}
      {items.length > 0 && (
        <>
          <p className="total">Total: ${total.toFixed(2)}</p>
          <button className="btn" onClick={() => router.push("/checkout")}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
