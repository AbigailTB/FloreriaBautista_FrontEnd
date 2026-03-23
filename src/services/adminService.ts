import {
  HealthCheckResponse,
  BackupsResponse,
  MaintenanceResponse,
  DatabaseMonitorResponse,
  Product,
  ProductDetail,
  ProductBody,
  Order,
  ApiResponse,
  SingleResponse,
  MeResponse,
  User,
  Flower,
  FlowerBody,
  ImportProductsResponse,
} from '../types';

const API_BASE = '/api/admin';
const TOKEN_URL = '/api/dev/token';

// Cache del token para evitar múltiples llamadas seguidas
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

const getToken = async (): Promise<string> => {
  const now = Date.now();
  // Reusar token si fue obtenido hace menos de 5 minutos
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }
  const response = await fetch(TOKEN_URL);
  if (!response.ok) throw new Error('No se pudo obtener el token de autenticación');
  const token = (await response.text()).trim();
  cachedToken = token;
  tokenExpiry = now + 5 * 60 * 1000; // 5 minutos
  return token;
};

const authHeaders = async () => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${await getToken()}`,
});

export const AdminService = {
  // ─── Base de datos ────────────────────────────────────────────
  getDatabaseHealth: async (): Promise<HealthCheckResponse> => {
    const res = await fetch(`${API_BASE}/database/health`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener estado de la base de datos');
    return res.json();
  },

  runMaintenance: async (): Promise<MaintenanceResponse> => {
    const res = await fetch(`${API_BASE}/database/mantenimiento`, {
      method: 'POST',
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al ejecutar mantenimiento');
    return res.json();
  },

  getDatabaseMonitor: async (): Promise<DatabaseMonitorResponse> => {
    const res = await fetch(`${API_BASE}/database/monitor`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener datos del monitor de base de datos');
    return res.json();
  },

  // ─── Respaldos ────────────────────────────────────────────────
  getBackups: async (): Promise<BackupsResponse> => {
    const res = await fetch(`${API_BASE}/backups`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener lista de respaldos');
    return res.json();
  },

  getDriveBackups: async (): Promise<BackupsResponse> => {
    const res = await fetch(`${API_BASE}/backups/drive`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener respaldos de Drive');
    return res.json();
  },

  createFullBackup: async (descripcion: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/backups/full`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ descripcion }),
    });
    if (!res.ok) throw new Error('Error al crear respaldo completo');
    return res.json();
  },

  createTableBackup: async (
    nombreTabla: string,
    descripcion: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/backups/tabla`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ nombreTabla, descripcion }),
    });
    if (!res.ok) throw new Error('Error al crear respaldo de tabla');
    return res.json();
  },

  saveBackupConfig: async (
    frecuencia: string,
    hora: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/backups/config`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ frecuencia, hora }),
    });
    if (!res.ok) throw new Error('Error al guardar configuración de respaldos');
    return res.json();
  },

  restoreBackup: async (backupId: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/backups/${backupId}/restore`, {
      method: 'POST',
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  // ─── Productos públicos ───────────────────────────────────────
  getProducts: async (params: {
    busqueda?: string;
    categoria?: string;
    coleccion?: string;
    page?: number;
    size?: number;
  } = {}): Promise<ApiResponse<Product>> => {
    const query = new URLSearchParams();
    if (params.busqueda !== undefined) query.set('busqueda', params.busqueda);
    if (params.categoria !== undefined) query.set('categoria', params.categoria);
    if (params.coleccion !== undefined) query.set('coleccion', params.coleccion);
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));
    const qs = query.toString();
    const res = await fetch(`/api/products${qs ? `?${qs}` : ''}`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  },

  // ─── Productos admin ──────────────────────────────────────────
  getAdminProducts: async (params: {
    busqueda?: string;
    estado?: string;
    page?: number;
    size?: number;
  } = {}): Promise<ApiResponse<Product>> => {
    const query = new URLSearchParams();
    if (params.busqueda !== undefined) query.set('busqueda', params.busqueda);
    if (params.estado !== undefined) query.set('estado', params.estado);
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));
    const qs = query.toString();
    const res = await fetch(`${API_BASE}/products${qs ? `?${qs}` : ''}`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener productos admin');
    return res.json();
  },

  getAdminProductById: async (productId: string): Promise<SingleResponse<ProductDetail>> => {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  createAdminProduct: async (body: ProductBody): Promise<ApiResponse<Product>> => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Error al crear producto');
    return res.json();
  },

  updateAdminProduct: async (productId: string, body: ProductBody): Promise<ApiResponse<Product>> => {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'PUT',
      headers: await authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Error al actualizar producto');
    return res.json();
  },

  // ─── Exportación ──────────────────────────────────────────────
  exportAdminProducts: async (): Promise<Blob> => {
    const res = await fetch(`${API_BASE}/export/products`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.blob();
  },

  exportAdminInventory: async (): Promise<Blob> => {
    const res = await fetch(`${API_BASE}/export/inventory`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.blob();
  },

  // ─── Importación ──────────────────────────────────────────────
  importAdminProducts: async (file: File): Promise<ImportProductsResponse> => {
    const form = new FormData();
    form.append('archivo', file);
    const res = await fetch(`${API_BASE}/import/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await getToken()}` },
      body: form,
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  importAdminInventory: async (file: File): Promise<void> => {
    const form = new FormData();
    form.append('archivo', file);
    const res = await fetch(`${API_BASE}/import/inventory`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await getToken()}` },
      body: form,
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  },

  // ─── Usuario actual ───────────────────────────────────────────
  getCurrentUser: async (): Promise<MeResponse> => {
    const res = await fetch('/api/users/me', {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  // ─── Órdenes admin ────────────────────────────────────────────
  getAdminOrders: async (params: {
    estado?: string;
    desde?: string;
    hasta?: string;
    page?: number;
    size?: number;
  } = {}): Promise<ApiResponse<Order>> => {
    const query = new URLSearchParams();
    if (params.estado !== undefined) query.set('estado', params.estado);
    if (params.desde !== undefined) query.set('desde', params.desde);
    if (params.hasta !== undefined) query.set('hasta', params.hasta);
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));
    const qs = query.toString();
    const res = await fetch(`${API_BASE}/orders${qs ? `?${qs}` : ''}`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener órdenes');
    return res.json();
  },

  // ─── Flores / Insumos ─────────────────────────────────────────
  getFlowers: async (params: {
    busqueda?: string;
    color?: string;
    bajoMinimo?: boolean;
    estado?: string;
    page?: number;
    size?: number;
  } = {}): Promise<ApiResponse<Flower>> => {
    const query = new URLSearchParams();
    if (params.busqueda !== undefined) query.set('busqueda', params.busqueda);
    if (params.color !== undefined) query.set('color', params.color);
    if (params.bajoMinimo !== undefined) query.set('bajoMinimo', String(params.bajoMinimo));
    if (params.estado !== undefined) query.set('estado', params.estado);
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));
    const qs = query.toString();
    const res = await fetch(`${API_BASE}/flowers${qs ? `?${qs}` : ''}`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener flores/insumos');
    return res.json();
  },

  createFlower: async (body: FlowerBody): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/flowers`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  // ─── Usuarios admin ───────────────────────────────────────────
  getAdminUsers: async (params: {
    busqueda?: string;
    rol?: string;
    estado?: string;
    page?: number;
    size?: number;
  } = {}): Promise<ApiResponse<User>> => {
    const query = new URLSearchParams();
    if (params.busqueda !== undefined) query.set('busqueda', params.busqueda);
    if (params.rol !== undefined) query.set('rol', params.rol);
    if (params.estado !== undefined) query.set('estado', params.estado);
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));
    const qs = query.toString();
    const res = await fetch(`${API_BASE}/users${qs ? `?${qs}` : ''}`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  getAdminUserById: async (userId: string): Promise<ApiResponse<User>> => {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  updateAdminUserStatus: async (
    userId: string,
    activo: boolean,
    motivo: string
  ): Promise<void> => {
    const res = await fetch(`${API_BASE}/users/${userId}/status`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ activo, motivo }),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  },

  updateAdminUserRoles: async (userId: string, roles: string[]): Promise<void> => {
    const res = await fetch(`${API_BASE}/users/${userId}/roles`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ roles }),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  },
};