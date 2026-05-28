/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  Sector,
  ClientLead,
  MarketingCampaign,
  Employee,
  FinancialRecord,
  WorkOrder,
  StockItem,
  SystemConfig
} from './types';

export const INITIAL_SECTORS: Sector[] = [
  {
    id: 'sec_1',
    name: 'Vendas & CRM',
    key: 'vendas',
    description: 'Gestão de funil de vendas, oportunidades, contratos e métricas de conversão de clientes.',
    manager: 'Carlos Viana',
    color: 'emerald'
  },
  {
    id: 'sec_2',
    name: 'Marketing & Growth',
    key: 'marketing',
    description: 'Planejamento de campanhas digitais, controle de tráfego, anúncios pagos e mídias sociais.',
    manager: 'Mariana Costa',
    color: 'indigo'
  },
  {
    id: 'sec_3',
    name: 'Recursos Humanos',
    key: 'rh',
    description: 'Cadastro de colaboradores, folha de pagamento corporativa, avaliações de clima e desempenho.',
    manager: 'Renata Souza',
    color: 'rose'
  },
  {
    id: 'sec_4',
    name: 'Financeiro',
    key: 'financeiro',
    description: 'Controle contínuo de caixa, fluxo de receitas e despesas, e conciliação bancária estruturada.',
    manager: 'Felipe Alencar',
    color: 'amber'
  },
  {
    id: 'sec_5',
    name: 'Produção & Estoque',
    key: 'producao',
    description: 'Acompanhamento do ciclo de ordens de serviço, níveis de matérias-primas e controle de qualidade.',
    manager: 'Pedro Ribeiro',
    color: 'blue'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_personal',
    name: 'Alberty Henrique',
    email: 'albertyhenrique846@gmail.com',
    password: 'senha123',
    sector: 'vendas',
    role: 'admin',
    is2FAEnabled: true
  },
  {
    id: 'usr_admin',
    name: 'Administrador Geral',
    email: 'admin@sgci.com',
    password: 'admin123',
    sector: 'vendas',
    role: 'admin',
    is2FAEnabled: false
  },
  {
    id: 'usr_vendas',
    name: 'Carlos Viana',
    email: 'carlos@sgci.com',
    password: 'user123',
    sector: 'vendas',
    role: 'user'
  },
  {
    id: 'usr_marketing',
    name: 'Mariana Costa',
    email: 'mariana@sgci.com',
    password: 'user123',
    sector: 'marketing',
    role: 'user'
  },
  {
    id: 'usr_rh',
    name: 'Renata Souza',
    email: 'renata@sgci.com',
    password: 'user123',
    sector: 'rh',
    role: 'user'
  },
  {
    id: 'usr_financeiro',
    name: 'Felipe Alencar',
    email: 'felipe@sgci.com',
    password: 'user123',
    sector: 'financeiro',
    role: 'user'
  },
  {
    id: 'usr_producao',
    name: 'Pedro Ribeiro',
    email: 'pedro@sgci.com',
    password: 'user123',
    sector: 'producao',
    role: 'user'
  }
];

