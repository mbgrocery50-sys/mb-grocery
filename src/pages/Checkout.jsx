import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, CreditCard, Wallet } from "lucide-react";
import api, { formatPrice, formatApiError } from "../lib/api";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, refresh } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [payment, setPayment] = useState("cod");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "Home", full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [busy, setBusy] = useState(false);

  const fee = subtotal === 0 || subtotal >= 99 ? 0 : 25;
  const total = subtotal + fee;

  const loadAddresses = async () => {
    const { data } = await api.get("/addresses");
    setAddresses(data);
    if (data.length && !addressId) setAddressId(data[0].address_id);
  };

  useEffect(() => { loadAddresses(); }, []);

  const saveAddress = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/addresses", form);
    setAddresses([...addresses, data]);
    setAddressId(data.address_id);
    setShowForm(false);
    setForm({ label: "Home", full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  };

  const placeOrder = async () => {
    if (!addressId) return toast.error("Please add a delivery address");
    setBusy(true);
    try {
      const { data } = await api.post("/checkout", {
        address_id: addressId,
        payment_method: payment,
        origin_url: window.location.origin,
      });
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        await refresh();
        toast.success("Order placed!");
        navigate(`/orders/${data.order.order_id}`);
      }
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) return (
    <div className="py-20 text-center text-gray-500">
      Your cart is empty. <a href="/" className="text-[#0C831F] font-bold">Shop now</a>
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {/* Address Section */}
        <section className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0C831F]" /> Delivery Address
            </div>
            <button onClick={() => setShowForm(true)} className="text-sm text-[#0C831F] font-bold flex items-center gap-1">
              <Plus className="w-4 h-4" />Add new
            </button>
          </div>
          <div className="space-y-2">
            {addresses.length === 0 && !showForm && (
              <div className="text-sm text-gray-500">No saved addresses. Add one to continue.</div>
            )}
            {addresses.map((a) => (
              <label key={a.address_id} className={`block border rounded-xl p-3 cursor-pointer ${addressId === a.address_id ? "border-[#0C831F] bg-green-50" : "border-gray-200"}`}>
                <input type="radio" checked={addressId === a.address_id} onChange={() => setAddressId(a.address_id)} className="mr-2" />
                <span className="font-bold">{a.label}</span> · <span>{a.full_name}</span>
                <div className="text-xs text-gray-600 mt-1">{a.line1}, {a.city}, {a.state} {a.pincode} · 📞 {a.phone}</div>
              </label>
            ))}
            {showForm && (
              <form onSubmit={saveAddress} className="grid grid-cols-2 gap-2 mt-3">
                <input required value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} placeholder="Full name" className="border rounded-lg p-2 text-sm" />
                <input required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="Phone" className="border rounded-lg p-2 text-sm" />
                <input required value={form.line1} onChange={(e) => setForm({...form, line1: e.target.value})} placeholder="Address line 1" className="border rounded-lg p-2 text-sm" />
                <input value={form.line2} onChange={(e) => setForm({...form, line2: e.target.value})} placeholder="Address line 2 (optional)" className="border rounded-lg p-2 text-sm" />
                <input required value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} placeholder="City" className="border rounded-lg p-2 text-sm" />
                <input required value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} placeholder="State" className="border rounded-lg p-2 text-sm" />
                <input required value={form.pincode} onChange={(e) => setForm({...form, pincode: e.target.value})} placeholder="Pincode" className="border rounded-lg p-2 text-sm" />
                <button type="submit" className="col-span-2 bg-[#F8CB46] font-bold py-2 rounded-lg">Save Address</button>
              </form>
            )}
          </div>
        </section>

        {/* Payment Section */}
        <section className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="font-bold mb-3">Payment Method</div>
          <div className="space-y-2">
            <label className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer ${payment === "cod" ? "border-[#0C831F] bg-green-50" : "border-gray-200"}`}>
              <input type="radio" checked={payment === "cod"} onChange={() => setPayment("cod")} />
              <Wallet className="w-5 h-5 text-[#0C831F]" />
              <div>
                <div className="font-bold">Cash on Delivery</div>
                <div className="text-xs text-gray-500">Pay when you receive</div>
              </div>
            </label>
            <label className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer ${payment === "stripe" ? "border-[#0C831F] bg-green-50" : "border-gray-200"}`}>
              <input type="radio" checked={payment === "stripe"} onChange={() => setPayment("stripe")} />
              <CreditCard className="w-5 h-5 text-[#0C831F]" />
              <div>
                <div className="font-bold">Pay Online (Stripe)</div>
                <div className="text-xs text-gray-500">Card · UPI · Wallets</div>
              </div>
            </label>
          </div>
        </section>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 h-fit sticky top-20">
        <div className="font-bold mb-3">Order Summary</div>
        <div className="text-sm space-y-1 max-h-40 overflow-y-auto pr-1">
          {items.map((i) => (
            <div key={i.product_id} className="flex justify-between">
              <span className="line-clamp-1">{i.product?.name} × {i.quantity}</span>
              <span>{formatPrice((i.product?.price || 0) * i.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-3 pt-2 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span className={fee ? "" : "text-[#0C831F] font-bold"}>{fee ? formatPrice(fee) : "FREE"}</span></div>
          <div className="flex justify-between font-bold pt-1 border-t"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
        <button onClick={placeOrder} disabled={busy} className="w-full bg-[#0C831F] hover:bg-[#0A6E1A] text-white font-bold py-3 rounded-xl mt-4 disabled:opacity-60">
          {busy ? "Placing..." : `Place Order · ${formatPrice(total)}`}
        </button>
      </div>
    </div>
  );
}