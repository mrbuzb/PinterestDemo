import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <span class="logo-icon">P</span>
            <span>Pinterest</span>
          </div>
          <h1>Sign up to get your ideas</h1>
        </div>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <input
              type="text"
              formControlName="firstName"
              placeholder="First name"
              [class.error]="signupForm.get('firstName')?.invalid && signupForm.get('firstName')?.touched"
            >
          </div>

          <div class="form-group">
            <input
              type="text"
              formControlName="lastName"
              placeholder="Last name"
              [class.error]="signupForm.get('lastName')?.invalid && signupForm.get('lastName')?.touched"
            >
          </div>

          <div class="form-group">
            <input
              type="email"
              formControlName="email"
              placeholder="Email"
              [class.error]="signupForm.get('email')?.invalid && signupForm.get('email')?.touched"
            >
          </div>

          <div class="form-group">
            <input
              type="text"
              formControlName="userName"
              placeholder="Username"
              [class.error]="signupForm.get('userName')?.invalid && signupForm.get('userName')?.touched"
            >
          </div>

          <div class="form-group">
            <input
              type="tel"
              formControlName="phoneNumber"
              placeholder="Phone number"
              [class.error]="signupForm.get('phoneNumber')?.invalid && signupForm.get('phoneNumber')?.touched"
            >
          </div>

          <div class="form-group">
            <input
              type="password"
              formControlName="password"
              placeholder="Create a password"
              [class.error]="signupForm.get('password')?.invalid && signupForm.get('password')?.touched"
            >
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="signupForm.invalid || loading"
          >
            {{ loading ? 'Creating account...' : 'Continue' }}
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="auth-footer">
          <p>Already a member? <a routerLink="/login">Log in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #e60023;
      font-weight: 700;
      font-size: 24px;
      margin-bottom: 16px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: #e60023;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    h1 {
      color: #333;
      margin-bottom: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    input {
      padding: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.2s ease;
      background: #f9f9f9;
    }

    input:focus {
      outline: none;
      border-color: #e60023;
      background: white;
      box-shadow: 0 0 0 3px rgba(230, 0, 35, 0.1);
    }

    input.error {
      border-color: #ff4444;
    }

    .btn {
      padding: 16px;
      border-radius: 24px;
      border: none;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 8px;
    }

    .btn-primary {
      background: #e60023;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #cc001e;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(230, 0, 35, 0.3);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .error-message {
      color: #ff4444;
      font-size: 14px;
      text-align: center;
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
    }

    .auth-footer a {
      color: #e60023;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.signUp(this.signupForm.value).subscribe({
        next: () => {
          this.authService.setUserEmail(this.signupForm.value.email);
          this.sendVerificationCode();
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Registration failed. Please try again.';
        }
      });
    }
  }

  private sendVerificationCode() {
    const email = this.signupForm.value.email;
    this.authService.sendCode({ email }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/verify-code']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to send verification code. Please try again.';
      }
    });
  }
}
