import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-foro-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './foro-dialog.component.html'
})
export class ForoDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ForoDialogComponent>);
  private catService = inject(CategoriaService);
  public data = inject(MAT_DIALOG_DATA);

  foro = this.data ? { ...this.data } : { titulo: '', descripcion: '', categoriaId: null };
  titulo = this.data ? 'Editar Foro' : 'Nuevo Foro';
  categorias: any[] = [];

  ngOnInit() {
    this.catService.listar().subscribe(data => this.categorias = data);
  }

  guardar() {
    if (this.foro.titulo && this.foro.descripcion && this.foro.categoriaId) {
      this.dialogRef.close(this.foro);
    }
  }
  cancelar() { this.dialogRef.close(null); }
}
