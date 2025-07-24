import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { 
  User, 
  UserCreateDto, 
  UserLoginDto, 
  AuthResponse, 
  SendCodeRequest, 
  ConfirmCodeRequest,
  RefreshRequestDto 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  private readonly API_URL = 'https://localhost:7072/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you might decode the JWT to get user info
      // For now, we'll just indicate that user is logged in
      this.currentUserSubject.next({ 
        firstName: 'User', 
        lastName: '', 
        userName: '', 
        email: '', 
        phoneNumber: '' 
      });
    }
  }
  
getCurrentUserId(): number | null {
  const user = this.currentUserSubject.value;
  return user && 'id' in user ? (user as any).id : null;
}

  signUp(userData: UserCreateDto): Observable<any> {
    return this.http.post(`${this.API_URL}/sign-up`, userData);
  }

  sendCode(request: SendCodeRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/send-code`, request);
  }

  confirmCode(request: ConfirmCodeRequest): Observable<boolean> {
  return this.http.post<boolean>(`${this.API_URL}/confirm-code`, request).pipe(
    tap((success: boolean) => {
      if (success) {
        this.router.navigate(['/login']);
      }
    })
  );
}


  login(credentials: UserLoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data?.accessToken) {
          this.setTokens(response.data.accessToken, response.data.refreshToken);
          this.currentUserSubject.next({ 
            firstName: 'User', 
            lastName: '', 
            userName: credentials.userName, 
            email: '', 
            phoneNumber: '' 
          });
        }
      })
    );
  }

  refreshToken(): Observable<any> {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!accessToken || !refreshToken) {
      this.logout();
      throw new Error('No tokens available');
    }

    const request: RefreshRequestDto = { accessToken, refreshToken };
    return this.http.put(`${this.API_URL}/refresh-token`, request).pipe(
      tap((response: any) => {
        if (response.success && response.data?.token) {
          this.setTokens(response.data.token, response.data.refreshToken);
        }
      })
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.http.delete(`${this.API_URL}/log-out?refreshToken=${refreshToken}`).subscribe();
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setTokens(token: string, refreshToken: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setUserEmail(email: string): void {
    localStorage.setItem('userEmail', email);
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
}