import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Nav() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="nav">
      <Link href="/" className="brand">
        Shop
      </Link>
      <Link href="/cart">Cart ({count})</Link>
    </nav>
  );
}
