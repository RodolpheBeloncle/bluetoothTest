import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
    return new Observable(observer => {
      this.http.post(`${environment.backendUrl}/auth/login`, credentials).subscribe(
        (user: any) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          observer.next(user);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  signOut(): Observable<void> {
    return new Observable(observer => {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      observer.next();
      observer.complete();
    });
  }

  signUp(credentials: { email: string; password: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${environment.backendUrl}/auth/signup`, credentials).subscribe(
        (user: any) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          observer.next(user);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  forgotPassword(email: string): Observable<void> {
    return new Observable(observer => {
      this.http.post(`${environment.backendUrl}/auth/forgot-password`, { email }).subscribe(
        () => {
          observer.next();
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }
}
