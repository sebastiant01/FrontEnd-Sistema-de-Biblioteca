import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';

import { RevistaService } from '../../core/services/revista.service';
import { RevistaRead } from '../../models/revista.models';
import { RevistaDialogComponent, RevistaDialogData } from './revista-dialog';

@Component({
  selector: 'app-revista-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './revista-list.html',
  styleUrl: './revista-list.scss',
})
export class RevistaListComponent implements AfterViewInit {
  private readonly revistaService = inject(RevistaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly displayedColumns = [
    'codigo_material',
    'titulo_material',
    'volumen',
    'numero_edicion',
    'disponibilidad_material',
    'fecha_creacion',
    'fecha_edicion',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<RevistaRead>([]);
  loading = true;

  readonly filtrosForm = this.fb.group({
    titulo_material: [''],
    codigo_material: ['']
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.revistaService.list(this.filtrosForm.value as any).subscribe({
      next: (rows) => {
        this.dataSource.data = rows;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 });
      },
    });
  }

  limpiarFiltros(): void {
    this.filtrosForm.reset({ titulo_material: '', codigo_material: '' });
    this.reload();
  }

  nuevo(): void {
    const data: RevistaDialogData = { mode: 'create' };
    this.dialog
      .open(RevistaDialogComponent, { data, width: '480px' })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  editar(row: RevistaRead): void {
    const data: RevistaDialogData = { mode: 'edit', row };
    this.dialog
      .open(RevistaDialogComponent, { data, width: '480px' })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: RevistaRead): void {
    if (!confirm('¿Eliminar esta revista?')) return;
    this.revistaService.delete(row.id_revista).subscribe({
      next: () => this.reload(),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}