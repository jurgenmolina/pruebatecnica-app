import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../model/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = `${environment.urlHost}api/producto`;

  constructor(private http: HttpClient) {}

  getAllProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl, this.getHttpOptions());
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  createProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto, this.getHttpOptions());
  }

  updateProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto, this.getHttpOptions());
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  getProductoByCodigo(codigo: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/codigo/${codigo}`, this.getHttpOptions());
  }

  getProductosByEstado(estado: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/estado/${estado}`, this.getHttpOptions());
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