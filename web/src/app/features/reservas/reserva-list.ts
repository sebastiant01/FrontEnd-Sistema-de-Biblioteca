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

import { ReservaService } from '../../core/services/reserva.service';
import { ReservaRead } from '../../models/reserva.models';
import { ReservaDialogComponent, ReservaDialogData } from './reserva-dialog';

@Component({
  selector: 'app-reserva-list',
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
  templateUrl: './reserva-list.html',
  styleUrl: './reserva-list.scss',
})
export class ReservaListComponent implements AfterViewInit {
  private readonly reservaService = inject(ReservaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly displayedColumns = [
    'fecha_reserva',
    'estado_reserva',
    'fecha_creacion',
    'fecha_edicion',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<ReservaRead>([]);

  loading = true;

  readonly filtrosForm = this.fb.group({
    estado_reserva: ['']
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
    const filtros = this.filtrosForm.value;

    this.reservaService.list(filtros as any).subscribe({
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
    this.filtrosForm.reset({ estado_reserva: '' });
    this.reload();
  }

  nuevo(): void {
    const data: ReservaDialogData = { mode: 'create' };
    this.dialog
      .open(ReservaDialogComponent, { data, width: '480px' })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  editar(row: ReservaRead): void {
    const data: ReservaDialogData = { mode: 'edit', row };
    this.dialog
      .open(ReservaDialogComponent, { data, width: '480px' })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: ReservaRead): void {
    if (!confirm('¿Eliminar esta reserva?')) return;
    this.reservaService.delete(row.id_reserva).subscribe({
      next: () => this.reload(),
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