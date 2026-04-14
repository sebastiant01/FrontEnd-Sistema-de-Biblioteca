import { Routes } from '@angular/router';
 
import { auditUserGuard } from './core/audit-user.guard';
 
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'app',
    canActivate: [auditUserGuard],
    loadComponent: () => import('./features/shell/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuario-list').then((m) => m.UsuarioListComponent),
      },
      {
        path: 'autores',
        loadComponent: () =>
          import('./features/autores/autor-list').then((m) => m.AutorListComponent),
      },
      {
        path: 'materiales-biblioteca',
        loadComponent: () =>
          import('./features/materiales-biblioteca/material-biblioteca-list').then(
            (m) => m.MaterialBibliotecaListComponent,
          ),
      },
      {
        path: 'libros',
        loadComponent: () =>
          import('./features/libros/libro-list').then((m) => m.LibroListComponent),
      },
      {
        path: 'revistas',
        loadComponent: () =>
          import('./features/revistas/revista-list').then((m) => m.RevistaListComponent),
      },
      {
        path: 'periodicos',
        loadComponent: () =>
          import('./features/periodicos/periodico-list').then((m) => m.PeriodicoListComponent),
      },
      {
        path: 'prestamos',
        loadComponent: () =>
          import('./features/prestamos/prestamo-list').then((m) => m.PrestamoListComponent),
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('./features/reservas/reserva-list').then((m) => m.ReservaListComponent),
      },
      {
        path: 'sanciones',
        loadComponent: () =>
          import('./features/sanciones/sancion-list').then((m) => m.SancionListComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];