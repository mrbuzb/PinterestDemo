import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <nav class="nav-container">
        <div class="nav-left">
          <a routerLink="/pins" class="logo">
            <span class="logo-icon">P</span>
            <span class="logo-text">Pinterest</span>
          </a>
          
          <div class="nav-links">
            <a routerLink="/pins" routerLinkActive="active" class="nav-link">Home</a>
            <a routerLink="/create-pin" *ngIf="currentUser" routerLinkActive="active" class="nav-link">Create</a>
          </div>
        </div>

        <div class="nav-right">
          <div *ngIf="currentUser; else authButtons" class="user-menu">
            <a routerLink="/my-pins" class="nav-link">My Pins</a>
            <div class="user-avatar" (click)="toggleDropdown()">
              <span>{{ getUserInitials() }}</span>
            </div>
            <div class="dropdown-menu" [class.show]="showDropdown">
              <button (click)="logout()" class="dropdown-item">Logout</button>
            </div>
          </div>
          
          <ng-template #authButtons>
            <div class="auth-buttons">
              <a routerLink="/login" class="btn btn-secondary">Log in</a>
              <a routerLink="/signup" class="btn btn-primary">Sign up</a>
            </div>
          </ng-template>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 12px 0;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: #e60023;
      font-weight: 700;
      font-size: 20px;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: #e60023;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .nav-links {
      display: flex;
      gap: 16px;
    }

    .nav-link {
      text-decoration: none;
      color: #333;
      font-weight: 600;
      padding: 12px 16px;
      border-radius: 24px;
      transition: all 0.2s ease;
    }

    .nav-link:hover, .nav-link.active {
      background: #f0f0f0;
      color: #e60023;
    }

    .nav-right {
      position: relative;
    }

    .auth-buttons {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 24px;
      text-decoration: none;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background: #e60023;
      color: white;
    }

    .btn-primary:hover {
      background: #cc001e;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: #e60023;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .user-avatar:hover {
      background: #cc001e;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      padding: 8px 0;
      margin-top: 8px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: block;
      width: 100%;
      padding: 12px 24px;
      text-align: left;
      background: none;
      border: none;
      color: #333;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s ease;
    }

    .dropdown-item:hover {
      background: #f0f0f0;
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      
      .logo-text {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  showDropdown = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    return (this.currentUser.firstName.charAt(0) + this.currentUser.lastName.charAt(0)).toUpperCase();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
  }
}