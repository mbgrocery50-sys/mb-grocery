import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";

export default function CategoryPage() {
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const [cats, category] = await Promise.all([
          api.get("/categories"),
          api.get(`/categories/${slug}`)
        ]);
        setCategories(cats.data || []);
        setCurrentCategory(category.data);
        const productsRes = await api.get(`/products?category_id=${category.data.category_id}&limit=200`);
        setProducts(productsRes.data || []);
      } catch (e) {
        setCurrentCategory(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <div className="flex max-w-[1400px] mx-auto">
      <CategorySidebar categories={categories} currentSlug={slug} />
      <div className="flex-1 px-2 sm:px-4 py-3">
        <h1 className="text-base sm:text-lg font-bold mb-3">{currentCategory?.name || "Loading..."}</h1>
        
        {loading ? (
          <div className="text-center text-gray-500 py-8 text-sm">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-sm">No products in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-3">
            {products.map((p) => <ProductCard key={p.product_id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}