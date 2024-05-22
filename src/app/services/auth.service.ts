import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    const user = JSON.parse(localStorage.getItem('currentUser') ?? '{}');    
    this.currentUserSubject = new BehaviorSubject<any>(user);
    this.currentUser = this.currentUserSubject.asObservable();


  }

  getCurrentUser(): Observable<any> {
    return this.currentUser;
  }

  signIn(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/auth/signin`, credentials)
      .pipe(
        map(response => {
          if (response && response.token && response.user) {
            const { password, ...user } = response.user; // Remove password from user object
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', response.token); // Store the token if needed
            this.currentUserSubject.next(response.user);
            return response;
          } else {
            throw new Error('Invalid response from server');
          }
        }),
        catchError(this.handleError)
      );
  }

  signOut(): Observable<void> {
    return new Observable(observer => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token'); // Remove the token if stored
      this.currentUserSubject.next(null);
      observer.next();
      observer.complete();
    });
  }

  signUp(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/auth/signup`, credentials)
      .pipe(
        map(response => {
          if (response && response.id) {
            const { password, ...user } = response.user; // Remove password from user object
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(response);
            return response;
          } else {
            throw new Error('Invalid response from server');
          }
        }),
        catchError(this.handleError)
      );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${environment.backendUrl}/auth/forgot-password`, { email })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage)); // Updated to the new signature
  }
}
