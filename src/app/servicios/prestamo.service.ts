import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private apiUrl = 'http://localhost:9191/prestamo';

  constructor(private http: HttpClient) { }

  registrar(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, data).pipe(
      catchError(this.handleError)
    );
  }

  actualizar(id: number, data: any): Observable<any> {
    const url = `${this.apiUrl}/updatePrestamo/${id}`;
    return this.http.put(url, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  obtener(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/findAllPrestamo`).pipe(
      catchError(this.handleError)
    )
  }

  eliminar(id: number): Observable<any> {
    const url = `${this.apiUrl}/delete/${id}`; 
    return this.http.get(url);
  }

  buscarPrestamo(idLibro?: any, fechaPrestamo?: string, fechaDevolucion?: string): Observable<any> {
    const filtro = {
      idLibro: idLibro || null,
      fechaPrestamo: fechaPrestamo || null,
      fechaDevolucion: fechaDevolucion || null
    };
    return this.http.post<any>(`${this.apiUrl}/buscarPrestamo`, filtro, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  obtenerDataPrestamo(id: number): Observable<any> {
    const url = `${this.apiUrl}/obtenerDataPrestamo/${id}`; 
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
