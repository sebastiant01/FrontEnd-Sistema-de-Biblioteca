import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
 
import { environment } from '../../../environments/environment';
import { ReservaCreate, ReservaRead, ReservaUpdate, EstadoReserva } from '../../models/reserva.models';
 
@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly base = `${environment.apiUrl}/reservas`;
 
  constructor(private readonly http: HttpClient) {}
 
  list(): Observable<ReservaRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<ReservaRead[]>(`${this.base}/`, { params });
  }
 
  getById(id: string): Observable<ReservaRead> {
    return this.http.get<ReservaRead>(`${this.base}/${id}`);
  }
 
  getByUsuario(id_usuario: string): Observable<ReservaRead[]> {
    const params = new HttpParams().set('por_usuario', id_usuario);
    return this.http.get<ReservaRead[]>(`${this.base}/`, { params });
  }
 
  getByMaterial(id_material: string): Observable<ReservaRead[]> {
    const params = new HttpParams().set('por_material', id_material);
    return this.http.get<ReservaRead[]>(`${this.base}/`, { params });
  }
 
  getByEstado(estado: EstadoReserva): Observable<ReservaRead[]> {
    const params = new HttpParams().set('por_estado', estado);
    return this.http.get<ReservaRead[]>(`${this.base}/`, { params });
  }
 
  create(body: ReservaCreate): Observable<ReservaRead> {
    return this.http.post<ReservaRead>(`${this.base}/`, body);
  }
 
  update(id: string, body: ReservaUpdate): Observable<ReservaRead> {
    return this.http.put<ReservaRead>(`${this.base}/${id}`, body);
  }
 
  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
 