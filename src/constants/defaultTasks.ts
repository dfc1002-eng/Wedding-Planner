import { Task } from '../types';

export const DEFAULT_TASKS_DATA: Omit<Task, 'id' | 'userId' | 'createdAt'>[] = [
   // 12-18 MESES
   { title: "Fazer a lista de convidados (prévia)", timeframe: "12-18 MESES ANTES", completed: false, isImportant: true },
   { title: "Definir a data do casamento", timeframe: "12-18 MESES ANTES", completed: false, isImportant: true },
   { title: "Contratar Assessoria e Cerimonial", timeframe: "12-18 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Assessoria" },
   { title: "Escolher o local do casamento (Cerimônia e Festa)", timeframe: "12-18 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Espaço/Local" },
   { title: "Escolher Fotógrafo", timeframe: "12-18 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Fotografia" },
   { title: "Escolher DJ", timeframe: "12-18 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Música/DJ" },
   { title: "Escolher o Decorador", timeframe: "12-18 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Decoração" },
   { title: "Escolher o Filmmaker (Vídeo)", timeframe: "12-18 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Filmagem" },
   { title: "Escolher o Buffet do casamento", timeframe: "12-18 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Buffet" },
   { title: "Escolher o Bar do casamento", timeframe: "12-18 MESES ANTES", completed: false, isImportant: false, createsVendorCategory: "Bar/Bebidas" },
   { title: "Escolher o profissional de beleza da noiva", timeframe: "12-18 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Beleza" },

   // 10 MESES
   { title: "Definir o vestido de noiva e acessórios iniciais", timeframe: "10 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Trajes" },
   { title: "Planejar a Lua de Mel", timeframe: "10 MESES ANTES", completed: false, isImportant: true },
   { title: "Contratar música para cerimônia", timeframe: "10 MESES ANTES", completed: false, isImportant: false, createsVendorCategory: "Música Cerimônia" },
   { title: "Definir papelaria de casamento", timeframe: "10 MESES ANTES", completed: false, isImportant: false, createsVendorCategory: "Papelaria/Convites" },
   { title: "Escolher o Celebrante do casamento", timeframe: "10 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Celebrante" },
   { title: "Definir presentes para padrinhos e madrinhas", timeframe: "10 MESES ANTES", completed: false, isImportant: false },

   // 8 MESES
   { title: "Escolher as alianças", timeframe: "8 MESES ANTES", completed: false, isImportant: true },
   { title: "Fechar site de casamento", timeframe: "8 MESES ANTES", completed: false, isImportant: false },
   { title: "Fechar a lista de convidados", timeframe: "8 MESES ANTES", completed: false, isImportant: true },

   // 6 MESES
   { title: "Enviar o Save the Date", timeframe: "6 MESES ANTES", completed: false, isImportant: false },
   { title: "Escolher local da noite de núpcias", timeframe: "6 MESES ANTES", completed: false, isImportant: false },
   { title: "Escolher doces, bolo e bem casados", timeframe: "6 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Bolo e Doces" },
   { title: "Terno do noivo", timeframe: "6 MESES ANTES", completed: false, isImportant: true },
   { title: "Definir roupas das damas e pajens", timeframe: "6 MESES ANTES", completed: false, isImportant: false },
   { title: "Escolher o sapato de noiva (confortável)", timeframe: "6 MESES ANTES", completed: false, isImportant: true },
   { title: "Contratar Espaço Kids (se necessário)", timeframe: "6 MESES ANTES", completed: false, isImportant: false },

   // 3 MESES
   { title: "Dar entrada na papelada para o casamento civil", timeframe: "3 MESES ANTES", completed: false, isImportant: true },
   { title: "Contratar segurança e limpeza", timeframe: "3 MESES ANTES", completed: false, isImportant: false },
   { title: "Contratar gerador", timeframe: "3 MESES ANTES", completed: false, isImportant: true, createsVendorCategory: "Gerador" },
   { title: "Fechar chinelinho para o conforto das convidadas", timeframe: "3 MESES ANTES", completed: false, isImportant: false, createsVendorCategory: "Lembrancinhas" },
   { title: "Escolher Kit Toillet", timeframe: "3 MESES ANTES", completed: false, isImportant: false },
   { title: "Escolher músicas da cerimônia", timeframe: "3 MESES ANTES", completed: false, isImportant: false },
   { title: "Definir menu do Buffet e Bar", timeframe: "3 MESES ANTES", completed: false, isImportant: true },
   { title: "Comprar as bebidas alcoólicas", timeframe: "3 MESES ANTES", completed: false, isImportant: false },
   { title: "Escolher robe para usar no making of", timeframe: "3 MESES ANTES", completed: false, isImportant: false },
   { title: "Despedida de solteira", timeframe: "3 MESES ANTES", completed: false, isImportant: false },
   { title: "Entregar presentes para padrinhos e madrinhas", timeframe: "3 MESES ANTES", completed: false, isImportant: false },

   // 1 MÊS
   { title: "Conferir todos os detalhes dos trajes dos noivos", timeframe: "1 MÊS ANTES", completed: false, isImportant: true },
   { title: "Entregar convites do casamento", timeframe: "1 MÊS ANTES", completed: false, isImportant: true },
   { title: "Reunião final com o DJ", timeframe: "1 MÊS ANTES", completed: false, isImportant: true },
   { title: "Reunião final com o Cerimonialista", timeframe: "1 MÊS ANTES", completed: false, isImportant: true },
   { title: "Reunião final com o Celebrante", timeframe: "1 MÊS ANTES", completed: false, isImportant: true },
   { title: "Fazer cronograma do dia do casamento", timeframe: "1 MÊS ANTES", completed: false, isImportant: true },
   { title: "Organizar mala da Lua de Mel", timeframe: "1 MÊS ANTES", completed: false, isImportant: true },
   { title: "Entregar roupas damas e pajens", timeframe: "1 MÊS ANTES", completed: false, isImportant: false },

   // SEMANA DO CASAMENTO
   { title: "Vestido (Check final)", timeframe: "CHECKLIST DA SEMANA DO CASAMENTO", completed: false, isImportant: true },
   { title: "Sapato", timeframe: "CHECKLIST DA SEMANA DO CASAMENTO", completed: false, isImportant: true },
   { title: "Véu e Grinalda", timeframe: "CHECKLIST DA SEMANA DO CASAMENTO", completed: false, isImportant: true },
   { title: "Aliança e Jóias", timeframe: "CHECKLIST DA SEMANA DO CASAMENTO", completed: false, isImportant: true },
   { title: "Terno e camisa do noivo", timeframe: "CHECKLIST DA SEMANA DO CASAMENTO", completed: false, isImportant: true },
   { title: "Camisa extra do noivo", timeframe: "CHECKLIST DA SEMANA DO CASAMENTO", completed: false, isImportant: false },
   { title: "Mala para a noite de núpcias", timeframe: "CHECKLIST DA SEMANA DO CASAMENTO", completed: false, isImportant: true },
   { title: "Caderno de votos", timeframe: "CHECKLIST DA SEMANA DO CASAMENTO", completed: false, isImportant: true },
];
