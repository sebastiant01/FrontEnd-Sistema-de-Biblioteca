export interface PrestamoRead {
    id_prestamo: string;
    id_usuario: string;
    id_material: string;
    fecha_prestamo: Date;
    estado: string;
    fecha_creacion: Date;
    fecha_edicion?: Date | null;
    id_usuario_crea: string;
    id_usuario_edita?: string | null; 
}

export interface PrestamoCreate {
    id_usuario: string;
    id_material: string;
    id_usuario_crea: string;
}

export interface PrestamoUpdate {
    estado?: string;
    id_usuario_edita: string;
}