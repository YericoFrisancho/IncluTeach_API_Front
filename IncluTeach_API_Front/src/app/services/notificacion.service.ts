import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = 'http://localhost:8080/notificaciones';

  private contadorSubject = new BehaviorSubject<number>(0);
  public contador$ = this.contadorSubject.asObservable();

  actualizarContador() {
    const uid = this.auth.getCurrentUserId();
    if (uid) this.http.get<number>(`${this.apiUrl}/contador/${uid}`).subscribe(n => this.contadorSubject.next(n));
  }

  listar(uid: number): Observable<any[]> {
    this.actualizarContador();
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${uid}`);
  }

  toggle(uid: number, fid: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/toggle/usuario/${uid}/foro/${fid}`, {});
  }

  cambiarEstado(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cambiar-estado/${id}`, {}).pipe(tap(() => this.actualizarContador()));
  }

  marcarVisto(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/marcar-visto/${id}`, {}).pipe(tap(() => this.actualizarContador()));
  }

  limpiar(uid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/limpiar/${uid}`).pipe(tap(() => this.contadorSubject.next(0)));
  }
  getNotificacionesPorUsuario(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consultas/usuario/${userId}`);
  }

  getNotificacionesNoLeidas(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/contador/${userId}`);
  }
}
