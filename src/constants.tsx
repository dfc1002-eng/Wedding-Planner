import { WeddingData, Vendor, Payment, Task, VendorStatus, PaymentStatus, Guest, GuestStatus, Gift } from './types';
// FIX: The `subMonths` function is not a named export in some versions of date-fns. Replaced with `addMonths` and a negative value for broader compatibility.
import { addMonths, addDays } from 'date-fns';

export const VENDOR_CATEGORIES: string[] = [
    'Buffet',
    'Decoração',
    'Fotografia',
    'Cerimonial',
    'Local',
    'Filmagem',
    'Música',
    'Bar',
    'Beleza',
    'Convites',
    'Bolo e Doces',
    'Lembrancinhas',
    'Trajes',
    'Outros',
];

export const GUEST_GROUPS: string[] = [
    'Família da Noiva',
    'Amigos da Noiva',
    'Família do Noivo',
    'Amigos do Noivo',
    'Amigos do Casal',
    'Colegas de Trabalho',
    'Outros',
];

const today = new Date();

export const MOCK_WEDDING_DATA: WeddingData = {
    coupleNames: ['Jéssica', 'Fernando'],
    weddingDate: addMonths(today, 6),
    guestCount: 150,
    totalBudget: 80000,
    venueName: 'Espaço dos Sonhos',
    weddingWebsite: 'https://jessica-e-fernando.com',
};

export const INITIAL_WEDDING_DATA: WeddingData = {
    coupleNames: ['', ''],
    weddingDate: new Date(),
    guestCount: 0,
    totalBudget: 0,
    venueName: '',
    weddingWebsite: '',
};

const vendor1Id = 'vendor-1';
const vendor2Id = 'vendor-2';
const vendor3Id = 'vendor-3';
const vendor4Id = 'vendor-4';
const vendor5Id = 'vendor-5';
const vendor6Id = 'vendor-6';

export const MOCK_VENDORS: Vendor[] = [
    { id: vendor1Id, name: 'Buffet Sabor Divino', category: 'Buffet', contractedValue: 25000, amountPaid: 12500, status: VendorStatus.PartiallyPaid, email: 'contato@sabordivino.com', phone: '11 98765-4321' },
    { id: vendor2Id, name: 'Eterna Fotografia', category: 'Fotografia', contractedValue: 8000, amountPaid: 8000, status: VendorStatus.Paid, email: 'foto@eterna.com', phone: '21 91234-5678' },
    { id: vendor3Id, name: 'Espaço Sonho Real', category: 'Local', contractedValue: 15000, amountPaid: 7500, status: VendorStatus.PartiallyPaid, email: 'eventos@sonhoreal.com' },
    { id: vendor4Id, name: 'DJ Festa Boa', category: 'Música', contractedValue: 4500, amountPaid: 0, status: VendorStatus.Planned, phone: '31 99999-8888' },
    { id: vendor5Id, name: 'Decorações Encantadas', category: 'Decoração', contractedValue: 12000, amountPaid: 0, status: VendorStatus.Planned, email: 'contato@decoracoesencantadas.com', phone: '11 91111-2222' },
    { id: vendor6Id, name: 'Cerimonial Sonho Perfeito', category: 'Cerimonial', contractedValue: 7000, amountPaid: 3500, status: VendorStatus.PartiallyPaid, email: 'contato@sonhoperfeito.com', phone: '21 93333-4444' },
];

