export interface LibroCreate {
  codigo_material: string;
  titulo_material: string;
  disponibilidad_material: boolean; 
  descripcion_material?: string | null;
  fecha_material?: string | null; 
  codigo_isbn: string;
  genero_libro: string;
  id_autor: string; 
  id_usuario_crea: string;
}

export interface LibroUpdate {
  codigo_material?: string;
  titulo_material?: string;
  disponibilidad_material?: boolean;
  descripcion_material?: string | null;
  fecha_material?: string | null;
  codigo_isbn?: string;
  genero_libro?: string;
  id_autor?: string;
  id_usuario_edita?: string;
}

export interface LibroRead {
  id_libro: string;
  id_autor: string;
  codigo_material: string;
  titulo_material: string;
  disponibilidad_material: boolean;
  descripcion_material?: string | null;
  fecha_material?: string | null;
  codigo_isbn: string;
  genero_libro: string;
  fecha_creacion: string; 
  fecha_edicion?: string | null;
  id_usuario_crea: string;
  id_usuario_edita?: string | null;
}