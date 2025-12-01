import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PublicacionesComponent } from '../publicaciones/publicaciones.component';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule, NavbarComponent, DatePipe],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  private notiService = inject(NotificacionService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  notificaciones: any[] = [];
  userId = this.authService.getCurrentUserId();

  ngOnInit() { this.cargar(); }

  cargar() {
    if (this.userId) this.notiService.listar(this.userId).subscribe(data => this.notificaciones = data);
  }

  limpiar() {
    if (this.userId && confirm('¿Limpiar bandeja?')) {
      this.notiService.limpiar(this.userId).subscribe(() => this.cargar());
    }
  }

  toggleVisto(noti: any) {
    this.notiService.cambiarEstado(noti.id).subscribe(res => noti.visto = res.visto);
  }

  verPublicacion(noti: any) {
    if (!noti.visto) {
      this.notiService.marcarVisto(noti.id).subscribe(() => noti.visto = true);
    }
    this.dialog.open(PublicacionesComponent, {
      width: '95%', maxWidth: '1000px', height: '90vh',
      data: { id: noti.foroId, titulo: 'Foro' }
    });
  }
}