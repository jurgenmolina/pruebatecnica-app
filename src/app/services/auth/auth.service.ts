import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { LoginRequest } from '../../model/loginRequest';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (this.isPlatformBrowser(this.platformId)) {
      this.currentUserLoginOn.next(sessionStorage.getItem("token") !== null);
      this.currentUserData.next(sessionStorage.getItem("token") || "");
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${environment.urlHost}api/auth/login`, credentials).pipe(
      tap((userData) => {
        sessionStorage.setItem("token", userData.token);
        this.currentUserData.next(userData.token);
        this.currentUserLoginOn.next(true);
        this.currentUserSubject.next(userData.username);
      }),
      map((userData) => userData.token),
      catchError(this.handleError)
    );
  }

  logout(): void {
    sessionStorage.removeItem("token");
    this.currentUserLoginOn.next(false);
    this.currentUserSubject.next(null);
  }

  refreshToken(oldToken: string): Observable<any> {
    return this.http.post<any>(`${environment.urlHost}api/auth/refresh-token`, oldToken).pipe(
      tap((newTokenData) => {
        sessionStorage.setItem("token", newTokenData.token);
        this.currentUserData.next(newTokenData.token);
      }),
      map((newTokenData) => newTokenData.token),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error:', error.error);
    } else {
      console.error('Backend retornó el código de estado:', error.status, error.error);
    }
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'));
  }

  get userData(): Observable<string> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  get userToken(): string {
    return this.currentUserData.value;
  }

  private isPlatformBrowser(platformId: Object): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }
}
