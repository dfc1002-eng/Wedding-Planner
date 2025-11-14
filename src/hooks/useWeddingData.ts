
import { useState, useMemo, useCallback, useEffect } from 'react';
import { differenceInDays, isPast } from 'date-fns';
// FIX: Imported GuestStatus to resolve reference errors.
import { WeddingData, Vendor, Payment, Task, Guest, PaymentStatus, VendorStatus, Parcel, PaymentNotification, NewVendorFormData, EditVendorData, Addendum, NextPayment, GuestFormData, GuestStatus, Gift, GiftFormData } from '../types';
import { MOCK_WEDDING_DATA, MOCK_VENDORS, MOCK_PAYMENTS, MOCK_TASKS, MOCK_GUESTS, MOCK_GIFTS } from '../constants';
import { getPaymentNotifications } from '../notifications';

export const useWeddingData = () => {
    const [weddingData, setWeddingData] = useState<WeddingData>(MOCK_WEDDING_DATA);
    const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
    const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
    const [gifts, setGifts] = useState<Gift[]>(MOCK_GIFTS);

     useEffect(() => {
        const checkOverdue = () => {
            let hasChanged = false;
            
            const updatedPayments = payments.map(p => {
                if (p.status === PaymentStatus.Open && isPast(p.dueDate)) {
                    hasChanged = true;
                    return { ...p, status: PaymentStatus.Overdue };
                }
                return p;
            });
            
            if (hasChanged) {
                setPayments(updatedPayments);
            }

            const vendorPaymentsMap: Record<string, Payment[]> = updatedPayments.reduce((acc, p) => {
                if (!acc[p.vendorId]) acc[p.vendorId] = [];
                acc[p.vendorId].push(p);
                return acc;
            }, {} as Record<string, Payment[]>);


            const updatedVendors = vendors.map(v => {
                const vPayments = vendorPaymentsMap[v.id] || [];
                const hasOverdue = vPayments.some(p => p.status === PaymentStatus.Overdue);
                
                let newStatus = v.status;
                if(hasOverdue) {
                    newStatus = VendorStatus.Overdue;
                } else {
                    if (v.amountPaid >= v.contractedValue && v.contractedValue > 0) {
                       newStatus = VendorStatus.Paid;
                    } else if (v.amountPaid > 0) {
                        newStatus = VendorStatus.PartiallyPaid;
                    } else {
                        newStatus = VendorStatus.Planned;
                    }
                }

                if (newStatus !== v.status) {
                    hasChanged = true;
                    return { ...v, status: newStatus };
                }
                return v;
            });

             if (hasChanged) {
                setVendors(updatedVendors);
            }
        };

        const interval = setInterval(checkOverdue, 1000 * 60); // Check every minute
        checkOverdue();
        return () => clearInterval(interval);
    }, [payments, vendors]);


    const daysLeft = useMemo(() => differenceInDays(weddingData.weddingDate, new Date()), [weddingData.weddingDate]);
    const totalPaid = useMemo(() => vendors.reduce((acc, v) => acc + v.amountPaid, 0), [vendors]);
    
    const nextPayment = useMemo((): NextPayment | null => {
        const upcomingPayments = payments
            .filter(p => p.status === PaymentStatus.Open || p.status === PaymentStatus.Overdue)
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

        if (upcomingPayments.length === 0) return null;

        const next = upcomingPayments[0];
        const vendor = vendors.find(v => v.id === next.vendorId);

        // FIX: Added payment id to the nextPayment object for unique identification.
        return {
            id: next.id,
            vendorName: vendor ? vendor.name : 'Desconhecido',
            dueDate: next.dueDate,
            parcelValue: next.parcelValue,
        };
    }, [payments, vendors]);
    
    const expensesByCategory = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        vendors.forEach(vendor => {
            categoryMap[vendor.category] = (categoryMap[vendor.category] || 0) + vendor.amountPaid;
        });
        return Object.entries(categoryMap).map(([name, value]) => ({ name, value })).filter(item => item.value > 0);
    }, [vendors]);

    const paymentNotifications = useMemo(
        () => getPaymentNotifications(payments, vendors),
        [payments, vendors]
    );

    const handleToggleTask = useCallback((taskId: string): boolean => {
        let wasCompleted = false;
        setTasks(prevTasks =>
            prevTasks.map(task => {
                if (task.id === taskId) {
                    wasCompleted = !task.completed;
                    return { ...task, completed: !task.completed };
                }
                return task;
            })
        );
        return wasCompleted;
    }, []);
    
    const handleAddVendor = useCallback((data: NewVendorFormData) => {
        const newVendor: Vendor = {
            id: crypto.randomUUID(),
            name: data.name,
            category: data.category,
            phone: data.phone,
            email: data.email,
            contractedValue: data.contractedValue,
            amountPaid: 0,
            status: VendorStatus.Planned,
        };
        
        const newPayments: Payment[] = [];
        if (data.parcels) {
            data.parcels.forEach(parcel => {
                const dueDate = new Date(parcel.dueDate + 'T00:00:00');
                 newPayments.push({
                    id: crypto.randomUUID(),
                    vendorId: newVendor.id,
                    parcelValue: parcel.amount,
                    dueDate: dueDate,
                    status: isPast(dueDate) ? PaymentStatus.Overdue : PaymentStatus.Open,
                });
            });
        }

        setVendors(prev => [...prev, newVendor]);
        setPayments(prev => [...prev, ...newPayments]);
    }, []);

    const handleEditVendor = useCallback((data: EditVendorData) => {
        let newPaymentsForAddendum: Payment[] = [];

        setVendors(prev => prev.map(v => {
            if (v.id === data.id) {
                const updatedVendor = { ...v, name: data.name, category: data.category, phone: data.phone, email: data.email };

                // Handle contract addendum
                if (data.addendumAmount && data.addendumAmount > 0 && data.addendumReason && data.addendumParcels) {
                    updatedVendor.contractedValue += data.addendumAmount;
                    
                    const newAddendum: Addendum = {
                        id: crypto.randomUUID(),
                        date: new Date(),
                        amount: data.addendumAmount,
                        reason: data.addendumReason,
                    };
                    updatedVendor.addendums = [...(v.addendums || []), newAddendum];
                    
                    data.addendumParcels.forEach(parcel => {
                        const dueDate = new Date(parcel.dueDate + 'T00:00:00');
                        newPaymentsForAddendum.push({
                            id: crypto.randomUUID(),
                            vendorId: data.id,
                            parcelValue: parcel.amount,
                            dueDate: dueDate,
                            status: isPast(dueDate) ? PaymentStatus.Overdue : PaymentStatus.Open,
                        });
                    });
                }
                return updatedVendor;
            }
            return v;
        }));
        
        if (newPaymentsForAddendum.length > 0) {
            setPayments(prev => [...prev, ...newPaymentsForAddendum]);
        }
    }, []);
    
    const handleDeleteVendor = useCallback((vendorId: string) => {
        setVendors(prev => prev.filter(v => v.id !== vendorId));
        setPayments(prev => prev.filter(p => p.vendorId !== vendorId));
    }, []);

    const handleRegisterPayment = useCallback((data: { vendorId: string, paidAmount: number, paymentDate: Date, paymentId?: string }) => {
        setPayments(prevPayments => {
            const updatedPayments = prevPayments.map(p => {
                if (p.id === data.paymentId) {
                    return { ...p, status: PaymentStatus.Paid, paymentDate: data.paymentDate };
                }
                return p;
            });

            setVendors(prevVendors => {
                return prevVendors.map(v => {
                    if (v.id === data.vendorId) {
                        const newAmountPaid = v.amountPaid + data.paidAmount;
                        return { ...v, amountPaid: newAmountPaid };
                    }
                    return v;
                });
            });

            return updatedPayments;
        });
    }, []);
    
    const handleDeletePayment = useCallback((paymentId: string) => {
       setPayments(prev => prev.filter(p => p.id !== paymentId));
    }, []);
    
    const handleAddGuest = useCallback((data: GuestFormData) => {
        const newGuest: Guest = {
            id: crypto.randomUUID(),
            ...data,
            confirmedPlusOnes: data.status === GuestStatus.Confirmed ? data.confirmedPlusOnes : undefined,
        };
        setGuests(prev => [...prev, newGuest]);

        const newGift: Gift = {
            id: newGuest.id,
            guestId: newGuest.id,
            guestName: newGuest.name,
            amount: 0,
            description: '',
            thankYouSent: false,
        };
        setGifts(prev => [...prev, newGift]);
    }, []);

    const handleEditGuest = useCallback((guestId: string, data: GuestFormData) => {
        setGuests(prev => prev.map(g => {
            if (g.id === guestId) {
                return {
                    ...g,
                    ...data,
                    confirmedPlusOnes: data.status === GuestStatus.Confirmed ? data.confirmedPlusOnes : undefined,
                };
            }
            return g;
        }));
        
        setGifts(prev => prev.map(gift => {
            if (gift.guestId === guestId) {
                return { ...gift, guestName: data.name };
            }
            return gift;
        }));
    }, []);

    const handleDeleteGuest = useCallback((guestId: string) => {
        setGuests(prev => prev.filter(g => g.id !== guestId));
        setGifts(prev => prev.filter(gift => gift.guestId !== guestId));
    }, []);

    const handleUpdateGift = useCallback((giftId: string, data: GiftFormData) => {
        setGifts(prev => prev.map(g => {
            if (g.id === giftId) {
                return { ...g, ...data };
            }
            return g;
        }));
    }, []);

    const handleToggleThankYouSent = useCallback((giftId: string): boolean => {
        let newStatus = false;
        setGifts(prev => prev.map(g => {
            if (g.id === giftId) {
                newStatus = !g.thankYouSent;
                return { ...g, thankYouSent: newStatus };
            }
            return g;
        }));
        return newStatus;
    }, []);

    return {
        weddingData,
        setWeddingData,
        vendors,
        payments,
        tasks,
        guests,
        gifts,
        daysLeft,
        totalPaid,
        nextPayment,
        expensesByCategory,
        paymentNotifications,
        handleToggleTask,
        handleAddVendor,
        handleEditVendor,
        handleDeleteVendor,
        handleRegisterPayment,
        handleDeletePayment,
        handleAddGuest,
        handleEditGuest,
        handleDeleteGuest,
        handleUpdateGift,
        handleToggleThankYouSent,
    };
};
