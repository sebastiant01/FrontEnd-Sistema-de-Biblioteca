export interface PeriodicoCreate {
  codigo_material: string;
  titulo_material: string;
  disponibilidad_material: boolean; 
  descripcion_material?: string | null;
  fecha_material?: string | null;
  ciudad_publicacion: string;
  seccion_periodico: string;
  id_autor: string;
  id_usuario_crea: string;
}

export interface PeriodicoUpdate {
  codigo_material?: string;
  titulo_material?: string;
  disponibilidad_material?: boolean;
  descripcion_material?: string | null;
  fecha_material?: string | null;
  ciudad_publicacion?: string;
  seccion_periodico?: string;
  id_autor?: string;
  id_usuario_edita?: string;
}

export interface PeriodicoRead {
  id_periodico: string;
  id_autor: string;
  codigo_material: string;
  titulo_material: string;
  disponibilidad_material: boolean;
  descripcion_material?: string | null;
  fecha_material?: string | null;
  ciudad_publicacion: string;
  seccion_periodico: string;
  fecha_creacion: string; 
  fecha_edicion?: string | null;
  id_usuario_crea: string;
  id_usuario_edita?: string | null;
}