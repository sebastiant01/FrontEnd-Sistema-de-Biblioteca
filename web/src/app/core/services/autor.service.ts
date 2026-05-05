import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AutorCreate, AutorRead, AutorUpdate } from '../../models/autor.models';

@Injectable({ providedIn: 'root'})
export class AutorService {
    private readonly base = `${environment.apiUrl}/autores`;

    constructor(private readonly http:HttpClient) {}

    list(filtros?: { criterio: string, valor: string }) {
        if (!filtros || !filtros.valor.trim()) {
            return this.http.get<AutorRead[]>(`${this.base}`);
        }

        const valor = filtros.valor.trim();
        let url = `${this.base}`;

        switch (filtros.criterio) {
            case 'id_autor':
                url += `/${valor}`;
                break;
            case 'termino':
            default:
                url += `/buscar`;
                break;
        }

        return this.http.get<AutorRead[]>(url);
    }
    
    /*search(termino: string): Observable<AutorRead[]> {
        const params = new HttpParams().set('skip', 0).set('limit', 250);
        return this.http.get<AutorRead[]>(`${this.base}/buscar`, { params });
    }

    getById(id: string): Observable<AutorRead> {
        return this.http.get<AutorRead>(`${this.base}/${id}`);
    }*/

    create(body: AutorCreate): Observable<AutorRead> {
        return this.http.post<AutorRead>(`${this.base}`, body);
    }

    update(id: string, body: AutorUpdate): Observable<AutorRead> {
        return this.http.put<AutorRead>(`${this.base}/${id}`, body);
    }

    delete(idAutor: string, idUsuarioEdita: string): Observable<void> {
        const params = new HttpParams().set('id_usuario_edita', idUsuarioEdita);
        
        return this.http.delete<void>(`${this.base}/${idAutor}`, { params });
    }
}