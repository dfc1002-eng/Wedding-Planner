
import { VendorStatus, PaymentStatus, GuestStatus, ThankYouStatus } from './types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 2) {
        return `(${cleaned}`;
    }
    if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }
    if (cleaned.length <= 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

export const cleanPhoneNumber = (phone: string): string => {
    return phone.replace(/\D/g, '');
};


export const getStatusChipClass = (status: VendorStatus | PaymentStatus | GuestStatus | ThankYouStatus): string => {
    switch (status) {
        // Green
        case VendorStatus.Paid:
        case PaymentStatus.Paid:
        case GuestStatus.Confirmed:
        case ThankYouStatus.Sent:
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        
        // Yellow / Orange
        case VendorStatus.PartiallyPaid:
        case GuestStatus.Pending:
        case ThankYouStatus.Pending:
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        
        // Red
        case VendorStatus.Overdue:
        case PaymentStatus.Overdue:
        case GuestStatus.Declined:
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        
        // Gray / Default
        case VendorStatus.Planned:
        case PaymentStatus.Open:
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

export const getCategoryIcon = (category: string): string => {
    switch (category) {
        case 'Buffet': return 'restaurant_menu';
        case 'Decoração': return 'local_florist';
        case 'Fotografia': return 'photo_camera';
        case 'Assessoria': return 'event_note';
        case 'Local': return 'location_on';
        case 'Filmagem': return 'videocam';
        case 'Música': return 'music_note';
        case 'Bar': return 'local_bar';
        case 'Beleza': return 'face';
        case 'Convites': return 'mail_outline';
        case 'Bolo e Doces': return 'cake';
        case 'Lembrancinhas': return 'card_giftcard';
        case 'Trajes': return 'checkroom';
        case 'Outros':
        default:
            return 'category';
    }
};
