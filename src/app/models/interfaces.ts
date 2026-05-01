export interface CompanyMobileIcons {
  home: string;
  info: string;
  reservation: string;
  contact: string;
  profile: string;
}

export interface Company {
  id: number;
  name: string;
  tagline: string;
  about: string;
  aboutImage: string;
  history: string;
  historyImage: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  locationImage: string;
  schedule: string;
  mobileIcons: CompanyMobileIcons;
}

export interface Location {
  id: string;
  name: string;
  island: string;
  isAirport: boolean;
}

export interface Category {
  id: string;
  name: string;
  label: string;
  description: string;
}

export interface Car {
  id: string;
  slug: string;
  brand: string;
  model: string;
  fullName: string;
  featured?: boolean;
  categoryId: string;
  locationIds: string[];
  pricePerDay: number;
  priceText: string;
  transmission: string;
  fuel: string;
  seats: number;
  airConditioning: boolean;
  luggage: number;
  image: string;
  shortDescription: string;
  description: string;
  conditions: string;
}

export interface User {
  id: string;
  uid?: string;
  username: string;
  usernameNorm: string;
  email: string;
  emailNorm: string;
  role?: 'user' | 'admin';
  createdAt?: string;
}

export interface Session {
  uid: string;
  username: string;
  email: string;
  role?: 'user' | 'admin';
  loginAt: string;
}

export interface AuthFieldConfig {
  key: string;
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  autocomplete: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  clearLabel: string;
}

export interface AuthLinkConfig {
  text: string;
  href: string;
}

export interface AuthScreenConfig {
  title: string;
  description?: string;
  formId: string;
  fields: AuthFieldConfig[];
  checkText?: string;
  submitText: string;
  links?: {
    primary?: AuthLinkConfig;
    secondary?: AuthLinkConfig;
  };
  backLink?: AuthLinkConfig;
}

export interface AuthConfig {
  login: AuthScreenConfig;
  register: AuthScreenConfig;
  recovery: AuthScreenConfig;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export interface ContactMessage {
  id?: string;
  name: string;
  surname: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Reservation {
  id?: string;
  carId: number;
  pickupLocationId: number;
  returnLocationId: number;
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  extraIds: number[];
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}
