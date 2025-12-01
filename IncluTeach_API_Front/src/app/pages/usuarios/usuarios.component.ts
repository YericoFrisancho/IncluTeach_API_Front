import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card'; 
import { UserService } from '../../services/user.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AdminDialogComponent } from '../../components/admin-dialog/admin-dialog.component'; 
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    NavbarComponent
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  private userService = inject(UserService);
  private snack = inject(MatSnackBar);
  private authService = inject(AuthService); 
  private dialog = inject(MatDialog); 

  displayedColumns: string[] = ['id', 'nombre', 'username', 'email', 'rol', 'acciones'];
  
  usuarios: any[] = [];

  currentUserId: number | null = null;

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
    this.cargarUsuarios();
  }

  agregarAdministrador() {
    const dialogRef = this.dialog.open(AdminDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.crear(result).subscribe({
          next: () => {
            this.snack.open('¡Administrador creado con éxito!', 'OK', { duration: 3000 });
            this.cargarUsuarios(); 
          },
          error: (err) => {
            console.error(err);
            this.snack.open('Error al crear administrador.', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  cargarUsuarios() {
    this.userService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error(err);
        this.snack.open('Error al cargar la lista de usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarUsuario(id: number, username: string) {
    const esAutoEliminacion = id === this.currentUserId;
    
    const mensaje = esAutoEliminacion 
      ? `⚠️ ADVERTENCIA: Estás a punto de eliminar TU PROPIA CUENTA de Administrador. Se cerrará tu sesión inmediatamente. ¿Continuar?`
      : `¿Estás seguro de eliminar al usuario "${username}"? Esta acción no se puede deshacer.`;

    if (confirm(mensaje)) {
      this.userService.eliminar(id).subscribe({
        next: () => {
          if (esAutoEliminacion) {
            this.snack.open('Tu cuenta ha sido eliminada. Adiós.', 'OK', { duration: 4000 });
            this.authService.logout();
          } else {
            this.snack.open('Usuario eliminado correctamente.', 'OK', { duration: 3000 });
            this.usuarios = this.usuarios.filter(u => u.id !== id);
          }
        },
        error: (err) => {
          console.error(err);
          this.snack.open('Error al eliminar.', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  getRolNombre(rolId: number): string {
    switch (rolId) {
      case 1: return 'Familiar';
      case 2: return 'Profesional';
      case 3: return 'Administrador';
      default: return 'Otro';
    }
  }
}