import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { formatPrice } from "../lib/api";

export default function CartPage() {
  const { items, addToCart, removeFromCart, clear, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fee = subtotal === 0 || subtotal >= 99 ? 0 : 25;
  const total = subtotal + fee;

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <ShoppingBag className="w-20 h-20 mx-auto text-gray-300" />
      <div className="text-xl font-bold mt-3">Your cart is empty</div>
      <Link to="/" className="inline-block mt-4 bg-[#F8CB46] text-black px-5 py-2.5 rounded-lg font-bold">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white rounded-2xl p-4 border border-gray-100">
        <h1 className="text-xl font-black mb-4">My Cart ({items.length})</h1>
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.product_id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
              <img src={i.product?.image} className="w-16 h-16 object-contain bg-gray-50 rounded-lg" alt={i.product?.name} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold line-clamp-1">{i.product?.name}</div>
                <div className="text-xs text-gray-500">{i.product?.unit}</div>
                <div className="font-bold mt-1">{formatPrice((i.product?.price || 0) * i.quantity)}</div>
              </div>
              <div className="flex items-center gap-2 bg-[#0C831F] text-white font-bold rounded-md px-2 py-1.5">
                <button onClick={() => addToCart(i.product_id, -1)}><Minus className="w-4 h-4" /></button>
                <span className="text-sm min-w-[20px] text-center">{i.quantity}</span>
                <button onClick={() => addToCart(i.product_id, 1)}><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={() => removeFromCart(i.product_id)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <button onClick={clear} className="text-sm text-red-500 mt-3">Clear cart</button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 h-fit">
        <div className="font-bold mb-3">Bill summary</div>
        <div className="flex justify-between text-sm py-1"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="flex justify-between text-sm py-1"><span>Delivery</span><span className={fee ? "" : "text-[#0C831F] font-bold"}>{fee ? formatPrice(fee) : "FREE"}</span></div>
        <div className="flex justify-between font-bold pt-2 border-t mt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
        <button onClick={() => navigate(user ? "/checkout" : "/login")} className="w-full bg-[#0C831F] hover:bg-[#0A6E1A] text-white font-bold py-3 rounded-xl mt-4">Proceed to Checkout</button>
      </div>
    </div>
  );
}