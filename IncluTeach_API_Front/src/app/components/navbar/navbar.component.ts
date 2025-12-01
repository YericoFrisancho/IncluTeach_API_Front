import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Observable, map } from 'rxjs';
import { ExternalApiService } from '../../services/external-api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatToolbarModule, 
    MatButtonModule, 
    MatMenuModule, 
    MatIconModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public authService = inject(AuthService);
  public notiService = inject(NotificacionService);
  public externalApi = inject(ExternalApiService);
  private router = inject(Router);

  userName$: Observable<string> = this.authService.currentUser$.pipe(
    map(user => user?.username || 'user')
  );

  userDisplayName$: Observable<string | null> = this.authService.currentUser$.pipe(
    map(user => {
      if (!user) return null;
      
      let prefijo = '';
      switch (user.rolId) {
        case 1: prefijo = 'Fam.'; break;
        case 2: prefijo = 'Prof.'; break;
        case 3: prefijo = 'Admin.'; break;
        default: prefijo = 'User'; 
      }
      
      return `${prefijo} ${user.username}`;
    })
  );

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.notiService.actualizarContador();
    }
  }

  logout() {
    this.authService.logout();
  }
}