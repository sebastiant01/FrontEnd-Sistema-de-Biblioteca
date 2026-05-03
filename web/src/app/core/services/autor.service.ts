import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AutorCreate, AutorRead, AutorUpdate } from '../../models/autor.models';

@Injectable({ providedIn: 'root'})
export class AutorService {
    private readonly base = `${environment.apiUrl}/autores`;

    constructor(private readonly http:HttpClient) {}

    list(): Observable<AutorRead[]> {
        const params = new HttpParams().set('skip', 0).set('limit', 250);
        return this.http.get<AutorRead[]>(`${this.base}`, { params });
    }
    
    search(termino: string): Observable<AutorRead[]> {
        const params = new HttpParams().set('skip', 0).set('limit', 250);
        return this.http.get<AutorRead[]>(`${this.base}/buscar?q=${termino}`, { params });
    }

    getById(id: string): Observable<AutorRead> {
        return this.http.get<AutorRead>(`${this.base}/${id}`);
    }

    create(body: AutorCreate): Observable<AutorRead> {
        return this.http.post<AutorRead>(`${this.base}`, body);
    }

    update(id: string, body: AutorUpdate): Observable<AutorRead> {
        return this.http.put<AutorRead>(`${this.base}/${id}`, body);
    }

    delete(id: string): Observable <void> {
        return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
    }
}