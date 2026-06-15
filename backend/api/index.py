from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS - Allow all origins for deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== DUMMY DATA ==========
DUMMY_CATEGORIES = [
    {"category_id": "veg", "name": "Fresh Vegetables", "slug": "vegetables", "image": "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c"},
    {"category_id": "fruit", "name": "Fresh Fruits", "slug": "fruits", "image": "https://images.unsplash.com/photo-1610832958506-aa56368176cf"},
    {"category_id": "dairy", "name": "Dairy & Eggs", "slug": "dairy", "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150"},
    {"category_id": "snacks", "name": "Snacks & Munchies", "slug": "snacks", "image": "https://images.unsplash.com/photo-1599490659213-e2b9527bd08c"},
    {"category_id": "bakery", "name": "Bakery & Breads", "slug": "bakery", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff"},
]

DUMMY_PRODUCTS = [
    {"product_id": "p1", "name": "Fresh Tomato", "price": 28, "mrp": 40, "unit": "1 kg", "image": "https://images.unsplash.com/photo-1546470427-227df1e3a5be", "category_id": "veg", "description": "Fresh organic tomatoes", "stock": 100, "rating": 4.5},
    {"product_id": "p2", "name": "Fresh Onion", "price": 35, "mrp": 50, "unit": "1 kg", "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655", "category_id": "veg", "description": "Fresh red onions", "stock": 100, "rating": 4.2},
    {"product_id": "p3", "name": "Red Apple", "price": 180, "mrp": 240, "unit": "1 kg", "image": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb", "category_id": "fruit", "description": "Fresh Kashmiri apples", "stock": 100, "rating": 4.8},
    {"product_id": "p4", "name": "Banana", "price": 55, "mrp": 70, "unit": "1 dozen", "image": "https://images.unsplash.com/photo-1603833665858-e61d17a86224", "category_id": "fruit", "description": "Fresh bananas", "stock": 100, "rating": 4.3},
    {"product_id": "p5", "name": "Amul Milk", "price": 34, "mrp": 36, "unit": "500 ml", "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150", "category_id": "dairy", "description": "Fresh toned milk", "stock": 100, "rating": 4.6},
    {"product_id": "p6", "name": "Lays Chips", "price": 20, "mrp": 20, "unit": "52 g", "image": "https://images.unsplash.com/photo-1599490659213-e2b9527bd08c", "category_id": "snacks", "description": "Classic salted", "stock": 100, "rating": 4.4},
    {"product_id": "p7", "name": "Brown Bread", "price": 45, "mrp": 50, "unit": "400 g", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff", "category_id": "bakery", "description": "Whole wheat bread", "stock": 100, "rating": 4.2},
]

DUMMY_USER = {"user_id": "test123", "name": "Test User", "email": "test@blinkit.com", "role": "admin"}

# ========== ROUTES ==========
@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.get("/api/categories")
async def get_categories():
    return DUMMY_CATEGORIES

@app.get("/api/products")
async def get_products():
    return DUMMY_PRODUCTS

@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    for p in DUMMY_PRODUCTS:
        if p["product_id"] == product_id:
            return p
    return {"error": "Product not found"}

@app.post("/api/auth/register")
async def register():
    return {"token": "fake-token", "user": DUMMY_USER}

@app.post("/api/auth/login")
async def login():
    return {"token": "fake-token", "user": DUMMY_USER}

@app.get("/api/auth/me")
async def get_me():
    return DUMMY_USER

@app.post("/api/auth/logout")
async def logout():
    return {"ok": True}

@app.get("/api/cart")
async def get_cart():
    return {"items": []}

@app.post("/api/cart")
async def add_to_cart():
    return {"items": []}

@app.delete("/api/cart/{product_id}")
async def remove_from_cart():
    return {"items": []}

@app.get("/api/wishlist")
async def get_wishlist():
    return {"items": []}

@app.post("/api/wishlist/{product_id}")
async def toggle_wishlist():
    return {"product_ids": []}

@app.get("/api/addresses")
async def get_addresses():
    return []

@app.post("/api/addresses")
async def add_address():
    return {"address_id": "a1"}

@app.delete("/api/addresses/{address_id}")
async def delete_address():
    return {"ok": True}

@app.post("/api/checkout")
async def checkout():
    return {"order": {"order_id": "o1"}, "redirect_url": None}

@app.get("/api/orders")
async def get_orders():
    return []

@app.get("/api/orders/{order_id}")
async def get_order():
    return {"order_id": "o1"}

@app.get("/api/admin/stats")
async def admin_stats():
    return {"revenue": 0, "total_orders": 0, "total_products": 7, "total_users": 1, "daily": []}

@app.get("/api/admin/orders")
async def admin_orders():
    return []

@app.put("/api/admin/orders/{order_id}/status")
async def update_order_status():
    return {"ok": True}

@app.get("/api/admin/users")
async def admin_users():
    return [DUMMY_USER]

# Vercel handler
handler = app