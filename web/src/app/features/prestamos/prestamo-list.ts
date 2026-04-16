import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, viewChild, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { PrestamoService } from '../../core/services/prestamo.service';
import { PrestamoRead } from '../../models/prestamo.models';
import { PrestamoDialogComponent, PrestamoDialogData } from './prestamo-dialog';
import { UsuarioDialogComponent } from '../usuarios/usuario-dialog';


@Component({
    selector: 'app-prestamo-list',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
    templateUrl: './prestamo-list.html',
    styleUrl: './prestamo-list.scss'
})
export class PrestamoListComponent implements AfterViewInit {
    private readonly prestamoService = inject(PrestamoService);
    private readonly dialog = inject(MatDialog);
    private readonly snack = inject(MatSnackBar);

    readonly displayedColumns = [
        'id_usuario',
        'id_material',
        'fecha_preatamo',
        'estado',
    ];
    readonly dataSource = new MatTableDataSource<PrestamoRead>([]);

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
        this.prestamoService.list().subscribe({
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
        this.openDialog({mode: 'create'});
    }

    editar(row: PrestamoRead): void {
        this.openDialog({ mode: 'edit', row})
    }

    private openDialog(data: PrestamoDialogData): void {
        this.dialog.open(UsuarioDialogComponent, {width: '520px' , data}).afterClosed()
        .pipe(filter(Boolean)).subscribe(() => this.reload());
    }

    eliminar(row: PrestamoRead): void {
        if (!confirm(`Eliminar préstamo ${row.id_prestamo}?`)) return;
        this.prestamoService.delete(row.id_material).subscribe({
            next: () => {
                this.snack.open('Préstamo eliminado UnU', 'OK', {duration: 3000});
                this.reload();
            },
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
