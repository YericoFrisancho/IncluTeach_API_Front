import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/auth'; 

  private currentUserSubject = new BehaviorSubject<any>(this.getUserData());
  public currentUser$ = this.currentUserSubject.asObservable();

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('rolId', response.rolId.toString());
        localStorage.setItem('userId', response.id.toString());

        this.currentUserSubject.next({
          username: response.username,
          rolId: response.rolId,
          id: response.id
        });
      })
    );
  }

  registrar(userData: any) {
    return this.http.post(`${this.apiUrl}/registrar`, userData);
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  private getUserData() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return {
      username: localStorage.getItem('username'),
      rolId: Number(localStorage.getItem('rolId')),
      id: Number(localStorage.getItem('userId'))
    };
  }

  getCurrentUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  updateSession(newToken: string, newUsername: string, newRolId?: number) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    
    if (newRolId !== undefined && newRolId !== null) {
      localStorage.setItem('rolId', newRolId.toString());
    }

    const currentId = this.getCurrentUserId();
    const currentRol = Number(localStorage.getItem('rolId'));

    this.currentUserSubject.next({
      username: newUsername,
      rolId: currentRol,
      id: currentId
    });
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  isAuthenticated(): boolean { return !!this.getToken(); }
}