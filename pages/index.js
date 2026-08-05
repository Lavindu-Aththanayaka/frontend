import Nav from "../components/Nav";
import ProductCard from "../components/ProductCard";
import { catalogApi } from "../lib/api";

export default function Home({ products, error }) {
  return (
    <div className="container">
      <Nav />
      <h1>Products details</h1>
      {error && <p className="error">Could not load products: {error}</p>}
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const products = await catalogApi.listProducts();
    return { props: { products } };
  } catch (err) {
    return { props: { products: [], error: err.message } };
  }
}