export const INITIAL_LEADS: ClientLead[] = [
  {
    id: 'ld_1',
    name: 'Roberto Arruda',
    company: 'Arruda Alimentos Ltda',
    email: 'roberto@arrudaalimentos.com.br',
    phone: '(11) 98765-4321',
    status: 'fechado',
    value: 45000,
    notes: 'Contrato de fornecimento de software assinado. Integração agendada.',
    lastInteraction: '2026-05-25',
    createdAt: '2026-05-24T09:00:00Z',
    assignedTo: 'Carlos Viana',
    sectorKey: 'vendas'
  },
  {
    id: 'ld_2',
    name: 'Sofia Werneck',
    company: 'Inova Tech Brasil',
    email: 'sofia.werneck@inovatech.io',
    phone: '(21) 99876-1212',
    status: 'proposta',
    value: 28000,
    notes: 'Aguardando retorno sobre o escopo técnico do projeto.',
    lastInteraction: '2026-05-27',
    createdAt: '2026-05-26T14:30:00Z',
    assignedTo: 'Carlos Viana',
    sectorKey: 'vendas'
  },
  {
    id: 'ld_3',
    name: 'Henrique Castela',
    company: 'Logística Expressa S/A',
    email: 'hcastela@logexpress.com.br',
    phone: '(31) 98453-2287',
    status: 'contato',
    value: 110000,
    notes: 'Reunião de apresentação feita. Enviando escopo comercial na próxima semana.',
    lastInteraction: '2026-05-28',
    createdAt: '2026-05-27T11:15:00Z',
    assignedTo: 'Carlos Viana',
    sectorKey: 'vendas'
  },
  {
    id: 'ld_4',
    name: 'Amanda Silveira',
    company: 'Eletro-Norte Distribuição',
    email: 'amanda@eletronorte.com.br',
    phone: '(81) 97421-9900',
    status: 'lead',
    value: 15500,
    notes: 'Demonstrou interesse na solução de ERP via formulário de marketing.',
    lastInteraction: '2026-05-26',
    createdAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(), // 3.5 hours ago
    assignedTo: '',
    sectorKey: 'marketing'
  },
  {
    id: 'ld_5',
    name: 'José Carlos Peixoto',
    company: 'Metalúrgica Vulcan',
    email: 'jc.peixoto@metvulcan.com',
    phone: '(47) 98834-0101',
    status: 'perdido',
    value: 62000,
    notes: 'Optou pelo concorrente por questões de orçamento no trimestre.',
    lastInteraction: '2026-05-10',
    createdAt: '2026-05-09T08:00:00Z',
    assignedTo: 'Carlos Viana',
    sectorKey: 'vendas'
  },
  {
    id: 'ld_6',
    name: 'Maurício de Souza',
    company: 'Mônica Produções Ltda',
    email: 'mauricio@monicaprod.com.br',
    phone: '(11) 93321-4455',
    status: 'lead',
    value: 85000,
    notes: 'Surgido através de indicação corporativa. Necessita de escopo de desenvolvimento urgente.',
    lastInteraction: '2026-05-28',
    createdAt: new Date(Date.now() - 14.8 * 3600 * 1000).toISOString(), // ~15 hours ago
    assignedTo: '',
    sectorKey: 'vendas'
  },
  {
    id: 'ld_7',
    name: 'Patrícia Poeta',
    company: 'Rede Sudoeste Comunicações',
    email: 'patricia.poeta@sudcom.com',
    phone: '(31) 97722-1133',
    status: 'lead',
    value: 40000,
    notes: 'Contato direto do formulário web de infraestrutura de rede.',
    lastInteraction: '2026-05-28',
    createdAt: new Date(Date.now() - 0.45 * 3600 * 1000).toISOString(), // 27 minutes ago
    assignedTo: '',
    sectorKey: 'producao'
  }
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'cp_1',
    name: 'Google Pesquisa - Leads Qualificados 2026',
    channel: 'Google Search',
    status: 'ativo',
    budget: 15000,
    spent: 12450,
    clicks: 4890,
    conversions: 312,
    startDate: '2026-03-01'
  },
  {
    id: 'cp_2',
    name: 'Retargeting Facebook - Checkout Incompleto',
    channel: 'Facebook Ads',
    status: 'ativo',
    budget: 8000,
    spent: 5620,
    clicks: 12200,
    conversions: 185,
    startDate: '2026-04-10'
  },
  {
    id: 'cp_3',
    name: 'Campanha LinkedIn Ads - Diretores de RH & TI',
    channel: 'LinkedIn Ads',
    status: 'pausado',
    budget: 25000,
    spent: 25000,
    clicks: 2980,
    conversions: 84,
    startDate: '2026-02-15'
  },
  {
    id: 'cp_4',
    name: 'Inbound Marketing - Webinário Automação',
    channel: 'E-mail / Organic',
    status: 'rascunho',
    budget: 2000,
    spent: 0,
    clicks: 0,
    conversions: 0,
    startDate: '2026-06-15'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp_1',
    name: 'Carlos Viana',
    role: 'Diretor de Vendas',
    sector: 'vendas',
    salary: 8500,
    hireDate: '2021-02-10',
    vacationStatus: 'ativo',
    performanceRating: 5
  },
  {
    id: 'emp_2',
    name: 'Mariana Costa',
    role: 'Gerente Executiva',
    sector: 'marketing',
    salary: 7800,
    hireDate: '2022-05-15',
    vacationStatus: 'ativo',
    performanceRating: 4
  },
  {
    id: 'emp_3',
    name: 'Glória Mendonça',
    role: 'Coordenadora Operacional',
    sector: 'marketing',
    salary: 4300,
    hireDate: '2024-09-01',
    vacationStatus: 'ferias',
    performanceRating: 4
  },
  {
    id: 'emp_4',
    name: 'Renata Souza',
    role: 'Diretora de RH',
    sector: 'rh',
    salary: 8100,
    hireDate: '2020-03-12',
    vacationStatus: 'ativo',
    performanceRating: 5
  },
  {
    id: 'emp_5',
    name: 'Juliana Pires',
    role: 'Analista de Recrutamento',
    sector: 'rh',
    salary: 3900,
    hireDate: '2025-01-20',
    vacationStatus: 'ativo',
    performanceRating: 3
  },
  {
    id: 'emp_6',
    name: 'Felipe Alencar',
    role: 'Controlador Financeiro',
    sector: 'financeiro',
    salary: 8300,
    hireDate: '2021-11-01',
    vacationStatus: 'ativo',
    performanceRating: 5
  },
  {
    id: 'emp_7',
    name: 'Pedro Ribeiro',
    role: 'Gerente de Produção',
    sector: 'producao',
    salary: 7600,
    hireDate: '2023-01-15',
    vacationStatus: 'ativo',
    performanceRating: 4
  },
  {
    id: 'emp_8',
    name: 'Lucas Antunes',
    role: 'Supervisor de Linha',
    sector: 'producao',
    salary: 4100,
    hireDate: '2024-03-20',
    vacationStatus: 'ativo',
    performanceRating: 4
  }
];

