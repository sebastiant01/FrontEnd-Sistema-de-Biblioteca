import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UsuarioCreate, UsuarioRead, UsuarioUpdate } from '../../models/usuario.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
    private readonly base = `${environment.apiUrl}/usuarios`;

    constructor(private readonly http: HttpClient) {}

    list(): Observable<UsuarioRead[]> {
        const params = new HttpParams().set('skip', 0).set('limit', 300);
        return this.http.get<UsuarioRead[]>(`${this.base}`, { params });
    }

    search(termino: string): Observable<UsuarioRead[]> {
        const params = new HttpParams().set('skip', 0).set('limit', 300);
        return this.http.get<UsuarioRead[]>(`${this.base}/buscar`, { params });
    }

    getById(id: string): Observable<UsuarioRead> {
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
    }

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