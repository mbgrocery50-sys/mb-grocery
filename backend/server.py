from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import uuid
from datetime import datetime

app = FastAPI(title="Blinkit Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== IN-MEMORY DATABASE ==========
carts: Dict[str, dict] = {}
wishlists: Dict[str, list] = {}
addresses: Dict[str, list] = {}
orders: List[dict] = []

CURRENT_USER_ID = "test123"
CURRENT_USER = {
    "user_id": CURRENT_USER_ID,
    "name": "Test User",
    "email": "test@blinkit.com",
    "role": "admin"
}

# ========== 50+ PRODUCTS WITH VARIANTS ==========
DUMMY_PRODUCTS = [
    # Dairy, Bread & Eggs (7 products)
    {"product_id": "d1", "name": "Amul Gold Full Cream Milk", "price": 34, "mrp": 36, "unit": "500 ml", "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150", "category_id": "dairy", "description": "Fresh full cream milk", "stock": 100, "rating": 4.5, "variants": ["500 ml", "1 L", "2 L"]},
    {"product_id": "d2", "name": "Amul Masti Pouch Curd", "price": 35, "mrp": 40, "unit": "400 g", "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150", "category_id": "dairy", "description": "Fresh curd", "stock": 100, "rating": 4.3, "variants": ["200 g", "400 g", "1 kg"]},
    {"product_id": "d3", "name": "Britannia Cheese Slices", "price": 125, "mrp": 135, "unit": "200 g", "image": "https://images.unsplash.com/photo-1452195100486-9cc805987862", "category_id": "dairy", "description": "Processed cheese", "stock": 100, "rating": 4.4, "variants": ["200 g", "400 g"]},
    {"product_id": "d4", "name": "Mother Dairy Curd", "price": 45, "mrp": 50, "unit": "400 g", "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150", "category_id": "dairy", "description": "Fresh curd", "stock": 100, "rating": 4.2, "variants": ["400 g", "800 g"]},
    {"product_id": "d5", "name": "Amul Butter", "price": 58, "mrp": 62, "unit": "100 g", "image": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d", "category_id": "dairy", "description": "Salted butter", "stock": 100, "rating": 4.6, "variants": ["100 g", "200 g"]},
    {"product_id": "d6", "name": "Eggs White", "price": 95, "mrp": 110, "unit": "10 pc", "image": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f", "category_id": "dairy", "description": "Fresh eggs", "stock": 100, "rating": 4.5, "variants": ["6 pc", "10 pc", "30 pc"]},
    {"product_id": "d7", "name": "Paneer Fresh", "price": 95, "mrp": 110, "unit": "200 g", "image": "https://images.unsplash.com/photo-1631452180519-c96fe8b4d07f", "category_id": "dairy", "description": "Fresh cottage cheese", "stock": 100, "rating": 4.4, "variants": ["200 g", "400 g"]},

    # Fruits & Vegetables (8 products)
    {"product_id": "f1", "name": "Fresh Tomato", "price": 28, "mrp": 40, "unit": "1 kg", "image": "https://images.unsplash.com/photo-1546470427-227df1e3a5be", "category_id": "fruits", "description": "Fresh organic tomatoes", "stock": 100, "rating": 4.5, "variants": ["500 g", "1 kg"]},
    {"product_id": "f2", "name": "Fresh Onion", "price": 35, "mrp": 50, "unit": "1 kg", "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655", "category_id": "fruits", "description": "Fresh red onions", "stock": 100, "rating": 4.2, "variants": ["500 g", "1 kg", "2 kg"]},
    {"product_id": "f3", "name": "Red Apple", "price": 180, "mrp": 240, "unit": "1 kg", "image": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb", "category_id": "fruits", "description": "Fresh Kashmiri apples", "stock": 100, "rating": 4.8, "variants": ["500 g", "1 kg", "2 kg"]},
    {"product_id": "f4", "name": "Banana", "price": 55, "mrp": 70, "unit": "1 dozen", "image": "https://images.unsplash.com/photo-1603833665858-e61d17a86224", "category_id": "fruits", "description": "Fresh bananas", "stock": 100, "rating": 4.3, "variants": ["6 pc", "1 dozen", "2 dozen"]},
    {"product_id": "f5", "name": "Potato", "price": 30, "mrp": 42, "unit": "1 kg", "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655", "category_id": "fruits", "description": "Fresh potatoes", "stock": 100, "rating": 4.2, "variants": ["500 g", "1 kg", "2 kg"]},
    {"product_id": "f6", "name": "Carrot", "price": 45, "mrp": 60, "unit": "500 g", "image": "https://images.unsplash.com/photo-1447175008436-054170c2e979", "category_id": "fruits", "description": "Fresh carrots", "stock": 100, "rating": 4.4, "variants": ["250 g", "500 g", "1 kg"]},
    {"product_id": "f7", "name": "Capsicum", "price": 50, "mrp": 70, "unit": "500 g", "image": "https://images.unsplash.com/photo-1568585101075-d3ec5b6ecf1e", "category_id": "fruits", "description": "Fresh capsicum", "stock": 100, "rating": 4.3, "variants": ["250 g", "500 g"]},
    {"product_id": "f8", "name": "Pomegranate", "price": 110, "mrp": 150, "unit": "500 g", "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5", "category_id": "fruits", "description": "Fresh pomegranate", "stock": 100, "rating": 4.6, "variants": ["500 g", "1 kg"]},

    # Cold Drinks & Juices (7 products)
    {"product_id": "b1", "name": "Coca-Cola Soft Drink", "price": 40, "mrp": 40, "unit": "750 ml", "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97", "category_id": "beverages", "description": "Original taste", "stock": 100, "rating": 4.5, "variants": ["300 ml", "750 ml", "2.25 L"]},
    {"product_id": "b2", "name": "Pepsi Soft Drink", "price": 40, "mrp": 40, "unit": "750 ml", "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97", "category_id": "beverages", "description": "Original taste", "stock": 100, "rating": 4.4, "variants": ["300 ml", "750 ml", "2.25 L"]},
    {"product_id": "b3", "name": "Sprite Lime Soft Drink", "price": 40, "mrp": 40, "unit": "750 ml", "image": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3", "category_id": "beverages", "description": "Lime flavor", "stock": 100, "rating": 4.3, "variants": ["300 ml", "750 ml", "2.25 L"]},
    {"product_id": "b4", "name": "Thums Up Soft Drink", "price": 40, "mrp": 40, "unit": "750 ml", "image": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3", "category_id": "beverages", "description": "Strong taste", "stock": 100, "rating": 4.6, "variants": ["300 ml", "750 ml", "2.25 L"]},
    {"product_id": "b5", "name": "Fanta Orange Soft Drink", "price": 40, "mrp": 40, "unit": "750 ml", "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97", "category_id": "beverages", "description": "Orange flavor", "stock": 100, "rating": 4.2, "variants": ["300 ml", "750 ml", "2.25 L"]},
    {"product_id": "b6", "name": "Tropicana Orange Juice", "price": 110, "mrp": 120, "unit": "1 L", "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97", "category_id": "beverages", "description": "100% fruit juice", "stock": 100, "rating": 4.5, "variants": ["200 ml", "1 L"]},
    {"product_id": "b7", "name": "Real Mixed Fruit Juice", "price": 99, "mrp": 110, "unit": "1 L", "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97", "category_id": "beverages", "description": "Mixed fruit juice", "stock": 100, "rating": 4.4, "variants": ["200 ml", "1 L"]},

    # Snacks & Munchies (5 products)
    {"product_id": "s1", "name": "Lays Classic Salted", "price": 20, "mrp": 20, "unit": "52 g", "image": "https://images.unsplash.com/photo-1599490659213-e2b9527bd08c", "category_id": "snacks", "description": "Classic salted chips", "stock": 100, "rating": 4.5, "variants": ["25 g", "52 g", "110 g"]},
    {"product_id": "s2", "name": "Kurkure Masala Munch", "price": 20, "mrp": 20, "unit": "85 g", "image": "https://images.unsplash.com/photo-1599490659213-e2b9527bd08c", "category_id": "snacks", "description": "Masala flavor", "stock": 100, "rating": 4.4, "variants": ["30 g", "85 g"]},
    {"product_id": "s3", "name": "Haldiram Bhujia", "price": 75, "mrp": 85, "unit": "200 g", "image": "https://images.unsplash.com/photo-1599490659213-e2b9527bd08c", "category_id": "snacks", "description": "Spicy bhujia", "stock": 100, "rating": 4.6, "variants": ["100 g", "200 g", "400 g"]},
    {"product_id": "s4", "name": "Doritos Cheese", "price": 30, "mrp": 35, "unit": "47 g", "image": "https://images.unsplash.com/photo-1599490659213-e2b9527bd08c", "category_id": "snacks", "description": "Nacho cheese", "stock": 100, "rating": 4.3, "variants": ["47 g", "80 g"]},
    {"product_id": "s5", "name": "Pringles Sour Cream", "price": 99, "mrp": 110, "unit": "107 g", "image": "https://images.unsplash.com/photo-1599490659213-e2b9527bd08c", "category_id": "snacks", "description": "Sour cream flavor", "stock": 100, "rating": 4.4, "variants": ["107 g", "165 g"]},

    # Bakery & Biscuits (6 products)
    {"product_id": "bk1", "name": "Brown Bread", "price": 45, "mrp": 50, "unit": "400 g", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff", "category_id": "bakery", "description": "Whole wheat bread", "stock": 100, "rating": 4.3, "variants": ["200 g", "400 g"]},
    {"product_id": "bk2", "name": "White Bread", "price": 35, "mrp": 40, "unit": "400 g", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff", "category_id": "bakery", "description": "Fresh white bread", "stock": 100, "rating": 4.2, "variants": ["400 g", "800 g"]},
    {"product_id": "bk3", "name": "Garlic Bread", "price": 89, "mrp": 110, "unit": "200 g", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff", "category_id": "bakery", "description": "Butter garlic bread", "stock": 100, "rating": 4.4, "variants": ["200 g", "400 g"]},
    {"product_id": "bk4", "name": "Parle G Biscuit", "price": 10, "mrp": 10, "unit": "50 g", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff", "category_id": "bakery", "description": "Glucose biscuits", "stock": 100, "rating": 4.5, "variants": ["50 g", "100 g", "200 g"]},
    {"product_id": "bk5", "name": "Oreo Vanilla", "price": 30, "mrp": 30, "unit": "50 g", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff", "category_id": "bakery", "description": "Vanilla cream biscuits", "stock": 100, "rating": 4.6, "variants": ["50 g", "100 g", "150 g"]},
    {"product_id": "bk6", "name": "Good Day Butter", "price": 25, "mrp": 25, "unit": "100 g", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff", "category_id": "bakery", "description": "Butter cookies", "stock": 100, "rating": 4.4, "variants": ["50 g", "100 g"]},

    # Sweet Tooth (5 products)
    {"product_id": "sw1", "name": "Cadbury Dairy Milk", "price": 50, "mrp": 55, "unit": "55 g", "image": "https://images.unsplash.com/photo-1548907040-4baa42d10919", "category_id": "sweets", "description": "Silk chocolate", "stock": 100, "rating": 4.7, "variants": ["30 g", "55 g", "100 g"]},
    {"product_id": "sw2", "name": "KitKat", "price": 50, "mrp": 55, "unit": "37 g", "image": "https://images.unsplash.com/photo-1548907040-4baa42d10919", "category_id": "sweets", "description": "Wafer chocolate", "stock": 100, "rating": 4.6, "variants": ["37 g", "74 g"]},
    {"product_id": "sw3", "name": "Amul Vanilla Ice Cream", "price": 145, "mrp": 165, "unit": "750 ml", "image": "https://images.unsplash.com/photo-1576506295286-5cda18df43e7", "category_id": "sweets", "description": "Vanilla ice cream", "stock": 100, "rating": 4.5, "variants": ["500 ml", "750 ml", "1 L"]},
    {"product_id": "sw4", "name": "Haldiram Soan Papdi", "price": 199, "mrp": 230, "unit": "500 g", "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307", "category_id": "sweets", "description": "Traditional sweet", "stock": 100, "rating": 4.4, "variants": ["250 g", "500 g"]},
    {"product_id": "sw5", "name": "Gulab Jamun", "price": 120, "mrp": 140, "unit": "500 g", "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307", "category_id": "sweets", "description": "Canned gulab jamun", "stock": 100, "rating": 4.3, "variants": ["250 g", "500 g"]},
]

# ========== CATEGORIES ==========
DUMMY_CATEGORIES = [
    {"category_id": "paan-corner", "name": "Paan Corner", "slug": "paan-corner", "image": "https://images.unsplash.com/photo-1527661591475-527312dd65f5"},
    {"category_id": "dairy", "name": "Dairy, Bread & Eggs", "slug": "dairy", "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150"},
    {"category_id": "fruits", "name": "Fruits & Vegetables", "slug": "fruits", "image": "https://images.unsplash.com/photo-1610832958506-aa56368176cf"},
    {"category_id": "beverages", "name": "Cold Drinks & Juices", "slug": "beverages", "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97"},
    {"category_id": "snacks", "name": "Snacks & Munchies", "slug": "snacks", "image": "https://images.unsplash.com/photo-1599490659213-e2b9527bd08c"},
    {"category_id": "instant-food", "name": "Breakfast & Instant Food", "slug": "instant-food", "image": "https://images.unsplash.com/photo-1612152605287-5be0bf5da12d"},
    {"category_id": "sweets", "name": "Sweet Tooth", "slug": "sweets", "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307"},
    {"category_id": "bakery", "name": "Bakery & Biscuits", "slug": "bakery", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff"},
    {"category_id": "tea-coffee", "name": "Tea, Coffee & Milk Drinks", "slug": "tea-coffee", "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"},
    {"category_id": "staples", "name": "Atta, Rice & Dal", "slug": "staples", "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c"},
    {"category_id": "masala-oil", "name": "Masala, Oil & More", "slug": "masala-oil", "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d"},
    {"category_id": "sauces", "name": "Sauces & Spreads", "slug": "sauces", "image": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc"},
    {"category_id": "meat", "name": "Chicken, Meat & Fish", "slug": "meat", "image": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f"},
    {"category_id": "baby-care", "name": "Baby Care", "slug": "baby-care", "image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4"},
    {"category_id": "pharma", "name": "Pharma & Wellness", "slug": "pharma", "image": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88"},
    {"category_id": "cleaning", "name": "Cleaning Essentials", "slug": "cleaning", "image": "https://images.unsplash.com/photo-1583947215259-38e31be8751f"},
    {"category_id": "home-office", "name": "Home & Office", "slug": "home-office", "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38"},
    {"category_id": "personal-care", "name": "Personal Care", "slug": "personal-care", "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b"},
    {"category_id": "pet-care", "name": "Pet Care", "slug": "pet-care", "image": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee"},
]

# ========== HELPER FUNCTIONS ==========
def get_product(product_id: str):
    for p in DUMMY_PRODUCTS:
        if p["product_id"] == product_id:
            return p.copy()
    return None

def enrich_cart_items(cart_items):
    enriched = []
    for item in cart_items:
        product = get_product(item["product_id"])
        if product:
            enriched.append({
                "product_id": item["product_id"],
                "quantity": item["quantity"],
                "product": product
            })
    return enriched

# ========== CART ROUTES ==========
@app.get("/api/cart")
async def get_cart():
    cart = carts.get(CURRENT_USER_ID, {"items": []})
    enriched_items = enrich_cart_items(cart.get("items", []))
    return {"items": enriched_items}

@app.post("/api/cart")
async def add_to_cart(item: dict):
    product_id = item.get("product_id")
    quantity = item.get("quantity", 1)
    
    if CURRENT_USER_ID not in carts:
        carts[CURRENT_USER_ID] = {"items": []}
    
    cart_items = carts[CURRENT_USER_ID]["items"]
    found = False
    for cart_item in cart_items:
        if cart_item["product_id"] == product_id:
            cart_item["quantity"] = max(0, cart_item["quantity"] + quantity)
            found = True
            break
    
    if not found and quantity > 0:
        cart_items.append({"product_id": product_id, "quantity": quantity})
    
    cart_items = [i for i in cart_items if i["quantity"] > 0]
    carts[CURRENT_USER_ID]["items"] = cart_items
    enriched_items = enrich_cart_items(cart_items)
    return {"items": enriched_items}

@app.delete("/api/cart/{product_id}")
async def remove_from_cart(product_id: str):
    if CURRENT_USER_ID in carts:
        cart_items = carts[CURRENT_USER_ID]["items"]
        cart_items = [i for i in cart_items if i["product_id"] != product_id]
        carts[CURRENT_USER_ID]["items"] = cart_items
        enriched_items = enrich_cart_items(cart_items)
        return {"items": enriched_items}
    return {"items": []}

@app.delete("/api/cart")
async def clear_cart():
    carts[CURRENT_USER_ID] = {"items": []}
    return {"items": []}

# ========== WISHLIST ROUTES ==========
@app.get("/api/wishlist")
async def get_wishlist():
    wishlist_items = wishlists.get(CURRENT_USER_ID, [])
    products = [get_product(pid) for pid in wishlist_items if get_product(pid)]
    return {"items": products}

@app.post("/api/wishlist/{product_id}")
async def toggle_wishlist(product_id: str):
    if CURRENT_USER_ID not in wishlists:
        wishlists[CURRENT_USER_ID] = []
    
    if product_id in wishlists[CURRENT_USER_ID]:
        wishlists[CURRENT_USER_ID].remove(product_id)
    else:
        wishlists[CURRENT_USER_ID].append(product_id)
    
    return {"product_ids": wishlists[CURRENT_USER_ID]}

# ========== ADDRESS ROUTES ==========
@app.get("/api/addresses")
async def get_addresses():
    return addresses.get(CURRENT_USER_ID, [])

@app.post("/api/addresses")
async def add_address(address: dict):
    address_id = f"addr_{uuid.uuid4().hex[:8]}"
    new_address = {"address_id": address_id, **address}
    
    if CURRENT_USER_ID not in addresses:
        addresses[CURRENT_USER_ID] = []
    addresses[CURRENT_USER_ID].append(new_address)
    return new_address

@app.delete("/api/addresses/{address_id}")
async def delete_address(address_id: str):
    if CURRENT_USER_ID in addresses:
        addresses[CURRENT_USER_ID] = [a for a in addresses[CURRENT_USER_ID] if a["address_id"] != address_id]
    return {"ok": True}

# ========== CHECKOUT & ORDERS ==========
@app.post("/api/checkout")
async def checkout(data: dict):
    address_id = data.get("address_id")
    payment_method = data.get("payment_method", "cod")
    
    cart = carts.get(CURRENT_USER_ID, {"items": []})
    cart_items = cart.get("items", [])
    
    if not cart_items:
        raise HTTPException(400, "Cart is empty")
    
    user_addresses = addresses.get(CURRENT_USER_ID, [])
    selected_address = None
    for addr in user_addresses:
        if addr["address_id"] == address_id:
            selected_address = addr
            break
    
    if not selected_address:
        raise HTTPException(400, "Address not found")
    
    subtotal = 0
    order_items = []
    for item in cart_items:
        product = get_product(item["product_id"])
        if product:
            item_total = product["price"] * item["quantity"]
            subtotal += item_total
            order_items.append({
                "product_id": item["product_id"],
                "name": product["name"],
                "price": product["price"],
                "quantity": item["quantity"],
                "unit": product["unit"],
                "image": product["image"]
            })
    
    delivery_fee = 0 if subtotal >= 99 else 25
    handling_charge = 2
    total = subtotal + delivery_fee + handling_charge
    
    order_id = f"ord_{uuid.uuid4().hex[:8]}"
    
    new_order = {
        "order_id": order_id,
        "user_id": CURRENT_USER_ID,
        "items": order_items,
        "subtotal": subtotal,
        "delivery_fee": delivery_fee,
        "handling_charge": handling_charge,
        "total": total,
        "address": selected_address,
        "payment_method": payment_method,
        "payment_status": "pending" if payment_method == "stripe" else "cod_pending",
        "status": "placed",
        "timeline": [{"stage": "placed", "at": datetime.now().isoformat()}],
        "created_at": datetime.now().isoformat()
    }
    
    orders.append(new_order)
    carts[CURRENT_USER_ID] = {"items": []}
    
    return {"order": new_order, "redirect_url": None}

@app.get("/api/orders")
async def get_orders():
    user_orders = [o for o in orders if o["user_id"] == CURRENT_USER_ID]
    return user_orders

@app.get("/api/orders/{order_id}")
async def get_order(order_id: str):
    for o in orders:
        if o["order_id"] == order_id and o["user_id"] == CURRENT_USER_ID:
            return o
    raise HTTPException(404, "Order not found")

@app.get("/api/payments/status/{session_id}")
async def payment_status(session_id: str):
    return {"payment_status": "paid", "status": "complete"}

# ========== AUTH ROUTES ==========
@app.post("/api/auth/register")
async def register(user: dict):
    return {"token": "fake-token", "user": CURRENT_USER}

@app.post("/api/auth/login")
async def login(user: dict):
    if user.get("email") == "test@blinkit.com" and user.get("password") == "test123":
        return {"token": "fake-token", "user": CURRENT_USER}
    raise HTTPException(401, "Invalid credentials")

@app.get("/api/auth/me")
async def get_me():
    return CURRENT_USER

@app.post("/api/auth/logout")
async def logout():
    return {"ok": True}

@app.post("/api/auth/google/session")
async def google_session(body: dict):
    return {"token": "fake-token", "user": CURRENT_USER}

# ========== CATEGORY ROUTES ==========
@app.get("/api/categories")
async def get_categories():
    return DUMMY_CATEGORIES

@app.get("/api/categories/{slug}")
async def get_category(slug: str):
    for c in DUMMY_CATEGORIES:
        if c["slug"] == slug or c["category_id"] == slug:
            return c
    raise HTTPException(404, "Category not found")

# ========== CATEGORY CRUD (ADD/EDIT/DELETE) ==========
@app.post("/api/categories")
async def create_category(category: dict):
    new_id = category.get("category_id") or f"cat_{uuid.uuid4().hex[:6]}"
    # Check if slug already exists
    for c in DUMMY_CATEGORIES:
        if c.get("slug") == category.get("slug"):
            raise HTTPException(400, "Category with this slug already exists")
    
    entry = {
        "category_id": new_id,
        "name": category.get("name"),
        "slug": category.get("slug"),
        "image": category.get("image", "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c")
    }
    DUMMY_CATEGORIES.append(entry)
    return entry

@app.put("/api/categories/{category_id}")
async def update_category(category_id: str, category: dict):
    for i, c in enumerate(DUMMY_CATEGORIES):
        if c.get("category_id") == category_id:
            DUMMY_CATEGORIES[i] = {
                **c,
                "name": category.get("name", c.get("name")),
                "slug": category.get("slug", c.get("slug")),
                "image": category.get("image", c.get("image"))
            }
            return DUMMY_CATEGORIES[i]
    raise HTTPException(404, "Category not found")

@app.delete("/api/categories/{category_id}")
async def delete_category(category_id: str):
    global DUMMY_CATEGORIES
    # Check if category has products
    for p in DUMMY_PRODUCTS:
        if p.get("category_id") == category_id:
            raise HTTPException(400, "Cannot delete category with existing products")
    
    DUMMY_CATEGORIES = [c for c in DUMMY_CATEGORIES if c.get("category_id") != category_id]
    return {"ok": True, "message": "Category deleted"}

# ========== PRODUCT ROUTES ==========
@app.get("/api/products")
async def get_products(category_id: Optional[str] = None, search: Optional[str] = None, limit: int = 100):
    prods = DUMMY_PRODUCTS
    if category_id:
        prods = [p for p in prods if p.get("category_id") == category_id]
    if search:
        prods = [p for p in prods if search.lower() in p.get("name", "").lower()]
    return prods[:limit]

@app.get("/api/products/{product_id}")
async def get_product_by_id(product_id: str):
    for p in DUMMY_PRODUCTS:
        if p["product_id"] == product_id:
            return p
    raise HTTPException(404, "Product not found")

# ========== PRODUCT CRUD (ADD/EDIT/DELETE) ==========
@app.post("/api/products")
async def create_product(product: dict):
    new_id = product.get("product_id") or f"p_{uuid.uuid4().hex[:6]}"
    entry = {
        "product_id": new_id,
        "name": product.get("name"),
        "price": float(product.get("price", 0)),
        "mrp": float(product.get("mrp", 0)),
        "unit": product.get("unit", ""),
        "image": product.get("image", ""),
        "category_id": product.get("category_id"),
        "description": product.get("description", ""),
        "stock": int(product.get("stock", 100)),
        "rating": float(product.get("rating", 4.0)),
        "variants": product.get("variants", [])
    }
    DUMMY_PRODUCTS.append(entry)
    return entry

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, product: dict):
    for i, p in enumerate(DUMMY_PRODUCTS):
        if p.get("product_id") == product_id:
            DUMMY_PRODUCTS[i] = {**p, **product, "product_id": product_id}
            return DUMMY_PRODUCTS[i]
    raise HTTPException(404, "Product not found")

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str):
    global DUMMY_PRODUCTS
    DUMMY_PRODUCTS = [p for p in DUMMY_PRODUCTS if p.get("product_id") != product_id]
    return {"ok": True}

# ========== ADMIN ROUTES ==========
@app.get("/api/admin/stats")
async def admin_stats():
    total_revenue = sum(o.get("total", 0) for o in orders)
    return {
        "revenue": total_revenue,
        "total_orders": len(orders),
        "total_products": len(DUMMY_PRODUCTS),
        "total_users": 1,
        "daily": []
    }

@app.get("/api/admin/orders")
async def admin_orders():
    return orders

@app.put("/api/admin/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str):
    for o in orders:
        if o["order_id"] == order_id:
            o["status"] = status
            o["timeline"].append({"stage": status, "at": datetime.now().isoformat()})
            return o
    raise HTTPException(404, "Order not found")

@app.get("/api/admin/users")
async def admin_users():
    return [CURRENT_USER]

@app.get("/api/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)