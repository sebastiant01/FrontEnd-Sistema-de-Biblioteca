import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { LibroService } from '../../core/services/libro.service';
import { AuditContextService } from '../../core/audit-context.service';
import { LibroRead } from '../../models/libro.models';

@Component({
  selector: 'app-libro-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './libro-dialog.html',
  styleUrl: './libro-dialog.scss'
})
export class LibroDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly libroService: LibroService,
    private readonly auditContext: AuditContextService,
    private readonly dialogRef: MatDialogRef<LibroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; item?: LibroRead }
  ) {
    this.form = this.fb.group({
      codigo_material: ['', Validators.required],
      titulo_material: ['', Validators.required],
      disponibilidad_material: [true],
      descripcion_material: [''],
      fecha_material: [null],
      codigo_isbn: ['', Validators.required],
      genero_libro: ['', Validators.required],
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
      this.libroService.create(body).subscribe(() => this.dialogRef.close(true));
    } else {
      const body = {
        ...this.form.value,
        id_usuario_edita: userId
      };
      this.libroService.update(this.data.item!.id_libro, body).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}