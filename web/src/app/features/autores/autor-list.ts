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

import { AutorService } from '../../core/services/autor.service';
import { AutorRead } from '../../models/autor.models';
import { AutorDialogComponent, AutorDialogData } from './autor-dialog';
import { AuditContextService } from '../../core/audit-context.service';

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
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule
    ],
    templateUrl: './autor-list.html',
    styleUrl: './autor-list.scss'
})
export class AutorListComponent implements AfterViewInit {
    private readonly autorService = inject(AutorService);
    private readonly dialog = inject(MatDialog);
    private readonly snack = inject(MatSnackBar);
    private readonly fb = inject(FormBuilder);
    private readonly audit = inject(AuditContextService)
    private readonly auditService = inject(AuditContextService);

    esAdmin: boolean = false;

    ngOnInit() {
        this.verificarRol();
    }

    verificarRol(): void {
        const rol_usuario = this.auditService.usuarioRol();
        if (rol_usuario) {
            this.esAdmin = rol_usuario.trim() === 'Admin';
        }
    }

    readonly filterForm = this.fb.nonNullable.group({
        criterio: ['termino'],
        valor: ['']
    });

    readonly displayedColumns = [
        'id_autor',
        'nombre_autor',
        'apellido_autor',
        'nacionalidad',
        'activo',
        'id_usuario_crea',
        'fecha_creacion',
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
        const filtros = this.filterForm.getRawValue();

        this.autorService.list(filtros).subscribe({
        next: (rows: any) => { 
                let datosLimpios = [];

                if (Array.isArray(rows)) {
                    datosLimpios = rows;
                }

                else if (rows && rows.id_autor !== undefined) {
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

        const id_usuario_edita = this.audit.usuarioId()!
        this.autorService.delete(row.id_autor, id_usuario_edita).subscribe({
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