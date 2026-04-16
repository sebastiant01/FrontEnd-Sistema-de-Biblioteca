import { HttpErrorResponse, HttpRequest } from "@angular/common/http";
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AutorService } from '../../core/services/autor.service';
import { AutorRead, AutorUpdate } from '../../models/autor.models';
import { AuditContextService } from "../../core/audit-context.service";

export interface AutorDialogData{
    mode: 'create' | 'edit';
    row?: AutorRead;
}

@Component({
    selector: 'app-autor-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSnackBarModule,
    ],
    templateUrl: './autor-dialog.html',
})
export class AutorDialogComponent {
    private readonly fb = inject(FormBuilder);
    private readonly autorService = inject(AutorService);
    private readonly dialogRef = inject(MatDialogRef<AutorDialogComponent, boolean>);
    private readonly snack = inject(MatSnackBar);
    private readonly auditService = inject(AuditContextService);

    readonly data = inject<AutorDialogData>(MAT_DIALOG_DATA);

    readonly form = this.fb.nonNullable.group({
        nombre_autor: ['', Validators.required],
        apellido_autor: new FormControl<string | null>(null),
        nacionalidad_autor: ['', Validators.required],
        activo: [true],
    });

    constructor () {
        if (this.data.mode === 'edit' && this.data.row) {
            const r = this.data.row;
            this.form.patchValue({
                nombre_autor: r.nombre_autor,
                apellido_autor: r.apellido_autor,
                nacionalidad_autor: r.nacionalidad,
                activo: r.activo,
            });
        }
    }

    cancel(): void{
        this.dialogRef.close(false);
    }

    save(): void {
        const idUsuarioAuditoria = this.auditService.usuarioId()!;
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const v = this.form.getRawValue();
        const apellidoLimpio = v.apellido_autor?.trim() ? v.apellido_autor.trim() : null;
        if (this.data.mode === 'create') {
            this.autorService.create({
                nombre_autor: v.nombre_autor,
                apellido_autor: v.apellido_autor,
                nacionalidad: v.nacionalidad_autor,
                activo: v.activo,
                id_usuario_crea: idUsuarioAuditoria,
            }).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
            });
            return;
        }
        const id = this.data.row!.id_autor;
        const body: AutorUpdate = {
            nombre_autor: v.nombre_autor,
            apellido_autor: v.apellido_autor,
            nacionalidad: v.nacionalidad_autor,
            activo: v.activo,
            id_usuario_edita: idUsuarioAuditoria,
        };
        this.autorService.update(id, body).subscribe({
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