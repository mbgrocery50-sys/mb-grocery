import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, 
  Plus, Edit, Trash2, Eye, RefreshCw 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import api, { formatPrice } from "../../lib/api";
import { toast } from "sonner";

// ========== ADMIN LAYOUT ==========
export function AdminLayout() {
  const location = useLocation();
  const tabs = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/categories", label: "Categories", icon: FolderTree },
    { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { to: "/admin/users", label: "Users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="w-64 bg-white rounded-xl shadow-sm p-2 h-fit sticky top-20">
            {tabs.map((tab) => {
              const active = tab.exact ? location.pathname === tab.to : location.pathname.startsWith(tab.to);
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    active 
                      ? "bg-[#F8CB46] text-black font-bold shadow-sm" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> 
                  {tab.label}
                </Link>
              );
            })}
          </aside>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

// ========== ADMIN DASHBOARD ==========
export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data);
    } catch (error) {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  const cards = [
    { label: "Total Revenue", value: formatPrice(stats?.revenue || 0), color: "bg-green-50 text-green-700 border-green-200", icon: "💰" },
    { label: "Total Orders", value: stats?.total_orders || 0, color: "bg-blue-50 text-blue-700 border-blue-200", icon: "📦" },
    { label: "Total Products", value: stats?.total_products || 0, color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: "🛒" },
    { label: "Total Users", value: stats?.total_users || 0, color: "bg-purple-50 text-purple-700 border-purple-200", icon: "👥" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <button onClick={loadStats} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-xl p-5 border ${card.color} shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium opacity-80">{card.label}</div>
                <div className="text-2xl font-bold mt-1">{card.value}</div>
              </div>
              <div className="text-3xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-5 border shadow-sm">
        <h2 className="font-bold text-gray-800 mb-4">Revenue (Last 7 Days)</h2>
        {stats?.daily?.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stats.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Line type="monotone" dataKey="revenue" stroke="#0C831F" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-10 text-gray-500">No data available yet</div>
        )}
      </div>
    </div>
  );
}

