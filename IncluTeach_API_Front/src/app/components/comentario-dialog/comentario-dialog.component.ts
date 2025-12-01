import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-comentario-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './comentario-dialog.component.html'
})
export class ComentarioDialogComponent {
  private dialogRef = inject(MatDialogRef<ComentarioDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  comentario = this.data ? { ...this.data } : { contenido: '' };
  titulo = this.data ? 'Editar Comentario' : 'Nuevo Comentario';

  guardar() {
    if (this.comentario.contenido) {
      this.dialogRef.close(this.comentario);
    }
  }
  cancelar() { this.dialogRef.close(null); }
}