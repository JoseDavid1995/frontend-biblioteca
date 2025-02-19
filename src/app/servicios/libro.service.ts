import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl = 'http://localhost:9191/libro';

  constructor(private http: HttpClient) { }

  registrar(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, data).pipe(
      catchError(this.handleError)
    );
  }

  actualizar(id: number, data: any): Observable<any> {
    const url = `${this.apiUrl}/updateBook/${id}`;
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
    const url = `${this.apiUrl}/delete/${id}`; 
    return this.http.get(url);
  }

  activar(id: number): Observable<any> {
    const url = `${this.apiUrl}/activar/${id}`; 
    return this.http.get(url);
  }

  buscarLibro(titulo?: string, fechaPublicacion?: string, idAutor?: any, estado?: any): Observable<any> {
    const filtro = {
      titulo: titulo || null,
      fechaPublicacion: fechaPublicacion || null,
      idAutor: idAutor || null,
      estado: estado !== null ? estado : null
    };
    return this.http.post<any>(`${this.apiUrl}/buscarLibro`, filtro, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  obtenerDataLibro(id: number): Observable<any> {
    const url = `${this.apiUrl}/obtenerDataLibro/${id}`; 
    return this.http.get(url);
  }

  obtenerEstado(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/obtenerEstado`).pipe(
      catchError(this.handleError)
    )
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
