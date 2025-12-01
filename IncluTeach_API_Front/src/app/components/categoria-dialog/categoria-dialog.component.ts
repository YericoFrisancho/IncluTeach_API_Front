import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-categoria-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './categoria-dialog.component.html'
})
export class CategoriaDialogComponent {
  private dialogRef = inject(MatDialogRef<CategoriaDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  categoria = this.data ? { ...this.data } : { nombre: '', descripcion: '' };
  titulo = this.data ? 'Editar Categoría' : 'Nueva Categoría';

  guardar() {
    if (this.categoria.nombre && this.categoria.descripcion) {
      this.dialogRef.close(this.categoria);
    }
  }

  cancelar() { this.dialogRef.close(null); }
}