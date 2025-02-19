import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private apiUrl = 'http://localhost:9191/autor';

  constructor(private http: HttpClient) { }

  registrar(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createAutor`, data).pipe(
      catchError(this.handleError)
    );
  }

  actualizar(id: number, data: any): Observable<any> {
    const url = `${this.apiUrl}/updateAutor/${id}`;
    return this.http.put(url, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  obtener(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/findAll`).pipe(
      catchError(this.handleError)
    )
  }

  eliminar(id: number): Observable<any> {
    const url = `${this.apiUrl}/deleteAutor/${id}`; 
    return this.http.get(url);
  }

  obtenerNacionalidades(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/obtenerNacionalidades`).pipe(
      catchError(this.handleError)
    )
  }

  obtenerEstado(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/obtenerEstado`).pipe(
      catchError(this.handleError)
    )
  }

  buscarAutor(nombre?: string, fechaNacimiento?: string, nacionalidad?: string, estado?: string): Observable<any> {
    const filtro = {
      nombre: nombre || null,
      fechaNacimiento: fechaNacimiento || null,
      nacionalidad: nacionalidad || null,
      estado: estado || null
    };
    return this.http.post<any>(`${this.apiUrl}/buscarAutor`, filtro, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  obtenerDataAutor(id: number): Observable<any> {
    const url = `${this.apiUrl}/obtenerDataAutor/${id}`; 
    return this.http.get(url);
  }



  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
