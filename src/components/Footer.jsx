import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#F8CB46] flex items-center justify-center font-black">B</div>
            <div className="font-black text-lg">blinkit</div>
          </div>
          <p className="text-sm text-gray-500">Groceries delivered in 21 minutes to your doorstep.</p>
        </div>
        <div>
          <div className="font-bold mb-3 text-sm uppercase tracking-wider">Company</div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>About</li><li>Careers</li><li>Press</li><li>Blog</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-3 text-sm uppercase tracking-wider">Help</div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Customer Support</li><li>FAQs</li><li>Privacy</li><li>Terms</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-3 text-sm uppercase tracking-wider">Download App</div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Google Play</li><li>App Store</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">© 2026 Blinkly. All rights reserved.</div>
    </footer>
  );
}