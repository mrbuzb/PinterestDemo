import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PinService } from '../../../services/pin.service';
import { AuthService } from '../../../services/auth.service';
import { Pin, Comment } from '../../../models/pin.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pin-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="pin-detail-container" *ngIf="pin">
      <div class="pin-content">
        <div class="pin-image-section">
          <img [src]="pin.imageUrl" [alt]="pin.title" class="pin-image">
          <button 
            *ngIf="isAuthenticated"
            class="save-btn"
            [class.saved]="pin.isLiked"
            (click)="toggleLike()"
            [disabled]="likingInProgress"
          >
            {{ pin.isLiked ? 'Liked' : 'Like' }}
          </button>
          <div class="like-count" *ngIf="pin.likesCount !== undefined">
  ❤️ {{ pin.likesCount }} likes
</div>
        </div>

        <div class="pin-info-section">
          <h1>{{ pin.title }}</h1>
          <p class="pin-description">{{ pin.description }}</p>
          
          <div class="pin-author">
            <div class="author-avatar">{{ getAuthorInitial() }}</div>
            <div class="author-info">
              <h4>{{ getAuthorName() }}</h4>
            </div>
          </div>

          <div class="comments-section">
            <h3>Comments</h3>
            
            <form *ngIf="isAuthenticated" [formGroup]="commentForm" (ngSubmit)="addComment()" class="comment-form">
              <textarea
                formControlName="text"
                placeholder="Add a comment..."
                rows="3"
              ></textarea>
              <button type="submit" [disabled]="commentForm.invalid || commentLoading" class="btn btn-primary">
                {{ commentLoading ? 'Posting...' : 'Post' }}
              </button>
            </form>

            <div class="comments-list">
              <div *ngFor="let comment of comments" class="comment">
                <div class="comment-avatar">{{ getCommentAuthorInitial(comment) }}</div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.userName || 'Anonymous' }}</span>
                    <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <p class="comment-text">{{ comment.text }}</p>
                </div>
              </div>
              <div *ngIf="comments.length === 0" class="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button (click)="deletePin()" class="btn btn-danger" *ngIf="isAuthenticated">
  Delete Pin
