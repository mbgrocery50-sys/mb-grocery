import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { formatApiError } from "../lib/api";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("test@blinkit.com");
  const [password, setPassword] = useState("test123");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}!`);
      navigate(u.role === "admin" ? "/admin" : "/");
    } catch (e) {
      setErr(formatApiError(e));
    } finally {
      setBusy(false);
    }
  };

  const googleLogin = () => {
    const redirectUrl = window.location.origin + "/";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <h1 className="text-2xl font-black">Welcome back 👋</h1>
        <p className="text-sm text-gray-500 mb-6">Login to start shopping in 10 minutes</p>
        <form onSubmit={submit} className="space-y-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white outline-none focus:ring-2 focus:ring-[#F8CB46]" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white outline-none focus:ring-2 focus:ring-[#F8CB46]" />
          {err && <div className="text-sm text-red-500">{err}</div>}
          <button disabled={busy} className="w-full bg-[#F8CB46] text-black font-bold rounded-xl py-3 hover:bg-[#E5B833]">{busy ? "Logging in..." : "Login"}</button>
        </form>
        <div className="my-4 text-center text-xs text-gray-400">OR</div>
        <button onClick={googleLogin} className="w-full bg-white border border-gray-200 rounded-xl py-3 font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
          </svg>
          Continue with Google
        </button>
        <div className="text-center text-sm mt-6 text-gray-600">
          New here? <Link to="/register" className="font-bold text-[#0C831F]">Create account</Link>
        </div>
      </div>
    </div>
  );
}