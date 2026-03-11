import productsData from '../data/products.json';
import ordersData from '../data/orders.json';
import usersData from '../data/users.json';
import settingsData from '../data/settings.json';
import auditData from '../data/audit.json';
import systemData from '../data/system.json';

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
  image: string;
  createdAt: string;
  isInventoryOnly?: boolean;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
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
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
  avatar: string;
}

// Data Service
export const DataService = {
  // Products
  getProducts: (includeInventory = false) => {
    const products = productsData as Product[];
    if (includeInventory) return products;
    return products.filter(p => !p.isInventoryOnly);
  },
  
  // Inventory
  getInventoryItems: () => {
    const products = productsData as Product[];
    return products;
  },

  getInventoryStats: () => {
    const products = productsData as Product[];
    const totalValue = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);
    const criticalItems = products.filter(p => (p.stock || 0) <= (p.stock_minimo || 0)).length;
    
    return {
      totalValue,
      criticalItems,
      entriesMonth: 142,
      exitsMonth: 385
    };
  },
  
  // Orders
  getOrders: () => ordersData as Order[],
  getOrderById: (id: string) => (ordersData as Order[]).find(o => o.id === id),
  
  // Users
  getUsers: () => usersData as User[],
  
  // Settings
  getSettings: () => settingsData,

  // Audit
  getAuditLogs: () => auditData,

  // System
  getSystemInfo: () => systemData,

  // Calculations
  getDashboardStats: () => {
    const orders = ordersData as Order[];
    const users = usersData as User[];
    
    const totalSales = orders.reduce((acc, order) => acc + (order.total || 0), 0);
    const orderCount = orders.length;
    const averageTicket = orderCount > 0 ? totalSales / orderCount : 0;
    
    // New customers (registered this week)
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const newCustomers = users.filter(user => {
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
    const products = productsData as Product[];
    return products.filter(p => p.stock <= p.stock_minimo);
  },

  getWeeklySalesData: () => {
    const orders = ordersData as Order[];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const weeklyData = days.map(day => ({ day, total: 0, orders: 0 }));

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate >= startOfWeek) {
        const dayIndex = orderDate.getDay();
        weeklyData[dayIndex].total += (order.total || 0);
        weeklyData[dayIndex].orders += 1;
      }
    });

    return weeklyData;
  },

  // Payments
  getPayments: () => {
    const orders = ordersData as Order[];
    const users = usersData as User[];
    
    return orders.map(order => {
      const customer = users.find(u => u.id === order.customerId);
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
    const orders = ordersData as Order[];
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const incomeToday = orders
      .filter(o => o.createdAt.startsWith(today) && o.paymentStatus === 'paid')
      .reduce((acc, o) => acc + (o.total || 0), 0);
      
    const pendingAmount = orders
      .filter(o => o.paymentStatus === 'pending')
      .reduce((acc, o) => acc + (o.total || 0), 0);
      
    const failedCount = orders.filter(o => o.paymentStatus === 'failed').length;
    const totalTransactions = orders.length;
    
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
    const orders = ordersData as Order[];
    if (status === 'all') return orders;
    return orders.filter(o => o.status === status);
  },

  // Reporting
  getTopCustomers: (limit = 5) => {
    const orders = ordersData as Order[];
    const users = usersData as User[];
    
    const customerStats = orders.reduce((acc, order) => {
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
        const user = users.find(u => u.id === id);
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
    const orders = ordersData as Order[];
    const products = productsData as Product[];
    
    const productSales = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        if (!acc[item.productId]) acc[item.productId] = 0;
        acc[item.productId] += item.quantity;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(productSales)
      .map(([id, sales]) => {
        const product = products.find(p => p.id === id);
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
    const products = productsData as Product[];
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery)
    );
  }
};
