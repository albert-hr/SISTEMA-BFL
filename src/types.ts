/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  sector: string; // key of the sector, e.g., 'vendas', 'marketing', 'rh', 'financeiro', 'producao'
  role: UserRole;
  is2FAEnabled?: boolean;
}

export interface Sector {
  id: string;
  name: string;
  key: string;
  description: string;
  manager: string;
  color: string;
}

// CRM - Vendas
export interface ClientLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'lead' | 'contato' | 'proposta' | 'fechado' | 'perdido';
  value: number;
  notes: string;
  lastInteraction: string;
  createdAt?: string;      // ISO string representing when the lead was generated
  assignedTo?: string;     // Name or ID of the employee who assumed/took ownership of this lead
  sectorKey?: string;      // Responsible sector key (e.g., 'vendas', 'marketing', etc.)
}

// Marketing
export interface MarketingCampaign {
  id: string;
  name: string;
  channel: string;
  status: 'rascunho' | 'ativo' | 'pausado' | 'concluido';
  budget: number;
  spent: number;
  clicks: number;
  conversions: number;
  startDate: string;
}

// Recursos Humanos - RH
export interface Employee {
  id: string;
  name: string;
  role: string;
  sector: string;
  salary: number;
  hireDate: string;
  vacationStatus: 'ativo' | 'ferias' | 'afastado';
  performanceRating: number; // 1 to 5
}

// Financeiro
export interface FinancialRecord {
  id: string;
  description: string;
  type: 'receita' | 'despesa';
  amount: number;
  category: string;
  date: string;
  status: 'pago' | 'pendente';
}

// Produção / Operações
export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  priority: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em_progresso' | 'concluido';
  dueDate: string;
  responsible: string;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  unit: string;
}

// Global System Configuration
export interface SystemConfig {
  companyName: string;
  notificationEmail: string;
  twoFactorRequired: boolean;
  allowSelfRegistration: boolean;
  maintenanceMode: boolean;
}