export const MOCK_PAYMENTS: Payment[] = [
    // Buffet
    { id: 'p1', vendorId: vendor1Id, parcelValue: 12500, dueDate: addMonths(today, -1), status: PaymentStatus.Paid, paymentDate: addMonths(today, -1) },
    { id: 'p2', vendorId: vendor1Id, parcelValue: 12500, dueDate: addMonths(today, 1), status: PaymentStatus.Open },
    // Fotografia
    { id: 'p3', vendorId: vendor2Id, parcelValue: 8000, dueDate: addMonths(today, -2), status: PaymentStatus.Paid, paymentDate: addMonths(today, -2) },
    // Local
    { id: 'p4', vendorId: vendor3Id, parcelValue: 7500, dueDate: addDays(today, -5), status: PaymentStatus.Paid, paymentDate: addDays(today, -5) },
    { id: 'p5', vendorId: vendor3Id, parcelValue: 7500, dueDate: addMonths(today, 2), status: PaymentStatus.Open },
    // DJ
    { id: 'p6', vendorId: vendor4Id, parcelValue: 4500, dueDate: addDays(today, 3), status: PaymentStatus.Open },
    // Decoração
    { id: 'p7', vendorId: vendor5Id, parcelValue: 6000, dueDate: addMonths(today, 2), status: PaymentStatus.Open },
    { id: 'p8', vendorId: vendor5Id, parcelValue: 6000, dueDate: addMonths(today, 4), status: PaymentStatus.Open },
    // Cerimonial
    { id: 'p9', vendorId: vendor6Id, parcelValue: 3500, dueDate: addMonths(today, -1), status: PaymentStatus.Paid, paymentDate: addMonths(today, -1) },
    { id: 'p10', vendorId: vendor6Id, parcelValue: 3500, dueDate: addMonths(today, 1), status: PaymentStatus.Open },
];


