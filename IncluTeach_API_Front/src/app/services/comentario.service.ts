import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComentarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/comentarios';

  listarPorPublicacion(idPub: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consultas/publicacion/${idPub}`);
  }

  crear(comentario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, comentario);
  }

  actualizar(id: number, comentario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar/${id}`, comentario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

  getComentariosPorPublicacion(publicacionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consultas/publicacion/${publicacionId}`);
  }
}
