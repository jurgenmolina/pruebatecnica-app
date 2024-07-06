import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../../model/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = `${environment.urlHost}api/proveedor`;

  constructor(private http: HttpClient) {}

  getAllProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl, this.getHttpOptions());
  }

  getProveedor(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  createProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.apiUrl, proveedor, this.getHttpOptions());
  }

  updateProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, proveedor, this.getHttpOptions());
  }

  deleteProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  getProveedorPorIdentificacion(identificacion: string): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/identificacion/${identificacion}`, this.getHttpOptions());
  }

  existeProveedorPorIdentificacion(identificacion: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/existe/${identificacion}`, this.getHttpOptions());
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