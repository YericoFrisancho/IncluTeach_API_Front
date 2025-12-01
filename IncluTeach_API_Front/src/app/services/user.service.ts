import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/usuarios';

  constructor() { }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, usuarioDto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar/${id}`, usuarioDto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

  crear(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, usuario);
  }

  
  getUsuariosPorRol(nombreRol: string): Observable<any[]> {
    if (nombreRol) {
      return this.http.get<any[]>(`${this.apiUrl}/consultas/rol/${nombreRol}`);
    } else {
      return this.http.get<any[]>(`${this.apiUrl}/consultas/distribucion-roles`);
    }
  }

  getEstadisticasRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estadisticas/roles`);
  }

  getUsuariosConFavoritos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consultas/favoritos`);
  }

  getUsuariosQueSiguenForos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consultas/foros-seguidos`);
  }
}