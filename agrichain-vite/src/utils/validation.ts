/**
 * Validation utilities for AgriChain application
 * Strictly enforces rules 33 to 60 for form inputs, sanitization, and password strength.
 */

// Full Name Validation
export function validateFullName(name: string): { isValid: boolean; error: string | null } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: "Please enter a valid full name." };
  }
  if (trimmed.length < 2 || trimmed.length > 100) {
    return { isValid: false, error: "Please enter a valid full name." };
  }
  // Allow Unicode letters (Latin, Devanagari/Hindi/Marathi), spaces, hyphens, and apostrophes
  // Disallow numbers and special characters like @, #, $, %, etc.
  const nameRegex = /^[\p{L}\s'\-]+$/u;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid full name." };
  }
  return { isValid: true, error: null };
}

// Email Validation
export function validateEmail(email: string): { isValid: boolean; error: string | null } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  if (/\s/.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  return { isValid: true, error: null };
}

// Indian Mobile Number Validation
export function validateMobileNumber(mobile: string): { isValid: boolean; error: string | null } {
  const digitsOnly = mobile.replace(/\D/g, "");
  if (!digitsOnly || digitsOnly.length !== 10) {
    return { isValid: false, error: "Please enter a valid 10-digit Indian mobile number." };
  }
  if (!/^[6-9]\d{9}$/.test(digitsOnly)) {
    return { isValid: false, error: "Please enter a valid 10-digit Indian mobile number." };
  }
  return { isValid: true, error: null };
}

// Password Strength Evaluation
export interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export function evaluatePasswordRequirements(password: string): PasswordRequirements {
  return {
    length: password.length >= 8 && password.length <= 64,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
}

export function evaluatePasswordStrength(password: string): "Weak" | "Medium" | "Strong" {
  if (!password) return "Weak";
  const reqs = evaluatePasswordRequirements(password);
  const passedCount = Object.values(reqs).filter(Boolean).length;

  if (passedCount === 5) return "Strong";
  if (passedCount >= 3 && reqs.length) return "Medium";
  return "Weak";
}

export function validatePassword(password: string): { isValid: boolean; error: string | null } {
  if (!password) {
    return { isValid: false, error: "Password is required." };
  }
  if (password.startsWith(" ") || password.endsWith(" ")) {
    return { isValid: false, error: "Password cannot have leading or trailing spaces." };
  }
  const reqs = evaluatePasswordRequirements(password);
  if (!reqs.length) {
    return { isValid: false, error: "Password must be 8 to 64 characters long." };
  }
  if (!reqs.uppercase) {
    return { isValid: false, error: "Password must include at least one uppercase letter." };
  }
  if (!reqs.lowercase) {
    return { isValid: false, error: "Password must include at least one lowercase letter." };
  }
  if (!reqs.number) {
    return { isValid: false, error: "Password must include at least one number." };
  }
  if (!reqs.special) {
    return { isValid: false, error: "Password must include at least one special character." };
  }
  return { isValid: true, error: null };
}

// Confirm Password Validation
export function validateConfirmPassword(password: string, confirm: string): { isValid: boolean; error: string | null } {
  if (!confirm) {
    return { isValid: false, error: "Please confirm your password." };
  }
  if (password !== confirm) {
    return { isValid: false, error: "Passwords do not match." };
  }
  return { isValid: true, error: null };
}

// Farm Cluster / APMC Validation
export function validateFarmCluster(cluster: string): { isValid: boolean; error: string | null } {
  if (!cluster || !cluster.trim()) {
    return { isValid: false, error: "Please select your Farm Cluster / APMC Market Yard." };
  }
  return { isValid: true, error: null };
}

// Primary Crops Validation
export function validatePrimaryCrops(crops: string[]): { isValid: boolean; error: string | null } {
  if (!crops || crops.length === 0) {
    return { isValid: false, error: "Please select at least one primary crop." };
  }
  return { isValid: true, error: null };
}

// Delivery Address Validation
export function validateDeliveryAddress(address: string): { isValid: boolean; error: string | null } {
  const trimmed = address.trim();
  if (!trimmed || trimmed.length < 5 || trimmed.length > 200) {
    return { isValid: false, error: "Please enter your delivery address." };
  }
  return { isValid: true, error: null };
}

// City / Area Validation
export function validateCityArea(cityArea: string): { isValid: boolean; error: string | null } {
  const trimmed = cityArea.trim();
  if (!trimmed || trimmed.length < 2 || trimmed.length > 100) {
    return { isValid: false, error: "Please enter a valid city or area." };
  }
  return { isValid: true, error: null };
}

// Indian Pincode Validation
export function validatePinCode(pinCode: string): { isValid: boolean; error: string | null } {
  const trimmed = pinCode.trim();
  if (!trimmed || !/^[1-9][0-9]{5}$/.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid 6-digit pincode." };
  }
  return { isValid: true, error: null };
}

// First Name Validation
export function validateFirstName(name: string): { isValid: boolean; error: string | null } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: "First name is required." };
  }
  if (!/^[\p{L}\s'\-]+$/u.test(trimmed)) {
    return { isValid: false, error: "First name must contain alphabetic characters only." };
  }
  return { isValid: true, error: null };
}

// Last Name Validation
export function validateLastName(name: string): { isValid: boolean; error: string | null } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: "Last name is required." };
  }
  if (!/^[\p{L}\s'\-]+$/u.test(trimmed)) {
    return { isValid: false, error: "Last name must contain alphabetic characters only." };
  }
  return { isValid: true, error: null };
}

// Farm Name Validation
export function validateFarmName(farmName: string): { isValid: boolean; error: string | null } {
  const trimmed = farmName.trim();
  if (!trimmed) {
    return { isValid: false, error: "Farm name is required for farmers." };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: "Please enter a valid farm name." };
  }
  return { isValid: true, error: null };
}

// User-friendly Firebase Auth Error Mapper
export function mapFirebaseAuthError(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Email is already registered.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 8 characters with uppercase, lowercase, and numbers.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network connection error. Please check your internet connection.";
    case "auth/invalid-phone-number":
      return "Please enter a valid 10-digit Indian mobile number.";
    case "auth/invalid-verification-code":
      return "OTP is incorrect.";
    case "auth/code-expired":
      return "OTP has expired. Please click Resend OTP.";
    default:
      return "An error occurred during authentication. Please try again.";
  }
}

// Sanitization Utilities
export function sanitizeFullName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function sanitizeMobileNumber(mobile: string): string {
  return mobile.replace(/\D/g, "");
}
