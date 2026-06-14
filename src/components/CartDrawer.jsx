import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Clock, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { formatPrice } from "../lib/api";

export default function CartDrawer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { open, setOpen, items, addToCart, removeFromCart, subtotal, clear } = useCart();
  if (!open) return null;
  
  const deliveryFee = subtotal >= 99 ? 0 : 25;
  const handlingCharge = 2;
  const total = subtotal + deliveryFee + handlingCharge;
  
  // Calculate savings (MRP - Price)
  const totalSavings = items.reduce((s, i) => s + ((i.product?.mrp || i.product?.price) - (i.product?.price || 0)) * i.quantity, 0);
  
  // Count total items for shipment
  const totalItemsCount = items.reduce((s, i) => s + i.quantity, 0);

  const goToCheckout = () => {
    setOpen(false);
    if (!user) { navigate("/login"); return; }
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-200 animate-slide-in">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="font-bold text-lg">My Cart</div>
          <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500">
            <ShoppingBag className="w-14 h-14 text-gray-300 mb-3" />
            <div className="font-bold text-gray-800">Your cart is empty</div>
            <div className="text-sm">Add items to get started</div>
          </div>
        ) : (
          <>
            {/* Delivery Info */}
            <div className="bg-blue-50 mx-4 mt-3 rounded-xl p-3 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-bold text-sm">Delivery in 18 minutes</div>
                <div className="text-xs text-gray-600">Shipment of {totalItemsCount} items</div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {items.map((i) => (
                <div key={i.product_id} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                  <img src={i.product?.image} alt={i.product?.name} className="w-14 h-14 object-contain bg-white rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm line-clamp-2">{i.product?.name}</div>
                    <div className="text-xs text-gray-500">{i.product?.unit}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-sm">{formatPrice((i.product?.price || 0) * i.quantity)}</span>
                      {i.product?.mrp > i.product?.price && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(i.product?.mrp * i.quantity)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0C831F] text-white font-bold rounded-md px-2 py-1.5">
                    <button onClick={() => addToCart(i.product_id, -1)}><Minus className="w-3.5 h-3.5" /></button>
                    <span className="text-sm min-w-[18px] text-center">{i.quantity}</span>
                    <button onClick={() => addToCart(i.product_id, 1)}><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              
              <button onClick={clear} className="text-xs text-red-500 flex items-center gap-1 mt-2 mx-auto">
                <Trash2 className="w-3.5 h-3.5" /> Clear all
              </button>
            </div>

            {/* Bill Details */}
            <div className="bg-white border-t border-gray-100 p-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Bill details</div>
              <div className="flex justify-between text-sm">
                <span>Items total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery charge</span>
                <span className={deliveryFee ? "text-red-500" : "text-[#0C831F] font-bold"}>
                  {deliveryFee ? formatPrice(deliveryFee) : "FREE"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Handling charge</span>
                <span>{formatPrice(handlingCharge)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-gray-100">
                <span>Grand total</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              {/* Savings Badge */}
              {totalSavings > 0 && (
                <div className="flex justify-between text-xs text-green-600 font-bold pt-1">
                  <span>Your total savings</span>
                  <span>₹{totalSavings}</span>
                </div>
              )}

              {/* Cancellation Policy */}
              <div className="text-[10px] text-gray-400 text-center pt-2 border-t">
                Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
              </div>

              <button
                onClick={goToCheckout}
                className="w-full bg-[#0C831F] hover:bg-[#0A6E1A] text-white font-bold rounded-xl py-3 mt-2 transition-colors"
              >
                {user ? `₹${total.toFixed(0)} TOTAL` : "Login to Proceed →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}