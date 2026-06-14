import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import api, { formatPrice } from "../lib/api";

const STAGES = [
  { key: "placed", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "packed", label: "Packed" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export function OrdersList() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await api.get("/orders");
      setOrders(data);
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No orders yet</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.order_id} to={`/orders/${o.order_id}`} className="block bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold">#{o.order_id.slice(2, 10).toUpperCase()}</div>
                  <div className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatPrice(o.total)}</div>
                  <div className="text-xs bg-green-50 text-[#0C831F] font-bold rounded px-2 py-0.5 inline-block mt-1 uppercase">{o.status.replace("_", " ")}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2">{o.items.length} items · {o.payment_method.toUpperCase()}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    })();
  }, [id]);

  if (!order) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  const reachedIndex = STAGES.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black">Order #{order.order_id.slice(2, 10).toUpperCase()}</h1>
      <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</div>

      <div className="bg-white rounded-2xl p-5 mt-4 border border-gray-100">
        <div className="font-bold mb-4">Order Tracking</div>
        <div className="space-y-3">
          {STAGES.map((s, idx) => {
            const reached = idx <= reachedIndex;
            const t = order.timeline?.find((x) => x.stage === s.key);
            return (
              <div key={s.key} className="flex items-center gap-3">
                {reached ? <CheckCircle2 className="w-6 h-6 text-[#0C831F]" /> : <Circle className="w-6 h-6 text-gray-300" />}
                <div className="flex-1">
                  <div className={`font-semibold ${reached ? "text-gray-900" : "text-gray-400"}`}>{s.label}</div>
                  {t && <div className="text-xs text-gray-500">{new Date(t.at).toLocaleString()}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 mt-4 border border-gray-100">
        <div className="font-bold mb-3">Items</div>
        {order.items.map((i) => (
          <div key={i.product_id} className="flex items-center gap-3 py-2 border-b last:border-0">
            <img src={i.image} alt={i.name} className="w-12 h-12 object-contain bg-gray-50 rounded-lg" />
            <div className="flex-1 text-sm">
              <div className="font-semibold">{i.name}</div>
              <div className="text-xs text-gray-500">{i.unit} × {i.quantity}</div>
            </div>
            <div className="font-bold">{formatPrice(i.price * i.quantity)}</div>
          </div>
        ))}
        <div className="border-t mt-3 pt-2 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>{order.delivery_fee ? formatPrice(order.delivery_fee) : "FREE"}</span></div>
          <div className="flex justify-between font-bold border-t pt-1"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 mt-4 border border-gray-100 text-sm">
        <div className="font-bold mb-1">Delivery to</div>
        <div>{order.address?.full_name} · {order.address?.phone}</div>
        <div className="text-gray-600">{order.address?.line1}, {order.address?.city}, {order.address?.state} {order.address?.pincode}</div>
        <div className="mt-2">
          <span className="font-bold">Payment:</span> {order.payment_method.toUpperCase()} · <span className="text-[#0C831F] font-bold">{order.payment_status}</span>
        </div>
      </div>
    </div>
  );
}