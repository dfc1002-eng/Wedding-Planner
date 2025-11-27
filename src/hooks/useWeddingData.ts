
"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    writeBatch,
    getDocs,
} from 'firebase/firestore';
import { 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject 
} from "firebase/storage";
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import {
    WeddingData,
    Vendor,
    Payment,
    Task,
    Guest,
    PaymentStatus,
    VendorStatus,
    GuestStatus,
    Gift,
    NewVendorFormData,
    EditVendorData,
    GuestFormData,
    GiftFormData,
    NextPayment,
    Addendum,
} from '../types';
import { MOCK_WEDDING_DATA } from '../constants';
import { DEFAULT_TASKS_DATA } from '../constants/defaultTasks';
import { getPaymentNotifications } from '../notifications';
import { createPaymentsFromParcels } from '../utils';

export const useWeddingData = () => {
    const { user } = useAuth();
    const [weddingData, setWeddingData] = useState<WeddingData>(MOCK_WEDDING_DATA);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!user) {
            setVendors([]);
            setPayments([]);
            setTasks([]);
            setGuests([]);
            setGifts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const userId = user.uid;

        const collections = {
            vendors: collection(db, 'vendors'),
            payments: collection(db, 'payments'),
            tasks: collection(db, 'tasks'),
            guests: collection(db, 'guests'),
            gifts: collection(db, 'gifts'),
        };

        const queries = {
            vendors: query(collections.vendors, where('userId', '==', userId)),
            payments: query(collections.payments, where('userId', '==', userId)),
            tasks: query(collections.tasks, where('userId', '==', userId)),
            guests: query(collections.guests, where('userId', '==', userId)),
            gifts: query(collections.gifts, where('userId', '==', userId)),
        };

        const unsubscribes = [
            onSnapshot(queries.vendors, snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vendor));
                setVendors(data);
            }),
            onSnapshot(queries.payments, snapshot => {
                const data = snapshot.docs.map(doc => {
                    const paymentData = doc.data();
                    // FIX: Remove internal 'id' (UUID) to prevent conflicts with real doc.id
                    const { id: internalId, ...restOfData } = paymentData;
                    
                    return { 
                        ...restOfData,
                        id: doc.id, // FORCE REAL DOC ID
                        dueDate: paymentData.dueDate.toDate(),
                        paymentDate: paymentData.paymentDate ? paymentData.paymentDate.toDate() : undefined,
                    } as Payment;
                });
                setPayments(data);
            }),
            onSnapshot(queries.tasks, snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
                setTasks(data);
            }),
            onSnapshot(queries.guests, snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guest));
                setGuests(data);
            }),
            onSnapshot(queries.gifts, snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gift));
                setGifts(data);
            }),
        ];
        
        setLoading(false);

        return () => unsubscribes.forEach(unsub => unsub());
    }, [user]);


    const daysLeft = useMemo(() => differenceInDays(weddingData.weddingDate, new Date()), [weddingData.weddingDate]);
    const totalPaid = useMemo(() => vendors.reduce((acc, v) => acc + (v.amountPaid || 0), 0), [vendors]);
    
    const nextPayment = useMemo((): NextPayment | null => {
        const upcomingPayments = payments
            .filter(p => p.status === PaymentStatus.Open || p.status === PaymentStatus.Overdue)
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

        if (upcomingPayments.length === 0) return null;

        const next = upcomingPayments[0];
        const vendor = vendors.find(v => v.id === next.vendorId);

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
            categoryMap[vendor.category] = (categoryMap[vendor.category] || 0) + (vendor.amountPaid || 0);
        });
        return Object.entries(categoryMap).map(([name, value]) => ({ name, value })).filter(item => item.value > 0);
    }, [vendors]);

    const paymentNotifications = useMemo(
        () => getPaymentNotifications(payments, vendors),
        [payments, vendors]
    );

    const handleToggleTask = useCallback(async (taskId: string) => {
        if (!user) return false;
        const taskRef = doc(db, "tasks", taskId);
        const task = tasks.find(t => t.id === taskId);
        if(task){
            await updateDoc(taskRef, { completed: !task.completed });
            return !task.completed
        }
        return false;
    }, [user, tasks]);
    
    const populateDefaultTasks = useCallback(async () => {
        if (!user) return;
        
        const batch = writeBatch(db);
        
        DEFAULT_TASKS_DATA.forEach(task => {
            const taskRef = doc(collection(db, 'tasks'));
            batch.set(taskRef, {
                ...task,
                userId: user.uid,
                createdAt: new Date()
            });
        });
        
        await batch.commit();
    }, [user]);

    const handleAddVendor = useCallback(async (data: NewVendorFormData) => {
        if (!user) return;
        const batch = writeBatch(db);

        const newVendor: Omit<Vendor, 'id'> = {
            userId: user.uid,
            name: data.name,
            category: data.category,
            phone: data.phone,
            email: data.email,
            contractedValue: data.contractedValue,
            amountPaid: 0,
            status: VendorStatus.Planned,
        };
        const vendorRef = doc(collection(db, 'vendors'));
        batch.set(vendorRef, newVendor);
        
        const newPayments: Omit<Payment, 'id'>[] = data.parcels ? 
            createPaymentsFromParcels(vendorRef.id, data.parcels).map(p => ({...p, userId: user.uid})) 
            : [];
            
        newPayments.forEach(payment => {
            const paymentRef = doc(collection(db, 'payments'));
            batch.set(paymentRef, payment);
        });

        await batch.commit();

    }, [user]);

    const handleEditVendor = useCallback(async (data: EditVendorData) => {
       if (!user) return;
        const vendorRef = doc(db, "vendors", data.id);
        const batch = writeBatch(db);

        const updatedVendorData: Partial<Vendor> = {
            name: data.name,
            category: data.category,
            phone: data.phone,
            email: data.email,
        };

        if (data.addendumAmount && data.addendumAmount > 0 && data.addendumReason && data.addendumParcels) {
            const vendor = vendors.find(v => v.id === data.id);
            if(vendor){
                updatedVendorData.contractedValue = (vendor.contractedValue || 0) + data.addendumAmount;
                const newAddendum: Addendum = {
                    id: crypto.randomUUID(),
                    date: new Date(),
                    amount: data.addendumAmount,
                    reason: data.addendumReason,
                };
                updatedVendorData.addendums = [...(vendor.addendums || []), newAddendum];
                
                const newPaymentsForAddendum = createPaymentsFromParcels(data.id, data.addendumParcels);
                newPaymentsForAddendum.forEach(p => {
                    const paymentRef = doc(collection(db, 'payments'));
                    batch.set(paymentRef, {...p, userId: user.uid});
                });
            }
        }

        batch.update(vendorRef, updatedVendorData);
        await batch.commit();

    }, [user, vendors]);
    
    const handleDeleteVendor = useCallback(async (vendorId: string) => {
        if (!user) return;
        try {
            const batch = writeBatch(db);
            const vendorRef = doc(db, 'vendors', vendorId);
            batch.delete(vendorRef);

            const q = query(collection(db, 'payments'), where('vendorId', '==', vendorId), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
        } catch (error) {
            console.error("Error deleting vendor:", error);
        }
    }, [user]);

    const handleRegisterPayment = useCallback(async (data: { vendorId: string, paidAmount: number, paymentDate: Date, paymentId?: string }) => {
        if (!user) return;

        const batch = writeBatch(db);

        if(data.paymentId){
            const paymentRef = doc(db, 'payments', data.paymentId);
            batch.update(paymentRef, { status: PaymentStatus.Paid, paymentDate: data.paymentDate });
        }
        
        const vendorRef = doc(db, 'vendors', data.vendorId);
        const vendor = vendors.find(v => v.id === data.vendorId);
        if(vendor){
            const newAmountPaid = (vendor.amountPaid || 0) + data.paidAmount;
            batch.update(vendorRef, { amountPaid: newAmountPaid });
        }
        
        await batch.commit();

    }, [user, vendors]);
    
    const handleDeletePayment = useCallback(async (paymentId: string) => {
       if (!user) return;
       await deleteDoc(doc(db, "payments", paymentId));
    }, [user]);
    
    const handleAddGuest = useCallback(async (data: GuestFormData) => {
        if (!user) return;
        const batch = writeBatch(db);

        const guestRef = doc(collection(db, 'guests'));
        const newGuest: Omit<Guest, 'id'> = {
            ...data,
            userId: user.uid,
        };
        batch.set(guestRef, newGuest);

        const giftRef = doc(collection(db, 'gifts'));
        const newGift: Omit<Gift, 'id'> = {
            guestId: guestRef.id,
            guestName: newGuest.name,
            amount: 0,
            description: '',
            thankYouSent: false,
            userId: user.uid,
        };
        batch.set(giftRef, newGift);

        await batch.commit();
    }, [user]);

    const handleEditGuest = useCallback(async (guestId: string, data: GuestFormData) => {
        if (!user) return;

        const batch = writeBatch(db);
        const guestRef = doc(db, 'guests', guestId);
        batch.update(guestRef, data as Partial<Guest>);

        const gift = gifts.find(g => g.guestId === guestId);
        if (gift) {
            const giftRef = doc(db, 'gifts', gift.id);
            batch.update(giftRef, { guestName: data.name });
        }
        await batch.commit();
    }, [user, gifts]);

    const handleDeleteGuest = useCallback(async (guestIds: string[]) => {
        if (!user) return;
        const batch = writeBatch(db);
        guestIds.forEach(id => {
            const guestRef = doc(db, 'guests', id);
            batch.delete(guestRef);

            const gift = gifts.find(g => g.guestId === id);
            if (gift) {
                const giftRef = doc(db, 'gifts', gift.id);
                batch.delete(giftRef);
            }
        });
        await batch.commit();
    }, [user, gifts]);

    const handleChangeGuestsStatus = useCallback(async (guestIds: string[], newStatus: GuestStatus) => {
        if (!user) return;
        const batch = writeBatch(db);
        guestIds.forEach(id => {
            const guestRef = doc(db, 'guests', id);
            batch.update(guestRef, { status: newStatus });
        });
        await batch.commit();
    }, [user]);

    const handleUpdateGift = useCallback(async (giftId: string, data: GiftFormData) => {
        if (!user) return;
        const giftRef = doc(db, 'gifts', giftId);
        await updateDoc(giftRef, data as Partial<Gift>);
    }, [user]);

    const handleToggleThankYouSent = useCallback(async (giftId: string): Promise<boolean> => {
        if (!user) return false;
        const gift = gifts.find(g => g.id === giftId);
        if (gift) {
            const giftRef = doc(db, 'gifts', giftId);
            await updateDoc(giftRef, { thankYouSent: !gift.thankYouSent });
            return !gift.thankYouSent;
        }
        return false;
    }, [user, gifts]);

    const handleUploadContract = useCallback(async (vendorId: string, file: File): Promise<string | null> => {
        if (!user) return null;
        try {
            const storageRef = ref(storage, `contracts/${user.uid}/${vendorId}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            const vendorRef = doc(db, 'vendors', vendorId);
            await updateDoc(vendorRef, { 
                contractUrl: downloadURL,
                fileName: file.name
            });
            
            return downloadURL;
        } catch (error) {
            console.error("Error uploading contract:", error);
            throw error;
        }
    }, [user]);

    const handleDeleteContract = useCallback(async (vendorId: string, fileUrl: string) => {
        if (!user) return;
        try {
            const fileRef = ref(storage, fileUrl);
            await deleteObject(fileRef);
            
            const vendorRef = doc(db, 'vendors', vendorId);
            await updateDoc(vendorRef, { 
                contractUrl: null, // or deleteField() if you prefer to remove the field
                fileName: null 
            });
        } catch (error) {
             console.error("Error deleting contract:", error);
             throw error;
        }
    }, [user]);

    return {
        loading,
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
        populateDefaultTasks,
        handleAddVendor,
        handleEditVendor,
        handleDeleteVendor,
        handleRegisterPayment,
        handleDeletePayment,
        handleAddGuest,
        handleEditGuest,
        handleDeleteGuest,
        handleChangeGuestsStatus,
        handleUpdateGift,
        handleToggleThankYouSent,
        handleUploadContract,
        handleDeleteContract,
    };
};
