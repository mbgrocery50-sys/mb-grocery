import React from "react";
import { Heart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useCart();

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-black mb-4 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-500" /> My Wishlist
      </h1>
      {wishlist.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No items in wishlist yet.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {wishlist.map((p) => <ProductCard key={p.product_id} product={p} />)}
        </div>
      )}
    </div>
  );
}