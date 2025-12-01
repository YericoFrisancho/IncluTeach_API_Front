import { Component, inject, OnInit, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ComentarioService } from '../../services/comentario.service';
import { AuthService } from '../../services/auth.service';
import { ComentarioDialogComponent } from '../../components/comentario-dialog/comentario-dialog.component';
import { ExternalApiService } from '../../services/external-api.service'; // <--- IMPORTAR

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, 
    MatIconModule, MatMenuModule, MatSnackBarModule, DatePipe
  ],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  private comService = inject(ComentarioService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  
  // 👇👇 HACEMOS PÚBLICO EL SERVICIO DE AVATARES 👇👇
  public externalApi = inject(ExternalApiService);

  publicacion: any;
  comentarios: any[] = [];
  userId = this.authService.getCurrentUserId();
  rolId = Number(localStorage.getItem('rolId'));

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.publicacion = data;
  }

  ngOnInit() {
    this.cargarComentarios();
  }

  cargarComentarios() {
    this.comService.listarPorPublicacion(this.publicacion.id).subscribe({
      next: (data) => this.comentarios = data,
      error: () => this.snack.open('Error al cargar comentarios', 'Cerrar')
    });
  }

  esMio(com: any): boolean {
    return com.usuarioId === this.userId;
  }

  puedeEliminar(com: any): boolean {
    return com.usuarioId === this.userId || this.rolId === 3;
  }

  crear() {
    const ref = this.dialog.open(ComentarioDialogComponent, { width: '400px' });
    ref.afterClosed().subscribe(res => {
      if (res && this.userId) {
        const nuevo = {
          contenido: res.contenido,
          usuarioId: this.userId,
          publicacionId: this.publicacion.id
        };
        this.comService.crear(nuevo).subscribe({
          next: () => {
            this.snack.open('Comentario agregado', 'OK', {duration: 2000});
            this.cargarComentarios();
          },
          error: () => this.snack.open('Error al enviar', 'Cerrar')
        });
      }
    });
  }

  editar(com: any) {
    const ref = this.dialog.open(ComentarioDialogComponent, { width: '400px', data: com });
    ref.afterClosed().subscribe(res => {
      if (res) {
        this.comService.actualizar(com.id, { contenido: res.contenido }).subscribe({
          next: () => {
            this.snack.open('Editado', 'OK', {duration: 2000});
            this.cargarComentarios();
          },
          error: () => this.snack.open('Error al editar', 'Cerrar')
        });
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Borrar comentario?')) {
      this.comService.eliminar(id).subscribe({
        next: () => {
          this.snack.open('Eliminado', 'OK', {duration: 2000});
          this.cargarComentarios();
        },
        error: () => this.snack.open('Error al eliminar', 'Cerrar')
      });
    }
  }
}