export const MOCK_TASKS: Task[] = [
    // 12 - 18 MESES ANTES
    { id: 't1', title: 'Fazer a lista de convidados (prévia)', completed: true, timeframe: '12 - 18 MESES ANTES' },
    { id: 't2', title: 'Definir a data do casamento', completed: true, timeframe: '12 - 18 MESES ANTES' },
    { id: 't3', title: 'Contratar assessoria e cerimonial', completed: true, timeframe: '12 - 18 MESES ANTES', createsVendorCategory: 'Cerimonial', isImportant: true },
    { id: 't4', title: 'Escolher o local do casamento (cerimônia e festa)', completed: true, timeframe: '12 - 18 MESES ANTES', createsVendorCategory: 'Local', isImportant: true },
    { id: 't5', title: 'Escolher fotógrafo', completed: true, timeframe: '12 - 18 MESES ANTES', createsVendorCategory: 'Fotografia', isImportant: true },
    { id: 't6', title: 'Escolher DJ', completed: false, timeframe: '12 - 18 MESES ANTES', createsVendorCategory: 'Música' },
    { id: 't7', title: 'Escolher o decorador', completed: false, timeframe: '12 - 18 MESES ANTES', createsVendorCategory: 'Decoração', isImportant: true },
    { id: 't8', title: 'Escolher o filmmaker', completed: false, timeframe: '12 - 18 MESES ANTES', createsVendorCategory: 'Filmagem' },
    { id: 't9', title: 'Escolher o buffet do casamento', completed: true, timeframe: '12 - 18 MESES ANTES', createsVendorCategory: 'Buffet', isImportant: true },
    { id: 't10', title: 'Escolher o bar do casamento', completed: false, timeframe: '12 - 18 MESES ANTES', createsVendorCategory: 'Bar' },
    { id: 't11', title: 'Escolher o profissional de beleza da noiva (cabelo e maquiagem)', completed: false, timeframe: '12 - 18 MESES ANTES', createsVendorCategory: 'Beleza' },
    
    // 10 MESES ANTES
    { id: 't12', title: 'Definir o vestido de noiva e acessórios iniciais', completed: false, timeframe: '10 MESES ANTES', createsVendorCategory: 'Trajes' },
    { id: 't13', title: 'Planejar a lua de mel', completed: false, timeframe: '10 MESES ANTES' },
    { id: 't14', title: 'Contratar música para cerimônia', completed: false, timeframe: '10 MESES ANTES', createsVendorCategory: 'Música' },
    { id: 't15', title: 'Definir papelaria de casamento', completed: false, timeframe: '10 MESES ANTES', createsVendorCategory: 'Convites' },
    { id: 't16', title: 'Escolher o celebrante do casamento', completed: false, timeframe: '10 MESES ANTES', createsVendorCategory: 'Outros' },
    { id: 't17', title: 'Definir presentes para padrinhos e madrinhas', completed: false, timeframe: '10 MESES ANTES' },
    
    // 8 MESES ANTES
    { id: 't18', title: 'Escolher as alianças', completed: false, timeframe: '8 MESES ANTES' },
    { id: 't19', title: 'Fechar site de casamento', completed: false, timeframe: '8 MESES ANTES' },
    { id: 't20', title: 'Fechar a lista de convidados', completed: false, timeframe: '8 MESES ANTES', isImportant: true },
    
    // 6 MESES ANTES
    { id: 't21', title: 'Enviar o Save the Date', completed: false, timeframe: '6 MESES ANTES', isImportant: true }, // Marcado como importante
    { id: 't22', title: 'Escolher local da noite de núpcias', completed: false, timeframe: '6 MESES ANTES' },
    { id: 't23', title: 'Escolher doces, bolo e bem casados', completed: false, timeframe: '6 MESES ANTES', createsVendorCategory: 'Bolo e Doces' },
    { id: 't24', title: 'Terno do noivo', completed: false, timeframe: '6 MESES ANTES', createsVendorCategory: 'Trajes' },
    { id: 't25', title: 'Definir roupas das damas e pajens', completed: false, timeframe: '6 MESES ANTES' },
    { id: 't26', title: 'Escolher o sapato de noiva (Dica: escolha um confortável)', completed: false, timeframe: '6 MESES ANTES' },
    { id: 't27', title: 'Contratar espaço kids (se necessário)', completed: false, timeframe: '6 MESES ANTES', createsVendorCategory: 'Outros' },

    // 3 MESES ANTES
    { id: 't28', title: 'Dar entrada na papelada para o casamento civil', completed: false, timeframe: '3 MESES ANTES' },
    { id: 't29', title: 'Contratar segurança e limpeza', completed: false, timeframe: '3 MESES ANTES', createsVendorCategory: 'Outros' },
    { id: 't30', title: 'Contratar gerador', completed: false, timeframe: '3 MESES ANTES', createsVendorCategory: 'Outros' },
    { id: 't31', title: 'Fechar chinelinho para o conforto das convidadas', completed: false, timeframe: '3 MESES ANTES', createsVendorCategory: 'Lembrancinhas' },
    { id: 't32', title: 'Escolher kit toillet', completed: false, timeframe: '3 MESES ANTES' },
    { id: 't33', title: 'Escolher músicas da cerimônia', completed: false, timeframe: '3 MESES ANTES' },
    { id: 't34', title: 'Definir menu do buffet e bar', completed: false, timeframe: '3 MESES ANTES' },
    { id: 't35', title: 'Comprar as bebidas alcoólicas', completed: false, timeframe: '3 MESES ANTES' },
    { id: 't36', title: 'Escolher robe para usar no making of do grande dia', completed: false, timeframe: '3 MESES ANTES' },
    { id: 't37', title: 'Despedida de solteira', completed: false, timeframe: '3 MESES ANTES' },
    { id: 't38', title: 'Entregar presentes para padrinhos e madrinhas', completed: false, timeframe: '3 MESES ANTES' },

    // 1 MÊS ANTES
    { id: 't39', title: 'Conferir todos os detalhes dos trajes dos noivos', completed: false, timeframe: '1 MÊS ANTES' },
    { id: 't40', title: 'Entregar convites do casamento', completed: false, timeframe: '1 MÊS ANTES' },
    { id: 't41', title: 'Reunião final com o DJ', completed: false, timeframe: '1 MÊS ANTES' },
    { id: 't42', title: 'Reunião final com o cerimonialista', completed: false, timeframe: '1 MÊS ANTES' },
    { id: 't43', title: 'Reunião final com o celebrante', completed: false, timeframe: '1 MÊS ANTES' },
    { id: 't44', title: 'Fazer cronograma do dia do casamento', completed: false, timeframe: '1 MÊS ANTES' },
    { id: 't45', title: 'Organizar mala da lua de mel', completed: false, timeframe: '1 MÊS ANTES' },
    { id: 't46', title: 'Entregar roupas damas e pajens', completed: false, timeframe: '1 MÊS ANTES' },

    // CHECKLIST DA SEMANA DO CASAMENTO
    { id: 't47', title: 'Vestido', completed: false, timeframe: 'CHECKLIST DA SEMANA DO CASAMENTO' },
    { id: 't48', title: 'Sapato', completed: false, timeframe: 'CHECKLIST DA SEMANA DO CASAMENTO' },
    { id: 't49', title: 'Véu e grinalda', completed: false, timeframe: 'CHECKLIST DA SEMANA DO CASAMENTO' },
    { id: 't50', title: 'Aliança e jóias', completed: false, timeframe: 'CHECKLIST DA SEMANA DO CASAMENTO' },
    { id: 't51', title: 'Terno e camisa noivo', completed: false, timeframe: 'CHECKLIST DA SEMANA DO CASAMENTO' },
    { id: 't52', title: 'Camisa extra noivo', completed: false, timeframe: 'CHECKLIST DA SEMANA DO CASAMENTO' },
    { id: 't53', title: 'Mala para a noite de núpcias', completed: false, timeframe: 'CHECKLIST DA SEMANA DO CASAMENTO' },
    { id: 't54', title: 'Caderno de votos', completed: false, timeframe: 'CHECKLIST DA SEMANA DO CASAMENTO' },
];

