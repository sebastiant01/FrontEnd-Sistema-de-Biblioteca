import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PeriodicoRead, PeriodicoCreate, PeriodicoUpdate } from '../../models/periodico.models';

@Injectable({ providedIn: 'root' })
export class PeriodicoService {
  private readonly base = `${environment.apiUrl}/periodicos`;

  constructor(private readonly http: HttpClient) {}

  list(filters?: {
    skip?: number;
    limit?: number;
    por_titulo?: string;
    por_ciudad?: string;
    por_seccion?: string;
    solo_disponibles?: boolean;
  }): Observable<PeriodicoRead[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.skip !== undefined) params = params.set('skip', filters.skip);
      if (filters.limit !== undefined) params = params.set('limit', filters.limit);
      if (filters.por_titulo) params = params.set('por_titulo', filters.por_titulo);
      if (filters.por_ciudad) params = params.set('por_ciudad', filters.por_ciudad);
      if (filters.por_seccion) params = params.set('por_seccion', filters.por_seccion);
      if (filters.solo_disponibles !== undefined)
        params = params.set('solo_disponibles', filters.solo_disponibles);
    }

    return this.http.get<PeriodicoRead[]>(`${this.base}/`, { params });
  }

  getById(id: string): Observable<PeriodicoRead> {
    return this.http.get<PeriodicoRead>(`${this.base}/id/${id}`);
  }

  getByCode(code: string): Observable<PeriodicoRead> {
    return this.http.get<PeriodicoRead>(`${this.base}/codigo/${code}`);
  }

  getByAuthor(authorId: string): Observable<PeriodicoRead[]> {
    return this.http.get<PeriodicoRead[]>(`${this.base}/autor/${authorId}`);
  }

  create(body: PeriodicoCreate): Observable<PeriodicoRead> {
    return this.http.post<PeriodicoRead>(`${this.base}/`, body);
  }

  update(id: string, body: PeriodicoUpdate): Observable<PeriodicoRead> {
    return this.http.put<PeriodicoRead>(`${this.base}/${id}`, body);
  }

  patchAvailability(id: string, body: PeriodicoUpdate): Observable<PeriodicoRead> {
    return this.http.patch<PeriodicoRead>(`${this.base}/${id}/disponibilidad`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}