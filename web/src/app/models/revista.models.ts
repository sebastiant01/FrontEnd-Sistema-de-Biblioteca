export interface RevistaCreate {
  codigo_material: string;
  titulo_material: string;
  disponibilidad_material: boolean;
  descripcion_material?: string | null;
  fecha_material?: string | null;
  volumen: number;
  numero_edicion: number;
  id_autor: string;
  id_usuario_crea: string;
}

export interface RevistaUpdate {
  codigo_material?: string;
  titulo_material?: string;
  disponibilidad_material?: boolean;
  descripcion_material?: string | null;
  fecha_material?: string | null;
  volumen?: number;
  numero_edicion?: number;
  id_autor?: string;
  id_usuario_edita?: string;
}


export interface RevistaRead {
  id_revista: string;
  id_material: string;
  id_autor: string;
  codigo_material: string;
  titulo_material: string;
  disponibilidad_material: boolean;
  descripcion_material?: string | null;
  fecha_material?: string | null;
  volumen: number;
  numero_edicion: number;
  fecha_creacion: string;
  fecha_edicion?: string | null;
  id_usuario_crea: string;
  id_usuario_edita?: string | null;
}