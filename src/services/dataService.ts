// Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  stock_minimo: number;
  status: 'active' | 'inactive';
  images: string[];
  createdAt: string;
  isInventoryOnly?: boolean;
  description?: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
}

export interface OrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  shippingAddress?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer' | 'staff' | 'empleado';
  status: 'active' | 'inactive';
  createdAt: string;
  avatar: string;
}

// Internal State
let _products: Product[] = [];
let _orders: Order[] = [];
let _users: User[] = [];
let _settings: any = {};
let _audit: any[] = [];
let _system: any = {};

const fetchData = async (file: string) => {
  try {
    const res = await fetch(`/api/data/${file}`);
    if (!res.ok) throw new Error(`Failed to fetch ${file}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${file}:`, error);
    return [];
  }
};

const saveData = async (file: string, data: any) => {
  try {
    const res = await fetch(`/api/data/${file}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to save ${file}`);
    return true;
  } catch (error) {
    console.error(`Error saving ${file}:`, error);
    return false;
  }
};

// Data Service
export const DataService = {
  // Initialization
  init: async () => {
    _products = await fetchData('products');
    _orders = await fetchData('orders');
    _users = await fetchData('users');
    _settings = await fetchData('settings');
    _audit = await fetchData('audit');
    _system = await fetchData('system');
    console.log('DataService initialized');
  },

  // Products
  getProducts: (includeInventory = false) => {
    if (includeInventory) return _products;
    return _products.filter(p => !p.isInventoryOnly);
  },
  
  saveProducts: async (products: Product[]) => {
    _products = products;
    return await saveData('products', _products);
  },

  importProducts: async (newProducts: any[]) => {
    // Basic validation and merging
    const validProducts = newProducts.map(p => ({
      id: p.id || `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sku: p.sku || `SKU-${Date.now()}`,
      name: p.name || 'Producto Importado',
      category: p.category || 'General',
      price: Number(p.price) || 0,
      stock: Number(p.stock) || 0,
      stock_minimo: Number(p.stock_minimo) || 5,
      status: p.status === 'inactive' ? 'inactive' : 'active',
      images: p.images || (p.image ? [p.image] : ['https://images.unsplash.com/photo-1582794543139-8ac9cb4f2025?auto=format&fit=crop&q=80']),
      createdAt: p.createdAt || new Date().toISOString(),
      isInventoryOnly: !!p.isInventoryOnly,
      description: p.description || '',
      badge: p.badge || '',
    })) as Product[];

    // Merge with existing products (update if ID exists, otherwise add)
    const existingIds = new Set(_products.map(p => p.id));
    const toAdd = validProducts.filter(p => !existingIds.has(p.id));
    const toUpdate = validProducts.filter(p => existingIds.has(p.id));

    _products = _products.map(p => {
      const update = toUpdate.find(u => u.id === p.id);
      return update ? { ...p, ...update } : p;
    });

    _products = [...toAdd, ..._products];
    return await saveData('products', _products);
  },

  updateProductStock: async (productId: string, newStock: number) => {
    const index = _products.findIndex(p => p.id === productId);
    if (index !== -1) {
      _products[index].stock = newStock;
      return await saveData('products', _products);
    }
    return false;
  },
  
  // Inventory
  getInventoryItems: () => _products,

  getInventoryStats: () => {
    const totalValue = _products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);
    const criticalItems = _products.filter(p => (p.stock || 0) <= (p.stock_minimo || 0)).length;
    
    return {
      totalValue,
      criticalItems,
      entriesMonth: 142,
      exitsMonth: 385
    };
  },
  
  // Orders
  getOrders: () => _orders,
  getOrderById: (id: string) => _orders.find(o => o.id === id),
  
  saveOrders: async (orders: Order[]) => {
    _orders = orders;
    return await saveData('orders', _orders);
  },

  addOrder: async (order: Order) => {
    _orders.unshift(order);
    return await saveData('orders', _orders);
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    const index = _orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      _orders[index].status = status;
      return await saveData('orders', _orders);
    }
    return false;
  },
  
  // Users
  getUsers: () => _users,
  saveUsers: async (users: User[]) => {
    _users = users;
    return await saveData('users', _users);
  },
  
  // Settings
  getSettings: () => _settings,
  saveSettings: async (settings: any) => {
    _settings = settings;
    return await saveData('settings', _settings);
  },

  // Audit
  getAuditLogs: () => _audit,
  addAuditLog: async (log: any) => {
    _audit.unshift({ ...log, id: Date.now().toString(), timestamp: new Date().toISOString() });
    return await saveData('audit', _audit);
  },

  // System
  getSystemInfo: () => _system,

  // Calculations
  getDashboardStats: () => {
    const totalSales = _orders.reduce((acc, order) => acc + (order.total || 0), 0);
    const orderCount = _orders.length;
    const averageTicket = orderCount > 0 ? totalSales / orderCount : 0;
    
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const newCustomers = _users.filter(user => {
      const regDate = new Date(user.createdAt);
      return regDate >= startOfWeek && user.role === 'customer';
    }).length;

    return {
      totalSales,
      orderCount,
      averageTicket,
      newCustomers
    };
  },

  getInventoryAlerts: () => {
    return _products.filter(p => p.stock <= p.stock_minimo);
  },

  getWeeklySalesData: () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const weeklyData = days.map(day => ({ day, total: 0, orders: 0 }));

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    let hasData = false;
    _orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= startOfWeek) {
        const dayIndex = orderDate.getDay();
        weeklyData[dayIndex].total += (order.total || 0);
        weeklyData[dayIndex].orders += 1;
        hasData = true;
      }
    });

    if (!hasData) {
      // Mock data if no recent orders
      return [
        { day: 'Dom', total: 1200, orders: 15 },
        { day: 'Lun', total: 800, orders: 10 },
        { day: 'Mar', total: 1500, orders: 20 },
        { day: 'Mié', total: 950, orders: 12 },
        { day: 'Jue', total: 2100, orders: 25 },
        { day: 'Vie', total: 3200, orders: 40 },
        { day: 'Sáb', total: 4500, orders: 55 },
      ];
    }

    return weeklyData;
  },

  // Payments
  getPayments: () => {
    return _orders.map(order => {
      const customer = _users.find(u => u.id === order.customerId);
      return {
        id: `TRX-${order.id.split('-')[1] || order.id}`,
        orderId: order.id,
        client: customer ? customer.name : 'Cliente Desconocido',
        amount: order.total,
        method: order.paymentMethod,
        date: order.createdAt,
        status: order.paymentStatus
      };
    });
  },

  getPaymentStats: () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const incomeToday = _orders
      .filter(o => o.createdAt.startsWith(today) && o.paymentStatus === 'paid')
      .reduce((acc, o) => acc + (o.total || 0), 0);
      
    const pendingAmount = _orders
      .filter(o => o.paymentStatus === 'pending')
      .reduce((acc, o) => acc + (o.total || 0), 0);
      
    const failedCount = _orders.filter(o => o.paymentStatus === 'failed').length;
    const totalTransactions = _orders.length;
    
    return {
      incomeToday,
      pendingAmount,
      failedCount,
      totalTransactions
    };
  },

  paginate: <T>(items: T[], page: number, pageSize: number) => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  },

  filterOrders: (status: string | 'all') => {
    if (status === 'all') return _orders;
    return _orders.filter(o => o.status === status);
  },

  // Reporting
  getTopCustomers: (limit = 5) => {
    const customerStats = _orders.reduce((acc, order) => {
      if (!acc[order.customerId]) {
        acc[order.customerId] = { total: 0, count: 0, lastOrder: order.createdAt };
      }
      acc[order.customerId].total += (order.total || 0);
      acc[order.customerId].count += 1;
      if (new Date(order.createdAt) > new Date(acc[order.customerId].lastOrder)) {
        acc[order.customerId].lastOrder = order.createdAt;
      }
      return acc;
    }, {} as Record<string, { total: number; count: number; lastOrder: string }>);

    return Object.entries(customerStats)
      .map(([id, stats]) => {
        const user = _users.find(u => u.id === id);
        return {
          id,
          name: user ? user.name : 'Cliente Desconocido',
          email: user ? user.email : '',
          avatar: user ? user.avatar : '',
          total: stats.total,
          count: stats.count,
          lastOrder: stats.lastOrder,
          status: stats.total > 2000 ? 'VIP' : stats.count > 3 ? 'Fiel' : 'Regular'
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  },

  getTopProducts: (limit = 5) => {
    const productSales = _orders.reduce((acc, order) => {
      order.items.forEach(item => {
        if (!acc[item.productId]) acc[item.productId] = 0;
        acc[item.productId] += item.quantity;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(productSales)
      .map(([id, sales]) => {
        const product = _products.find(p => p.id === id);
        return {
          id,
          name: product ? product.name : 'Producto Desconocido',
          sales,
          total: product ? (product.price || 0) * sales : 0
        };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit);
  },

  searchProducts: (query: string) => {
    const lowerQuery = query.toLowerCase();
    return _products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery)
    );
  }
};