</button>
    </div>
    <div class="loading" *ngIf="loading">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .pin-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .pin-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
    }

    .pin-image-section {
      position: relative;
    }

    .pin-image {
      width: 100%;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .save-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: #e60023;
      color: white;
      border: none;
      border-radius: 24px;
      padding: 12px 24px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .save-btn:hover {
      background: #cc001e;
      transform: scale(1.05);
    }

    .save-btn.saved {
      background: #111;
    }

    .pin-info-section {
      padding: 20px 0;
    }

    .pin-info-section h1 {
      font-size: 36px;
      font-weight: 700;
      color: #333;
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .pin-description {
      font-size: 18px;
      color: #666;
      line-height: 1.5;
      margin-bottom: 32px;
    }

    .pin-author {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 32px;
    }

    .author-avatar {
      width: 48px;
      height: 48px;
      background: #e60023;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
    }

    .author-info h4 {
      margin: 0 0 4px;
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }

    .follower-count {
      color: #666;
      font-size: 14px;
    }

    .comments-section {
      margin-top: 32px;
    }

    .comments-section h3 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 24px;
    }

    .comment-form {
      margin-bottom: 32px;
    }

    .comment-form textarea {
      width: 100%;
      padding: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      font-size: 14px;
      margin-bottom: 12px;
      resize: vertical;
      transition: border-color 0.2s ease;
    }

    .comment-form textarea:focus {
      outline: none;
      border-color: #e60023;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 24px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #e60023;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #cc001e;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .comment {
      display: flex;
      gap: 12px;
    }

    .comment-avatar {
      width: 32px;
      height: 32px;
      background: #e60023;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .comment-content {
      flex: 1;
    }

    .comment-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .comment-author {
      font-weight: 600;
      color: #333;
    }

    .comment-date {
      font-size: 12px;
      color: #666;
    }

    .comment-text {
      color: #333;
      line-height: 1.4;
      margin: 0;
    }

    .no-comments {
      text-align: center;
      padding: 40px;
      color: #666;
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

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .pin-content {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .pin-info-section h1 {
        font-size: 28px;
      }
    }
  `]
})
export class PinDetailComponent implements OnInit {
  pin: Pin | null = null;
  comments: Comment[] = [];
  commentForm: FormGroup;
  loading = true;
  isAuthenticated = false;
  likingInProgress = false;
  commentLoading = false;

  constructor(
    private route: ActivatedRoute,
    private pinService: PinService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    this.route.params.subscribe(params => {
      const pinId = +params['id'];
      if (pinId) {
        this.loadPin(pinId);
        this.loadComments(pinId);
      }
    });
  }

  loadPin(pinId: number) {
    this.pinService.getPinById(pinId).subscribe({
      next: (pin) => {
        this.pin = pin;
        this.loading = false;
        
        if (this.isAuthenticated) {
          this.checkIfLiked(pinId);
        }
      },
      error: (error) => {
        console.error('Error loading pin:', error);
        this.loading = false;
      }
    });
  }


deleteComment(commentId: number) {
    if (confirm('Delete this comment?')) {
      this.pinService.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c.id !== commentId);
        },
        error: (err) => console.error('Error deleting comment:', err)
      });
    }
  }


  deletePin() {
    if (confirm('Are you sure you want to delete this pin?')) {
      this.pinService.deletePin(this.pin!.id!).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Error deleting pin:', err)
      });
    }
  }



  loadComments(pinId: number) {
  this.pinService.getComments(pinId).subscribe({
    next: (allComments) => {
      this.comments = allComments.filter(c => c.pinId === pinId); // 👈 Faqat shu pin uchun filter
    },
    error: (error) => {
      console.error('Error loading comments:', error);
    }
  });
}

  checkIfLiked(pinId: number) {
    this.pinService.hasUserLiked(pinId).subscribe({
      next: (isLiked) => {
        if (this.pin) {
          this.pin.isLiked = isLiked;
        }
      },
      error: (error) => {
        console.error('Error checking like status:', error);
      }
    });
  }

  toggleLike() {
    if (!this.pin?.id || this.likingInProgress) return;

    this.likingInProgress = true;

    if (this.pin.isLiked) {
      this.pinService.unlikePin(this.pin.id).subscribe({
        next: () => {
          if (this.pin) {
            this.pin.isLiked = false;
            this.pin.likesCount = Math.max(0, (this.pin.likesCount || 0) - 1);
          }
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
          if (this.pin) {
            this.pin.isLiked = true;
            this.pin.likesCount = (this.pin.likesCount || 0) + 1;
          }
          this.likingInProgress = false;
        },
        error: (error) => {
          console.error('Error liking pin:', error);
          this.likingInProgress = false;
        }
      });
    }
  }

  addComment() {
    if (this.commentForm.valid && this.pin?.id) {
      this.commentLoading = true;
      
      const commentData = {
        text: this.commentForm.value.text,
        pinId: this.pin.id
      };

      this.pinService.addComment(commentData).subscribe({
        next: () => {
          this.commentForm.reset();
          this.loadComments(this.pin!.id!);
          this.commentLoading = false;
        },
        error: (error) => {
          console.error('Error adding comment:', error);
          this.commentLoading = false;
        }
      });
    }
  }

  getAuthorName(): string {
    if (!this.pin) return 'Anonymous';
    
    if (this.pin.userFirstName && this.pin.userLastName) {
      return `${this.pin.userFirstName} ${this.pin.userLastName}`;
    }
    return this.pin.userName || 'Anonymous';
  }

  getAuthorInitial(): string {
    if (!this.pin) return 'A';
    
    if (this.pin.userFirstName) {
      return this.pin.userFirstName.charAt(0).toUpperCase();
    }
    if (this.pin.userName) {
      return this.pin.userName.charAt(0).toUpperCase();
    }
    return 'A';
  }

  getCommentAuthorInitial(comment: Comment): string {
    return comment.userName ? comment.userName.charAt(0).toUpperCase() : 'A';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
}