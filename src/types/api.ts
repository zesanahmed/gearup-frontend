export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errorDetails?: unknown;
}

export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "SUSPENDED";
  phone?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface GearItem {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  brand?: string;
  description?: string;
  specs?: Record<string, unknown>;
  pricePerDay: string;
  stock: number;
  isAvailable: boolean;
  images: string[];
  createdAt: string;
  category?: Category;
  provider?: { id: string; name: string };
  reviews?: Review[];
}

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "CANCELLED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED";

export interface RentalOrderItem {
  id: string;
  gearItemId: string;
  quantity: number;
  priceAtBooking: string;
  gearItem: {
    id: string;
    name: string;
    pricePerDay: string;
    providerId: string;
  };
}

export interface RentalOrder {
  id: string;
  customerId: string;
  status: OrderStatus;
  startDate: string;
  endDate: string;
  totalAmount: string;
  createdAt: string;
  customer?: { id: string; name: string; email: string };
  items: RentalOrderItem[];
  payment?: Payment | null;
}

export interface Payment {
  id: string;
  rentalOrderId: string;
  transactionId: string;
  amount: string;
  method: "STRIPE" | "SSLCOMMERZ";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paidAt?: string;
}

export interface Review {
  id: string;
  customerId: string;
  gearItemId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer?: { id: string; name: string };
}
