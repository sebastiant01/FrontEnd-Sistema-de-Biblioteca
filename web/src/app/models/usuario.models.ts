export interface UsuarioRead {
    id_usuario: string;
    nombre: string;
    apellido: string;
    documento: string;
    email: string;
    telefono: string;
    rol: string;
    fecha_creacion: Date;
    fecha_edicion?: Date | null;
    id_usuario_crea?: string;
    id_usuario_edita?: string | null;
}

export interface UsuarioCreate {
    nombre: string;
    apellido: string;
    documento: string;
    email: string;
    telefono: string;
    contrasena: string;
    rol: string;
    id_usuario_crea?: string;
}

export interface UsuarioUpdate {
    nombre?: string;
    apellido?: string;
    documento?: string;
    email?: string;
    telefono?: string;
    contrasena?: string;
    rol?: string;
    id_usuario_edita: string;
}