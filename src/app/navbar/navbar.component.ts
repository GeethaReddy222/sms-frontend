import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  userRole: string | null = null;
  userFullName: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check initial login status
    this.updateNavbarState();

    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(() => {
      this.updateNavbarState();
    });
  }

  updateNavbarState() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      this.userRole = user?.role || null;
      this.userFullName = user?.fullName || null;
    } else {
      this.userRole = null;
      this.userFullName = null;
    }
  }

  // Go to home and logout if user is logged in
  goHome() {
    if (this.isLoggedIn) {
      this.logout();
    } else {
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.updateNavbarState();
  }
}