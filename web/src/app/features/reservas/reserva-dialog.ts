import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
 
import { ReservaService } from '../../core/services/reserva.service';
import { ReservaRead, ReservaUpdate } from '../../models/reserva.models';
import { AuditContextService } from "../../core/audit-context.service";
 
 
export interface ReservaDialogData {
  mode: 'create' | 'edit';
  row?: ReservaRead;
}
 
@Component({
  selector: 'app-reserva-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './reserva-dialog.html',
})
 
export class ReservaDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly reservaService = inject(ReservaService);
  private readonly dialogRef = inject(MatDialogRef<ReservaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  private readonly auditService = inject(AuditContextService);
 
  readonly data = inject<ReservaDialogData>(MAT_DIALOG_DATA);
 
  readonly form = this.fb.nonNullable.group({
    id_usuario: ['', Validators.required],
    id_material: ['', Validators.required],
    fecha_reserva: ['', Validators.required],
    estado_reserva: ['pendiente'],
  });
 
  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        id_usuario: r.id_usuario,
        id_material: r.id_material,
        fecha_reserva: this.toInputDate(r.fecha_reserva),
        estado_reserva: r.estado_reserva,
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
 
  private toBackendDate(fecha: string): string {
    if (!fecha) return '';
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
      this.reservaService.create({
        id_usuario: v.id_usuario,
        id_material: v.id_material,
        fecha_reserva: this.toBackendDate(v.fecha_reserva),
        estado_reserva: v.estado_reserva as any,
        id_usuario_crea: idUsuarioAuditoria ?? '',
      }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }
    const id = this.data.row!.id_reserva;
    const body: ReservaUpdate = {
      fecha_reserva: this.toBackendDate(v.fecha_reserva),
      estado_reserva: v.estado_reserva as any,
      id_usuario_edita: idUsuarioAuditoria,
    };
    this.reservaService.update(id, body).subscribe({
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