import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-rol-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule
  ],
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.css']
})
export class RolDialogComponent {
  private dialogRef = inject(MatDialogRef<RolDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  rolData = this.data ? { ...this.data } : { nombre: '', descripcion: '' };
  titulo = this.data ? 'Editar Rol' : 'Nuevo Rol';

  guardar() {
    if (this.rolData.nombre && this.rolData.descripcion) {
      this.dialogRef.close(this.rolData);
    }
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
