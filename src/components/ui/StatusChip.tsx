
import React from 'react';
import { VendorStatus, PaymentStatus, GuestStatus, ThankYouStatus } from '../../types';
import { getStatusChipClass } from '../../utils';


const StatusChip: React.FC<{ status: VendorStatus | PaymentStatus | GuestStatus | ThankYouStatus }> = ({ status }) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusChipClass(status)}`}>
        {status}
    </span>
);

export default StatusChip;
