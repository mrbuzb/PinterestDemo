import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Pin } from '../../../models/pin.model';
import { PinService } from '../../../services/pin.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pin-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="pin-card" [style.height.px]="cardHeight">
    <div class="pin-card" [style.height.px]="cardHeight" (click)="goToDetail()">
      <div class="pin-image-container">
        <img 
          [src]="pin.imageUrl || getPlaceholderImage()" 
          [alt]="pin.title"
          class="pin-image"
          (load)="onImageLoad($event)"
          (error)="onImageError($event)"
        >
        <div class="pin-overlay">
          <button 
            *ngIf="isAuthenticated"
            class="save-btn"
            [class.saved]="pin.isLiked"
            (click)="toggleLike()"
            [disabled]="likingInProgress"
          >
            {{ pin.isLiked ? 'Liked' : 'Like' }}
          </button>
        </div>
      </div>
      
      <div class="pin-info">
        <h3 class="pin-title">{{ pin.title }}</h3>
        <p class="pin-description" *ngIf="pin.description">{{ pin.description }}</p>
        <div class="pin-meta">
          <div class="pin-author">
            <div class="author-avatar">
              {{ getAuthorInitial() }}
            </div>
            <span>{{ getAuthorName() }}</span>
          </div>
          <div class="pin-stats">
            <span *ngIf="pin.likesCount" class="likes-count">
              ❤️ {{ pin.likesCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pin-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      overflow: hidden;
      position: relative;
    }

    .pin-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .pin-image-container {
      position: relative;
      overflow: hidden;
    }

    .pin-image {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 16px 16px 0 0;
      transition: transform 0.3s ease;
    }

    .pin-card:hover .pin-image {
      transform: scale(1.05);
    }

    .pin-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      padding: 16px;
    }

    .pin-card:hover .pin-overlay {
      opacity: 1;
    }

    .save-btn {
      background: #e60023;
      color: white;
      border: none;
      border-radius: 24px;
      padding: 12px 20px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
    }

    .save-btn:hover {
      background: #cc001e;
      transform: scale(1.05);
    }

    .save-btn.saved {
      background: #111;
    }

    .save-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .pin-info {
      padding: 16px;
    }

    .pin-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .pin-description {
      font-size: 14px;
      color: #666;
      margin: 0 0 12px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .pin-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pin-author {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }

    .author-avatar {
      width: 24px;
      height: 24px;
      background: #e60023;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    .pin-stats {
      display: flex;
      gap: 12px;
    }

    .likes-count {
      font-size: 12px;
      color: #666;
    }

    /* Random heights for masonry effect */
    :host:nth-child(3n+1) .pin-card {
      min-height: 300px;
    }

    :host:nth-child(3n+2) .pin-card {
      min-height: 400px;
    }

    :host:nth-child(3n+3) .pin-card {
      min-height: 250px;
    }
  `]
})
export class PinCardComponent implements OnInit {
  @Input() pin!: Pin;
  @Output() onLike = new EventEmitter<number>();
  @Output() onUnlike = new EventEmitter<number>();

  isAuthenticated = false;
  likingInProgress = false;
  cardHeight = 300;

  constructor(
    private pinService: PinService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.setRandomHeight();
    
    if (this.isAuthenticated && this.pin.id) {
      this.checkIfLiked();
    }
  }
  
goToDetail() {
  if (this.pin?.id) {
    this.router.navigate(['/pin', this.pin.id]);
  }
}
  private setRandomHeight() {
    const heights = [280, 350, 320, 400, 300, 380];
    this.cardHeight = heights[Math.floor(Math.random() * heights.length)];
  }

  onImageLoad(event: any) {
    const img = event.target;
    const aspectRatio = img.naturalHeight / img.naturalWidth;
    this.cardHeight = Math.max(250, Math.min(500, 280 * aspectRatio + 100));
  }

  onImageError(event: any) {
    event.target.src = this.getPlaceholderImage();
  }

  getPlaceholderImage(): string {
    const colors = ['667eea', 'f093fb', 'a8edea', 'ffeaa7', 'fab1a0'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `https://via.placeholder.com/300x400/${color}/ffffff?text=${encodeURIComponent(this.pin.title || 'Pin')}`;
  }

  getAuthorName(): string {
    if (this.pin.userFirstName && this.pin.userLastName) {
      return `${this.pin.userFirstName} ${this.pin.userLastName}`;
    }
    return this.pin.userName || 'Anonymous';
  }

  getAuthorInitial(): string {
    if (this.pin.userFirstName) {
      return this.pin.userFirstName.charAt(0).toUpperCase();
    }
    if (this.pin.userName) {
      return this.pin.userName.charAt(0).toUpperCase();
    }
    return 'A';
  }

  private checkIfLiked() {
    if (this.pin.id) {
      this.pinService.hasUserLiked(this.pin.id).subscribe({
        next: (isLiked) => {
          this.pin.isLiked = isLiked;
        },
        error: (error) => {
          console.error('Error checking like status:', error);
        }
      });
    }
  }

  toggleLike() {
    if (!this.pin.id || this.likingInProgress) return;

    this.likingInProgress = true;

    if (this.pin.isLiked) {
      this.pinService.unlikePin(this.pin.id).subscribe({
        next: () => {
          this.onUnlike.emit(this.pin.id);
          this.likingInProgress = false;
        },
        error: (error) => {
          console.error('Error unliking pin:', error);
          this.likingInProgress = false;
        }
      });
    } else {
      this.pinService.likePin(this.pin.id).subscribe({
        next: () => {
          this.onLike.emit(this.pin.id);
          this.likingInProgress = false;
        },
        error: (error) => {
          console.error('Error liking pin:', error);
          this.likingInProgress = false;
        }
      });
    }
  }
}