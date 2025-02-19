import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9191/login';
  private isAuthenticated = false;

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        console.log('x');
        if (response && response.token) {
          this.isAuthenticated = true;
          localStorage.setItem('authToken', response.token);
         /*  localStorage.setItem('usuario',  JSON.stringify({username: response.data.username, idUsuario : response.data.idUsuario})); */
        } else {
          this.isAuthenticated = false;
        }
      }),
      catchError(error => {
        this.isAuthenticated = false;
        return of(null);
      })
    );
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
}
