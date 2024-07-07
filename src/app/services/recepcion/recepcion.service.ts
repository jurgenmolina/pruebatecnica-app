import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecepcionProducto } from '../../model/recepcionProducto';

@Injectable({
  providedIn: 'root'
})
export class RecepcionProductoService {
  private apiUrl = `${environment.urlHost}api/recepcion-producto`;

  constructor(private http: HttpClient) {}

  getAllRecepciones(): Observable<RecepcionProducto[]> {
    return this.http.get<RecepcionProducto[]>(this.apiUrl, this.getHttpOptions());
  }

  getRecepcionById(id: number): Observable<RecepcionProducto> {
    return this.http.get<RecepcionProducto>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  createRecepcion(recepcion: RecepcionProducto): Observable<RecepcionProducto> {
    return this.http.post<RecepcionProducto>(this.apiUrl, recepcion, this.getHttpOptions());
  }

  updateRecepcion(id: number, recepcion: RecepcionProducto): Observable<RecepcionProducto> {
    return this.http.put<RecepcionProducto>(`${this.apiUrl}/${id}`, recepcion, this.getHttpOptions());
  }

  deleteRecepcion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  getRecepcionesByProveedor(proveedorId: number): Observable<RecepcionProducto[]> {
    return this.http.get<RecepcionProducto[]>(`${this.apiUrl}/proveedor/${proveedorId}`, this.getHttpOptions());
  }

  getRecepcionesByProducto(productoId: number): Observable<RecepcionProducto[]> {
    return this.http.get<RecepcionProducto[]>(`${this.apiUrl}/producto/${productoId}`, this.getHttpOptions());
  }

  getRecepcionesByFechas(inicio: Date, fin: Date): Observable<RecepcionProducto[]> {
    const params = {
      inicio: inicio.toISOString(),
      fin: fin.toISOString()
    };
    return this.http.get<RecepcionProducto[]>(`${this.apiUrl}/fechas`, { ...this.getHttpOptions(), params });
  }

  private getHttpOptions() {
    const token = sessionStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }
}