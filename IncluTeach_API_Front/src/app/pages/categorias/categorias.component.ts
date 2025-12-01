import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// Componentes y Servicios
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CategoriaDialogComponent } from '../../components/categoria-dialog/categoria-dialog.component';
import { PublicacionesComponent } from '../publicaciones/publicaciones.component';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';
import { ForoService } from '../../services/foro.service';
import { RecursoService } from '../../services/recurso.service';

type Vista = 'HOME' | 'GESTION' | 'EXPLORAR';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NavbarComponent,
    MatCardModule, MatButtonModule, MatIconModule, MatTableModule, 
    MatSelectModule, MatRadioModule, MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  private catService = inject(CategoriaService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  
  private foroService = inject(ForoService);
  private recursoService = inject(RecursoService);

  userId = this.authService.getCurrentUserId();
  rolId = Number(localStorage.getItem('rolId'));

  vistaActual: Vista = 'HOME';
  categorias: any[] = []; 

  displayedColumns = ['id', 'nombre', 'descripcion', 'acciones'];

  tipoExplorar: 'FORO' | 'RECURSO' = 'FORO';
  categoriaSeleccionadaId: number | null = null;
  resultados: any[] = [];
  busquedaRealizada = false;

  ngOnInit() {
    this.cargarCategorias();
    if (this.rolId === 1) {
      this.vistaActual = 'EXPLORAR';
    } else {
      this.vistaActual = 'HOME';
    }
  }

  cargarCategorias() {
    this.catService.listar().subscribe(data => this.categorias = data);
  }

  cambiarVista(vista: Vista) {
    this.vistaActual = vista;
    if (vista === 'EXPLORAR') {
      this.resultados = [];
      this.busquedaRealizada = false;
      this.categoriaSeleccionadaId = null;
    }
  }

  // --- NUEVO MÉTODO PARA LIMPIAR AL CAMBIAR RADIO BUTTON ---
  onTipoChange() {
    this.resultados = []; // Limpia la lista visualmente
    this.busquedaRealizada = false; // Oculta mensaje de "no resultados"
  }

  puedeEditar(cat: any): boolean {
    if (this.rolId === 3) return true;
    if (this.rolId === 2) return cat.usuarioId === this.userId;
    return false;
  }

  crear() {
    const ref = this.dialog.open(CategoriaDialogComponent, { width: '400px' });
    ref.afterClosed().subscribe(res => {
      if (res) {
        this.catService.crear({ ...res, usuarioId: this.userId }).subscribe(() => {
          this.snack.open('Categoría creada', 'OK', { duration: 3000 });
          this.cargarCategorias();
        });
      }
    });
  }

  editar(cat: any) {
    const ref = this.dialog.open(CategoriaDialogComponent, { width: '400px', data: cat });
    ref.afterClosed().subscribe(res => {
      if (res) {
        this.catService.actualizar(cat.id, res).subscribe(() => {
          this.snack.open('Actualizada', 'OK', { duration: 3000 });
          this.cargarCategorias();
        });
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar categoría?')) {
      this.catService.eliminar(id).subscribe({
        next: () => {
          this.snack.open('Eliminada', 'OK');
          this.cargarCategorias();
        },
        error: () => this.snack.open('Error al eliminar', 'Cerrar')
      });
    }
  }

  buscar() {
    if (!this.categoriaSeleccionadaId) return;
    
    this.busquedaRealizada = true;
    this.resultados = [];

    if (this.tipoExplorar === 'FORO') {
      this.foroService.listarPorCategoria(this.categoriaSeleccionadaId).subscribe({
        next: (data) => this.resultados = data,
        error: () => this.snack.open('Error al cargar foros', 'Cerrar')
      });
    } else {
      // Asegúrate de que tu RecursoService tenga este método
      this.recursoService.getRecursosPorCategoria(this.categoriaSeleccionadaId).subscribe({
        next: (data) => this.resultados = data,
        error: () => this.snack.open('Error al cargar recursos', 'Cerrar')
      });
    }
  }
  
  verDetalle(item: any) {
    if (this.tipoExplorar === 'FORO') {
      this.dialog.open(PublicacionesComponent, {
        width: '95%',
        maxWidth: '1000px',
        height: '90vh',
        data: item
      });
    } else {
      // Detalle simple para Recursos
      alert(`Recurso: ${item.titulo}\n\n${item.descripcion}`);
    }
  }
}