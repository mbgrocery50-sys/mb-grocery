import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, MapPin, User, ChevronDown, LogOut, Package, Heart, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../lib/api";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { count, subtotal, setOpen } = useCart();
  const [q, setQ] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center gap-3 sm:gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#F8CB46] flex items-center justify-center font-black text-black text-lg">B</div>
          <div className="hidden sm:block">
            <div className="font-black text-lg leading-none text-gray-900">mb grocery</div>
            <div className="text-[10px] font-bold tracking-wider text-gray-500">in 21 minutes</div>
          </div>
        </Link>

        {/* Location Selector */}
        <button className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-800 shrink-0 hover:text-black">
          <MapPin className="w-4 h-4 text-[#F8CB46]" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500">DELIVERY IN 21 MINUTES</div>
            <div className="flex items-center gap-1 text-sm font-bold">
              Satellite Junction, Indus Satellite... <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </button>

        {/* Search Bar */}
        <form onSubmit={onSearch} className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-2 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#F8CB46] focus-within:shadow-sm transition-all">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Search "bread", "milk", "eggs"...'
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
          />
        </form>

        {/* User Menu & Cart */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="relative">
              <button onClick={() => navigate("/profile")} className="flex items-center gap-2 text-sm font-semibold hover:bg-gray-50 px-3 py-2 rounded-lg">
                <User className="w-5 h-5" />
                <span className="hidden md:inline">{user.name?.split(" ")[0] || "Account"}</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold px-3 py-2 hover:bg-gray-50 rounded-lg">Login</Link>
          )}

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-[#0C831F] hover:bg-[#0A6E1A] text-white font-bold rounded-xl px-3 sm:px-4 py-2.5 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-5 h-5" />
            {count > 0 ? (
              <span className="text-sm">
                <span className="block text-[10px] opacity-80 text-left leading-none">{count} items</span>
                <span className="block text-left leading-none">{formatPrice(subtotal)}</span>
              </span>
            ) : (
              <span className="text-sm hidden sm:inline">My Cart</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}