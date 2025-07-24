import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PinService } from '../../../services/pin.service';
import { AuthService } from '../../../services/auth.service';
import { Pin } from '../../../models/pin.model';
import { PinCardComponent } from '../pin-card/pin-card.component';

@Component({
  selector: 'app-pin-grid',
  standalone: true,
  imports: [CommonModule, RouterModule, PinCardComponent],
  template: `
    <div class="pin-grid-container">
      <div class="hero-section" *ngIf="!isAuthenticated">
        <h1>Get your next</h1>
        <div class="rotating-text">
          <span class="highlight">{{ currentText }}</span>
        </div>
        <div class="hero-actions">
          <a routerLink="/signup" class="btn btn-primary">Sign up</a>
        </div>
      </div>

      <div class="pins-section">
        <div class="pins-grid" [class.masonry]="pins.length > 0">
          <a 
            *ngFor="let pin of pins; trackBy: trackByPinId" 
            [routerLink]="['/pin', pin.id]"
            style="text-decoration: none; color: inherit;">
            <app-pin-card 
              [pin]="pin"
              (onLike)="onPinLike($event)"
              (onUnlike)="onPinUnlike($event)"
            ></app-pin-card>
          </a>
        </div>

        <div class="loading" *ngIf="loading">
          <div class="spinner"></div>
        </div>

        <div class="empty-state" *ngIf="!loading && pins.length === 0">
          <div class="empty-icon">📌</div>
          <h3>No pins yet</h3>
          <p>Be the first to create a pin!</p>
          <a routerLink="/create-pin" class="btn btn-primary" *ngIf="isAuthenticated">Create Pin</a>
        </div>
      </div>
    </div>
  `,
  styles:[
  `
  .pin-grid-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .hero-section {
    text-align: center;
    padding: 80px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 24px;
    margin: 20px 0 40px;
    color: white;
  }

  .hero-section h1 {
    font-size: 48px;
    font-weight: 700;
    margin: 0 0 16px;
    line-height: 1.2;
  }

  .rotating-text {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 32px;
    height: 60px;
  }

  .highlight {
    color: #FFD700;
    animation: fadeInUp 2s ease-in-out infinite;
  }

  .hero-actions {
    margin-top: 32px;
  }

  .pins-section {
    padding: 20px 0;
  }

  .pins-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    justify-content: center;
  }

  .pins-grid app-pin-card {
    display: block;
    width: 100%;
    max-height: 240px;
    overflow: hidden;
    border-radius: 8px;
  }

  .loading {
    display: flex;
    justify-content: center;
    padding: 40px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f0f0f0;
    border-left: 4px solid #e60023;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
  }

  .empty-icon {
    font-size: 64px;
    margin-bottom: 24px;
  }

  .empty-state h3 {
    color: #333;
    margin-bottom: 12px;
  }

  .empty-state p {
    color: #666;
    margin-bottom: 24px;
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
  }

  .btn-primary {
    background: #e60023;
    color: white;
  }

  .btn-primary:hover {
    background: #cc001e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(230, 0, 35, 0.3);
  }

  @keyframes fadeInUp {
    0%, 100% { opacity: 0; transform: translateY(20px); }
    50% { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 992px) {
    .pins-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 768px) {
    .hero-section h1,
    .rotating-text {
      font-size: 32px;
    }

    .pins-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .pins-grid {
      grid-template-columns: repeat(1, 1fr);
    }
  }
  `
]

})
export class PinGridComponent implements OnInit {
  pins: Pin[] = [];
  loading = true;
  isAuthenticated = false;
  currentText = 'weeknight dinner idea';

  private textRotation = [
    'weeknight dinner idea',
    'home decor idea',
    'new look outfit',
    'weekend project'
  ];
  private currentIndex = 0;

  constructor(
    private pinService: PinService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.loadPins();
    this.startTextRotation();
  }

  loadPins() {
    this.loading = true;
    this.pinService.getAllPins().subscribe({
      next: (pins) => {
        this.pins = pins || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pins:', error);
        this.pins = [];
        this.loading = false;
      }
    });
  }

  startTextRotation() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.textRotation.length;
      this.currentText = this.textRotation[this.currentIndex];
    }, 2000);
  }

  trackByPinId(index: number, pin: Pin): number | undefined {
    return pin.id;
  }

  onPinLike(pinId: number) {
    const pin = this.pins.find(p => p.id === pinId);
    if (pin) {
      pin.isLiked = true;
      pin.likesCount = (pin.likesCount || 0) + 1;
    }
  }

  onPinUnlike(pinId: number) {
    const pin = this.pins.find(p => p.id === pinId);
    if (pin) {
      pin.isLiked = false;
      pin.likesCount = Math.max(0, (pin.likesCount || 0) - 1);
    }
  }
}
