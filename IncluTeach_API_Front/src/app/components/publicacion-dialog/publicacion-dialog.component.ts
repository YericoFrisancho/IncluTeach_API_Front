import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-publicacion-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './publicacion-dialog.component.html',
  styleUrls: ['./publicacion-dialog.component.css']
})
export class PublicacionDialogComponent {
  private dialogRef = inject(MatDialogRef<PublicacionDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  publicacion = this.data ? { ...this.data } : { titulo: '', contenido: '' };
  titulo = this.data ? 'Editar Publicación' : 'Nueva Publicación';

  guardar() {
    if (this.publicacion.titulo && this.publicacion.contenido) {
      this.dialogRef.close(this.publicacion);
    }
  }
  cancelar() { this.dialogRef.close(null); }
}