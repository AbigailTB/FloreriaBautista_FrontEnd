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
  nombre: string;
  tamanoBytes: number;
  creadoEn: string;
  enlace: string;
}

export interface BackupsResponse {
  success: boolean;
  message: string;
  data: Backup[] | null;
}

export interface MaintenanceTask {
  tarea: string;
  estado: 'COMPLETADO' | 'ERROR';
  detalle: string;
  mensajeError: string | null;
  ejecutadoEn: string;
  duracionMs: number;
  resultados: string[];
}

export interface MaintenanceResponse {
  success: boolean;
  message: string;
  data: MaintenanceTask[];
}
