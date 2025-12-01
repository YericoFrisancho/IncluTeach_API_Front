import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/categorias';

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  crear(categoria: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, categoria);
  }

  actualizar(id: number, categoria: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar/${id}`, categoria);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}