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

  constructor(public authService: AuthService, public router: Router) {
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
}
