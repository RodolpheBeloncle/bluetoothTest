import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router, private alertController: AlertController) {
    const user = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    this.currentUserSubject = new BehaviorSubject<any>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser;
  }

  signIn(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/auth/signin`, credentials)
      .pipe(
        map(response => {
          if (response && response.token && response.user) {
            const { token, user } = response;
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('token', token);
            this.currentUserSubject.next(user);
            return response;
          } else {
            throw new Error('Invalid response from server');
          }
        }),
        catchError(error => {
          this.handleError(error);
          return throwError(() => new Error('Login failed'));
        })
      );
  }

  signUp(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/auth/signup`, credentials)
      .pipe(
        map(response => {
          if (response && response.user && response.user.id) { // Ensure response has user and user.id
            const { password, ...user } = response.user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return response;
          } else {
            throw new Error('Invalid response from server');
          }
        }),
        catchError(error => {
          this.handleError(error);
          return throwError(() => new Error('Registration failed'));
        })
      );
  }


  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${environment.backendUrl}/auth/forgot-password`, { email })
      .pipe(catchError(error => {
        this.handleError(error);
        return throwError(() => new Error('Password reset failed'));
      }));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.showAlert('Error', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  async signOut() {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
      this.showAlert('Success', 'You have successfully logged out.');
    } catch (error) {
      console.error('Error during sign-out:', error);
      this.showAlert('Failed', 'An error occurred while signing out. Please try again.');
    }
  }
}
