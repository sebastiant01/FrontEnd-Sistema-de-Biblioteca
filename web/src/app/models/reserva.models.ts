export type EstadoReserva = 'pendiente' | 'completada' | 'cancelada';
export interface ReservaCreate {
  fecha_reserva: string;
  estado_reserva: EstadoReserva;
  id_usuario: string;
  id_material: string;
  id_usuario_crea: string;
}

export interface ReservaUpdate {
  fecha_reserva?: string;
  estado_reserva?: EstadoReserva;
  id_usuario_edita?: string;
}


export interface ReservaRead {
  id_reserva: string;
  fecha_reserva: string;
  estado_reserva: EstadoReserva;
  id_usuario: string;
  id_material: string;
  fecha_creacion: string;
  fecha_edicion?: string | null;
  id_usuario_crea: string;
  id_usuario_edita?: string | null;
}