// ========== PRODUCT MANAGEMENT ==========
export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", category_id: "", price: "", mrp: "", unit: "", 
    image: "", description: "", stock: 100, rating: 4
  });

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([api.get("/products?limit=500"), api.get("/categories")]);
      setProducts(p.data || []);
      setCategories(c.data || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        name: product.name,
        category_id: product.category_id,
        price: product.price,
        mrp: product.mrp,
        unit: product.unit,
        image: product.image,
        description: product.description || "",
        stock: product.stock,
        rating: product.rating
      });
    } else {
      setEditingProduct(null);
      setForm({ name: "", category_id: "", price: "", mrp: "", unit: "", image: "", description: "", stock: 100, rating: 4 });
    }
    setShowModal(true);
  };

  const saveProduct = async () => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.product_id}`, form);
        toast.success("Product updated!");
      } else {
        await api.post("/products", form);
        toast.success("Product created!");
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const deleteProduct = async (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted!");
        loadData();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Products ({products.length})</h1>
        <button onClick={() => openModal()} className="bg-[#0C831F] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const cat = categories.find(c => c.category_id === p.category_id);
              return (
                <tr key={p.product_id} className="border-t hover:bg-gray-50">
                  <td className="p-3"><img src={p.image} alt="" className="w-10 h-10 object-cover rounded" /></td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-gray-500">{cat?.name || "-"}</td>
                  <td className="p-3 text-center font-semibold">₹{p.price}</td>
                  <td className="p-3 text-center">{p.stock}</td>
                  <td className="p-3 text-center space-x-2">
                    <button onClick={() => openModal(p)} className="text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4 inline" /> Edit</button>
                    <button onClick={() => deleteProduct(p.product_id, p.name)} className="text-red-500 hover:text-red-700 ml-2"><Trash2 className="w-4 h-4 inline" /> Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && <div className="text-center py-10 text-gray-500">No products yet</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h2>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Product Name" className="w-full border rounded-lg p-2" />
              <select value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})} className="w-full border rounded-lg p-2">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="Price" className="border rounded-lg p-2" />
                <input type="number" value={form.mrp} onChange={(e) => setForm({...form, mrp: e.target.value})} placeholder="MRP" className="border rounded-lg p-2" />
              </div>
              <input value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} placeholder="Unit (e.g. 1 kg, 500 ml)" className="w-full border rounded-lg p-2" />
              <input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="Image URL" className="w-full border rounded-lg p-2" />
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description" rows="3" className="w-full border rounded-lg p-2" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} placeholder="Stock" className="border rounded-lg p-2" />
                <input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({...form, rating: e.target.value})} placeholder="Rating" className="border rounded-lg p-2" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveProduct} className="flex-1 bg-[#0C831F] text-white py-2 rounded-lg font-semibold">Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== ORDERS MANAGEMENT ==========
export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const STAGES = ["placed", "confirmed", "packed", "out_for_delivery", "delivered"];

  const loadOrders = async () => {
    try {
      const { data } = await api.get("/admin/orders");
      setOrders(data || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status?status=${status}`);
      toast.success(`Order status updated to ${status}`);
      loadOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: "bg-gray-200 text-gray-700",
      confirmed: "bg-blue-100 text-blue-700",
      packed: "bg-yellow-100 text-yellow-700",
      out_for_delivery: "bg-orange-100 text-orange-700",
      delivered: "bg-green-100 text-green-700"
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  if (loading) return <div className="text-center py-10">Loading orders...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Orders ({orders.length})</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-center">Items</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3 text-center">Payment</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.order_id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">{o.order_id?.slice(0, 12)}</td>
                <td className="p-3">
                  <div className="font-medium">{o.address?.full_name}</div>
                  <div className="text-xs text-gray-500">{o.address?.phone}</div>
                </td>
                <td className="p-3 text-center">{o.items?.length || 0}</td>
                <td className="p-3 text-center font-semibold">₹{o.total}</td>
                <td className="p-3 text-center">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100">{o.payment_method}</span>
                </td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(o.status)}`}>
                    {o.status?.replace("_", " ")}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <select 
                    value={o.status} 
                    onChange={(e) => updateStatus(o.order_id, e.target.value)}
                    className="border rounded p-1 text-xs"
                  >
                    {STAGES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="text-center py-10 text-gray-500">No orders yet</div>}
      </div>
    </div>
  );
}

// ========== CATEGORIES MANAGEMENT ==========
export function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", image: "" });
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const openModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setForm({ name: cat.name, slug: cat.slug, image: cat.image });
    } else {
      setEditingCat(null);
      setForm({ name: "", slug: "", image: "" });
    }
    setShowModal(true);
  };

  const saveCategory = async () => {
    try {
      if (editingCat) {
        await api.put(`/categories/${editingCat.category_id}`, form);
        toast.success("Category updated!");
      } else {
        await api.post("/categories", form);
        toast.success("Category created!");
      }
      setShowModal(false);
      loadCategories();
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const deleteCategory = async (id, name) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success("Category deleted!");
        loadCategories();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading categories...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Categories ({categories.length})</h1>
        <button onClick={() => openModal()} className="bg-[#0C831F] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c.category_id} className="bg-white rounded-xl border p-3 hover:shadow-md transition">
            <img src={c.image} alt={c.name} className="w-full h-32 object-cover rounded-lg" />
            <div className="mt-2">
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-xs text-gray-500">{c.slug}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => openModal(c)} className="flex-1 text-blue-600 text-sm py-1 border rounded">Edit</button>
              <button onClick={() => deleteCategory(c.category_id, c.name)} className="flex-1 text-red-500 text-sm py-1 border rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingCat ? "Edit Category" : "Add Category"}</h2>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Category Name" className="w-full border rounded-lg p-2" />
              <input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} placeholder="Slug (e.g. fresh-vegetables)" className="w-full border rounded-lg p-2" />
              <input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="Image URL" className="w-full border rounded-lg p-2" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveCategory} className="flex-1 bg-[#0C831F] text-white py-2 rounded-lg font-semibold">Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== USERS MANAGEMENT ==========
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data || []);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  if (loading) return <div className="text-center py-10">Loading users...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Users ({users.length})</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3 text-center">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">{u.user_id}</td>
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded ${u.role === "admin" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.role || "user"}
                  </span>
                </td>
                <td className="p-3 text-center text-gray-500">{u.created_at?.slice(0, 10) || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}