export const MOCK_GUESTS: Guest[] = [
  { id: 'g1', name: 'Carlos Andrade', status: GuestStatus.Confirmed, group: 'Família da Noiva', plusOnes: 1, confirmedPlusOnes: 1, table: 1, phone: '(11) 98888-7777', address: 'Rua das Flores, 123, São Paulo, SP', notes: 'Padrinho do noivo. Alergia a camarão.' },
  { id: 'g2', name: 'Mariana Lima', status: GuestStatus.Pending, group: 'Amigos do Noivo', plusOnes: 0, phone: '(21) 99999-5555', address: 'Av. Copacabana, 456, Rio de Janeiro, RJ', notes: 'Amiga de infância.' },
  { id: 'g3', name: 'Pedro Souza', status: GuestStatus.Declined, group: 'Amigos do Noivo', plusOnes: 1, phone: '(31) 97777-6666', address: 'Rua da Bahia, 789, Belo Horizonte, MG', notes: 'Estará em viagem.' },
  { id: 'g4', name: 'Ana Costa', status: GuestStatus.Confirmed, group: 'Família do Noivo', plusOnes: 3, confirmedPlusOnes: 3, table: 2, phone: '(11) 96666-4444', address: 'Rua Augusta, 101, São Paulo, SP', notes: 'Tia e primos do noivo.' },
  { id: 'g5', name: 'Lucas Ferreira', status: GuestStatus.Pending, group: 'Amigos da Noiva', plusOnes: 1, phone: '(48) 95555-3333', address: 'Av. Beira Mar, 212, Florianópolis, SC', notes: '' },
  { id: 'g6', name: 'Julia Martins', status: GuestStatus.Confirmed, group: 'Família da Noiva', plusOnes: 0, table: 1, phone: '(11) 94444-2222', address: 'Rua das Flores, 123, São Paulo, SP', notes: 'Irmã da noiva. Madrinha.' },
];

export const MOCK_GIFTS: Gift[] = [
  { id: 'g1', guestId: 'g1', guestName: 'Carlos Andrade', amount: 500, description: 'Dinheiro via Pix', thankYouSent: true },
  { id: 'g2', guestId: 'g2', guestName: 'Mariana Lima', amount: 0, description: '', thankYouSent: false },
  { id: 'g3', guestId: 'g3', guestName: 'Pedro Souza', amount: 0, description: 'Recusou o convite', thankYouSent: true },
  { id: 'g4', guestId: 'g4', guestName: 'Ana Costa', amount: 1200, description: 'Jogo de panelas Le Creuset', thankYouSent: false },
  { id: 'g5', guestId: 'g5', guestName: 'Lucas Ferreira', amount: 0, description: '', thankYouSent: false },
  { id: 'g6', guestId: 'g6', guestName: 'Julia Martins', amount: 750, description: 'Cotas de lua de mel', thankYouSent: true },
];