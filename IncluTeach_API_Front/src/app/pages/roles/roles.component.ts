import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RolService } from '../../services/rol.service';
import { RolDialogComponent } from '../../components/rol-dialog/rol-dialog.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSnackBarModule,
    MatDialogModule,
    NavbarComponent
  ],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  private rolService = inject(RolService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'acciones'];
  roles: any[] = [];

  ngOnInit() {
    this.cargarRoles();
  }

  cargarRoles() {
    this.rolService.listar().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error(err)
    });
  }

  abrirDialogo(rol?: any) {
    const dialogRef = this.dialog.open(RolDialogComponent, {
      width: '400px',
      data: rol
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.rolService.actualizar(result.id, result).subscribe({
            next: () => {
              this.snack.open('Rol actualizado correctamente', 'OK', { duration: 3000 });
              this.cargarRoles();
            },
            error: () => this.snack.open('Error al actualizar', 'Cerrar', { duration: 3000 })
          });
        } else {
          this.rolService.registrar(result).subscribe({
            next: () => {
              this.snack.open('Rol creado correctamente', 'OK', { duration: 3000 });
              this.cargarRoles();
            },
            error: () => this.snack.open('Error al crear', 'Cerrar', { duration: 3000 })
          });
        }
      }
    });
  }

  eliminarRol(rol: any) {
    const mensaje = `⚠️ ¡PELIGRO!\n\nEstás a punto de eliminar el rol "${rol.nombre}".\n\nSi eliminas este rol, todos los usuarios que lo tengan asignado podrían perder acceso al sistema.\n\n¿Estás seguro de continuar?`;

    if (confirm(mensaje)) {
      this.rolService.eliminar(rol.id).subscribe({
        next: () => {
          this.snack.open('Rol eliminado.', 'OK', { duration: 3000 });
          this.roles = this.roles.filter(r => r.id !== rol.id);
        },
        error: (err) => {
          console.error(err);
          this.snack.open('No se puede eliminar el rol (probablemente esté en uso).', 'Cerrar', { duration: 4000 });
        }
      });
    }
  }
}