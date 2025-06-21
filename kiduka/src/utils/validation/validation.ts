// src/utils/validation.ts - Form validation utilities
export class ValidationService {
  static email(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  }

  static password(password: string): string | null {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return null;
  }

  static username(username: string): string | null {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return null;
  }

  static required(value: string, fieldName: string): string | null {
    if (!value || !value.trim()) return `${fieldName} is required`;
    return null;
  }

  static numeric(value: string, min?: number, max?: number): string | null {
    const num = parseFloat(value);
    if (isNaN(num)) return "Must be a valid number";
    if (min !== undefined && num < min) return `Must be at least ${min}`;
    if (max !== undefined && num > max) return `Must be at most ${max}`;
    return null;
  }

  static soilPH(ph: string): string | null {
    const error = this.numeric(ph, 0, 14);
    if (error) return error;
    return null;
  }

  static nutrientLevel(
    value: string,
    nutrient: string,
    max: number
  ): string | null {
    const error = this.numeric(value, 0, max);
    if (error) return `${nutrient} ${error.toLowerCase()}`;
    return null;
  }
}
