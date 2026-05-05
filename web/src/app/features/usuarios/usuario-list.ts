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
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioRead } from '../../models/usuario.models';
import { UsuarioDialogComponent, UsuarioDialogData } from './usuario-dialog';

@Component({
    selector: 'app-usuario-list',
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule
    ],
    templateUrl: './usuario-list.html',
    styleUrl: './usuario-list.scss'
})
export class UsuarioListComponent implements AfterViewInit {
    private readonly usuarioService = inject(UsuarioService);
    private readonly dialog = inject(MatDialog);
    private readonly snack = inject(MatSnackBar);
    private readonly fb = inject(FormBuilder);

    readonly filterForm = this.fb.nonNullable.group({
        criterio: ['termino'],
        valor: ['']
    });

    readonly displayedColumns = [
        'id_usuario',
        'nombre',
        'apellido',
        'documento',
        'email',
        'telefono',
        'username',
        'rol',
        'id_usuario_crea',
        'fecha_creacion',
        'acciones',
    ];
    readonly dataSource = new MatTableDataSource<UsuarioRead>([]);

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
        const filtros = this.filterForm.getRawValue();

        this.usuarioService.list(filtros).subscribe({
        next: (rows: any) => { 
                let datosLimpios = [];

                if (Array.isArray(rows)) {
                    datosLimpios = rows;
                }

                else if (rows && rows.id_usuario !== undefined) {
                    datosLimpios = [rows];
                }

                this.dataSource.data = datosLimpios;
                
                if (this.dataSource.paginator) {
                    this.dataSource.paginator.firstPage();
                }

                this.loading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.loading = false;
                this.snack.open('No se encontraron resultados', 'Cerrar', {duration: 6000});
            },
        });
    }

    buscar(): void {
        this.reload();
    }

    limpiarFiltros(): void {
        this.filterForm.reset();
        this.reload();
    }

    nuevo(): void {
        const data: UsuarioDialogData = { mode: 'create' };
        this.dialog
        .open(UsuarioDialogComponent, { data, width: '480px' })
        .afterClosed()
        .pipe(filter(Boolean))
        .subscribe(() => this.reload());
    }
    
    editar(row: UsuarioRead): void {
        const data: UsuarioDialogData = { mode: 'edit', row };
        this.dialog
        .open(UsuarioDialogComponent, { data, width: '480px' })
        .afterClosed()
        .pipe(filter(Boolean))
        .subscribe(() => this.reload());
    }

    eliminar(row: UsuarioRead): void {
        if (!confirm(`Eliminar usuario ${row.nombre} ${row.apellido}?`)) return;
        this.usuarioService.delete(row.id_usuario).subscribe({
            next: () => {
                this.snack.open('Usuario eliminado', 'OK', { duration: 3000 });
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