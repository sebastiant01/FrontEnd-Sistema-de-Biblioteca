import { HttpErrorResponse } from "@angular/common/http";
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
 
import { RevistaService } from '../../core/services/revista.service';
import { RevistaRead, RevistaUpdate } from '../../models/revista.models';
import { AuditContextService } from "../../core/audit-context.service";
 
 
export interface RevistaDialogData {
  mode: 'create' | 'edit';
  row?: RevistaRead;
}
 
@Component({
  selector: 'app-revista-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './revista-dialog.html',
})
 
export class RevistaDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly revistaService = inject(RevistaService);
  private readonly dialogRef = inject(MatDialogRef<RevistaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);
  private readonly auditService = inject(AuditContextService);
 
  readonly data = inject<RevistaDialogData>(MAT_DIALOG_DATA);
 
  readonly form = this.fb.nonNullable.group({
    codigo_material: ['', Validators.required],
    titulo_material: ['', Validators.required],
    volumen: [0, [Validators.required, Validators.min(1)]],
    numero_edicion: [0, [Validators.required, Validators.min(1)]],
    id_autor: ['', Validators.required],
    descripcion_material: [''],
    fecha_material: [''],
  });
 
  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        codigo_material: r.codigo_material,
        titulo_material: r.titulo_material,
        volumen: r.volumen,
        numero_edicion: r.numero_edicion,
        id_autor: r.id_autor,
        descripcion_material: r.descripcion_material ?? '',
        fecha_material: this.toInputDate(r.fecha_material ?? ''),
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
      this.revistaService.create({
        codigo_material: v.codigo_material,
        titulo_material: v.titulo_material,
        volumen: v.volumen,
        numero_edicion: v.numero_edicion,
        id_autor: v.id_autor,
        descripcion_material: v.descripcion_material || null,
        fecha_material: v.fecha_material || null,
        disponibilidad_material: true,
        id_usuario_crea: idUsuarioAuditoria ?? '',
      }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }
    const id = this.data.row!.id_revista;
    const body: RevistaUpdate = {
      codigo_material: v.codigo_material,
      titulo_material: v.titulo_material,
      volumen: v.volumen,
      numero_edicion: v.numero_edicion,
      id_autor: v.id_autor,
      descripcion_material: v.descripcion_material || null,
      fecha_material: v.fecha_material || null,
      id_usuario_edita: idUsuarioAuditoria,
    };
    this.revistaService.update(id, body).subscribe({
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
 