import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Minus, Heart, Clock, Truck, ShieldCheck } from "lucide-react";
import api, { formatPrice } from "../lib/api";
import { useCart } from "../contexts/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const { qtyOf, addToCart, toggleWishlist, wishlistIds } = useCart();

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      const relatedRes = await api.get(`/products?category_id=${data.category_id}&limit=6`);
      setRelated((relatedRes.data || []).filter((x) => x.product_id !== id));
    })();
  }, [id]);

  if (!product) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  const qty = qtyOf(product.product_id);
  const off = product.mrp > product.price ? Math.round((1 - product.price / product.mrp) * 100) : 0;
  const fav = wishlistIds.has(product.product_id);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid md:grid-cols-2 gap-6 bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
        <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
          <img src={product.image} alt={product.name} className="max-h-96 object-contain" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-black">{product.name}</h1>
          <div className="text-sm text-gray-500 mt-1">{product.unit}</div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-2xl font-black">{formatPrice(product.price)}</span>
            {off > 0 && <span className="text-gray-400 line-through">{formatPrice(product.mrp)}</span>}
            {off > 0 && <span className="bg-[#266FE8] text-white text-xs px-2 py-0.5 rounded font-bold">{off}% OFF</span>}
          </div>
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-3 gap-2 mt-5 text-xs">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Clock className="w-5 h-5 mx-auto text-[#0C831F]" />
              <div className="font-bold mt-1">10 min</div>
              <div className="text-gray-500">delivery</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Truck className="w-5 h-5 mx-auto text-[#0C831F]" />
              <div className="font-bold mt-1">Free</div>
              <div className="text-gray-500">over ₹99</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <ShieldCheck className="w-5 h-5 mx-auto text-[#0C831F]" />
              <div className="font-bold mt-1">Quality</div>
              <div className="text-gray-500">assured</div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            {qty > 0 ? (
              <div className="flex items-center gap-3 bg-[#0C831F] text-white font-bold rounded-md px-3 py-2.5">
                <button onClick={() => addToCart(product.product_id, -1)}><Minus className="w-4 h-4" /></button>
                <span className="min-w-[24px] text-center">{qty}</span>
                <button onClick={() => addToCart(product.product_id, 1)}><Plus className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={() => addToCart(product.product_id, 1)} className="bg-[#0C831F] hover:bg-[#0A6E1A] text-white font-bold rounded-md px-6 py-2.5 uppercase text-sm">Add to Cart</button>
            )}
            <button onClick={() => toggleWishlist(product.product_id)} className="border rounded-md p-2.5 hover:bg-gray-50">
              <Heart className={`w-5 h-5 ${fav ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-black mb-3">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {related.slice(0, 5).map((rp) => (
              <a key={rp.product_id} href={`/product/${rp.product_id}`} className="bg-white rounded-xl p-3 hover:shadow-md transition border border-gray-100">
                <img src={rp.image} alt={rp.name} className="w-full aspect-square object-contain bg-gray-50 rounded-lg" />
                <div className="text-sm font-semibold mt-2 line-clamp-2">{rp.name}</div>
                <div className="text-sm font-bold mt-1">{formatPrice(rp.price)}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}