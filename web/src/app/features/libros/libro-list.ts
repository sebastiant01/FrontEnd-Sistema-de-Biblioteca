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

import { LibroService } from '../../core/services/libro.service';
import { LibroRead } from '../../models/libro.models';
import { LibroDialogComponent } from './libro-dialog';
import { shortId } from '../../shared/ids';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuditContextService } from '../../core/audit-context.service';

@Component({
    selector: 'app-libro-list',
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
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDividerModule,
        MatTooltipModule
    ],
    templateUrl: './libro-list.html',
    styleUrl: './libro-list.scss'
})
export class LibroListComponent implements AfterViewInit {
    private readonly libroService = inject(LibroService);
    private readonly dialog = inject(MatDialog);
    private readonly snack = inject(MatSnackBar);
    private readonly fb = inject(FormBuilder);
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

    protected readonly formatId = shortId;

    readonly displayedColumns = [
        'codigo_material',
        'titulo_material',
        'genero_libro',
        'codigo_isbn',
        'disponibilidad_material',
        'id_usuario_crea',
        'fecha_creacion',
        'acciones',
    ];
    readonly dataSource = new MatTableDataSource<LibroRead>([]);

    loading = true;

    readonly filtrosForm = this.fb.group({
        id_libro: [''],
        codigo_material: [''],
        por_titulo: [''],
        por_genero: [''],
        solo_disponibles: [false]
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
        const { id_libro, codigo_material, ...otrosFiltros } = this.filtrosForm.value;

        if (id_libro?.trim()) {
            this.libroService.getById(id_libro.trim()).subscribe({
                next: (res) => this.setTableData([res]),
                error: (err) => this.handleError(err, 'ID')
            });
            return;
        }

        if (codigo_material?.trim()) {
            this.libroService.getByCode(codigo_material.trim()).subscribe({
                next: (res) => this.setTableData([res]),
                error: (err) => this.handleError(err, 'Código')
            });
            return;
        }

        this.libroService.list(otrosFiltros as any).subscribe({
            next: (rows) => this.setTableData(rows),
            error: (err) => this.handleError(err)
        });
    }

    private setTableData(data: LibroRead[]): void {
        this.dataSource.data = data;
        this.loading = false;
    }

    private handleError(err: HttpErrorResponse, context?: string): void {
        this.loading = false;
        this.dataSource.data = [];
        const mensaje = context ? `No se encontró resultado por ${context}` : this.msg(err);
        this.snack.open(mensaje, 'Cerrar', { duration: 5000 });
    }

    limpiarFiltros(): void {
        this.filtrosForm.reset({ 
            id_libro: '', codigo_material: '', por_titulo: '', 
            por_genero: '', solo_disponibles: false 
        });
        this.reload();
    }

    create(): void {
        this.openDialog({ mode: 'create' });
    }

    edit(row: LibroRead): void {
        this.openDialog({ mode: 'edit', item: row });
    }

    private openDialog(data: { mode: 'create' | 'edit'; item?: LibroRead }): void {
        this.dialog.open(LibroDialogComponent, { width: '600px', data })
            .afterClosed()
            .pipe(filter(Boolean))
            .subscribe(() => this.reload());
    }

    delete(row: LibroRead): void {
        if (!confirm(`¿Eliminar el libro "${row.titulo_material}"?`)) return;
        this.libroService.delete(row.id_libro).subscribe({
            next: () => {
                this.snack.open('Libro eliminado', 'OK', { duration: 3000 });
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