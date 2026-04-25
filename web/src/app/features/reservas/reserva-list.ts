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
 
import { ReservaService } from '../../core/services/reserva.service';
import { ReservaRead } from '../../models/reserva.models';
import { ReservaDialogComponent, ReservaDialogData } from './reserva-dialog';
 
@Component({
  selector: 'app-reserva-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './reserva-list.html',
  styleUrl: './reserva-list.scss',
})
export class ReservaListComponent implements AfterViewInit {
  private readonly reservaService = inject(ReservaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
 
  readonly displayedColumns = [
    'id_usuario',
    'id_material',
    'fecha_reserva',
    'estado_reserva',
    'id_usuario_crea',
    'id_usuario_edita',
    'fecha_creacion',
    'fecha_edicion',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<ReservaRead>([]);
 
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
    this.reservaService.list().subscribe({
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