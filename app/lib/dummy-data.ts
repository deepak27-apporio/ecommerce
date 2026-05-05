export type DummyProduct = {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  photos: string;
};

export type DummyUser = {
  _id: string;
  name: string;
  email: string;
  gender: "male" | "female";
  role: "admin" | "user";
  photo: string;
};

export type DummyOrder = {
  _id: string;
  user: { name: string };
  total: number;
  discount: number;
  status: "Processing" | "Shipped" | "Delivered";
  orderItems: { name: string; quantity: number }[];
};

export const adminUser = {
  _id: "admin_001",
  name: "Demo Admin",
  photo:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
};

export const products: DummyProduct[] = [
  {
    _id: "prod_101",
    name: "Wireless Headphones",
    category: "Audio",
    price: 3499,
    stock: 42,
    photos:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
  },
  {
    _id: "prod_102",
    name: "Smart Watch",
    category: "Wearables",
    price: 5499,
    stock: 18,
    photos:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
  },
  {
    _id: "prod_103",
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 2899,
    stock: 31,
    photos:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
  },
  {
    _id: "prod_104",
    name: "Travel Backpack",
    category: "Bags",
    price: 2199,
    stock: 12,
    photos:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80",
  },
];

export const customers: DummyUser[] = [
  {
    _id: "user_201",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    gender: "male",
    role: "user",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
  {
    _id: "user_202",
    name: "Diya Mehta",
    email: "diya@example.com",
    gender: "female",
    role: "admin",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
  {
    _id: "user_203",
    name: "Kabir Khan",
    email: "kabir@example.com",
    gender: "male",
    role: "user",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
  },
];

export const orders: DummyOrder[] = [
  {
    _id: "txn_301",
    user: { name: "Aarav Sharma" },
    total: 8998,
    discount: 500,
    status: "Processing",
    orderItems: [
      { name: "Wireless Headphones", quantity: 1 },
      { name: "Smart Watch", quantity: 1 },
    ],
  },
  {
    _id: "txn_302",
    user: { name: "Diya Mehta" },
    total: 2899,
    discount: 0,
    status: "Shipped",
    orderItems: [{ name: "Mechanical Keyboard", quantity: 1 }],
  },
  {
    _id: "txn_303",
    user: { name: "Kabir Khan" },
    total: 4398,
    discount: 250,
    status: "Delivered",
    orderItems: [
      { name: "Travel Backpack", quantity: 2 },
    ],
  },
];

export const stats = {
  changePercent: {
    revenue: 18,
    user: 9,
    order: -4,
    product: 14,
  },
  count: {
    revenue: 187450,
    user: customers.length,
    order: orders.length,
    product: products.length,
  },
  chart: {
    revenue: [22000, 36000, 31000, 45000, 52000, 61000],
    order: [18, 25, 21, 30, 36, 41],
  },
  categoryCount: [
    { Audio: 38 },
    { Wearables: 24 },
    { Accessories: 28 },
    { Bags: 10 },
  ],
  userRatio: {
    female: customers.filter((customer) => customer.gender === "female").length,
    male: customers.filter((customer) => customer.gender === "male").length,
  },
  latestTransaction: orders.map((order) => ({
    _id: order._id,
    quantity: order.orderItems.length,
    discount: order.discount,
    amount: order.total,
    status: order.status,
  })),
};

export const last6Months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
