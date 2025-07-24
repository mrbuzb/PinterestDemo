import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  UserId: string;
  unique_name: string; // bu UserName
  role: string;
  exp: number;
}


@Component({
  selector: 'app-login',
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
          <h1>Welcome to Pinterest</h1>
          <p>Find new ideas to try</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="userName">Username</label>
            <input
              id="userName"
              type="text"
              formControlName="userName"
              [class.error]="loginForm.get('userName')?.invalid && loginForm.get('userName')?.touched"
              placeholder="Username"
            >
            <div class="error-message" *ngIf="loginForm.get('userName')?.invalid && loginForm.get('userName')?.touched">
              Username is required
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              placeholder="Password"
            >
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Password is required
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            [disabled]="loginForm.invalid || loading"
          >
            {{ loading ? 'Logging in...' : 'Log in' }}
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="auth-footer">
          <p>Not on Pinterest yet? <a routerLink="/signup">Sign up</a></p>
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
      background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
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
      gap: 8px;
    }

    label {
      font-weight: 600;
      color: #333;
      font-size: 14px;
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
      text-decoration: none;
      text-align: center;
      display: inline-block;
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
      margin-top: 4px;
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

    @media (max-width: 480px) {
      .auth-card {
        padding: 24px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
  if (this.loginForm.valid) {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data?.accessToken) {
          const accessToken = response.data.accessToken;

          // Tokenni saqlash
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken || '');
          localStorage.setItem('tokenType', response.data.tokenType);
          localStorage.setItem('expires', response.data.expires.toString());

          // 👇 Tokendan user ma'lumotlarini olish
          const decodedToken: JwtPayload = jwtDecode(accessToken);

          const user = {
            id: decodedToken.UserId,
            username: decodedToken.unique_name,
            role: decodedToken.role
          };

          localStorage.setItem('user', JSON.stringify(user));

          // Navigatsiya
          this.router.navigate(['/pins']);
        } else {
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    });
  }
}

}