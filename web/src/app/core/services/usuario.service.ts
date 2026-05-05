import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UsuarioCreate, UsuarioRead, UsuarioUpdate } from '../../models/usuario.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
    private readonly base = `${environment.apiUrl}/usuarios`;

    constructor(private readonly http: HttpClient) {}

    list(filtros?: { criterio: string, valor: string }) {
        if (!filtros || !filtros.valor.trim()) {
            return this.http.get<UsuarioRead[]>(`${this.base}`);
        }

        const valor = filtros.valor.trim();
        let url = `${this.base}`;

        switch (filtros.criterio) {
            case 'id_usuario':
                url += `/${valor}`;
                break;
            case 'documento':
                url += `/documento/${valor}`;
                break;
            case 'email':
                url += `/email/${valor}`;
                break;
            case 'telefono':
                url += `/telefono/${valor}`;
                break;
            case 'username':
                url += `/username/${valor}`;
                break;
            case 'termino':
            default:
                url += `/buscar`;
                break;
        }

        return this.http.get<UsuarioRead[]>(url);
    }

    search(termino: string): Observable<UsuarioRead[]> {
        const params = new HttpParams().set('skip', 0).set('limit', 300);
        return this.http.get<UsuarioRead[]>(`${this.base}/buscar`, { params });
    }

    /* getById(id: string): Observable<UsuarioRead> {
        return this.http.get<UsuarioRead>(`${this.base}/${id}`);
    }
    
    getByUsername(username: string): Observable<UsuarioRead> {
        return this.http.get<UsuarioRead>(`${this.base}/username/${username}`);
    }

    getByEmail(email: string): Observable<UsuarioRead> {
        return this.http.get<UsuarioRead>(`${this.base}/email/${email}`);
    }

    getByDni(documento: string): Observable<UsuarioRead> {
        return this.http.get<UsuarioRead>(`${this.base}/documento/${documento}`);
    }

    getByPhone(telefono: string): Observable<UsuarioRead> {
        return this.http.get<UsuarioRead>(`${this.base}/telefono/${telefono}`);
    } */

    create(body: UsuarioCreate): Observable<UsuarioRead> {
        return this.http.post<UsuarioRead>(`${this.base}`, body);
    }

    update(id: string, body: UsuarioUpdate): Observable<UsuarioRead> {
        return this.http.put<UsuarioRead>(`${this.base}/${id}`, body);
    }

    delete(id: string): Observable <void> {
        return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
    }

    login(credenciales: { username: string, contrasena: string}) {
        return this.http.post<{ status: string, message: string, id_usuario: string, nombre: string, apellido: string, username: string, rol: string }>(
            `${environment.apiUrl}/auth/login`,
            credenciales
        );
    }
}