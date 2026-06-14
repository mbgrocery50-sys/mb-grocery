import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { formatApiError } from "../lib/api";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const u = await register(form.name, form.email, form.password);
      toast.success(`Welcome, ${u.name}!`);
      navigate("/");
    } catch (e) {
      setErr(formatApiError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <h1 className="text-2xl font-black">Create account</h1>
        <p className="text-sm text-gray-500 mb-6">Get groceries delivered in 10 minutes</p>
        <form onSubmit={submit} className="space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white outline-none focus:ring-2 focus:ring-[#F8CB46]" />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white outline-none focus:ring-2 focus:ring-[#F8CB46]" />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password (min 6 chars)" minLength={6} required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white outline-none focus:ring-2 focus:ring-[#F8CB46]" />
          {err && <div className="text-sm text-red-500">{err}</div>}
          <button disabled={busy} className="w-full bg-[#F8CB46] text-black font-bold rounded-xl py-3 hover:bg-[#E5B833]">{busy ? "Creating..." : "Sign Up"}</button>
        </form>
        <div className="text-center text-sm mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="font-bold text-[#0C831F]">Login</Link>
        </div>
      </div>
    </div>
  );
}