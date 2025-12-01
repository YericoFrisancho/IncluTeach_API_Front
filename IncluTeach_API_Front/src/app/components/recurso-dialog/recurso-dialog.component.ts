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
  selector: 'app-recurso-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './recurso-dialog.component.html'
})
export class RecursoDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<RecursoDialogComponent>);
  private catService = inject(CategoriaService);
  public data = inject(MAT_DIALOG_DATA);

  recurso = this.data ? { ...this.data } : { titulo: '', descripcion: '', categoriaId: null };
  titulo = this.data ? 'Editar Recurso' : 'Nuevo Recurso';
  categorias: any[] = [];

  ngOnInit() {
    this.catService.listar().subscribe(data => this.categorias = data);
  }

  guardar() {
    if (this.recurso.titulo && this.recurso.descripcion && this.recurso.categoriaId) {
      this.dialogRef.close(this.recurso);
    }
  }
  cancelar() { this.dialogRef.close(null); }
}