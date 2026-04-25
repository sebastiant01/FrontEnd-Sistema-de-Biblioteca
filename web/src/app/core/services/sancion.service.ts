import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
 
import { environment } from '../../../environments/environment';
import { SancionCreate, SancionRead, SancionUpdate } from '../../models/sancion.models';
 
@Injectable({ providedIn: 'root' })
export class SancionService {
  private readonly base = `${environment.apiUrl}/sanciones`;
 
  constructor(private readonly http: HttpClient) {}
 
  list(): Observable<SancionRead[]> {
    const params = new HttpParams().set('skip', 0).set('limit', 500);
    return this.http.get<SancionRead[]>(`${this.base}/`, { params });
  }
 
  getById(id: string): Observable<SancionRead> {
    return this.http.get<SancionRead>(`${this.base}/${id}`);
  }
 
  getByUsuario(id_usuario: string): Observable<SancionRead[]> {
    const params = new HttpParams().set('por_usuario', id_usuario);
    return this.http.get<SancionRead[]>(`${this.base}/`, { params });
  }
 
  getByPrestamo(id_prestamo: string): Observable<SancionRead[]> {
    const params = new HttpParams().set('por_prestamo', id_prestamo);
    return this.http.get<SancionRead[]>(`${this.base}/`, { params });
  }
 
  create(body: SancionCreate): Observable<SancionRead> {
    return this.http.post<SancionRead>(`${this.base}/`, body);
  }
 
  update(id: string, body: SancionUpdate): Observable<SancionRead> {
    return this.http.put<SancionRead>(`${this.base}/${id}`, body);
  }
 
  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}
 