import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';
 
import { SancionService } from '../../core/services/sancion.service';
import { SancionRead } from '../../models/sancion.models';
import { SancionDialogComponent, SancionDialogData } from './sancion-dialog';
 
@Component({
  selector: 'app-sancion-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './sancion-list.html',
  styleUrl: './sancion-list.scss',
})
export class SancionListComponent implements AfterViewInit {
  private readonly sancionService = inject(SancionService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
 
  readonly displayedColumns = [
    'id_usuario',
    'id_prestamo',
    'fecha_inicio',
    'dias_sancion',
    'motivo',
    'id_usuario_crea',
    'id_usuario_edita',
    'fecha_creacion',
    'fecha_edicion',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<SancionRead>([]);
 
  loading = true;
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
 
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
 
  constructor() {
    this.reload();
  }
 
  reload(): void {
    this.loading = true;
    this.sancionService.list().subscribe({
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
 
  nuevo(): void {
    const data: SancionDialogData = { mode: 'create' };
    this.dialog
      .open(SancionDialogComponent, { data, width: '480px' })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }
 
  editar(row: SancionRead): void {
    const data: SancionDialogData = { mode: 'edit', row };
    this.dialog
      .open(SancionDialogComponent, { data, width: '480px' })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }
 
  eliminar(row: SancionRead): void {
    if (!confirm('¿Eliminar esta sanción?')) return;
    this.sancionService.delete(row.id_sancion).subscribe({
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