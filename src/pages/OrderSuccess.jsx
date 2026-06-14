import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import api from "../lib/api";
import { useCart } from "../contexts/CartContext";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("checking");
  const attempts = useRef(0);
  const { refresh } = useCart();

  useEffect(() => {
    if (!sessionId) {
      setStatus("done");
      return;
    }
    const poll = async () => {
      if (attempts.current >= 8) {
        setStatus("timeout");
        return;
      }
      attempts.current += 1;
      try {
        const { data } = await api.get(`/payments/status/${sessionId}`);
        if (data.payment_status === "paid") {
          setStatus("paid");
          refresh();
          return;
        }
        if (data.status === "expired") {
          setStatus("expired");
          return;
        }
      } catch {}
      setTimeout(poll, 2000);
    };
    poll();
  }, [sessionId, refresh]);

  return (
    <div className="max-w-lg mx-auto py-20 text-center px-4">
      {status === "checking" && (
        <>
          <Loader2 className="w-14 h-14 animate-spin mx-auto text-[#0C831F]" />
          <div className="font-bold mt-3">Confirming your payment...</div>
        </>
      )}
      {(status === "paid" || status === "done") && (
        <>
          <CheckCircle2 className="w-20 h-20 mx-auto text-[#0C831F]" />
          <h1 className="text-2xl font-black mt-3">Order placed successfully! 🎉</h1>
          <p className="text-gray-500 mt-2">Your groceries will arrive in 10 minutes</p>
          <button onClick={() => navigate("/orders")} className="bg-[#F8CB46] text-black font-bold px-6 py-3 rounded-xl mt-5">View Orders</button>
        </>
      )}
      {(status === "expired" || status === "timeout") && (
        <>
          <div className="text-xl font-bold text-red-500">Payment incomplete</div>
          <button onClick={() => navigate("/checkout")} className="bg-[#F8CB46] text-black font-bold px-6 py-3 rounded-xl mt-5">Try again</button>
        </>
      )}
    </div>
  );
}