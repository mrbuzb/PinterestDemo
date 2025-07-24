import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PinService } from '../../../services/pin.service';
import { Pin } from '../../../models/pin.model';
import { PinCardComponent } from '../pin-card/pin-card.component';

@Component({
  selector: 'app-user-pins',
  standalone: true,
  imports: [CommonModule, RouterModule, PinCardComponent],
  template: `
    <div class="user-pins-container">
      <div class="page-header">
        <h1>My Pins</h1>
        <a routerLink="/create-pin" class="btn btn-primary">Create Pin</a>
      </div>

      <div class="pins-grid" *ngIf="pins.length > 0">
        <app-pin-card 
          *ngFor="let pin of pins; trackBy: trackByPinId" 
          [pin]="pin"
          (onLike)="onPinLike($event)"
          (onUnlike)="onPinUnlike($event)">
        </app-pin-card>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
      </div>

      <div class="empty-state" *ngIf="!loading && pins.length === 0">
        <div class="empty-icon">📌</div>
        <h3>You haven't created any pins yet</h3>
        <p>Share your ideas and inspirations with the world</p>
        <a routerLink="/create-pin" class="btn btn-primary">Create your first Pin</a>
      </div>
    </div>
  `,
  styles: [`
    .user-pins-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #333;
      margin: 0;
    }

    .pins-grid {
      column-count: auto;
      column-width: 280px;
      column-gap: 20px;
    }

    .pins-grid app-pin-card {
      break-inside: avoid;
      margin-bottom: 20px;
      display: inline-block;
      width: 100%;
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: 80px;
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
      font-size: 24px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 32px;
      font-size: 16px;
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

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 20px;
      }

      .page-header h1 {
        text-align: center;
      }

      .pins-grid {
        column-width: 250px;
        column-gap: 16px;
      }

      .pins-grid app-pin-card {
        margin-bottom: 16px;
      }
    }

    @media (max-width: 480px) {
      .pins-grid {
        column-width: 200px;
      }
    }
  `]
})
export class UserPinsComponent implements OnInit {
  pins: Pin[] = [];
  loading = true;

  constructor(private pinService: PinService) {}

  ngOnInit() {
    this.loadUserPins();
  }

  loadUserPins() {
    this.loading = true;
    this.pinService.getUserPins().subscribe({
      next: (pins) => {
        this.pins = pins || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user pins:', error);
        this.pins = [];
        this.loading = false;
      }
    });
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