import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

import { InicioComponent } from './pages/dashboard/inicio.component';
import { GestionLibrosComponent } from './gestion-libros/gestion-libros.component';
import { GestionAutoresComponent } from './gestion-autores/gestion-autores.component';
import { GestionPrestamosComponent } from './gestion-prestamos/gestion-prestamos.component';
import { RegistroGestionAutoresComponent } from './gestion-autores/registro/registro-gestion-autores.component';
import { RegistroGestionLibrosComponent } from './gestion-libros/registro/registro-gestion-libros.component';
import { RegistroGestionPrestamosComponent } from './gestion-prestamos/registro/registro-gestion-prestamos.component';
import { EditarGestionAutoresComponent } from './gestion-autores/editar/editar-gestion-autores.component';
import { VerGestionAutoresComponent } from './gestion-autores/ver/ver-gestion-autores.component';
import { EditarGestionLibrosComponent } from './gestion-libros/editar/editar-gestion-libros.component';
import { VerGestionLibrosComponent } from './gestion-libros/ver/ver-gestion-libros.component';
import { EditarGestionPrestamosComponent } from './gestion-prestamos/editar/editar-gestion-prestamos.component';
import { VerGestionPrestamosComponent } from './gestion-prestamos/ver/ver-gestion-prestamos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Asegúrate de usar pathMatch
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'gestion-libros', component: GestionLibrosComponent },
  { path: 'gestion-autores', component: GestionAutoresComponent },
  { path: 'gestion-prestamos', component: GestionPrestamosComponent },
  { path: 'register-gestion-autores', component: RegistroGestionAutoresComponent },
  { path: 'registro-gestion-libros', component: RegistroGestionLibrosComponent },
  { path: 'registro-gestion-prestamos', component: RegistroGestionPrestamosComponent },
  { path: 'editar-gestion-autores/:id', component: EditarGestionAutoresComponent },
  { path: 'ver-gestion-autores/:id', component: VerGestionAutoresComponent },
  { path: 'editar-gestion-libros/:id', component: EditarGestionLibrosComponent },
  { path: 'ver-gestion-libros/:id', component: VerGestionLibrosComponent },
  { path: 'editar-gestion-prestamos/:id', component: EditarGestionPrestamosComponent },
  { path: 'ver-gestion-prestamos/:id', component: VerGestionPrestamosComponent },









];
