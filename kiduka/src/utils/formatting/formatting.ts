// src/utils/formatting.ts - Data formatting utilities

export class FormattingService {
  static formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  static formatShortDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  static formatPercentage(value: number): string {
    return `${Math.round(value * 100)}%`;
  }

  static formatNutrientValue(value: number, unit: string = 'mg/kg'): string {
    return `${value.toFixed(1)} ${unit}`;
  }

  static formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  }

  static formatPrice(price: number, currency: string = 'KES'): string {
    return `${currency} ${price.toLocaleString()}`;
  }

  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}