export const INITIAL_FINANCES: FinancialRecord[] = [
  {
    id: 'fin_1',
    description: 'Aquisição Software ERP Trimestral',
    type: 'despesa',
    amount: 14200,
    category: 'Infraestrutura',
    date: '2026-05-15',
    status: 'pago'
  },
  {
    id: 'fin_2',
    description: 'Mensalidade Licença Cloud AWS',
    type: 'despesa',
    amount: 5800,
    category: 'Tecnologia',
    date: '2026-05-20',
    status: 'pago'
  },
  {
    id: 'fin_3',
    description: 'Sucesso Projeto Arruda Alimentos',
    type: 'receita',
    amount: 45000,
    category: 'Vendas Serviços',
    date: '2026-05-25',
    status: 'pago'
  },
  {
    id: 'fin_4',
    description: 'Adiantamento Inova Tech Brasil',
    type: 'receita',
    amount: 14000,
    category: 'Vendas Serviços',
    date: '2026-05-28',
    status: 'pago'
  },
  {
    id: 'fin_5',
    description: 'Consultoria Especializada Operações',
    type: 'despesa',
    amount: 7200,
    category: 'Serviços de Terceiros',
    date: '2026-05-26',
    status: 'pendente'
  },
  {
    id: 'fin_6',
    description: 'Faturamento Mensal Indústria Vulcan',
    type: 'receita',
    amount: 62000,
    category: 'Mensalidades SaaS',
    date: '2026-05-29',
    status: 'pendente'
  }
];

export const INITIAL_ORDERS: WorkOrder[] = [
  {
    id: 'wo_1',
    title: 'Manutenção Preventiva Extrusora #2',
    description: 'Verificação do sistema hidráulico e substituição dos filtros óleo.',
    priority: 'alta',
    status: 'concluido',
    dueDate: '2026-05-24',
    responsible: 'Lucas Antunes'
  },
  {
    id: 'wo_2',
    title: 'Embalagem Lote #259 Cosméticos',
    description: 'Montagem de kits e expedição do lote comercial homologado.',
    priority: 'media',
    status: 'em_progresso',
    dueDate: '2026-05-29',
    responsible: 'Fábio Melo'
  },
  {
    id: 'wo_3',
    title: 'Auditoria Mensal de Controle de Qualidade',
    description: 'Auditar se as diretrizes ISO 9001 foram executadas no setor de fabricação.',
    priority: 'baixa',
    status: 'pendente',
    dueDate: '2026-06-02',
    responsible: 'Pedro Ribeiro'
  },
  {
    id: 'wo_4',
    title: 'Ajuste de Setup da Injetora #4',
    description: 'Mudar moldagem de chapas plásticas para linha de eletrodomésticos.',
    priority: 'alta',
    status: 'em_progresso',
    dueDate: '2026-05-28',
    responsible: 'Sérgio Portela'
  }
];

export const INITIAL_STOCK: StockItem[] = [
  { id: 'st_1', name: 'Polímero ABS Virgem', quantity: 1250, minQuantity: 500, unit: 'kg' },
  { id: 'st_2', name: 'Película Protetora PVC', quantity: 380, minQuantity: 400, unit: 'metros' },
  { id: 'st_3', name: 'Embalagem de Papelão Reforçado', quantity: 2400, minQuantity: 1000, unit: 'unidades' },
  { id: 'st_4', name: 'Lubrificante de Silicone Industrial', quantity: 15, minQuantity: 20, unit: 'galões' },
  { id: 'st_5', name: 'Componentes Eletrônicos Circuito X-12', quantity: 720, minQuantity: 200, unit: 'unidades' }
];

export const INITIAL_CONFIG: SystemConfig = {
  companyName: 'SGCI Premium Corporate',
  notificationEmail: 'notificacoes@sgci.com',
  twoFactorRequired: false,
  allowSelfRegistration: true,
  maintenanceMode: false
};
