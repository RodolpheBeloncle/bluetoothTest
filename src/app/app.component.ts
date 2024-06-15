// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isAuthenticated: Observable<boolean>;
  title = 'push-notifications-client';

  constructor(
    private authService: AuthService,
    private router: Router,

  ) {
    this.isAuthenticated = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/groups']);
      }
    });


  }

  signOut(): void {
    this.authService.signOut();
  }

  redirectTo(path: string): void {
    this.router.navigate([path]);
  }
}
