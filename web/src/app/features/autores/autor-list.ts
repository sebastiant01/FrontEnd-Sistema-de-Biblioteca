import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, viewChild, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { AutorService } from '../../core/services/autor.service';
import { AutorRead } from '../../models/autor.models';
import { AutorDialogComponent, AutorDialogData } from './autor-dialog';

@Component({
    selector: 'app-autor-list',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
    templateUrl: './autor-list.html',
    styleUrl: './autor-list.scss'
})
export class AutorListComponent implements AfterViewInit {
    private readonly autorService = inject(AutorService);
    private readonly dialog = inject(MatDialog);
    private readonly snack = inject(MatSnackBar);

    readonly displayedColumns = [
        'id_autor',
        'nombre_autor',
        'apellido_autor',
        'nacionalidad',
        'activo',
        'id_usuario_crea',
        'id_usuario_edita',
        'fecha_creacion',
        'fecha_edicion',
        'acciones',
    ];
    readonly dataSource = new MatTableDataSource<AutorRead>([]);

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
        this.autorService.list().subscribe({
            next: (rows) => {
                this.dataSource.data = rows;
                this.loading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.loading = false;
                this.snack.open(this.msg(err), 'Cerrar', {duration: 6000});
            },
        });
    }

    nuevo(): void {
        this.openDialog({ mode: 'create'});
    }

    editar(row: AutorRead): void {
        this.openDialog({ mode: 'edit', row});
    }

    private openDialog(data: AutorDialogData): void {
        this.dialog.open(AutorDialogComponent, {width: '520px', data}).afterClosed()
        .pipe(filter(Boolean)).subscribe(() => this.reload());
    }

    eliminar(row: AutorRead): void {
        if (!confirm(`Eliminar autor ${row.nombre_autor} ${row.apellido_autor}?`)) return;
        this.autorService.delete(row.id_autor).subscribe({
            next: () => {
                this.snack.open('Autor eliminado', 'OK', { duration: 3000 });
                this.reload();
            },
            error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', {duration: 6000}),
        });
    }

    private msg(err: HttpErrorResponse): string {
        const d = err.error?.detail;
        if (typeof d === 'string') return d;
        if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
        return err.message;
    }
}