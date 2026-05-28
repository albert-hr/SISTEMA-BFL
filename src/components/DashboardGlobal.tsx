/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Coins, 
  Wrench, 
  Layers, 
  AlertTriangle, 
  CheckCircle,
  TrendingDown,
  ChevronRight,
  Filter,
  DollarSign,
  Calendar,
  Briefcase
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  User, 
  Sector, 
  ClientLead, 
  MarketingCampaign, 
  Employee, 
  FinancialRecord, 
  WorkOrder, 
  StockItem 
} from '../types';

interface DashboardGlobalProps {
  sectors: Sector[];
  leads: ClientLead[];
  campaigns: MarketingCampaign[];
  employees: Employee[];
  finances: FinancialRecord[];
  orders: WorkOrder[];
  stock: StockItem[];
  currentUser: User;
}

export default function DashboardGlobal({
  sectors,
  leads,
  campaigns,
  employees,
  finances,
  orders,
  stock,
  currentUser
}: DashboardGlobalProps) {
  // Sector filter: 'all' or key of a sector
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // 1. CALCULATE CORE METRICS Dynamically based on current live state:
  
  // Vendas KPIs
  const totalSalesValue = leads
    .filter(l => l.status === 'fechado')
    .reduce((sum, current) => sum + current.value, 0);
  
  const activeLeadsCount = leads.filter(l => l.status !== 'fechado' && l.status !== 'perdido').length;

  // Marketing KPIs
  const totalMarketingBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalMarketingSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const activeCampaignsCount = campaigns.filter(c => c.status === 'ativo').length;
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

  // RH KPIs
  const totalEmployees = employees.length;
  const totalPayroll = employees
    .filter(e => e.vacationStatus !== 'afastado')
    .reduce((sum, e) => sum + e.salary, 0);
  const avgPerformance = employees.length > 0 
    ? (employees.reduce((sum, e) => sum + e.performanceRating, 0) / employees.length).toFixed(1)
    : '0';

  // Financeiro KPIs
  const totalReceitas = finances
    .filter(f => f.type === 'receita' && f.status === 'pago')
    .reduce((sum, f) => sum + f.amount, 0);
  const totalDespesas = finances
    .filter(f => f.type === 'despesa' && f.status === 'pago')
    .reduce((sum, f) => sum + f.amount, 0);
  const currentCash = totalReceitas - totalDespesas;
  
  const pendingReceivas = finances
    .filter(f => f.type === 'receita' && f.status === 'pendente')
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingDespesas = finances
    .filter(f => f.type === 'despesa' && f.status === 'pendente')
    .reduce((sum, f) => sum + f.amount, 0);

  // Produção KPIs
  const totalWorkOrders = orders.length;
  const completedOrdersCount = orders.filter(o => o.status === 'concluido').length;
  const osCompletionRate = totalWorkOrders > 0 
    ? Math.round((completedOrdersCount / totalWorkOrders) * 100)
    : 0;
  
  const lowStockItems = stock.filter(s => s.quantity <= s.minQuantity);

  // Format Reais currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Recharts: Combined Cashflow Data for AreaChart
  // We can group cash balances per day/month or create mock sequential dates based on actual registers!
  const sortedFinances = [...finances].sort((a,b) => a.date.localeCompare(b.date));
  let runningBalance = 25000; // base historical starting capital
  const cashflowTimeline = sortedFinances.map((f, i) => {
    if (f.status === 'pago') {
      if (f.type === 'receita') runningBalance += f.amount;
      else runningBalance -= f.amount;
    }
    return {
      date: f.date.split('-').reverse().slice(0, 2).join('/'), // DD/MM format
      valor: f.amount,
      tipo: f.type === 'receita' ? 'Receitas' : 'Despesas',
      saldo: runningBalance,
      historico: f.description
    };
  });

  // Recharts: Lead funnel
  const leadsDistribution = [
    { name: 'Captação (Lead)', value: leads.filter(l => l.status === 'lead').length, fill: '#64748b' },
    { name: 'Contato Feito', value: leads.filter(l => l.status === 'contato').length, fill: '#0284c7' },
    { name: 'Proposta Enviada', value: leads.filter(l => l.status === 'proposta').length, fill: '#f59e0b' },
    { name: 'Contrato Ganho', value: leads.filter(l => l.status === 'fechado').length, fill: '#10b981' },
    { name: 'Perdidos / Arquivados', value: leads.filter(l => l.status === 'perdido').length, fill: '#ef4444' }
  ];

  // Recharts: Budget Distribution per sector (approximate budgets)
  const sectorFinancialShare = [
    { name: 'Vendas (CRM)', value: totalSalesValue, fill: '#10b981' },
    { name: 'Marketing & Ads', value: totalMarketingBudget, fill: '#6366f1' },
    { name: 'Recursos Humanos (Salários)', value: totalPayroll, fill: '#f43f5e' },
    { name: 'Financeiro (Despesas Pagas)', value: totalDespesas, fill: '#f59e0b' },
    { name: 'Produção (Insumos Estimados)', value: stock.reduce((sum, s) => sum + (s.quantity * 10), 0), fill: '#3b82f6' }
  ];

  // Render metrics per filtered sector
  const getFilteredTitle = () => {
    if (selectedFilter === 'all') return 'Visão Executiva Consolidada';
    const sec = sectors.find(s => s.key === selectedFilter);
    return `Indicadores Setoriais: ${sec?.name || selectedFilter}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Title block with Sector Quick Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-500" />
            {getFilteredTitle()}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Status operacional e performance corporativa em tempo real. Atualizado agora.
          </p>
        </div>

        {/* Filter Trigger bar */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button 
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'all' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Empresa Inteira
          </button>
          {sectors.map((sec) => (
            <button 
              key={sec.id}
              onClick={() => setSelectedFilter(sec.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === sec.key 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sec.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER DYNAMIC KPI CARDS ON SECTOR FILTER AND GLOBAL SIGHT */}
      {selectedFilter === 'all' ? (
        /* 1. GLOBAL COMPANY KPIs PANEL */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue and Sales Balance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Faturamento em CRM</span>
                <span className="text-2xl font-bold font-display text-slate-900 block mt-1.5">
                  {formatCurrency(totalSalesValue)}
                </span>
              </div>
              <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <TrendingUp className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[11px] text-slate-500 bg-emerald-50/40 p-1.5 rounded-lg border border-emerald-100/10">
              <span className="font-semibold text-emerald-600">{leads.filter(l => l.status === 'fechado').length}</span>
              <span>contratos fechados •</span>
              <span className="font-semibold text-sky-600">{activeLeadsCount}</span>
              <span>oportunidades ativas</span>
            </div>
          </div>

          {/* Cash Balance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Caixa Atual Livre</span>
                <span className="text-2xl font-bold font-display text-slate-900 block mt-1.5">
                  {formatCurrency(currentCash)}
                </span>
              </div>
              <span className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                <Coins className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Receitas: {formatCurrency(totalReceitas)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Despesas: {formatCurrency(totalDespesas)}</span>
              </div>
            </div>
          </div>

          {/* HR Overhead / Employees */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Pessoal & Desempenho</span>
                <span className="text-2xl font-bold font-display text-slate-900 block mt-1.5">
                  {totalEmployees} Colaboradores
                </span>
              </div>
              <span className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                <Users className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Desempenho Geral:</span>
              <span className="font-semibold text-slate-800 bg-indigo-100/60 text-indigo-800 px-2 py-0.5 rounded-full">
                ★ {avgPerformance} / 5.0
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span>Folha de pgto mensal:</span>
              <span className="font-medium text-slate-700">{formatCurrency(totalPayroll)}</span>
            </div>
          </div>

          {/* Operational Delivery OS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Ciclo de Produção</span>
                <span className="text-2xl font-bold font-display text-slate-900 block mt-1.5">
                  {osCompletionRate}% Entregas
                </span>
              </div>
              <span className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                <Wrench className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${osCompletionRate}%` }}
                ></div>
              </div>
              <div className="mt-2 flex justify-between items-center text-[11px] text-slate-500">
                <span>{completedOrdersCount} de {totalWorkOrders} Ordens</span>
                {lowStockItems.length > 0 && (
                  <span className="text-red-600 font-semibold flex items-center gap-0.5 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> {lowStockItems.length} insumos baixos
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. FILTERED DEPARTMENT FOCUS PANEL */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedFilter === 'vendas' && (
            <>
              <div className="bg-white p-5 rounded-2xl border border-emerald-200/70 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest block mb-2">Vendas Totais Ganhas</span>
                <span className="text-3xl font-bold font-display text-slate-900">{formatCurrency(totalSalesValue)}</span>
                <p className="text-xs text-slate-500 mt-2">Soma dos contratos marcados como "Fechado" no CRM.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-2">Oportunidades no Funil</span>
                <span className="text-3xl font-bold font-display text-slate-900">{leads.length} Leads</span>
                <p className="text-xs text-slate-500 mt-2">Clientes potenciais registrados do CRM.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-2">Ticket Médio</span>
                <span className="text-3xl font-bold font-display text-slate-900">
                  {formatCurrency(leads.length > 0 ? (totalSalesValue / leads.length) : 0)}
                </span>
                <p className="text-xs text-slate-500 mt-2">Valor faturado dividido pela contagem de leads.</p>
              </div>
            </>
          )}

          {selectedFilter === 'marketing' && (
            <>
              <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm">
                <span className="text-[11px] font-bold text-indigo-600 uppercase block mb-2">Investimento Total</span>
                <span className="text-3xl font-bold font-display text-slate-900">{formatCurrency(totalMarketingSpent)}</span>
                <p className="text-xs text-slate-500 mt-2">Do orçamento total aprovado de {formatCurrency(totalMarketingBudget)}.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-2">Conversões Digitais</span>
                <span className="text-3xl font-bold font-display text-slate-900">{totalConversions} Ações</span>
                <p className="text-xs text-slate-500 mt-2">Meta alcançada de preenchimento ou downloads.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-2">Custo Por Conversão (CPA)</span>
                <span className="text-3xl font-bold font-display text-slate-900">
                  {formatCurrency(totalConversions > 0 ? (totalMarketingSpent / totalConversions) : 0)}
                </span>
                <p className="text-xs text-slate-500 mt-2">Gasto médio do tráfego pago por usuário convertido.</p>
              </div>
            </>
          )}

          {selectedFilter === 'rh' && (
            <>
              <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm">
                <span className="text-[11px] font-bold text-rose-600 uppercase block mb-2">Custo Operacional Mensal</span>
                <span className="text-3xl font-bold font-display text-slate-900">{formatCurrency(totalPayroll)}</span>
                <p className="text-xs text-slate-500 mt-2">Suma dos salários de todos colaboradores ativos.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-2">Colaboradores no Setor</span>
                <span className="text-3xl font-bold font-display text-slate-900">{employees.filter(e => e.sector === selectedFilter || selectedFilter === 'rh').length} Pessoas</span>
                <p className="text-xs text-slate-500 mt-2">Registrados na base corporativa sob RH.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-2">Feedback de Desempenho</span>
                <span className="text-3xl font-bold font-display text-slate-900">★ {avgPerformance} / 5</span>
                <p className="text-xs text-slate-500 mt-2">Avaliação de clima e atingimento de metas.</p>
              </div>
            </>
          )}

          {selectedFilter === 'financeiro' && (
            <>
              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
                <span className="text-[11px] font-bold text-amber-600 uppercase block mb-2">Fluxo de Caixa Realizado</span>
                <span className={`text-3xl font-bold font-display ${currentCash >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency(currentCash)}
                </span>
                <p className="text-xs text-slate-500 mt-2">Diferença entre receitas líquidas e despesas líquidas.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-2">Pendências de Contas a Receber</span>
                <span className="text-3xl font-bold font-display text-emerald-600">+{formatCurrency(pendingReceivas)}</span>
                <p className="text-xs text-slate-500 mt-2">Faturamento agendado pendente de liberação.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-2">Pendências de Contas a Pagar</span>
                <span className="text-3xl font-bold font-display text-rose-600">-{formatCurrency(pendingDespesas)}</span>
                <p className="text-xs text-slate-500 mt-2">Despesas agendadas aguardando autorização.</p>
              </div>
            </>
          )}

          {selectedFilter === 'producao' && (
            <>
              <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm">
                <span className="text-[11px] font-bold text-blue-600 uppercase block mb-2">Ordens de Serviço</span>
                <span className="text-3xl font-bold font-display text-slate-900">{orders.length} OS Ativas</span>
                <p className="text-xs text-slate-500 mt-2">Tarefas de montagem, ajustes e reparos preventivos.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-2">Falta de Materiais</span>
                <span className={`text-3xl font-bold font-display ${lowStockItems.length > 0 ? 'text-red-500' : 'text-slate-900'}`}>
                  {lowStockItems.length} Alertas
                </span>
                <p className="text-xs text-slate-500 mt-2">Componentes operacionais abaixo do nível mínimo crítico.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-2">Taxa de Eficiência</span>
                <span className="text-3xl font-bold font-display text-slate-900">{osCompletionRate}%</span>
                <p className="text-xs text-slate-500 mt-2">Relação de Ordens de Serviço concluídas.</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* DETAILED RECHARTS DATA VISUALIZATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Financial Area chart: Revenues, Expenses & Running Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900">Histórico de Fluxo de Caixa e Projeção</h3>
              <p className="text-xs text-slate-500">Saldo acumulado resultante de receitas e despesas.</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Receitas
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Despesas
              </span>
            </div>
          </div>

          <div className="h-72 w-full text-xs">
            {cashflowTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflowTimeline}>
                  <defs>
                    <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `R$${v/1000}k`} />
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      formatCurrency(Number(value)), 
                      name === 'saldo' ? 'Saldo Corrente' : 'Valor Movimentação'
                    ]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} 
                  />
                  <Area type="monotone" dataKey="saldo" stroke="#0284c7" strokeWidth={2} fillOpacity={1} fill="url(#colorSaldo)" />
                  <Bar dataKey="valor" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Sem dados financeiros registrados.
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Division Share or Leads Allocation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">Estrutura de Gastos e Orçamentos</h3>
            <p className="text-xs text-slate-500 mb-4">Distribuição de capitais e valores por setor empresarial.</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorFinancialShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sectorFinancialShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Ativos Estimados</span>
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(totalSalesValue + totalMarketingBudget)}
              </span>
            </div>
          </div>

          {/* Color Indicators List */}
          <div className="space-y-1.5 mt-2">
            {sectorFinancialShare.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></span>
                  {item.name}
                </span>
                <span className="font-semibold text-slate-800">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CRUCIAL CONSOLIDATED REPORTS FOR DEPARTMENTS LISTING */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">Status Geral dos Setores</h3>
            <p className="text-xs text-slate-500">Visão macro de responsabilidade e liderança operacional.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors.map((sec) => {
            // Count items specific to this sector
            let statsString = '';
            if (sec.key === 'vendas') statsString = `${leads.length} Leads no pipeline • ${leads.filter(l => l.status === 'fechado').length} Ganhos`;
            else if (sec.key === 'marketing') statsString = `${campaigns.length} Campanhas • ${activeCampaignsCount} Ativas`;
            else if (sec.key === 'rh') statsString = `${employees.length} Funcionários contratados`;
            else if (sec.key === 'financeiro') statsString = `${finances.length} Movimentações de fluxo`;
            else if (sec.key === 'producao') statsString = `${orders.length} Ordens • ${stock.length} Tipos no estoque`;

            return (
              <div key={sec.id} className="p-4 border border-slate-100 rounded-xl hover:border-slate-200 hover:bg-slate-50/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-3 h-3 rounded-full bg-${sec.color}-500 inline-block shadow-sm`}></span>
                    <span className="font-bold text-slate-800 tracking-tight text-sm">{sec.name}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal line-clamp-2">{sec.description}</p>
                </div>
                <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between items-center text-[11px] text-slate-500">
                  <span>Gestor: <strong>{sec.manager}</strong></span>
                  <span className="text-slate-400 text-[10px]">{statsString}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
