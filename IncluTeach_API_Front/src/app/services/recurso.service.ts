import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecursoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/recursos';
  private apiFav = 'http://localhost:8080/favoritos';

  
  listar(): Observable<any[]> { 
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }
  
  listarTodos(): Observable<any[]> {
    return this.listar();
  }

  crear(recursoDTO: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, recursoDTO);
  }

  actualizar(id: number, recursoDTO: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar/${id}`, recursoDTO);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

  listarFavoritos(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favoritos/${usuarioId}`);
  }

  agregarFavorito(usuarioId: number, recursoId: number): Observable<any> {
    const data = {
      fechaAgregado: new Date(),
      usuario: { id: usuarioId },
      recurso: { id: recursoId }
    };
    return this.http.post<any>(`${this.apiFav}/registrar`, data);
  }

  eliminarFavorito(usuarioId: number, recursoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiFav}/usuario/${usuarioId}/recurso/${recursoId}`);
  }

  getRecursosPorCategoria(categoriaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consultas/categoria/${categoriaId}`);
  }
  
  listarPorCategoria(categoriaId: number): Observable<any[]> {
    return this.getRecursosPorCategoria(categoriaId);
  }

  getEstadisticasCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estadisticas/categorias`);
  }
}