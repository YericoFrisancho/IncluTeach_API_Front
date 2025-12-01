import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { PerfilComponent } from './pages/perfil/perfil.component'; 
import { UsuariosComponent } from './pages/usuarios/usuarios.component'; 
import { RolesComponent } from './pages/roles/roles.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { ForosComponent } from './pages/foros/foros.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { RecursosComponent } from './pages/recursos/recursos.component';
import { ConsultasComponent } from './pages/consultas/consultas.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'app',
    canActivate: [authGuard], 
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'perfil', component: PerfilComponent }, 
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'foros', component: ForosComponent },
      { path: 'notificaciones', component: NotificacionesComponent },
      { path: 'recursos', component: RecursosComponent },
      { path: 'consultas', component: ConsultasComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];