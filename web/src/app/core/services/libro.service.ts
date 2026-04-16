import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LibroRead, LibroCreate, LibroUpdate } from '../../models/libro.models';

@Injectable({ providedIn: 'root' })
export class LibroService {
  private readonly base = `${environment.apiUrl}/libros`;

  constructor(private readonly http: HttpClient) {}

  list(filters?: {
    skip?: number;
    limit?: number;
    por_titulo?: string;
    por_genero?: string;
    solo_disponibles?: boolean;
  }): Observable<LibroRead[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.skip !== undefined) params = params.set('skip', filters.skip);
      if (filters.limit !== undefined) params = params.set('limit', filters.limit);
      if (filters.por_titulo) params = params.set('por_titulo', filters.por_titulo);
      if (filters.por_genero) params = params.set('por_genero', filters.por_genero);
      if (filters.solo_disponibles !== undefined)
        params = params.set('solo_disponibles', filters.solo_disponibles);
    }

    return this.http.get<LibroRead[]>(`${this.base}/`, { params });
  }

  getById(id: string): Observable<LibroRead> {
    return this.http.get<LibroRead>(`${this.base}/id/${id}`);
  }

  getByCode(code: string): Observable<LibroRead> {
    return this.http.get<LibroRead>(`${this.base}/codigo/${code}`);
  }

  getByAuthor(authorId: string): Observable<LibroRead[]> {
    return this.http.get<LibroRead[]>(`${this.base}/autor/${authorId}`);
  }

  create(body: LibroCreate): Observable<LibroRead> {
    return this.http.post<LibroRead>(`${this.base}/`, body);
  }

  update(id: string, body: LibroUpdate): Observable<LibroRead> {
    return this.http.put<LibroRead>(`${this.base}/${id}`, body);
  }

  patchAvailability(id: string, body: LibroUpdate): Observable<LibroRead> {
    return this.http.patch<LibroRead>(`${this.base}/${id}/disponibilidad`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}