export type UserRole = 'ADMIN' | 'AGENCY' | 'OWNER' | 'TENANT';

export type PropertyType = 
  | 'APPARTEMENT' 
  | 'STUDIO' 
  | 'VILLA_BASSE' 
  | 'VILLA_DUPLEX' 
  | 'IMMEUBLE' 
  | 'MAGASIN' 
  | 'BUREAU' 
  | 'ENTREPOT' 
  | 'TERRAIN';

export type PropertyStatus = 'VACANT' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';

export type PaymentMethod = 'WAVE' | 'MOBILE_MONEY' | 'ESPECE' | 'VIREMENT';

export type PaymentStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';

export type PaymentType = 'LOYER' | 'CAUTION' | 'AVANCE' | 'FRAIS';

export type MaintenanceStatus = 'REPORTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type LeaseStatus = 'ACTIVE' | 'EXPIRED' | 'TERMINATED' | 'PENDING';

export type NotificationType = 
  | 'PAYMENT_DUE' 
  | 'PAYMENT_RECEIVED' 
  | 'MAINTENANCE_UPDATE' 
  | 'LEASE_EXPIRING' 
  | 'SYSTEM';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Agency {
  id: string;
  userId: string;
  name: string;
  description?: string;
  address?: string;
  city: string;
  country: string;
  licenseNumber?: string;
  commissionRate: number;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerProfile {
  id: string;
  userId: string;
  agencyId?: string;
  isManaged: boolean;
  address?: string;
  idNumber?: string;
  taxNumber?: string;
  bankAccount?: string;
  bankName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantProfile {
  id: string;
  userId: string;
  agencyId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  profession?: string;
  employer?: string;
  monthlyIncome?: number;
  idNumber?: string;
  idDocument?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyPhoto {
  id: string;
  propertyId: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Property {
  id: string;
  name: string;
  description?: string;
  address: string;
  commune: string;
  quartier: string;
  city: string;
  country: string;
  type: PropertyType;
  status: PropertyStatus;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  surface?: number;
  floor?: number;
  photos: PropertyPhoto[];
  ownerId: string;
  agencyId?: string;
  depositMonths: number;
  advanceMonths: number;
  feeMonths: number;
  monthlyRent: number;
  occupancyRate: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
  // Enriched fields
  owner?: User;
  tenant?: TenantProfile & { user: User };
  activeLease?: Lease;
}

export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  advanceAmount: number;
  feeAmount: number;
  status: LeaseStatus;
  contractUrl?: string;
  entryInventory?: Inventory;
  exitInventory?: Inventory;
  createdAt: string;
  updatedAt: string;
  // Enriched fields
  property?: Property;
  tenant?: User;
  payments?: Payment[];
}

export interface Inventory {
  id: string;
  leaseId: string;
  type: 'entry' | 'exit';
  date: string;
  notes?: string;
  photos?: string[];
  damages?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  leaseId?: string;
  propertyId?: string;
  type: PaymentType;
  amount: number;
  month: number;
  year: number;
  method: PaymentMethod;
  receiptUrl?: string;
  status: PaymentStatus;
  validatedBy?: string;
  validatedAt?: string;
  rejectionReason?: string;
  quittanceUrl?: string;
  quittanceNumber?: string;
  createdAt: string;
  updatedAt: string;
  // Enriched fields
  tenant?: User;
  property?: Property;
}

export interface MaintenanceTimeline {
  id: string;
  maintenanceId: string;
  status: string;
  note?: string;
  createdBy: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  propertyId: string;
  reportedBy: string;
  title: string;
  description: string;
  photos?: string[];
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assignedTo?: string;
  providerName?: string;
  providerPhone?: string;
  estimatedCost?: number;
  actualCost?: number;
  reportedAt: string;
  startedAt?: string;
  completedAt?: string;
  timeline: MaintenanceTimeline[];
  createdAt: string;
  updatedAt: string;
  // Enriched fields
  property?: Property;
  reporter?: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export interface DashboardStats {
  totalProperties: number;
  occupiedProperties: number;
  occupancyRate: number;
  totalRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  activeLeases: number;
  expiringLeases: number;
  pendingMaintenance: number;
}

export interface ChartData {
  month?: string;
  monthNumber?: number;
  revenue?: number;
  name?: string;
  value?: number;
  color?: string;
}

export interface Activity {
  id: string;
  type: 'PAYMENT' | 'MAINTENANCE' | 'LEASE';
  title: string;
  description: string;
  date: string;
  status: string;
  priority?: string;
}

export interface Alert {
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  date: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
    profile?: Agency | OwnerProfile | (TenantProfile & { user: User });
  };
}
