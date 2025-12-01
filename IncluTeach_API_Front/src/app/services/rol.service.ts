import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/roles'; 

  constructor() { }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  registrar(rol: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, rol);
  }

  actualizar(id: number, rol: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar/${id}`, rol);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }
}