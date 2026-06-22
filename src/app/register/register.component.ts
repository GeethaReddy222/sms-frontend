import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { nameValidator } from '../validators/name-validator';
import { passwordMatchValidator } from '../validators/password-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, nameValidator]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
            )
          ]
        ],
        confirmPassword: ['', [Validators.required]],
        role: ['', [Validators.required]]
      },
      {
        validators: passwordMatchValidator
      }
    );
  }

  // Getter for form controls
  get f() {
    return this.registerForm.controls;
  }

  register() {
    // Check if form is invalid
    if (this.registerForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      
      this.snackBar.open('Please fill all fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading = true;

    // Prepare data for backend (exclude confirmPassword)
    const formData = {
      fullName: this.registerForm.value.fullName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role
    };

    this.authService.register(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        
        this.snackBar.open(res || 'Registration Successful! Please login to continue.', 'Login Now', {
          duration: 5000,
          panelClass: ['success-snackbar']
        }).onAction().subscribe(() => {
          // Redirect to login when user clicks "Login Now"
          this.router.navigate(['/login']);
        });

        // COMPLETELY RESET THE FORM
        this.resetFormCompletely();

        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },

      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(
          err.error || 'Registration Failed. Please try again.',
          'Close',
          { 
            duration: 3000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  // COMPLETE RESET METHOD
  private resetFormCompletely() {
    // Reset form with empty values
    this.registerForm.reset({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    });

    // Mark all controls as pristine and untouched
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      // Clear any errors
      control?.setErrors(null);
    });

    // Clear the password mismatch error from the form group
    this.registerForm.setErrors(null);
    
    // Update validity
    this.registerForm.updateValueAndValidity();

    // Reset password visibility toggles
    this.hidePassword = true;
    this.hideConfirmPassword = true;
  }
}