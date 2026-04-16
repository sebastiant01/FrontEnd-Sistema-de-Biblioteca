import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PeriodicoService } from '../../core/services/periodico.service';
import { AuditContextService } from '../../core/audit-context.service';
import { PeriodicoRead } from '../../models/periodico.models';

@Component({
  selector: 'app-periodico-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './periodico-dialog.html',
  styleUrl: './periodico-dialog.scss'
})
export class PeriodicoDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly periodicoService: PeriodicoService,
    private readonly auditContext: AuditContextService,
    private readonly dialogRef: MatDialogRef<PeriodicoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; item?: PeriodicoRead }
  ) {
    this.form = this.fb.group({
      codigo_material: ['', Validators.required],
      titulo_material: ['', Validators.required],
      disponibilidad_material: [true],
      descripcion_material: [''],
      fecha_material: [null],
      ciudad_publicacion: ['', Validators.required],
      seccion_periodico: ['', Validators.required],
      id_autor: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.item) {
      this.form.patchValue(this.data.item);
    }
  }

  save(): void {
    if (this.form.invalid) return;

    const userId = this.auditContext.usuarioId();
    if (!userId) return;

    if (this.data.mode === 'create') {
      const body = {
        ...this.form.value,
        id_usuario_crea: userId
      };
      this.periodicoService.create(body).subscribe(() => this.dialogRef.close(true));
    } else {
      const body = {
        ...this.form.value,
        id_usuario_edita: userId
      };
      this.periodicoService.update(this.data.item!.id_periodico, body).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}