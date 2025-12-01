import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ForoService } from '../../services/foro.service';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { ForoDialogComponent } from '../../components/foro-dialog/foro-dialog.component';
import { PublicacionesComponent } from '../publicaciones/publicaciones.component';
import { ExternalApiService } from '../../services/external-api.service';

@Component({
  selector: 'app-foros',
  standalone: true,
  imports: [
    CommonModule, MatTabsModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatTooltipModule, MatDialogModule, MatSnackBarModule, 
    NavbarComponent, DatePipe
  ],
  templateUrl: './foros.component.html',
  styleUrls: ['./foros.component.css']
})
export class ForosComponent implements OnInit {
  foroService = inject(ForoService);
  authService = inject(AuthService);
  notiService = inject(NotificacionService);
  dialog = inject(MatDialog);
  snack = inject(MatSnackBar);
  
  public externalApi = inject(ExternalApiService);

  forosTodos: any[] = [];
  forosSeguidos: any[] = [];
  userId: number | null = null;
  rolId: number | null = null;

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    this.rolId = Number(localStorage.getItem('rolId'));
    this.cargarDatos();
  }

  cargarDatos() {
    this.foroService.listarTodos().subscribe(data => this.forosTodos = data);
    if (this.userId) {
      this.foroService.listarSeguidos(this.userId).subscribe(data => this.forosSeguidos = data);
    }
  }

  esMio(foro: any): boolean {
    return foro.usuarioId === this.userId;
  }

  puedeEliminar(foro: any): boolean {
    return foro.usuarioId === this.userId || this.rolId === 3;
  }

  yaLoSigo(foroId: number): boolean {
    return this.forosSeguidos.some(f => f.id === foroId);
  }

  toggleNotificacion(foro: any) {
    if (!this.userId) return;

    this.notiService.toggle(this.userId, foro.id).subscribe({
      next: (res) => {
        const estaActivado = res.mensaje === 'ACTIVADO';
        foro.notificacionesActivas = estaActivado;
        const texto = estaActivado ? 'Notificaciones ACTIVADAS 🔔' : 'Notificaciones DESACTIVADAS 🔕';
        this.snack.open(texto, 'OK', { duration: 2000 });
      },
      error: () => this.snack.open('Error al cambiar notificación', 'Cerrar')
    });
  }

  verPublicaciones(foro: any) {
    this.dialog.open(PublicacionesComponent, {
      width: '95%',
      maxWidth: '1000px',
      height: '90vh',
      data: foro
    });
  }

  seguir(foro: any) {
    if (!this.userId) return;
    
    this.foroService.seguir(this.userId, foro.id).subscribe({
      next: () => {
        this.snack.open('¡Siguiendo foro!', 'OK', { duration: 2000 });
        this.cargarDatos(); 
      },
      error: () => this.snack.open('Error al seguir', 'Cerrar')
    });
  }

  dejarDeSeguir(foro: any) {
    if (!this.userId) return;
    if (confirm('¿Dejar de seguir este foro?')) {
      this.foroService.dejarDeSeguir(this.userId, foro.id).subscribe({
        next: () => {
          this.snack.open('Dejaste de seguir', 'OK', { duration: 2000 });
          this.cargarDatos();
        },
        error: () => this.snack.open('Error al dejar de seguir', 'Cerrar')
      });
    }
  }

  crear() {
    const ref = this.dialog.open(ForoDialogComponent, { width: '500px' });
    ref.afterClosed().subscribe(res => {
      if (res && this.userId) {
        const nuevoForoDTO = {
          titulo: res.titulo,
          descripcion: res.descripcion,
          usuarioId: this.userId,
          categoriaId: res.categoriaId
        };

        this.foroService.crear(nuevoForoDTO).subscribe({
          next: () => {
            this.snack.open('Foro creado', 'OK', { duration: 3000 });
            this.cargarDatos();
          },
          error: () => this.snack.open('Error al crear', 'Cerrar')
        });
      }
    });
  }

  editar(foro: any) {
    const ref = this.dialog.open(ForoDialogComponent, { width: '500px', data: foro });
    ref.afterClosed().subscribe(res => {
      if (res) {
        const foroEditado = {
          ...foro,
          titulo: res.titulo,
          descripcion: res.descripcion,
          categoriaId: res.categoriaId
        };
        this.foroService.actualizar(foro.id, foroEditado).subscribe({
          next: () => {
            this.snack.open('Actualizado', 'OK', { duration: 3000 });
            this.cargarDatos();
          },
          error: () => this.snack.open('Error al editar', 'Cerrar')
        });
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar tu foro permanentemente?')) {
      this.foroService.eliminar(id).subscribe({
        next: () => {
          this.snack.open('Eliminado', 'OK');
          this.cargarDatos();
        },
        error: () => this.snack.open('Error al eliminar', 'Cerrar')
      });
    }
  }
}