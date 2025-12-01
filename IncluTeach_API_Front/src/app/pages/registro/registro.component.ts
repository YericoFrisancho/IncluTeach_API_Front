import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatRadioModule, NavbarComponent],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  usuario = { nombre: '', username: '', email: '', password: '', rolId: 1 };

  registrar() {
    this.auth.registrar(this.usuario).subscribe({
      next: () => {
        this.snack.open('¡Registro exitoso! Inicia sesión.', 'OK', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.snack.open('Error al registrar. Verifica los datos.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}