import React from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Heart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../lib/api";

export default function ProductCard({ product }) {
  const { qtyOf, addToCart, toggleWishlist, wishlistIds } = useCart();
  const qty = qtyOf(product.product_id);
  const fav = wishlistIds.has(product.product_id);
  const off = product.mrp > product.price ? Math.round((1 - product.price / product.mrp) * 100) : 0;
  const variantsCount = product.variants?.length || Math.floor(Math.random() * 3) + 1;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full relative">
      
      {/* Wishlist Button */}
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(product.product_id); }}
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center"
      >
        <Heart className={`w-4 h-4 ${fav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
      </button>

      {/* Product Image */}
      <Link to={`/product/${product.product_id}`} className="block p-3">
        <div className="bg-gray-50 flex items-center justify-center rounded-lg">
          <img src={product.image} alt={product.name} className="w-full h-32 object-contain" loading="lazy" />
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-3 pt-0 flex-1 flex flex-col gap-1">
        
        {/* 21 MINS Badge */}
        <div>
          <span className="bg-blue-500 text-white text-[10px] font-bold rounded px-2 py-0.5 inline-block">
            21 MINS
          </span>
        </div>

        {/* Product Name */}
        <Link to={`/product/${product.product_id}`} className="hover:text-[#0C831F]">
          <div className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.name}
          </div>
        </Link>
        
        {/* Weight/Unit */}
        <div className="text-[11px] text-gray-500">{product.unit}</div>

        {/* Price and ADD Button - Blinkit style */}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-gray-900 text-base">{formatPrice(product.price)}</div>
              {off > 0 && (
                <div className="text-[10px] text-gray-400 line-through">{formatPrice(product.mrp)}</div>
              )}
            </div>
            
            {qty > 0 ? (
              <div className="flex items-center gap-2 bg-[#0C831F] text-white font-bold rounded-md px-2 py-1.5 shadow-sm">
                <button onClick={() => addToCart(product.product_id, -1)} className="w-6 h-6 flex items-center justify-center">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="min-w-[20px] text-center text-sm">{qty}</span>
                <button onClick={() => addToCart(product.product_id, 1)} className="w-6 h-6 flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product.product_id, 1)}
                className="border border-[#0C831F] text-[#0C831F] bg-white font-bold rounded-md px-4 py-1.5 hover:bg-[#0C831F] hover:text-white transition-all uppercase text-xs shadow-sm min-w-[56px]"
              >
                ADD
              </button>
            )}
          </div>

          {/* X Options Badge - below price on right side */}
          {variantsCount > 1 && (
            <div className="text-right mt-1">
              <span className="text-[10px] text-gray-400 font-medium">
                {variantsCount} options
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}