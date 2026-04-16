export interface SancionCreate {
  fecha_inicio: string;
  dias_sancion: number;
  motivo: string;
  id_usuario: string;
  id_prestamo: string;
  id_usuario_crea: string;
}

export interface SancionUpdate {
  fecha_inicio?: string;
  dias_sancion?: number;
  motivo?: string;
  id_usuario_edita?: string;
}

export interface SancionRead {
  id_sancion: string;
  fecha_inicio: string;
  dias_sancion: number;
  motivo: string;
  id_usuario: string;
  id_prestamo: string;
  fecha_creacion: string;
  fecha_edicion?: string | null;
  id_usuario_crea: string;
  id_usuario_edita?: string | null;
}