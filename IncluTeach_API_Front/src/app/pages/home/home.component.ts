import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, MatButtonModule, MatSnackBarModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  validarComenzar() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/app/dashboard']);
    } else {
      this.snack.open('Debes iniciar sesión primero antes de entrar.', 'OK', {
        duration: 4000, verticalPosition: 'top'
      });
    }
  }
}
