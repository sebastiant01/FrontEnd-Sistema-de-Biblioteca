import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from "@angular/material/select";

import { PrestamoService } from '../../core/services/prestamo.service';
import { PrestamoRead, PrestamoUpdate } from '../../models/prestamo.models';
import { AuditContextService } from "../../core/audit-context.service";

export interface PrestamoDialogData {
    mode: 'create' | 'edit';
    row?: PrestamoRead;
}

const ESTADOS_PRESTAMO = ['Activa', 'Devuelta', 'Retrasada'];

@Component({
    selector: 'app-prestamo-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatSelectModule,
    ],
    templateUrl: './prestamo-dialog.html',
})
export class PrestamoDialogComponent {
    private readonly fb = inject(FormBuilder);
    private readonly prestamoService = inject(PrestamoService);
    private readonly dialogRef = inject(MatDialogRef<PrestamoDialogComponent, boolean>);
    private readonly snack = inject(MatSnackBar);
    private readonly auditService = inject(AuditContextService);

    readonly estados = ESTADOS_PRESTAMO;

    readonly data = inject<PrestamoDialogData>(MAT_DIALOG_DATA);


    readonly createForm = this.fb.nonNullable.group({
        id_usuario: ['', Validators.required],
        id_material: ['', Validators.required],
    });

    readonly editForm = this.fb.nonNullable.group({
        estado: ['', Validators.required],
    });

    constructor() {
        if (this.data.mode === 'edit' && this.data.row) {
            this.editForm.patchValue({
                estado: this.data.row.estado,
            });
        }
        if (this.data.mode === 'create' && this.data.row) {
            this.createForm.patchValue({
                id_material: this.data.row.id_material,
            });
        }
    }

    cancel(): void {
        this.dialogRef.close(false);
    }

    save(): void {
        const idUsuarioAuditoria = this.auditService.usuarioId()!;
        const actualForm = this.data.mode === 'create' ? this.createForm : this.editForm;
        if (actualForm.invalid) {
            actualForm.markAllAsTouched();
            return;
        }

        if (this.data.mode === 'create') {
            const vc = this.createForm.getRawValue();
            this.prestamoService.create({
                id_usuario: vc.id_usuario,
                id_material: vc.id_material,
                id_usuario_crea: idUsuarioAuditoria,
            }).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', {duration: 6000}),
            });
            return;
        } else {
            const ve = this.editForm.getRawValue();
            const id = this.data.row!.id_prestamo;
            const body: PrestamoUpdate = {
                estado: ve.estado,
                id_usuario_edita: idUsuarioAuditoria,
            };
            this.prestamoService.update(id, body).subscribe({
                next: () => this.dialogRef.close(true),
                error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', {duration: 6000}),
            });
        }
    }

    private msg(err: HttpErrorResponse): string {
        const d = err.error?.detail;
        if (typeof d === 'string') return d;
        if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
        return err.message;
    }
}