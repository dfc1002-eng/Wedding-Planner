import { Payment, Vendor, PaymentStatus, PaymentNotification } from './types';
import { differenceInDays, isPast } from 'date-fns';

/**
 * Gera notificações de pagamentos baseado em status e prazos
 */
export const getPaymentNotifications = (
  payments: Payment[],
  vendors: Vendor[]
): PaymentNotification[] => {
  const notifications: PaymentNotification[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar para o início do dia
  const vendorMap = new Map(vendors.map(v => [v.id, v]));

  payments.forEach(payment => {
    // Apenas pagamentos em aberto
    if (payment.status !== PaymentStatus.Open && payment.status !== PaymentStatus.Overdue) return;

    const vendor = vendorMap.get(payment.vendorId);
    if (!vendor) return;

    const paymentDueDate = new Date(payment.dueDate);
    paymentDueDate.setHours(0,0,0,0); // Normalizar data do pagamento

    const daysUntilDue = differenceInDays(paymentDueDate, today);

    // Pagamento atrasado
    if (daysUntilDue < 0) {
      notifications.push({
        id: `notif-${payment.id}`,
        type: 'overdue',
        payment,
        vendor,
        daysUntilDue,
        message: `Vencido há ${Math.abs(daysUntilDue)} ${Math.abs(daysUntilDue) === 1 ? 'dia' : 'dias'}`,
        severity: 'error',
      });
    }
    // Vence hoje
    else if (daysUntilDue === 0) {
      notifications.push({
        id: `notif-${payment.id}`,
        type: 'due-today',
        payment,
        vendor,
        daysUntilDue: 0,
        message: 'Vence hoje',
        severity: 'error',
      });
    }
    // Vence nos próximos 7 dias
    else if (daysUntilDue > 0 && daysUntilDue <= 7) {
      notifications.push({
        id: `notif-${payment.id}`,
        type: 'due-soon',
        payment,
        vendor,
        daysUntilDue,
        message: `Vence em ${daysUntilDue} ${daysUntilDue === 1 ? 'dia' : 'dias'}`,
        severity: 'warning',
      });
    }
  });

  // Ordenar por urgência: atrasados > hoje > próximos dias
  return notifications.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
};