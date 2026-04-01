import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Quantity } from '../../core/services/quantity';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  // 🔷 UI STATE
  type = 'length';        // Current measurement type (length, weight, etc.)
  action = 'comparison';  // Current action (comparison, conversion, arithmetic)
  operation = 'add';      // Current arithmetic operation

  // 🔷 INPUT VALUES
  value1 = 1;            // First input value
  value2 = 1;            // Second input value (for comparison/arithmetic)
  result: number | string = 0; // The calculated result

  // 🔷 UNITS
  units: string[] = [];  // List of available units for the current type
  fromUnit = '';         // Unit of the first value
  toUnit = '';           // Unit of the second value or target unit

  constructor(
    private quantity: Quantity
  ) { }

  ngOnInit(): void {
    this.setUnits();
    this.calculate();
  }

  /**
   * Main calculation logic.
   * Handles conversion, arithmetic, and comparison.
   */
  calculate() {
    const v1 = Number(this.value1);
    const v2 = Number(this.value2);

    // 🔹 CASE 1: CONVERSION
    // Simply convert v1 from fromUnit to toUnit.
    if (this.action === 'conversion') {
      this.result = this.quantity.convert(
        this.type,
        v1,
        this.fromUnit,
        this.toUnit
      );
    }
    
    // 🔹 CASE 2: ARITHMETIC
    // We first convert the first value into the second value's unit,
    // then perform the requested math operation.
    else if (this.action === 'arithmetic') {
      const v1_converted = this.quantity.convert(this.type, v1, this.fromUnit, this.toUnit);
      
      switch (this.operation) {
        case 'add': this.result = v1_converted + v2; break;
        case 'sub': this.result = v1_converted - v2; break;
        case 'mul': this.result = v1_converted * v2; break;
        case 'div': this.result = v2 !== 0 ? v1_converted / v2 : 0; break;
      }
    }
    
    // 🔹 CASE 3: COMPARISON
    // We convert the first value into the target unit and check for equality.
    // The result is 'True' if they are equal, 'False' otherwise.
    else {
      const v1_converted = this.quantity.convert(this.type, v1, this.fromUnit, this.toUnit);
      
      // We use a small epsilon for floating point comparison if needed, 
      // but for simple cases strict equality or precision check is fine.
      this.result = Math.abs(v1_converted - v2) < 0.0001 ? 'True' : 'False';
    }
  }

  /**
   * Updates the measurement type and refreshes units.
   */
  setType(newType: string) {
    this.type = newType;
    this.setUnits();
    this.calculate();
  }

  /**
   * Updates the action mode and triggers recalculation.
   */
  onActionChange(newAction: string) {
    this.action = newAction;
    this.calculate();
  }

  /**
   * Event handler for input value changes.
   */
  onValueChange(val: number, isValue1: boolean) {
    if (isValue1) this.value1 = val;
    else this.value2 = val;
    this.calculate();
  }

  /**
   * Event handler for unit selection changes.
   */
  onUnitChange(unit: string, isFrom: boolean) {
    if (isFrom) this.fromUnit = unit;
    else this.toUnit = unit;
    this.calculate();
  }

  /**
   * Dynamically populates the units list based on selected type.
   */
  setUnits() {
    if (this.type === 'length') {
      this.units = ['meter', 'kilometer', 'centimeter', 'millimeter'];
    }
    else if (this.type === 'weight') {
      this.units = ['gram', 'kilogram', 'milligram'];
    }
    else if (this.type === 'temperature') {
      this.units = ['celsius', 'fahrenheit', 'kelvin'];
    }
    else if (this.type === 'volume') {
      this.units = ['liter', 'milliliter'];
    }

    // Default selection if current units are invalid for new type
    if (!this.units.includes(this.fromUnit)) this.fromUnit = this.units[0];
    if (!this.units.includes(this.toUnit)) this.toUnit = this.units[1];
  }
}
