import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RevistaCreate, RevistaRead, RevistaUpdate } from '../../models/revista.models';

@Injectable({ providedIn: 'root' })
export class RevistaService {
  private readonly base = `${environment.apiUrl}/revistas`;

  constructor(private readonly http: HttpClient) {}

  list(filtros?: { titulo_material?: string, codigo_material?: string }): Observable<RevistaRead[]> {
    let params = new HttpParams().set('skip', 0).set('limit', 500);
    
    if (filtros?.titulo_material) {
      params = params.set('por_titulo', filtros.titulo_material);
    }
    if (filtros?.codigo_material) {
      params = params.set('codigo', filtros.codigo_material); // Ajustado según tu método getByCodigo
    }
    
    return this.http.get<RevistaRead[]>(`${this.base}/`, { params });
  }

  getById(id: string): Observable<RevistaRead> {
    return this.http.get<RevistaRead>(`${this.base}/${id}`);
  }

  getByCodigo(codigo: string): Observable<RevistaRead> {
    return this.http.get<RevistaRead>(`${this.base}/codigo/${codigo}`);
  }

  getByAutor(id_autor: string): Observable<RevistaRead[]> {
    const params = new HttpParams().set('por_autor', id_autor);
    return this.http.get<RevistaRead[]>(`${this.base}/`, { params });
  }

  searchByTitulo(titulo: string): Observable<RevistaRead[]> {
    const params = new HttpParams().set('por_titulo', titulo);
    return this.http.get<RevistaRead[]>(`${this.base}/`, { params });
  }

  getDisponibles(): Observable<RevistaRead[]> {
    const params = new HttpParams().set('solo_disponibles', true);
    return this.http.get<RevistaRead[]>(`${this.base}/`, { params });
  }

  create(body: RevistaCreate): Observable<RevistaRead> {
    return this.http.post<RevistaRead>(`${this.base}/`, body);
  }

  update(id: string, body: RevistaUpdate): Observable<RevistaRead> {
    return this.http.put<RevistaRead>(`${this.base}/${id}`, body);
  }

  updateDisponibilidad(id: string, body: RevistaUpdate): Observable<RevistaRead> {
    return this.http.patch<RevistaRead>(`${this.base}/${id}/disponibilidad`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}