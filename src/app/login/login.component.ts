import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  hidePassword = true;
  isLoading = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  login() {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
      
      this.snackBar.open('Please fill all fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading = true;

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(loginData).subscribe({
      next: (user: any) => {
        this.isLoading = false;
        
        this.snackBar.open('Login Successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Redirect based on role from the user object
        this.redirectBasedOnRole(user.role);
      },

      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(
          err.error || 'Login Failed. Please check your credentials.',
          'Close',
          { 
            duration: 3000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  private redirectBasedOnRole(role: string) {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'TEACHER':
        this.router.navigate(['/teacher']);
        break;
      case 'STUDENT':
        this.router.navigate(['/student']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
}