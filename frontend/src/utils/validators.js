export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(p) {
  if (p.length < 8 || p.length > 16) return "Password must be 8-16 characters";
  if (!/[A-Z]/.test(p)) return "Password must contain at least one uppercase letter";
  if (!/[^A-Za-z0-9]/.test(p)) return "Password must contain at least one special character";
  return null;
}

export function validateName(name) {
  if (name.length < 20 || name.length > 60) return "Name must be 20-60 characters";
  return null;
}

export function validateAddress(address) {
  if (address.length > 400) return "Address max 400 characters";
  return null;
}
