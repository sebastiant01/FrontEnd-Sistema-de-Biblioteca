import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PrestamoCreate, PrestamoRead, PrestamoUpdate } from '../../models/prestamo.models';

@Injectable({ providedIn: 'root'})
export class PrestamoService {
    private readonly base = `${environment.apiUrl}/prestamos`;

    constructor(private readonly http: HttpClient) {}

    list(): Observable<PrestamoRead[]> {
        const params = new HttpParams().set('skip', 0).set('limit', 200);
        return this.http.get<PrestamoRead[]>(`${this.base}`, {params });
    }

    getById(id: string): Observable<PrestamoRead> {
        return this.http.get<PrestamoRead>(`${this.base}/${id}`);
    }

    getByUserId(id_usu: string): Observable<PrestamoRead[]> {
        const params = new HttpParams().set('skip', 0).set('limit', 200);
        return this.http.get<PrestamoRead[]>(`${this.base}/usuario/${id_usu}`, { params });
    }

    getActiveByUserId(id_usu: string): Observable<PrestamoRead[]> {
        const params = new HttpParams().set('skip', 0).set('limit', 200);
        return this.http.get<PrestamoRead[]>(`${this.base}/usuario/${id_usu}/activos`, { params });
    }

    getByMaterialId(id_mat: string): Observable<PrestamoRead[]> {
        const params = new HttpParams().set('skip', 0).set('limit', 200);
        return this.http.get<PrestamoRead[]>(`${this.base}/material/${id_mat}`, { params });
    }

    create(body: PrestamoCreate): Observable<PrestamoRead> {
        return this.http.post<PrestamoRead>(`${this.base}`, body);
    }

    update(id: string, body: PrestamoUpdate): Observable<PrestamoRead> {
        return this.http.put<PrestamoRead>(`${this.base}/${id}`, body);
    }

    delete(id: string): Observable <void> {
        return this.http.delete(`${this.base}/${id}`, { observe: 'response'}).pipe(map(() => undefined));
    }
}