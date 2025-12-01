import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './admin-dialog.component.html',
  styleUrls: ['./admin-dialog.component.css']
})
export class AdminDialogComponent {
  private dialogRef = inject(MatDialogRef<AdminDialogComponent>);

  adminData = {
    nombre: '',
    username: '',
    email: '',
    contrasena: '',
    rolId: 3
  };

  guardar() {
    if (this.adminData.nombre && this.adminData.username && 
        this.adminData.email && this.adminData.contrasena) {
      
      this.dialogRef.close(this.adminData);
    }
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}