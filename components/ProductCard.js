import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p className="muted">{product.category}</p>
      <p className="price">${Number(product.price).toFixed(2)}</p>
      <Link href={`/products/${product.id}`}>View details</Link>
    </div>
  );
}
