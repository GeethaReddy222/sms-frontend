import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { passwordMatchValidator } from '.././validators/password-match.validator';
import { nameValidator } from '../validators/name-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            nameValidator
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
            )
          ]
        ],

        confirmPassword: [
          '',
          Validators.required
        ],

        role: [
          '',
          Validators.required
        ]
      },
      {
        validators: passwordMatchValidator
      }
    );
  }

  register() {

    if (this.registerForm.valid) {

      console.log(this.registerForm.value);

      this.snackBar.open(
        'Registration Successful',
        '',
        {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        }
      );

      this.router.navigate(['/login']);

    }

  }

  get f() {
    return this.registerForm.controls;
  }
}