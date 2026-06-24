import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
    setDoc,
    getDoc,
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
import { MOCK_WEDDING_DATA, INITIAL_WEDDING_DATA } from '../constants';
import { DEFAULT_TASKS_DATA } from '../constants/defaultTasks';
import { createPaymentsFromParcels, normalizeText } from '../utils';
import { getPaymentNotifications } from '../notifications';

export const useWeddingData = () => {
    const { user } = useAuth();
    const [weddingData, setWeddingDataState] = useState<WeddingData>(INITIAL_WEDDING_DATA);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [loadedCollections, setLoadedCollections] = useState<Set<string>>(new Set());
    
    // Estados para Colaboração / Compartilhamento de Conta
    const [activeWeddingId, setActiveWeddingId] = useState<string | null>(() => {
        const saved = localStorage.getItem('activeWeddingId');
        return saved || null;
    });
    const [collaborators, setCollaborators] = useState<string[]>([]);
    const [sharedWeddings, setSharedWeddings] = useState<any[]>([]);

    // Sincroniza o activeWeddingId com o UID do usuário após login
    useEffect(() => {
        if (user) {
            if (!activeWeddingId) {
                setActiveWeddingId(user.uid);
            }
        } else {
            setActiveWeddingId(null);
            localStorage.removeItem('activeWeddingId');
        }
    }, [user, activeWeddingId]);

    // Busca os casamentos onde o usuário atual é colaborador
    useEffect(() => {
        if (!user) {
            setSharedWeddings([]);
            return;
        }

        console.log("Fetching shared weddings for user:", user.uid);
        const q = query(
            collection(db, 'users'),
            where('collaborators', 'array-contains', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    coupleNames: data.weddingData?.coupleNames || ['Sem Nome', 'Sem Nome'],
                    ...data.weddingData
                };
            });
            console.log("Shared weddings updated:", list);
            setSharedWeddings(list);
        }, (error) => {
            console.error("Error loading shared weddings:", error);
        });

        return () => unsubscribe();
    }, [user]);

    const changeActiveWedding = useCallback((id: string | null) => {
        if (id) {
            localStorage.setItem('activeWeddingId', id);
            setActiveWeddingId(id);
        } else {
            localStorage.removeItem('activeWeddingId');
            if (user) {
                setActiveWeddingId(user.uid);
            } else {
                setActiveWeddingId(null);
            }
        }
    }, [user]);

    const handleAddCollaborator = useCallback(async (collabUid: string) => {
        if (!user || !activeWeddingId) return;
        if (collabUid === user.uid) {
            throw new Error("Você não pode se adicionar como colaborador do seu próprio casamento.");
        }
        
        if (activeWeddingId !== user.uid) {
            throw new Error("Apenas o dono do casamento pode adicionar colaboradores.");
        }

        const userRef = doc(db, 'users', activeWeddingId);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            const currentCollaborators = data.collaborators || [];
            
            if (currentCollaborators.includes(collabUid)) {
                throw new Error("Este usuário já é um colaborador.");
            }

            const collabUserRef = doc(db, 'users', collabUid);
            const collabUserSnap = await getDoc(collabUserRef);
            if (!collabUserSnap.exists()) {
                throw new Error("ID de usuário não encontrado. Certifique-se de que o parceiro já fez login no sistema pelo menos uma vez.");
            }

            const updated = [...currentCollaborators, collabUid];
            await updateDoc(userRef, { collaborators: updated });
        } else {
            await setDoc(userRef, { 
                weddingData: INITIAL_WEDDING_DATA,
                collaborators: [collabUid] 
            });
        }
    }, [user, activeWeddingId]);

    const handleRemoveCollaborator = useCallback(async (collabUid: string) => {
        if (!user || !activeWeddingId) return;
        
        if (activeWeddingId !== user.uid) {
            throw new Error("Apenas o dono do casamento pode remover colaboradores.");
        }

        const userRef = doc(db, 'users', activeWeddingId);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            const currentCollaborators = data.collaborators || [];
            const updated = currentCollaborators.filter((uid: string) => uid !== collabUid);
            await updateDoc(userRef, { collaborators: updated });
        }
    }, [user, activeWeddingId]);

    // Ref para controlar a origem das mudanças e evitar loops de salvamento do Firestore
    const isDirty = useRef(false);
    const lastSavedString = useRef<string>('');

    const markAsLoaded = useCallback((collectionName: string) => {
        setLoadedCollections(prev => {
            if (prev.has(collectionName)) return prev;
            const newSet = new Set(prev);
            newSet.add(collectionName);
            return newSet;
        });
    }, []);

    const loading = useMemo(() => {
        if (!user) return false;
        return loadedCollections.size < 6;
    }, [user, loadedCollections]);

    // Wrapper para atualizar localmente e marcar para salvamento
    const setWeddingData = useCallback((data: WeddingData | ((prev: WeddingData) => WeddingData)) => {
        if (!user) return;
        isDirty.current = true; // Marca que a mudança veio do usuário/frontend
        setWeddingDataState(data);
    }, [user]);

    // Efeito para salvar weddingData no Firestore com debounce
    useEffect(() => {
        if (!user || !activeWeddingId || !isDirty.current) {
            // Só salva se houver usuário logado e se a mudança foi iniciada pelo frontend (isDirty)
            return;
        }

        const timer = setTimeout(async () => {
            console.log("Saving weddingData to Firestore with debounce:", weddingData);
            try {
                const userRef = doc(db, 'users', activeWeddingId);
                const dataToSave = {
                    ...weddingData,
                    // Garante que weddingDate seja um objeto Date antes de salvar
                    weddingDate: weddingData.weddingDate instanceof Date ? weddingData.weddingDate : new Date(weddingData.weddingDate)
                };
                // Remove o 'id' antes de salvar para evitar conflitos, pois o ID já é o doc.id
                const { id, ...restOfWeddingData } = dataToSave;
                
                // Serializa os dados antes de salvar para comparar no listener
                lastSavedString.current = JSON.stringify(restOfWeddingData);
                
                // Salva o documento de usuário principal (com dados sensíveis como totalBudget)
                await setDoc(userRef, { weddingData: restOfWeddingData }, { merge: true });
                
                // Salva a cópia pública de RSVP (sem dados sensíveis)
                const publicRsvpRef = doc(db, 'users', activeWeddingId, 'public', 'rsvp');
                await setDoc(publicRsvpRef, {
                    coupleNames: restOfWeddingData.coupleNames,
                    weddingDate: restOfWeddingData.weddingDate,
                }, { merge: true });
                
                console.log("weddingData Firestore save success!");
                isDirty.current = false; // Reseta a flag após o salvamento bem-sucedido
            } catch (err) {
                console.error("weddingData Firestore save error:", err);
            }
        }, 2000); // 2 segundos de debounce

        return () => clearTimeout(timer);
    }, [weddingData, user, activeWeddingId]);

    useEffect(() => {
        if (!user || !activeWeddingId) {
            setVendors([]);
            setPayments([]);
            setTasks([]);
            setGuests([]);
            setGifts([]);
            setLoadedCollections(new Set());
            setCollaborators([]);
            return;
        }

        const userId = activeWeddingId;
        console.log("Initializing listeners for wedding:", userId);

        // 1. Listener para Dados do Casamento (User Doc)
        const userRef = doc(db, 'users', userId);
        const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Received update from Firestore (User Doc):", data);
                
                // Atualiza colaboradores
                if (data.collaborators) {
                    setCollaborators(data.collaborators);
                } else {
                    setCollaborators([]);
                }
                
                if (data.weddingData) {
                    const incomingString = JSON.stringify(data.weddingData);
                    
                    // Previne loops se for igual ao último gravado localmente
                    if (incomingString === lastSavedString.current) {
                        markAsLoaded('user');
                        return;
                    }
                    
                    // Previne sobrescrever dados locais se houver edição pendente (debounce ativo)
                    if (isDirty.current) {
                        markAsLoaded('user');
                        return;
                    }

                    setWeddingDataState({
                        id: docSnap.id, // Adiciona o ID do documento (user.uid) aqui!
                        ...data.weddingData,
                        weddingDate: data.weddingData.weddingDate?.toDate ? data.weddingData.weddingDate.toDate() : new Date(data.weddingData.weddingDate),
                    });
                    
                    lastSavedString.current = incomingString;
                }
            } else {
                console.log("User document does not exist yet.");
                setCollaborators([]);
            }
            markAsLoaded('user');
        }, (error) => {
            console.error("Error listening to user doc:", error);
            markAsLoaded('user');
        });

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
            unsubscribeUser,
            onSnapshot(queries.vendors, snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vendor));
                setVendors(data);
                markAsLoaded('vendors');
            }, error => {
                console.error("Error loading vendors:", error);
                markAsLoaded('vendors');
            }),
            onSnapshot(queries.payments, snapshot => {
                const data = snapshot.docs.map(doc => {
                    const paymentData = doc.data();
                    const { id: internalId, ...restOfData } = paymentData;
                    
                    return { 
                        ...restOfData,
                        id: doc.id, // FORCE REAL DOC ID
                        dueDate: paymentData.dueDate.toDate(),
                        paymentDate: paymentData.paymentDate ? paymentData.paymentDate.toDate() : undefined,
                    } as Payment;
                });
                setPayments(data);
                markAsLoaded('payments');
            }, error => {
                console.error("Error loading payments:", error);
                markAsLoaded('payments');
            }),
            onSnapshot(queries.tasks, snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
                setTasks(data);
                markAsLoaded('tasks');
            }, error => {
                console.error("Error loading tasks:", error);
                markAsLoaded('tasks');
            }),
            onSnapshot(queries.guests, snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Guest));
                setGuests(data);
                markAsLoaded('guests');
            }, error => {
                console.error("Error loading guests:", error);
                markAsLoaded('guests');
            }),
            onSnapshot(queries.gifts, snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gift));
                setGifts(data);
                markAsLoaded('gifts');
            }, error => {
                console.error("Error loading gifts:", error);
                markAsLoaded('gifts');
            }),
        ];

        return () => unsubscribes.forEach(unsub => unsub());
    }, [user, activeWeddingId]);


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
        if (!user || !activeWeddingId) return;
        
        const batch = writeBatch(db);
        
        DEFAULT_TASKS_DATA.forEach(task => {
            const taskRef = doc(collection(db, 'tasks'));
            batch.set(taskRef, {
                ...task,
                userId: activeWeddingId,
                createdAt: new Date()
            });
        });
        
        await batch.commit();
    }, [user, activeWeddingId]);

    const handleAddVendor = useCallback(async (data: NewVendorFormData) => {
        if (!user || !activeWeddingId) return;
        const batch = writeBatch(db);

        const newVendor: Omit<Vendor, 'id'> = {
            userId: activeWeddingId,
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
            createPaymentsFromParcels(vendorRef.id, data.parcels).map(p => ({...p, userId: activeWeddingId})) 
            : [];
            
        newPayments.forEach(payment => {
            const paymentRef = doc(collection(db, 'payments'));
            batch.set(paymentRef, payment);
        });

        await batch.commit();

    }, [user, activeWeddingId]);

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
                    batch.set(paymentRef, {...p, userId: activeWeddingId});
                });
            }
        }

        batch.update(vendorRef, updatedVendorData);
        await batch.commit();

    }, [user, vendors, activeWeddingId]);
    
    const handleDeleteVendor = useCallback(async (vendorId: string) => {
        if (!user || !activeWeddingId) return;
        try {
            const batch = writeBatch(db);
            const vendorRef = doc(db, 'vendors', vendorId);
            batch.delete(vendorRef);

            const q = query(collection(db, 'payments'), where('vendorId', '==', vendorId), where('userId', '==', activeWeddingId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            await batch.commit();
        } catch (error) {
            console.error("Error deleting vendor:", error);
        }
    }, [user, activeWeddingId]);

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
        if (!user || !activeWeddingId) return;
        const batch = writeBatch(db);

        const guestRef = doc(collection(db, 'guests'));
        const newGuest: Omit<Guest, 'id'> = {
            ...data,
            nameNormalized: normalizeText(data.name),
            userId: activeWeddingId,
        };
        batch.set(guestRef, newGuest);

        const giftRef = doc(collection(db, 'gifts'));
        const newGift: Omit<Gift, 'id'> = {
            guestId: guestRef.id,
            guestName: newGuest.name,
            amount: 0,
            description: '',
            thankYouSent: false,
            userId: activeWeddingId,
        };
        batch.set(giftRef, newGift);

        await batch.commit();
    }, [user, activeWeddingId]);

    const handleEditGuest = useCallback(async (guestId: string, data: GuestFormData) => {
        if (!user) return;

        const batch = writeBatch(db);
        const guestRef = doc(db, 'guests', guestId);
        const updateData = {
            ...data as Partial<Guest>,
            nameNormalized: normalizeText(data.name)
        };
        batch.update(guestRef, updateData);

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
        if (!user || !activeWeddingId) return null;
        try {
            const storageRef = ref(storage, `contracts/${activeWeddingId}/${vendorId}/${file.name}`);
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
    }, [user, activeWeddingId]);

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
        weddingData: { ...weddingData, id: activeWeddingId },
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
        activeWeddingId,
        changeActiveWedding,
        collaborators,
        sharedWeddings,
        handleAddCollaborator,
        handleRemoveCollaborator,
    };
};
