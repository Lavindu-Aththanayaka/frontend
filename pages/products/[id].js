import { useState } from "react";
import { useRouter } from "next/router";
import Nav from "../../components/Nav";
import { catalogApi } from "../../lib/api";
import { useCart } from "../../context/CartContext";

export default function ProductDetail({ product, error }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (error) {
    return (
      <div className="container">
        <Nav />
        <p className="error">Could not load product: {error}</p>
      </div>
    );
  }

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
  }

  return (
    <div className="container">
      <Nav />
      <button className="link-btn" onClick={() => router.push("/")}>
        &larr; Back to products
      </button>
      <h1>{product.name}</h1>
      <p className="muted">{product.category}</p>
      <p className="price">${Number(product.price).toFixed(2)}</p>
      <p>{product.description}</p>
      <button className="btn" onClick={handleAdd}>
        Add to cart
      </button>
      {added && <p className="success">Added to cart.</p>}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const product = await catalogApi.getProduct(params.id);
    return { props: { product } };
  } catch (err) {
    return { props: { product: null, error: err.message } };
  }
}
