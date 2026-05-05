import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioRead, UsuarioUpdate } from '../../models/usuario.models';
import { AuditContextService } from "../../core/audit-context.service";


export interface UsuarioDialogData {
    mode: 'create' | 'edit';
    row?: UsuarioRead;
}

@Component({
    selector: 'app-usuario-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSnackBarModule,
    ],
    templateUrl: './usuario-dialog.html',
})

export class UsuarioDialogComponent {
    private readonly fb = inject(FormBuilder);
    private readonly usuarioService = inject(UsuarioService);
    private readonly dialogRef = inject(MatDialogRef<UsuarioDialogComponent, boolean>);
    private readonly snack = inject(MatSnackBar);
    private readonly auditService = inject(AuditContextService);

    readonly data = inject<UsuarioDialogData>(MAT_DIALOG_DATA);


    readonly form = this.fb.nonNullable.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        documento: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefono: ['', Validators.required],
        contrasena: [''],
        rol: ['', Validators.required],
    });

    constructor() {
        if (this.data.mode == 'edit' && this.data.row) {
            const r = this.data.row;
            this.form.patchValue({
                nombre: r.nombre,
                apellido: r.apellido,
                documento: r.documento,
                email: r.email,
                telefono: r.telefono,
                contrasena: '',
                rol: r.rol,
            });
        }
        if (this.data.mode == 'create') {
            this.form.controls.contrasena.setValidators([Validators.required, Validators.minLength(10)]);
        }
    }

    cancel(): void {
        this.dialogRef.close(false);
    }

    save(): void {
        const idUsuarioAuditoria = this.auditService.usuarioId()!;
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const v = this.form.getRawValue();
        if (this.data.mode === 'create') {
            this.usuarioService.create({
                nombre: v.nombre,
                apellido: v.apellido,
                documento: v.documento,
                email: v.email,
                telefono: v.telefono,
                contrasena: v.contrasena,
                rol: v.rol,
                id_usuario_crea: idUsuarioAuditoria ?? '',
            }).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', {duration: 6000}),
            });
            return;
        }
        const id = this.data.row!.id_usuario;
        const body: UsuarioUpdate = {
            nombre: v.nombre,
            apellido: v.apellido,
            documento: v.documento,
            email: v.email,
            telefono: v.telefono,
            contrasena: v.contrasena,
            rol: v.rol,
            id_usuario_edita: idUsuarioAuditoria,
        };
        if (v.contrasena?.trim()) {
            body.contrasena = v.contrasena;
        }
        this.usuarioService.update(id, body).subscribe({
            next: () => this.dialogRef.close(true),
            error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', {duration: 6000}),
        });
    }

    private msg(err: HttpErrorResponse): string {
        const d = err.error?.detail;
        if (typeof d === 'string') return d;
        if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
        return err.message;
    }
}