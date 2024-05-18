import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor() {
    const user = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    this.currentUserSubject = new BehaviorSubject<any>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser;
  }

  signIn(credentials: { email: string; password: string }): Observable<any> {
    return new Observable(observer => {
      // Simulate API call to sign in
      setTimeout(() => {
        const user = { id: 2, email: "bob@exemple.com" }; // Simulate user data
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        observer.next(user);
        observer.complete();
      }, 1000);
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
      // Simulate API call to sign up
      setTimeout(() => {
        const user = { id: 1, email: credentials.email }; // Simulate user data
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        observer.next(user);
        observer.complete();
      }, 1000);
    });
  }
  forgotPassword(email: string): Observable<void> {
    return new Observable(observer => {
      // Simulate API call to reset password
      setTimeout(() => {
        observer.next();
        observer.complete();
      }, 1000);
    });
  }






}
