import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Quantity } from '../../core/services/quantity';
import { HistoryService } from '../../core/services/history';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  type = 'length';
  action = 'comparison';
  operation = 'add';

  value1 = 1;
  value2 = 1;
  result: number | string = '-';
  isCalculating = false;
  recentHistory: any[] = [];

  units: string[] = [];
  fromUnit = '';
  toUnit = '';

  constructor(
    private quantity: Quantity,
    private historyService: HistoryService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.setUnits();
    this.loadRecentHistory();
  }

  async loadRecentHistory() {
    if (this.auth.user()) {
      this.recentHistory = await this.historyService.getHistory();
      this.recentHistory = this.recentHistory.slice(0, 5); // Only show top 5
    }
  }

  async onCalculate() {
    this.isCalculating = true;
    // ... same calculation logic ...
    const v1 = Number(this.value1);
    const v2 = Number(this.value2);

    if (this.action === 'conversion') {
      this.result = this.quantity.convert(this.type, v1, this.fromUnit, this.toUnit);
    }
    else if (this.action === 'arithmetic') {
      const v1_converted = this.quantity.convert(this.type, v1, this.fromUnit, this.toUnit);
      switch (this.operation) {
        case 'add': this.result = v1_converted + v2; break;
        case 'sub': this.result = v1_converted - v2; break;
        case 'mul': this.result = v1_converted * v2; break;
        case 'div': this.result = v2 !== 0 ? v1_converted / v2 : 0; break;
      }
    }
    else {
      const v1_converted = this.quantity.convert(this.type, v1, this.fromUnit, this.toUnit);
      this.result = Math.abs(v1_converted - v2) < 0.0001 ? 'Equal' : 'Not Equal';
    }

    // Save to history only if user is logged in
    const user = this.auth.user();
    if (user) {
      try {
        await this.historyService.addHistory({
          type: this.type,
          action: this.action,
          value1: this.value1,
          fromUnit: this.fromUnit,
          value2: this.value2,
          toUnit: this.toUnit,
          result: this.result
        });
        await this.loadRecentHistory(); // Refresh the list immediately!
      } catch (e) {
        console.error("Failed to save history", e);
      }
    }

    setTimeout(() => this.isCalculating = false, 500);
  }

  setType(newType: string) {
    this.type = newType;
    this.setUnits();
    this.result = '-';
  }

  onActionChange(newAction: string) {
    this.action = newAction;
    this.result = '-';
  }

  setUnits() {
    if (this.type === 'length') this.units = ['meter', 'kilometer', 'centimeter', 'millimeter'];
    else if (this.type === 'weight') this.units = ['gram', 'kilogram', 'milligram'];
    else if (this.type === 'temperature') this.units = ['celsius', 'fahrenheit', 'kelvin'];
    else if (this.type === 'volume') this.units = ['liter', 'milliliter'];

    if (!this.units.includes(this.fromUnit)) this.fromUnit = this.units[0];
    if (!this.units.includes(this.toUnit)) this.toUnit = this.units[1];
  }
}
