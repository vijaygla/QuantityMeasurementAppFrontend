import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Quantity {

  // 🗺️ LENGTH CONVERSION MAP (Base unit: meter)
  private lengthMap: any = {
    millimeter: 0.001,
    centimeter: 0.01,
    meter: 1,
    kilometer: 1000
  };

  // 🗺️ WEIGHT CONVERSION MAP (Base unit: gram)
  private weightMap: any = {
    milligram: 0.001,
    gram: 1,
    kilogram: 1000
  };

  // 🗺️ VOLUME CONVERSION MAP (Base unit: liter)
  private volumeMap: any = {
    milliliter: 0.001,
    liter: 1
  };

  /**
   * Universal conversion method.
   * Handles Length, Weight, Volume, and Temperature.
   */
  convert(type: string, value: number, from: string, to: string): number {

    // 📏 Handle Length
    if (type === 'length') {
      return (value * this.lengthMap[from]) / this.lengthMap[to];
    }

    // ⚖️ Handle Weight
    if (type === 'weight') {
      return (value * this.weightMap[from]) / this.weightMap[to];
    }

    // 🧪 Handle Volume
    if (type === 'volume') {
      return (value * this.volumeMap[from]) / this.volumeMap[to];
    }

    // 🌡️ Handle Temperature
    // (Non-linear conversion logic)
    if (type === 'temperature') {
      let resultInCelsius = value;

      // First convert input to Celsius
      if (from === 'fahrenheit') {
        resultInCelsius = (value - 32) * 5 / 9;
      } else if (from === 'kelvin') {
        resultInCelsius = value - 273.15;
      }

      // Then convert Celsius to target unit
      if (to === 'celsius') {
        return resultInCelsius;
      } else if (to === 'fahrenheit') {
        return (resultInCelsius * 9 / 5) + 32;
      } else if (to === 'kelvin') {
        return resultInCelsius + 273.15;
      }
    }

    return value;
  }
}
