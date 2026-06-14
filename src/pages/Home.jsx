import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Clock, Truck, ShieldCheck, Sparkles, ShoppingBag, Star } from "lucide-react";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, p] = await Promise.all([api.get("/categories"), api.get("/products?limit=20")]);
        setCategories(c.data || []);
        setProducts(p.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4">
      
      {/* Premium Hero Banner Section - BADI PNG IMAGES */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#F8CB46] via-[#FFD970] to-[#FCE38A] shadow-lg">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1 bg-black/10 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
              <Sparkles className="w-4 h-4 text-black" />
              <span className="text-xs font-bold text-black uppercase tracking-wider">Today's Special</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-3">
              Fresh Groceries
              <span className="block text-[#0C831F]">Delivered in 21 Minutes</span>
            </h1>
            <p className="text-gray-700 text-sm sm:text-base mb-4 max-w-md mx-auto md:mx-0">
              Get farm-fresh vegetables, fruits, dairy, snacks & more at unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link to="/category/fruits" className="bg-black hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md">
                <ShoppingBag className="w-4 h-4" /> Shop Now
              </Link>
              <Link to="/category/vegetables" className="bg-white hover:bg-gray-100 text-gray-800 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md border border-gray-200">
                <Zap className="w-4 h-4 text-[#0C831F]" /> Order Now
              </Link>
            </div>
          </div>

          {/* Right - BADI PNG GROCERY IMAGES (No circle) */}
          <div className="flex-1 flex justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/415/415682.png" 
                alt="Vegetables" 
                className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl"
              />
              <span className="text-xs font-semibold text-gray-700">Fresh Veggies</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/415/415687.png" 
                alt="Fruits" 
                className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl"
              />
              <span className="text-xs font-semibold text-gray-700">Fresh Fruits</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/415/415692.png" 
                alt="Dairy" 
                className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl"
              />
              <span className="text-xs font-semibold text-gray-700">Dairy</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/883/883642.png" 
                alt="Snacks" 
                className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl"
              />
              <span className="text-xs font-semibold text-gray-700">Snacks</span>
            </div>
          </div>
        </div>

        {/* Floating Offer Badges */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 shadow-md">
          <span className="text-xs font-bold text-[#0C831F]">⚡ 21 MIN DELIVERY</span>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 shadow-md">
          <span className="text-xs font-bold text-black">🔥 UP TO 50% OFF</span>
        </div>
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {[
          { icon: Clock, label: "21-min delivery", color: "text-blue-500" },
          { icon: Truck, label: "Free over ₹99", color: "text-green-600" },
          { icon: ShieldCheck, label: "100% quality", color: "text-purple-500" },
          { icon: Sparkles, label: "Daily offers", color: "text-orange-500" },
        ].map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="bg-white rounded-xl p-3 flex items-center gap-2 border border-gray-100 shadow-sm">
              <Icon className={`w-5 h-5 ${f.color}`} />
              <div className="text-xs sm:text-sm font-semibold text-gray-700">{f.label}</div>
            </div>
          );
        })}
      </div>

      {/* Categories grid - BADE ICONS (w-24 h-24) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-black text-gray-800">Shop by Category</h2>
          <Link to="/categories" className="text-xs text-[#0C831F] font-semibold hover:underline">View All →</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {categories.slice(0, 14).map((c) => (
            <Link key={c.category_id} to={`/category/${c.slug}`} className="bg-gradient-to-b from-blue-50/80 to-white hover:from-blue-100 hover:to-blue-50 rounded-xl p-3 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-md border border-gray-100">
              <img src={c.image} alt={c.name} className="w-28 h-28 object-cover rounded-xl shadow-md" />
              <div className="text-sm font-semibold mt-2 line-clamp-2 text-center text-gray-700">{c.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bestsellers Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-black text-gray-800">⭐ Bestsellers</h2>
          <Link to="/products" className="text-xs text-[#0C831F] font-semibold hover:underline">View All →</Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-8 text-sm">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-3">
            {products.map((p) => <ProductCard key={p.product_id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}