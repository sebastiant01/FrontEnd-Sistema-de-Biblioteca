import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { PeriodicoService } from '../../core/services/periodico.service';
import { PeriodicoRead } from '../../models/periodico.models';
import { PeriodicoDialogComponent } from './periodico-dialog';

@Component({
    selector: 'app-periodico-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
    templateUrl: './periodico-list.html',
    styleUrl: './periodico-list.scss'
})
export class PeriodicoListComponent implements AfterViewInit {
    private readonly periodicoService = inject(PeriodicoService);
    private readonly dialog = inject(MatDialog);
    private readonly snack = inject(MatSnackBar);

    readonly displayedColumns = [
        'codigo_material',
        'titulo_material',
        'ciudad_publicacion',
        'seccion_periodico',
        'disponibilidad_material',
        'id_usuario_crea',
        'fecha_creacion',
        'acciones',
    ];
    readonly dataSource = new MatTableDataSource<PeriodicoRead>([]);

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
        this.periodicoService.list().subscribe({
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

    create(): void {
        this.openDialog({ mode: 'create' });
    }

    edit(row: PeriodicoRead): void {
        this.openDialog({ mode: 'edit', item: row });
    }

    private openDialog(data: { mode: 'create' | 'edit'; item?: PeriodicoRead }): void {
        this.dialog.open(PeriodicoDialogComponent, { width: '600px', data })
            .afterClosed()
            .pipe(filter(Boolean))
            .subscribe(() => this.reload());
    }

    delete(row: PeriodicoRead): void {
        if (!confirm(`¿Eliminar el periódico "${row.titulo_material}"?`)) return;
        this.periodicoService.delete(row.id_periodico).subscribe({
            next: () => {
                this.snack.open('Periódico eliminado', 'OK', { duration: 3000 });
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