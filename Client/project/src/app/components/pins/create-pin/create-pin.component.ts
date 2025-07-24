import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PinService } from '../../../services/pin.service';

@Component({
  selector: 'app-create-pin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="create-pin-container">
      <div class="create-pin-header">
        <h1>Create Pin</h1>
        <p>Share your ideas with the world</p>
      </div>

      <form [formGroup]="pinForm" (ngSubmit)="onSubmit()" class="create-pin-form">
        <div class="form-layout">
          <div class="image-section">
            <div class="image-upload" [class.has-image]="selectedImage">
              <input
                type="file"
                #fileInput
                (change)="onFileSelected($event)"
                accept="image/*"
                style="display: none"
              >
              
              <div *ngIf="!selectedImage" class="upload-placeholder" (click)="fileInput.click()">
                <div class="upload-icon">📷</div>
                <p>Click to upload an image</p>
                <span class="upload-hint">Choose a high quality image</span>
              </div>

              <div *ngIf="selectedImage" class="image-preview" (click)="fileInput.click()">
                <img [src]="imagePreview" alt="Preview">
                <div class="image-overlay">
                  <span>Change image</span>
                </div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <div class="form-group">
              <label for="title">Title</label>
              <input
                id="title"
                type="text"
                formControlName="title"
                placeholder="Add your title"
                [class.error]="pinForm.get('title')?.invalid && pinForm.get('title')?.touched"
              >
              <div class="error-message" *ngIf="pinForm.get('title')?.invalid && pinForm.get('title')?.touched">
                Title is required
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                formControlName="description"
                placeholder="Tell everyone what your Pin is about"
                rows="4"
                [class.error]="pinForm.get('description')?.invalid && pinForm.get('description')?.touched"
              ></textarea>
              <div class="error-message" *ngIf="pinForm.get('description')?.invalid && pinForm.get('description')?.touched">
                Description is required
              </div>
            </div>

            <div class="form-actions">
              <button type="button" (click)="goBack()" class="btn btn-secondary">Cancel</button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="pinForm.invalid || !selectedImage || loading"
              >
                {{ loading ? 'Creating...' : 'Create Pin' }}
              </button>
            </div>
          </div>
        </div>

        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .create-pin-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .create-pin-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .create-pin-header h1 {
      font-size: 36px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
    }

    .create-pin-header p {
      color: #666;
      font-size: 18px;
    }

    .form-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 32px;
    }

    .image-section {
      display: flex;
      flex-direction: column;
    }

    .image-upload {
      background: #f0f0f0;
      border-radius: 16px;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed #ccc;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .image-upload:hover {
      background: #e8e8e8;
      border-color: #e60023;
    }

    .image-upload.has-image {
      border: none;
      background: transparent;
    }

    .upload-placeholder {
      text-align: center;
      padding: 40px;
    }

    .upload-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .upload-placeholder p {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    .upload-hint {
      color: #666;
      font-size: 14px;
    }

    .image-preview {
      width: 100%;
      height: 100%;
      position: relative;
      cursor: pointer;
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 16px;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 16px;
    }

    .image-preview:hover .image-overlay {
      opacity: 1;
    }

    .image-overlay span {
      color: white;
      font-weight: 600;
    }

    .details-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-weight: 600;
      color: #333;
      font-size: 16px;
    }

    input, textarea {
      padding: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.2s ease;
      background: #f9f9f9;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #e60023;
      background: white;
      box-shadow: 0 0 0 3px rgba(230, 0, 35, 0.1);
    }

    input.error, textarea.error {
      border-color: #ff4444;
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 16px;
    }

    .btn {
      flex: 1;
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

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
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

    @media (max-width: 768px) {
      .form-layout {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .create-pin-header h1 {
        font-size: 28px;
      }

      .image-upload {
        min-height: 300px;
      }
    }
  `]
})
export class CreatePinComponent {
  pinForm: FormGroup;
  loading = false;
  errorMessage = '';
  selectedImage: File | null = null;
  imagePreview = '';

  constructor(
    private fb: FormBuilder,
    private pinService: PinService,
    private router: Router
  ) {
    this.pinForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.pinForm.valid && this.selectedImage) {
      this.loading = true;
      this.errorMessage = '';

      const pinData = {
        title: this.pinForm.value.title,
        description: this.pinForm.value.description
      };

      this.pinService.addPin(pinData, this.selectedImage).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/pins']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to create pin. Please try again.';
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/pins']);
  }
}