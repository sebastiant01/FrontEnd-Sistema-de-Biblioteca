import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
 
import { SancionService } from '../../core/services/sancion.service';
import { SancionRead, SancionUpdate } from '../../models/sancion.models';
import { AuditContextService } from "../../core/audit-context.service";
 
 
export interface SancionDialogData {
  mode: 'create' | 'edit';
  row?: SancionRead;
}
 
@Component({
  selector: 'app-sancion-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './sancion-dialog.html',
})
 
export class SancionDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly sancionService = inject(SancionService);
  private readonly dialogRef = inject(MatDialogRef<SancionDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  private readonly auditService = inject(AuditContextService);
 
  readonly data = inject<SancionDialogData>(MAT_DIALOG_DATA);
 
  readonly form = this.fb.nonNullable.group({
    id_usuario: ['', Validators.required],
    id_prestamo: ['', Validators.required],
    fecha_inicio: ['', Validators.required],
    dias_sancion: [0, [Validators.required, Validators.min(1)]],
    motivo: ['', [Validators.required, Validators.maxLength(200)]],
  });
 
  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_usuario: r.id_usuario,
        id_prestamo: r.id_prestamo,
        fecha_inicio: this.toInputDate(r.fecha_inicio),
        dias_sancion: r.dias_sancion,
        motivo: r.motivo,
      });
    }
  }
 
  private toInputDate(fecha: string): string {
    if (!fecha) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
    const parts = fecha.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return fecha;
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
      this.sancionService.create({
        id_usuario: v.id_usuario,
        id_prestamo: v.id_prestamo,
        fecha_inicio: v.fecha_inicio,
        dias_sancion: v.dias_sancion,
        motivo: v.motivo,
        id_usuario_crea: idUsuarioAuditoria ?? '',
      }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }
    const id = this.data.row!.id_sancion;
    const body: SancionUpdate = {
      fecha_inicio: v.fecha_inicio,
      dias_sancion: v.dias_sancion,
      motivo: v.motivo,
      id_usuario_edita: idUsuarioAuditoria,
    };
    this.sancionService.update(id, body).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }
 
  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}