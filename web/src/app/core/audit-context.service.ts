import { Injectable, computed, signal } from "@angular/core";

const STORAGE_KEY = 'token';

@Injectable({ providedIn: 'root'})
export class AuditContextService {
    private readonly token = signal<string | null>(this.readStorage());

    readonly tokenUsuario = this.token.asReadonly();

    readonly hasUsuario = computed(() => this.token() !== null);

    private readonly payload = computed(() => {
        const t = this.token();
        if (!t) return null;

        try {
            const payloadBase64 = t.split('.')[1];
            return JSON.parse(atob(payloadBase64));
        } catch (err) {
            console.error("Error extrayendo los datos del token de acceso", err);
            return null;
        }
    });

    readonly usuarioId = computed(() => this.payload()?.sub ?? null);
    readonly usuarioRol = computed(() => this.payload()?.rol ?? null);

    select(token: string): void {
        this.token.set(token);
        localStorage.setItem(STORAGE_KEY, token);
    }

    clear(): void {
        this.token.set(null);
        localStorage.removeItem(STORAGE_KEY);
    }

    private readStorage(): string | null {
        return localStorage.getItem(STORAGE_KEY);
    }
}