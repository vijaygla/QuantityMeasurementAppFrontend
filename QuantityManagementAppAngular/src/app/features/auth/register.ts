import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="auth-wrapper">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join us for free</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <button mat-stroked-button class="full-width google-btn" (click)="onGoogleLogin()">
            <mat-icon svgIcon="google"></mat-icon> Sign up with Google
          </button>

          <div class="divider-container">
            <mat-divider></mat-divider>
            <span class="divider-text">OR EMAIL</span>
            <mat-divider></mat-divider>
          </div>

          <form (submit)="onRegister()" #registerForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" name="email" [(ngModel)]="email" required #emailInput="ngModel">
              <mat-error *ngIf="emailInput.invalid">Valid email is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" name="password" [(ngModel)]="password" minlength="6" required>
              <mat-hint>Min. 6 characters</mat-hint>
            </mat-form-field>

            <button mat-flat-button color="primary" class="full-width action-btn" type="submit" [disabled]="loading || registerForm.invalid">
              Get Started
            </button>
          </form>
        </mat-card-content>
        <mat-card-footer>
          <p>Already have an account? <a routerLink="/login">Log In</a></p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 120px);
      padding: 20px;
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: 32px 24px;
    }
    mat-card-header {
      margin-bottom: 32px;
      text-align: center;
      display: block !important;
    }
    mat-card-title {
      font-size: 2rem !important;
      font-weight: 700 !important;
      margin-bottom: 8px !important;
    }
    .full-width {
      width: 100%;
    }
    .google-btn {
      height: 48px !important;
      border-color: #ddd !important;
      color: #555 !important;
    }
    .divider-container {
      display: flex;
      align-items: center;
      margin: 24px 0;
      gap: 16px;
    }
    .divider-text {
      font-size: 0.75rem;
      color: #888;
      white-space: nowrap;
      font-weight: 600;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .action-btn {
      height: 48px !important;
      margin-top: 16px;
      font-size: 1rem;
    }
    mat-card-footer {
      text-align: center;
      margin-top: 24px;
      padding-bottom: 16px;
      color: #666;
    }
    a {
      color: var(--accent-color);
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class Register {
  email = '';
  password = '';
  loading = false;

  constructor(private auth: AuthService) {}

  async onRegister() {
    this.loading = true;
    try {
      await this.auth.register(this.email, this.password);
    } catch (err) {
      alert('Registration failed. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  onGoogleLogin() {
    this.auth.signInWithGoogle();
  }
}
