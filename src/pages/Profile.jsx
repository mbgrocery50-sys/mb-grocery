import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";
import { Trash2, Plus, MapPin } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "Home", full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });

  const loadAddresses = async () => {
    const { data } = await api.get("/addresses");
    setAddresses(data);
  };

  useEffect(() => { loadAddresses(); }, []);

  const saveAddress = async (e) => {
    e.preventDefault();
    await api.post("/addresses", form);
    setShowForm(false);
    setForm({ label: "Home", full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
    loadAddresses();
  };

  const deleteAddress = async (id) => {
    await api.delete(`/addresses/${id}`);
    loadAddresses();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h1 className="text-2xl font-black">My Profile</h1>
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div>
            <div className="text-gray-500">Name</div>
            <div className="font-bold">{user?.name}</div>
          </div>
          <div>
            <div className="text-gray-500">Email</div>
            <div className="font-bold">{user?.email}</div>
          </div>
          <div>
            <div className="text-gray-500">Role</div>
            <div className="font-bold capitalize">{user?.role}</div>
          </div>
        </div>
        <button onClick={logout} className="mt-4 text-sm text-red-500 font-bold">Logout</button>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0C831F]" /> Saved Addresses
          </div>
          <button onClick={() => setShowForm(!showForm)} className="text-sm text-[#0C831F] font-bold flex items-center gap-1">
            <Plus className="w-4 h-4" />Add
          </button>
        </div>
        {addresses.length === 0 && !showForm && <div className="text-sm text-gray-500">No addresses saved yet.</div>}
        <div className="space-y-2">
          {addresses.map((a) => (
            <div key={a.address_id} className="border rounded-xl p-3 flex justify-between items-start">
              <div>
                <div className="font-bold">{a.label} · {a.full_name}</div>
                <div className="text-xs text-gray-600 mt-1">{a.line1}, {a.city}, {a.state} {a.pincode} · 📞 {a.phone}</div>
              </div>
              <button onClick={() => deleteAddress(a.address_id)} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {showForm && (
          <form onSubmit={saveAddress} className="grid grid-cols-2 gap-2 mt-3">
            <input required value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} placeholder="Full name" className="border rounded-lg p-2 text-sm" />
            <input required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="Phone" className="border rounded-lg p-2 text-sm" />
            <input required value={form.line1} onChange={(e) => setForm({...form, line1: e.target.value})} placeholder="Address line 1" className="border rounded-lg p-2 text-sm" />
            <input value={form.line2} onChange={(e) => setForm({...form, line2: e.target.value})} placeholder="Address line 2" className="border rounded-lg p-2 text-sm" />
            <input required value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} placeholder="City" className="border rounded-lg p-2 text-sm" />
            <input required value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} placeholder="State" className="border rounded-lg p-2 text-sm" />
            <input required value={form.pincode} onChange={(e) => setForm({...form, pincode: e.target.value})} placeholder="Pincode" className="border rounded-lg p-2 text-sm" />
            <button type="submit" className="col-span-2 bg-[#F8CB46] font-bold py-2 rounded-lg">Save Address</button>
          </form>
        )}
      </div>
    </div>
  );
}