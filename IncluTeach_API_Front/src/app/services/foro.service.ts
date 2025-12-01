import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ForoService {
  private http = inject(HttpClient);
  
  private apiUrl = 'http://localhost:8080/foros'; 
  private apiSeguidos = 'http://localhost:8080/foros-seguidos';


  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  listarPorCategoria(idCategoria: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categoria/${idCategoria}`);
  }

  listarSeguidos(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/seguidos/${usuarioId}`);
  }

  crear(foroDTO: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, foroDTO);
  }

  actualizar(id: number, foroDTO: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar/${id}`, foroDTO);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }


  seguir(usuarioId: number, foroId: number): Observable<any> {
    const payload = {
      fechaSeguimiento: new Date(),
      notificacionesActivas: false,
      usuario: { id: usuarioId },
      foro: { id: foroId }
    };
    return this.http.post<any>(`${this.apiSeguidos}/registrar`, payload);
  }

  dejarDeSeguir(usuarioId: number, foroId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiSeguidos}/dejar-seguir/usuario/${usuarioId}/foro/${foroId}`);
  }
}