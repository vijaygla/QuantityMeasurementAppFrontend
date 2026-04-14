import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth';
import { HistoryService, CalculationHistory } from '../../core/services/history';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="profile-wrapper">
      <div class="profile-header">
        <h1>User Dashboard</h1>
        <p>Review your account and past activities</p>
      </div>

      <div class="profile-grid">
        <!-- User Info -->
        <div class="info-col">
          <mat-card class="user-info-card" *ngIf="auth.user() as user">
            <mat-card-header>
              <div mat-card-avatar class="user-avatar">
                <mat-icon>account_circle</mat-icon>
              </div>
              <mat-card-title>{{ user.email }}</mat-card-title>
              <mat-card-subtitle>Authenticated Member</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="user-details">
                <p><strong>User ID:</strong> {{ user.uid }}</p>
                <p><strong>Provider:</strong> {{ user.providerId || 'Firebase' }}</p>
              </div>
            </mat-card-content>
            <mat-card-actions align="end">
              <button mat-flat-button color="warn" (click)="auth.logout()">Sign Out</button>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- History -->
        <div class="history-col">
          <mat-card class="history-card">
            <mat-card-header>
              <mat-card-title>Activity History ({{ history.length }})</mat-card-title>
              <button mat-icon-button (click)="loadHistory()" matTooltip="Refresh">
                <mat-icon>refresh</mat-icon>
              </button>
            </mat-card-header>
            <mat-divider></mat-divider>
            <mat-card-content>
              <div class="loading-state" *ngIf="loading">
                <mat-icon class="spin">sync</mat-icon>
                <p>Loading history...</p>
              </div>

              <mat-list *ngIf="!loading">
                <ng-container *ngFor="let item of history; let last = last">
                  <mat-list-item>
                    <mat-icon matListItemIcon class="history-icon">history</mat-icon>
                    <div matListItemTitle class="history-title">
                      <span class="type-badge">{{ item.type | uppercase }}</span>
                      {{ item.value1 }} {{ item.fromUnit }} 
                      <span class="op-text">{{ getActionSymbol(item) }}</span>
                      {{ item.action === 'conversion' ? '' : item.value2 }} {{ item.toUnit }}
                      <span class="res-text">= {{ item.result }}</span>
                    </div>
                    <div matListItemLine class="history-date">
                      {{ formatDate(item.timestamp) | date:'MMM d, y, h:mm a' }}
                    </div>
                  </mat-list-item>
                  <mat-divider *ngIf="!last"></mat-divider>
                </ng-container>
                
                <div class="empty-state" *ngIf="history.length === 0">
                  <mat-icon>cloud_off</mat-icon>
                  <p>No activity recorded yet. Calculations you perform will appear here.</p>
                </div>
              </mat-list>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 24px;
    }
    .profile-header {
      margin-bottom: 32px;
      h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 8px; }
      p { color: #64748b; font-size: 1.1rem; }
    }
    .profile-grid {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 32px;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }
    .user-avatar {
      background-color: #f0f4f8;
      color: var(--accent-color);
      display: flex;
      justify-content: center;
      align-items: center;
      mat-icon { font-size: 40px; width: 40px; height: 40px; }
    }
    .user-details {
      padding: 16px 0;
      p { font-size: 0.9rem; margin-bottom: 8px; color: #64748b; }
    }
    .history-card { min-height: 500px; }
    .history-title { font-weight: 500; font-size: 1rem; color: #1e293b; }
    .type-badge {
      font-size: 0.65rem;
      background: #f1f5f9;
      padding: 2px 8px;
      border-radius: 4px;
      margin-right: 12px;
      font-weight: 700;
      color: #475569;
    }
    .op-text { color: #94a3b8; margin: 0 4px; }
    .res-text { color: var(--accent-color); font-weight: 700; margin-left: 8px; }
    .history-date { font-size: 0.8rem; color: #64748b; margin-top: 4px; }
    .loading-state, .empty-state {
      text-align: center;
      padding: 100px 20px;
      color: #94a3b8;
      mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; }
    }
    .spin { animation: spin 2s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    
    ::ng-deep body.dark-theme {
      .user-avatar { background-color: #334155; }
      .type-badge { background-color: #334155; color: #cbd5e1; }
      .history-title { color: #f1f5f9; }
      .profile-header p { color: #94a3b8; }
    }
  `]
})
export class Profile implements OnInit {
  history: CalculationHistory[] = [];
  loading = false;
  private cdr = inject(ChangeDetectorRef);

  constructor(public auth: AuthService, private historyService: HistoryService) {}

  async ngOnInit() {
    console.log("Profile: Initializing...");
    await this.checkUserAndLoad();
  }

  async checkUserAndLoad() {
    this.loading = true;
    // Wait for auth to settle if necessary
    let attempts = 0;
    while (!this.auth.user() && attempts < 10) {
      console.log("Profile: Waiting for user auth...");
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }

    if (this.auth.user()) {
      console.log("Profile: User found, loading history for", this.auth.user()?.uid);
      await this.loadHistory();
    } else {
      console.error("Profile: No user found after waiting.");
      this.loading = false;
    }
    this.cdr.detectChanges();
  }

  async loadHistory() {
    this.loading = true;
    try {
      this.history = await this.historyService.getHistory();
      console.log("Profile: History loaded, count:", this.history.length);
    } catch (err) {
      console.error("Profile: Failed to load history", err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  getActionSymbol(item: CalculationHistory): string {
    if (item.action === 'conversion') return '→';
    if (item.action === 'comparison') return 'vs';
    return '+';
  }

  formatDate(timestamp: any): Date {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return new Date();
  }
}
