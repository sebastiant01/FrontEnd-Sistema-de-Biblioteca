export interface AutorRead {
    id_autor: string;
    nombre_autor: string;
    apellido_autor?: string | null;
    nacionalidad: string;
    activo: boolean;
    fecha_creacion: Date;
    fecha_edicion?: Date | null;
    id_usuario_crea: string;
    id_usuario_edit?: string | null;
}

export interface AutorCreate {
    nombre_autor: string;
    apellido_autor?: string | null;
    nacionalidad: string;
    activo: boolean;
    id_usuario_screa: string;
}

export interface AutorUpdate {
    nombre_autor?: string;
    apellido_autor?: string | null;
    nacionalidad?: string;
    activo?: boolean;
    id_usuario_edita: string;
}