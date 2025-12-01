import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RecursoService } from '../../services/recurso.service';
import { AuthService } from '../../services/auth.service';
import { RecursoDialogComponent } from '../../components/recurso-dialog/recurso-dialog.component';
import { ExternalApiService } from '../../services/external-api.service';

@Component({
  selector: 'app-recursos',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTabsModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatDialogModule, MatSnackBarModule, MatTooltipModule,
    MatProgressSpinnerModule, NavbarComponent
  ],
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.css']
})
export class RecursosComponent implements OnInit {
  private recService = inject(RecursoService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  
  private externalApi = inject(ExternalApiService);

  recursosTodos: any[] = [];
  recursosFavoritos: any[] = [];
  
  librosEncontrados: any[] = [];
  busquedaLibro: string = '';
  cargandoLibros: boolean = false;
  
  userId = this.authService.getCurrentUserId();
  rolId = Number(localStorage.getItem('rolId'));

  ngOnInit() {
    this.cargarTodos();
    if (this.userId) {
      this.cargarFavoritos();
    }
  }

  cargarTodos() {
    this.recService.listarTodos().subscribe(data => this.recursosTodos = data);
  }

  cargarFavoritos() {
    if (!this.userId) return;
    this.recService.listarFavoritos(this.userId).subscribe(data => this.recursosFavoritos = data);
  }

  get puedeCrear(): boolean { return this.rolId === 2 || this.rolId === 3; } 

  esMio(rec: any): boolean { return rec.usuarioId === this.userId; }

  puedeEliminar(rec: any): boolean {
    return this.rolId === 3 || (this.rolId === 2 && this.esMio(rec)); 
  }

  esFavorito(recId: number): boolean {
    return this.recursosFavoritos.some(r => r.id === recId);
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/128x192.png?text=Sin+Portada';
    
  }

  toggleFavorito(rec: any) {
    if (!this.userId) return;

    if (this.esFavorito(rec.id)) {
      this.recService.eliminarFavorito(this.userId, rec.id).subscribe({
        next: () => {
          this.snack.open('Eliminado de favoritos', 'OK', {duration: 2000});
          this.cargarFavoritos();
        },
        error: () => this.snack.open('Error al quitar favorito', 'Cerrar')
      });
    } else {
      this.recService.agregarFavorito(this.userId, rec.id).subscribe({
        next: () => {
          this.snack.open('¡Agregado a favoritos!', 'OK', {duration: 2000});
          this.cargarFavoritos();
        },
        error: () => this.snack.open('Error al agregar favorito', 'Cerrar')
      });
    }
  }

  crear() {
    const ref = this.dialog.open(RecursoDialogComponent, { width: '500px' });
    ref.afterClosed().subscribe(res => {
      if (res && this.userId) {
        const nuevo = {
          titulo: res.titulo,
          descripcion: res.descripcion,
          usuarioId: this.userId,
          categoriaId: res.categoriaId
        };
        this.recService.crear(nuevo).subscribe({
          next: () => {
            this.snack.open('Recurso creado', 'OK', {duration: 3000});
            this.cargarTodos();
          },
          error: () => this.snack.open('Error al crear', 'Cerrar')
        });
      }
    });
  }

  editar(rec: any) {
    const ref = this.dialog.open(RecursoDialogComponent, { width: '500px', data: rec });
    ref.afterClosed().subscribe(res => {
      if (res) {
        const editado = {
          ...rec,
          titulo: res.titulo,
          descripcion: res.descripcion,
          categoriaId: res.categoriaId
        };
        this.recService.actualizar(rec.id, editado).subscribe({
          next: () => {
            this.snack.open('Actualizado', 'OK', {duration: 3000});
            this.cargarTodos();
            this.cargarFavoritos();
          },
          error: () => this.snack.open('Error al editar', 'Cerrar')
        });
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar recurso permanentemente?')) {
      this.recService.eliminar(id).subscribe({
        next: () => {
          this.snack.open('Eliminado', 'OK');
          this.cargarTodos();
          this.cargarFavoritos();
        },
        error: () => this.snack.open('Error al eliminar', 'Cerrar')
      });
    }
  }

  buscarLibrosExternos() {
    if (!this.busquedaLibro.trim()) return;
    
    this.cargandoLibros = true;
    this.librosEncontrados = []; 

    this.externalApi.buscarLibros(this.busquedaLibro).subscribe({
      next: (data) => {
        this.librosEncontrados = data;
        this.cargandoLibros = false;
      },
      error: () => {
        this.snack.open('Error al buscar en la biblioteca externa', 'Cerrar');
        this.cargandoLibros = false;
      }
    });
  }
}