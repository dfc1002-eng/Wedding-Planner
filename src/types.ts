// FIX: Provided full type definitions that were missing.
export enum VendorStatus {
    Planned = 'Contratado',
    PartiallyPaid = 'Parcialmente Pago',
    Paid = 'Pago',
    Overdue = 'Vencido',
}

export enum PaymentStatus {
    Open = 'Em Aberto',
    Paid = 'Pago',
    Overdue = 'Vencido',
}

export enum GuestStatus {
    Pending = 'Pendente',
    Confirmed = 'Confirmado',
    Declined = 'Recusado',
}

export enum ThankYouStatus {
    Sent = 'Agradecido',
    Pending = 'Pendente',
}

export interface WeddingData {
  coupleNames: [string, string];
  weddingDate: Date;
  guestCount: number;
  totalBudget: number;
  venueName?: string;
  weddingWebsite?: string;
}

export interface Addendum {
    id: string;
    date: Date;
    amount: number;
    reason: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  phone?: string;
  email?: string;
  contractedValue: number;
  amountPaid: number;
  status: VendorStatus;
  addendums?: Addendum[];
  contractLink?: string;
}

export interface Payment {
  id: string;
  vendorId: string;
  parcelValue: number;
  dueDate: Date;
  status: PaymentStatus;
  paymentDate?: Date;
}

// FIX: Added NextPayment interface to define the shape of the next upcoming payment object.
// FIX: Added 'id' to NextPayment for unique identification.
export interface NextPayment {
    id: string;
    vendorName: string;
    dueDate: Date;
    parcelValue: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  timeframe: string;
  isImportant?: boolean;
  createsVendorCategory?: string;
}

export interface Guest {
    id: string;
    name: string;
    phone: string;
    address: string;
    notes: string;
    status: GuestStatus;
    group: string; // Ex: 'Família da Noiva', 'Amigos do Noivo'
    table?: number;
    plusOnes: number; // Acompanhantes convidados
    confirmedPlusOnes?: number; // Acompanhantes que confirmaram
}

export interface Gift {
    id: string;
    guestId: string;
    guestName: string;
    amount: number;
    description: string;
    thankYouSent: boolean;
}

export interface Parcel {
    id: string;
    dueDate: string; // YYYY-MM-DD
    amount: number;
}

export interface NewVendorFormData {
    name: string;
    category: string;
    phone?: string;
    email?: string;
    contractedValue: number;
    parcels?: Parcel[];
}

export interface EditVendorData {
    id: string;
    name: string;
    category: string;
    phone?: string;
    email?: string;
    // For addendums
    addendumAmount?: number;
    addendumReason?: string;
    addendumParcels?: Parcel[];
}

export interface GuestFormData {
    name: string;
    phone: string;
    address: string;
    group: string;
    plusOnes: number;
    notes: string;
    status: GuestStatus;
    confirmedPlusOnes: number;
}

export interface GiftFormData {
    amount: number;
    description: string;
    thankYouSent: boolean;
}

export interface PaymentNotification {
  id: string;
  type: 'overdue' | 'due-soon' | 'due-today';
  payment: Payment;
  vendor: Vendor;
  daysUntilDue: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}