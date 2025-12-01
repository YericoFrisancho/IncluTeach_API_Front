import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule, 
    NavbarComponent
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private snack = inject(MatSnackBar);
  private usuarioOriginal: any = {};

  usuario: any = {
    id: null,
    nombre: '',
    username: '',
    email: '',
    contrasena: '',
    rolId: null
  };

  rolesDisponibles = [
    { id: 1, nombre: 'Familiar' },
    { id: 2, nombre: 'Profesional' }
  ];

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    const userId = this.authService.getCurrentUserId();

    if (userId) {
      this.userService.obtenerPorId(userId).subscribe({
        next: (data) => {
          this.usuario = data;
          this.usuario.contrasena = ''; 
          this.usuarioOriginal = { ...data };
        },
        error: (err) => {
          console.error(err);
          this.snack.open('Error al cargar datos del perfil', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  actualizar() {
    if (!this.usuario.id) return;

    const hayCambiosDatos = 
      this.usuario.nombre !== this.usuarioOriginal.nombre ||
      this.usuario.username !== this.usuarioOriginal.username ||
      this.usuario.email !== this.usuarioOriginal.email ||
      this.usuario.rolId !== this.usuarioOriginal.rolId;

    const hayCambioPassword = this.usuario.contrasena && this.usuario.contrasena.trim() !== '';

    if (!hayCambiosDatos && !hayCambioPassword) {
      this.snack.open('Guardado exitoso (No se detectaron cambios).', 'OK', { duration: 3000 });
      this.usuario.contrasena = '';
      return;
    }

    this.userService.actualizar(this.usuario.id, this.usuario).subscribe({
      next: (response: any) => {
        console.log('Respuesta del Backend:', response);

        const usuarioActualizado = response.usuario;
        const nuevoToken = response.newToken;

        if (!usuarioActualizado || !nuevoToken) {
          console.error('La respuesta del backend no tiene el formato esperado {usuario, newToken}');
          return;
        }

        this.authService.updateSession(
          nuevoToken, 
          usuarioActualizado.username, 
          usuarioActualizado.rolId
        );

        this.snack.open('Perfil actualizado correctamente', 'OK', { duration: 3000 });
        
        this.usuarioOriginal = { ...this.usuario };
        this.usuario.contrasena = ''; 
      },
      error: (err) => {
        console.error('Error en el frontend:', err);
        this.snack.open('Error al actualizar. Revisa la consola.', 'Cerrar', { duration: 3000 });
      }
    });
  }
  eliminarCuenta() {
    const confirmacion = window.confirm('¿Estás seguro? Esta acción eliminará tu cuenta permanentemente.');

    if (confirmacion && this.usuario.id) {
      this.userService.eliminar(this.usuario.id).subscribe({
        next: () => {
          this.snack.open('Cuenta eliminada. Hasta luego.', 'Adiós', { duration: 4000 });
          this.authService.logout();
        },
        error: (err) => {
          this.snack.open('No se pudo eliminar la cuenta.', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}