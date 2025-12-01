import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PublicacionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/publicaciones';

  // Método básico para listar todo (Público/Auth)
  listar(): Observable<any[]> {
    return this.http.get<any[]>(${this.apiUrl}/listar);
  }

  listarPorForo(idForo: number): Observable<any[]> {

    return this.http.get<any[]>(${this.apiUrl}/foro/${idForo});
  }

  crear(publicacion: any): Observable<any> {
    return this.http.post<any>(${this.apiUrl}/registrar, publicacion);
  }

  actualizar(id: number, publicacion: any): Observable<any> {
    return this.http.put<any>(${this.apiUrl}/actualizar/${id}, publicacion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(${this.apiUrl}/eliminar/${id});
  }

  // --- CONSULTAS ADMIN ---

  getPublicacionesPorUsuario(userId: number): Observable<any[]> {
    return this.http.get<any[]>(${this.apiUrl}/consultas/usuario/${userId});
  }

  // Si tienes una función específica para el Dashboard Admin, crea una separada:
  getReportePorForoAdmin(foroId: number): Observable<any[]> {
    return this.http.get<any[]>(${this.apiUrl}/consultas/foro/${foroId});
  }
  getPublicacionesPorForo(foroId: number): Observable<any[]> {
    return this.http.get<any[]>(${this.apiUrl}/foro/${foroId});
  }

  buscarPublicacionesPorPalabra(palabra: string): Observable<any[]> {
    return this.http.get<any[]>(${this.apiUrl}/consultas/busqueda/${palabra});
  }

  // Estadísticas
  getEstadisticasForos(): Observable<any[]> {
    return this.http.get<any[]>(${this.apiUrl}/estadisticas/foros);
  }

  getTopUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(${this.apiUrl}/estadisticas/top-usuarios);
  }
}