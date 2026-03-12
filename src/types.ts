export interface HealthCheckResponse {
  success: boolean;
  message: string;
  data: {
    conectado: boolean;
    estado: string;
    baseDatos: string;
    servidor: string;
    versionPostgres: string;
    conexionesActivas: number;
    conexionesMaximas: number;
    tiempoRespuesta: string;
    tiempoActividad: string;
    mensajeError: string | null;
    consultadoEn: string;
  };
}

export interface Backup {
  id: string;
  date: string;
  time: string;
  type: string;
  user: string;
  status: 'Completado' | 'En progreso' | 'Error';
}

export interface BackupsResponse {
  success: boolean;
  message: string;
  data: Backup[] | null;
}
