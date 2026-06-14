import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { slug: "paan-corner", name: "Paan Corner", image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5" },
  { slug: "dairy", name: "Dairy, Bread & Eggs", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150" },
  { slug: "fruits", name: "Fruits & Vegetables", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf" },
  { slug: "beverages", name: "Cold Drinks & Juices", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97" },
  { slug: "snacks", name: "Snacks & Munchies", image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd08c" },
  { slug: "instant-food", name: "Breakfast & Instant Food", image: "https://images.unsplash.com/photo-1612152605287-5be0bf5da12d" },
  { slug: "sweets", name: "Sweet Tooth", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307" },
  { slug: "bakery", name: "Bakery & Biscuits", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff" },
  { slug: "tea-coffee", name: "Tea, Coffee & Milk Drinks", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" },
  { slug: "staples", name: "Atta, Rice & Dal", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c" },
  { slug: "masala-oil", name: "Masala, Oil & More", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d" },
  { slug: "sauces", name: "Sauces & Spreads", image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc" },
  { slug: "meat", name: "Chicken, Meat & Fish", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f" },
  { slug: "baby-care", name: "Baby Care", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4" },
  { slug: "pharma", name: "Pharma & Wellness", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88" },
  { slug: "cleaning", name: "Cleaning Essentials", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f" },
  { slug: "home-office", name: "Home & Office", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38" },
  { slug: "personal-care", name: "Personal Care", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b" },
  { slug: "pet-care", name: "Pet Care", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee" },
];

export default function CategorySidebar({ currentSlug }) {
  return (
    <aside className="w-24 flex-shrink-0 hidden md:block sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto custom-scrollbar bg-white border-r border-gray-100">
      <div className="py-2">
        {categories.map((c) => {
          const active = currentSlug === c.slug;
          return (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className={`flex flex-col items-center gap-1 px-2 py-3 text-center transition-all ${
                active 
                  ? "bg-green-50 text-[#0C831F] font-bold border-r-2 border-[#0C831F]" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <img 
                src={c.image} 
                alt={c.name} 
                className="w-14 h-14 rounded-full object-cover shadow-sm"
              />
              <span className="text-[11px] leading-tight line-clamp-2 max-w-[70px] text-center mt-1">{c.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}