import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { data } = await api.get(`/products?search=${encodeURIComponent(query)}&limit=200`);
        setProducts(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-black mb-4">
        Results for "<span className="text-[#0C831F]">{query}</span>"
      </h1>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Searching...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map((p) => <ProductCard key={p.product_id} product={p} />)}
        </div>
      )}
    </div>
  );
}