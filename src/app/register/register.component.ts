import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
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

  // Getter for form controls (you are already using f['field'])
  get f() {
    return this.registerForm.controls;
  }

  register() {

    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill all fields correctly', 'Close', {
        duration: 3000
      });
      return;
    }

    // Prepare data for backend (IMPORTANT: no confirmPassword sent)
    const formData = {
      fullName: this.registerForm.value.fullName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role
    };

    this.authService.register(formData).subscribe({
      next: (res: any) => {
        this.snackBar.open(res, 'Close', {
          duration: 3000
        });

        this.registerForm.reset();
      },

      error: (err) => {
        this.snackBar.open(
          err.error || 'Registration Failed',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }
}