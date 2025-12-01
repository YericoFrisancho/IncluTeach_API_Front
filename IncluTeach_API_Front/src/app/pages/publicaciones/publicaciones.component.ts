import { Component, inject, OnInit, Optional, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PublicacionService } from '../../services/publicacion.service';
import { AuthService } from '../../services/auth.service';
import { PublicacionDialogComponent } from '../../components/publicacion-dialog/publicacion-dialog.component';
import { ComentariosComponent } from '../comentarios/comentarios.component';
import { ExternalApiService } from '../../services/external-api.service';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatDialogModule, MatSnackBarModule, MatTooltipModule, DatePipe
  ],
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {
  private pubService = inject(PublicacionService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  
  public externalApi = inject(ExternalApiService);

  foroData: any; 
  publicaciones: any[] = [];
  userId = this.authService.getCurrentUserId();
  rolId = Number(localStorage.getItem('rolId')); 

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.foroData = data;
  }

  ngOnInit() {
    if (this.foroData) {
      this.cargarPublicaciones();
    }
  }

  cargarPublicaciones() {
    this.pubService.listarPorForo(this.foroData.id).subscribe({
      next: (data) => this.publicaciones = data,
      error: () => this.snack.open('Error al cargar publicaciones', 'Cerrar')
    });
  }

  esMio(pub: any): boolean {
    return pub.usuarioId === this.userId;
  }

  puedeEliminar(pub: any): boolean {
    return pub.usuarioId === this.userId || this.rolId === 3;
  }

  crear() {
    const ref = this.dialog.open(PublicacionDialogComponent, { width: '500px' });
    ref.afterClosed().subscribe(res => {
      if (res) {
        const nuevaPub = {
          titulo: res.titulo,
          contenido: res.contenido,
          usuarioId: this.userId,
          foroId: this.foroData.id
        };

        this.pubService.crear(nuevaPub).subscribe({
          next: () => {
            this.snack.open('Publicado correctamente', 'OK', {duration: 3000});
            this.cargarPublicaciones();
          },
          error: (err) => {
            console.error(err);
            this.snack.open('Error al publicar', 'Cerrar');
          }
        });
      }
    });
  }

  editar(pub: any) {
    const ref = this.dialog.open(PublicacionDialogComponent, { width: '500px', data: pub });
    ref.afterClosed().subscribe(res => {
      if (res) {
        const editada = {
          ...pub,
          titulo: res.titulo,
          contenido: res.contenido
        };
        this.pubService.actualizar(pub.id, editada).subscribe({
          next: () => {
            this.snack.open('Actualizado', 'OK', {duration: 3000});
            this.cargarPublicaciones();
          },
          error: () => this.snack.open('Error al editar', 'Cerrar')
        });
      }
    });
  }

  eliminar(id: number) {
    if(confirm('¿Eliminar publicación?')) {
      this.pubService.eliminar(id).subscribe({
        next: () => {
          this.snack.open('Eliminada', 'OK');
          this.cargarPublicaciones();
        },
        error: () => this.snack.open('Error al eliminar', 'Cerrar')
      });
    }
  }

  verComentarios(pub: any) {
    this.dialog.open(ComentariosComponent, {
      width: '90%',
      maxWidth: '800px',
      height: '90vh',
      data: pub,
      autoFocus: false
    });
  }
}