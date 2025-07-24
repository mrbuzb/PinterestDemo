import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <span class="logo-icon">P</span>
            <span>Pinterest</span>
          </div>
          <h1>We sent you a code</h1>
          <p>Enter the 6-digit code we sent to {{ userEmail }}</p>
        </div>

        <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <input
              type="text"
              formControlName="code"
              placeholder="Enter 6-digit code"
              maxlength="6"
              [class.error]="verifyForm.get('code')?.invalid && verifyForm.get('code')?.touched"
              class="code-input"
            >
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="verifyForm.invalid || loading"
          >
            {{ loading ? 'Verifying...' : 'Continue' }}
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="auth-footer">
          <button (click)="resendCode()" class="link-btn" [disabled]="resendLoading">
            {{ resendLoading ? 'Sending...' : 'Send code again' }}
          </button>
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
      background: linear-gradient(45deg, #a8edea 0%, #fed6e3 100%);
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
      margin-bottom: 8px;
      font-size: 24px;
      font-weight: 600;
    }

    p {
      color: #666;
      margin-bottom: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .code-input {
      padding: 20px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      font-size: 24px;
      font-weight: 600;
      text-align: center;
      letter-spacing: 8px;
      transition: all 0.2s ease;
      background: #f9f9f9;
    }

    .code-input:focus {
      outline: none;
      border-color: #e60023;
      background: white;
      box-shadow: 0 0 0 3px rgba(230, 0, 35, 0.1);
    }

    .code-input.error {
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

    .link-btn {
      background: none;
      border: none;
      color: #e60023;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      text-decoration: underline;
    }

    .link-btn:hover:not(:disabled) {
      color: #cc001e;
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
  `]
})
export class VerifyCodeComponent implements OnInit {
  verifyForm: FormGroup;
  loading = false;
  resendLoading = false;
  errorMessage = '';
  userEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit() {
    this.userEmail = this.authService.getUserEmail() || '';
    if (!this.userEmail) {
      this.router.navigate(['/signup']);
    }
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const request = {
        code: this.verifyForm.value.code,
        email: this.userEmail
      };

      this.authService.confirmCode(request).subscribe({
        next: (response) => {
          this.loading = false;
          if (response) {
            this.router.navigate(['/pins']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Invalid code. Please try again.';
        }
      });
    }
  }

  resendCode() {
    this.resendLoading = true;
    this.authService.sendCode({ email: this.userEmail }).subscribe({
      next: () => {
        this.resendLoading = false;
      },
      error: () => {
        this.resendLoading = false;
      }
    });
  }
}