import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ExternalApiService } from '../../services/external-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  private externalApi = inject(ExternalApiService);

  frase: string = 'Cargando inspiración...';
  autor: string = '';

  ngOnInit() {
    this.cargarFrase();
  }

  cargarFrase() {
    this.externalApi.getFraseInspiradora().subscribe(data => {
      this.frase = data.content;
      this.autor = data.author;
    });
  }
}