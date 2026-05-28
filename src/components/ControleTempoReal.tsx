/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Activity, 
  Sparkles,
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Square,
  TrendingUp, 
  Users, 
  Coins, 
  Wrench, 
  Megaphone,
  Layers,
  Cpu,
  Zap,
  RefreshCw,
  Bell,
  Check,
  ChevronRight,
  TrendingDown,
  Clock,
  Briefcase,
  Filter,
  Mail,
  Phone
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell
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

interface SimulationLog {
  id: string;
  time: string;
  sectorName: string;
  message: string;
  status: 'info' | 'success' | 'warn' | 'error';
  metricImpact?: string;
}

interface ControleTempoRealProps {
  sectors: Sector[];
  leads: ClientLead[];
  campaigns: MarketingCampaign[];
  employees: Employee[];
  finances: FinancialRecord[];
  orders: WorkOrder[];
  stock: StockItem[];
  currentUser: User;
  
  onAddLead: (lead: ClientLead) => void;
  onUpdateLeadStatus: (id: string, status: ClientLead['status']) => void;
  onAddFinanceRecord: (rec: FinancialRecord) => void;
  onAddOrder: (order: WorkOrder) => void;
  onUpdateOrderStatus: (id: string, status: WorkOrder['status']) => void;
  onRestockItem: (id: string, quantity: number) => void;
  onUpdatePerformance: (id: string, rating: number) => void;
}

export default function ControleTempoReal({
  sectors,
  leads,
  campaigns,
  employees,
  finances,
  orders,
  stock,
  currentUser,
  onAddLead,
  onUpdateLeadStatus,
  onAddFinanceRecord,
  onAddOrder,
  onUpdateOrderStatus,
  onRestockItem,
  onUpdatePerformance
}: ControleTempoRealProps) {
  
  // Simulation Active state
  const [isSimulating, setIsSimulating] = useState(false);
  const [latency, setLatency] = useState(18); // ms
  const [systemLoad, setSystemLoad] = useState(42); // %
  const [simSpeed, setSimSpeed] = useState<number>(3500); // ms interval
  const [simLogs, setSimLogs] = useState<SimulationLog[]>([
    {
      id: 'log_0',
      time: new Date().toLocaleTimeString('pt-BR'),
      sectorName: 'Geral',
      message: 'Console de Telemetria e Operações em Tempo Real inicializada com sucesso para Administradores.',
      status: 'info'
    }
  ]);

  // Secondary Chart Buffer for "Transaction Velocity / Activity Frequency in last 8 cycles"
  // Keep live activity index counts
  const [activityBuffer, setActivityBuffer] = useState([
    { cycle: 'C1', Vendas: 2, Marketing: 3, Produção: 1, Caixa: 20 },
    { cycle: 'C2', Vendas: 1, Marketing: 2, Produção: 2, Caixa: 22 },
    { cycle: 'C3', Vendas: 4, Marketing: 1, Produção: 3, Caixa: 25 },
    { cycle: 'C4', Vendas: 3, Marketing: 4, Produção: 2, Caixa: 21 },
    { cycle: 'C5', Vendas: 2, Marketing: 2, Produção: 1, Caixa: 24 },
    { cycle: 'C6', Vendas: 5, Marketing: 3, Produção: 4, Caixa: 29 },
    { cycle: 'C7', Vendas: 3, Marketing: 5, Produção: 2, Caixa: 28 },
    { cycle: 'C8', Vendas: 4, Marketing: 2, Produção: 3, Caixa: 32 }
  ]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // States for monitoring potential leads and sending warnings (charging sector)
  const [chargedLeads, setChargedLeads] = useState<{ [id: string]: string }>({});
  const [leadFilter, setLeadFilter] = useState<'unhandled' | 'in_progress' | 'all'>('unhandled');

  const handleChargeSector = (lead: ClientLead) => {
    const timeStr = new Date().toLocaleTimeString('pt-BR');
    setChargedLeads(prev => ({
      ...prev,
      [lead.id]: timeStr
    }));
    
    addLog(
      'Vendas', 
      `🚨 [COBRANÇA DIRETORIA] O Proprietário cobrou o setor sobre lead sem atendimento: ${lead.name} (${lead.company})!`, 
      'error', 
      'AVISO ENVIADO'
    );
  };

  // Auto-scrolling indicator
  const addLog = (sectorName: string, message: string, status: 'info' | 'success' | 'warn' | 'error', impact?: string) => {
    const newLog: SimulationLog = {
      id: 'log_' + Date.now() + Math.random(),
      time: new Date().toLocaleTimeString('pt-BR'),
      sectorName,
      message,
      status,
      metricImpact: impact
    };
    setSimLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep latest 50 logs
  };

  // Helper arrays for random simulation generation
  const clientNames = [
    'Aline Gontijo', 'Lucas Antunes', 'Mariana Valadão', 'Felipe Guimarães', 
    'Camila Rezende', 'Bruno Silveira', 'Vanessa Bernardes', 'Gabriel Nogueira',
    'Sofia Castilho', 'Diego Mendonça', 'Beatriz Fraga', 'Renato Neves'
  ];
  
  const companyNames = [
    'Alfa Tech S/A', 'Max Logística', 'Portal Varejo Corp', 'Inovação Digital', 
    'Forte Industrial Ltda', 'Brasil Siderúrgica', 'Parceiros Globais', 'Horizonte Agronegócios',
    'Conexão Consultoria', 'Saber Educação', 'Ponto das Tintas', 'Metalúrgica Inox'
  ];

  const maintenanceTitles = [
    'Calibração de Injetora Polímeros #4',
    'Substituição do Rolamento Extrusora Principal',
    'Ajuste Pressão de Compressor Inox #1',
    'Lubrificação de Engrenagens da Prensa',
    'Limpeza de Bicos de Refrigeração Hidrófila'
  ];

  const maintenanceTechs = [
    'Lucas Antunes', 'Marcio Souza', 'Vitor Guedes', 'Fernando Lima', 'Renan Costa'
  ];

  // 2. CORE SIMULATION REACTION DISPATCHER
  const runRandomEvent = () => {
    // Pick random sector: 0 = Vendas, 1 = Marketing, 2 = RH, 3 = Financeiro, 4 = Produção
    const secSelector = Math.floor(Math.random() * 5);
    
    // Vary latency and system load for realistic dashboards
    setLatency(Math.floor(Math.random() * 25) + 10);
    setSystemLoad(Math.floor(Math.random() * 40) + 30);

    switch (secSelector) {
      case 0: { // VENDAS
        const client = clientNames[Math.floor(Math.random() * clientNames.length)];
        const company = companyNames[Math.floor(Math.random() * companyNames.length)];
        const val = Math.floor(Math.random() * 12 + 4) * 2000;
        
        const newLead: ClientLead = {
          id: 'lead_' + Date.now(),
          name: client,
          company: company,
          email: `${client.toLowerCase().replace(/\s+/g, '')}@${company.toLowerCase().replace(/\s+/g, '')}.com.br`,
          phone: `(31) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'lead',
          value: val,
          notes: 'Captado via telemetria em tempo real no simulador.',
          lastInteraction: new Date().toISOString().split('T')[0]
        };

        onAddLead(newLead);
        addLog('Vendas', `Novo lead quente registrado no pipeline: ${client} (${company})`, 'success', `+ ${val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
        
        // Update Recharts cycle
        setActivityBuffer(prev => {
          const next = [...prev];
          next.shift();
          const last = next[next.length - 1];
          next.push({ cycle: `C${Date.now().toString().slice(-2)}`, Vendas: last.Vendas + 1, Marketing: last.Marketing, Produção: last.Produção, Caixa: last.Caixa + 1 });
          return next;
        });
        break;
      }

      case 1: { // MARKETING
        const channels = ['Google Ads', 'Facebook Ads', 'LinkedIn B2B', 'Instagram Reels'];
        const channel = channels[Math.floor(Math.random() * channels.length)];
        const impactClicks = Math.floor(Math.random() * 45) + 15;
        
        addLog('Marketing', `Conversão detectada em anúncios no canal ${channel}. +${impactClicks} cliques em links de afiliados.`, 'info');
        
        setActivityBuffer(prev => {
          const next = [...prev];
          next.shift();
          const last = next[next.length - 1];
          next.push({ cycle: `C${Date.now().toString().slice(-2)}`, Vendas: last.Vendas, Marketing: last.Marketing + 1, Produção: last.Produção, Caixa: last.Caixa });
          return next;
        });
        break;
      }

      case 2: { // RH / PESSOAL
        if (employees.length > 0) {
          const randEmpIdx = Math.floor(Math.random() * employees.length);
          const randEmp = employees[randEmpIdx];
          const currentRating = randEmp.performanceRating;
          // Alter rating slightly within 1 to 5
          let newRating = currentRating + (Math.random() > 0.5 ? 0.5 : -0.5);
          newRating = Math.max(1, Math.min(5, newRating));
          
          onUpdatePerformance(randEmp.id, newRating);
          addLog('RH', `Reavaliação de produtividade em tempo real para ${randEmp.name}: Nova pontuação ★ ${newRating.toFixed(1)}/5.0`, 'info');
        }
        break;
      }

      case 3: { // FINANCEIRO
        const isReceita = Math.random() > 0.4;
        const amount = Math.floor(Math.random() * 8 + 1) * 350;
        
        const descName = isReceita 
          ? `Adiantamento Fatura Ref ${companyNames[Math.floor(Math.random() * companyNames.length)]}` 
          : `Taxas alfandegárias de maquinário industrial`;

        const newRec: FinancialRecord = {
          id: 'fin_rec_' + Date.now(),
          description: descName,
          type: isReceita ? 'receita' : 'despesa',
          amount: amount,
          category: isReceita ? 'Vendas Insumo' : 'Manutenção Máquina',
          date: new Date().toISOString().split('T')[0],
          status: 'pago'
        };

        onAddFinanceRecord(newRec);
        
        const textImpact = isReceita 
          ? `+ R$ ${amount.toLocaleString('pt-BR')}` 
          : `- R$ ${amount.toLocaleString('pt-BR')}`;

        addLog(
          'Financeiro', 
          `Lançamento automático de Livro Caixa compilado: ${descName}`, 
          isReceita ? 'success' : 'warn',
          textImpact
        );

        setActivityBuffer(prev => {
          const next = [...prev];
          next.shift();
          const last = next[next.length - 1];
          const newBal = isReceita ? last.Caixa + 4 : last.Caixa - 2;
          next.push({ cycle: `C${Date.now().toString().slice(-2)}`, Vendas: last.Vendas, Marketing: last.Marketing, Produção: last.Produção, Caixa: Math.max(5, newBal) });
          return next;
        });
        break;
      }

      case 4: { // PRODUÇÃO & ESTOQUE
        // Consumes raw materials OR triggers urgent maintenance OS
        const forceUrgentOS = Math.random() > 0.7;

        if (forceUrgentOS) {
          const title = maintenanceTitles[Math.floor(Math.random() * maintenanceTitles.length)];
          const tech = maintenanceTechs[Math.floor(Math.random() * maintenanceTechs.length)];
          
          const newOrder: WorkOrder = {
            id: 'wo_sim_' + Date.now(),
            title: title,
            description: 'Aberta automaticamente pela telemetria do detector em tempo real.',
            priority: 'alta',
            status: 'pendente',
            dueDate: new Date().toISOString().split('T')[0],
            responsible: tech
          };

          onAddOrder(newOrder);
          addLog('Produção', `Incidente Técnico Detectado! OS Aberta para ${title} (Urgente). Resp: ${tech}`, 'error');
        } else if (stock.length > 0) {
          // Consume some stock
          const randStockIdx = Math.floor(Math.random() * stock.length);
          const randItem = stock[randStockIdx];
          
          // consume 15 units
          onRestockItem(randItem.id, -12);
          addLog('Produção', `Consumo operacional automático detectado: -12 ${randItem.unit} de ${randItem.name}`, 'warn');
          
          // If level has gone critically low, raise alert
          if (randItem.quantity - 12 <= randItem.minQuantity) {
            addLog('Produção', `ALERTA CRÍTICO: Estoque de ${randItem.name} atingiu limite operacional mínimo de segurança!`, 'error');
          }
        }

        setActivityBuffer(prev => {
          const next = [...prev];
          next.shift();
          const last = next[next.length - 1];
          next.push({ cycle: `C${Date.now().toString().slice(-2)}`, Vendas: last.Vendas, Marketing: last.Marketing, Produção: last.Produção + 1, Caixa: last.Caixa });
          return next;
        });
        break;
      }
    }
  };

  // 3. EFFECT TO CONTROL TICK RATE
  useEffect(() => {
    if (isSimulating) {
      addLog('Geral', 'Fluxo de simulação automática iniciado pelo Administrador.', 'success');
      timerRef.current = setInterval(runRandomEvent, simSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        addLog('Geral', 'Simulação pausada. Monitor em espera.', 'info');
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSimulating, simSpeed, stock, employees]);

  // Manual Injections
  const handleManualLeadInject = () => {
    const names = ['Fernanda Porto', 'Afonso Cintra', 'Juliana Torres'];
    const comps = ['Porto Soluções', 'Cintra Incorporações', 'Torres Indústria'];
    const idx = Math.floor(Math.random() * names.length);
    const val = 15000;
    
    const newLead: ClientLead = {
      id: 'lead_man_' + Date.now(),
      name: names[idx],
      company: comps[idx],
      email: `${names[idx].toLowerCase().replace(/\s+/g, '')}@empresa.com`,
      phone: '(31) 98888-7777',
      status: 'lead',
      value: val,
      notes: 'Injetado manualmente por Administrador na Sala de Controle.',
      lastInteraction: new Date().toISOString().split('T')[0]
    };

    onAddLead(newLead);
    addLog('Vendas', `[Manual Injection] Novo Lead Quente cadastrado: ${names[idx]} (R$15.000)`, 'success', '+ R$ 15.000');
  };

  const handleManualMaintenanceInject = () => {
    const title = 'Manutenção emergencial preventiva: Superaquecimento Compressor #4';
    const tech = 'Lucas Antunes';
    
    const newOrder: WorkOrder = {
      id: 'wo_man_' + Date.now(),
      title: title,
      description: 'Acionamento manual prioritário de falha mecânica em sala de controle integrada.',
      priority: 'alta',
      status: 'pendente',
      dueDate: new Date().toISOString().split('T')[0],
      responsible: tech
    };

    onAddOrder(newOrder);
    addLog('Produção', `[Manual Injection] Alarme Técnico Ativado: ${title}`, 'error');
  };

  const handleManualPayoutInject = () => {
    const amount = 3000;
    const newRec: FinancialRecord = {
      id: 'fin_man_' + Date.now(),
      description: 'Cobrança Extraordinária: Consumo Fluido de Limpeza Injetoras',
      type: 'despesa',
      amount: amount,
      category: 'Insumos Produção',
      date: new Date().toISOString().split('T')[0],
      status: 'pago'
    };

    onAddFinanceRecord(newRec);
    addLog('Financeiro', `[Manual Injection] Despesa Industrial Liquidada: R$ 3.000`, 'warn', '- R$ 3.000');
  };

  // Helper calculating live numbers
  const countLowStock = stock.filter(s => s.quantity <= s.minQuantity).length;
  const activeOS = orders.filter(o => o.status !== 'concluido').length;
  const pendingReceivablesTotal = finances.filter(f => f.type === 'receita' && f.status === 'pendente').reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Controls Console Header */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase bg-sky-950 px-2.5 py-1 rounded-full border border-sky-900">
                ADMIN CONSOLE INTEGRADO
              </span>
            </div>
            
            <h2 className="text-2xl font-extrabold font-display tracking-tight text-white flex items-center gap-2">
              <Radio className="w-5.5 h-5.5 text-sky-400" />
              Sala de Controle Operacional Hub
            </h2>
            
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Monitore o desenvolvimento corporativo instantâneo de todas as divisões empresariais. Ative o fluxo automático de business events para ver charts de faturamento, conciliações e ordens de fabricação se transformando ao vivo.
            </p>
          </div>

          {/* SIMULATION SWITCHER PANE */}
          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 shrink-0 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase">SIMULADOR METASECTOR</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
                <span className="text-xs font-bold text-white uppercase">{isSimulating ? 'Simulando Fluxo' : 'Servidor Prontidão'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Speed select */}
              <div className="flex flex-col">
                <select 
                  value={simSpeed}
                  onChange={(e) => setSimSpeed(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-[10px] text-slate-350 px-2 py-1.5 rounded-lg focus:outline-none"
                  disabled={isSimulating}
                >
                  <option value={2000}>Ciclo Rápido (2s)</option>
                  <option value={3500}>Ciclo Normal (3.5s)</option>
                  <option value={5000}>Ciclo Lento (5s)</option>
                </select>
              </div>

              {isSimulating ? (
                <button
                  onClick={() => setIsSimulating(false)}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  Pausar
                </button>
              ) : (
                <button
                  onClick={() => setIsSimulating(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white animate-pulse" />
                  Iniciar Live
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TELEMETRY SPEEDY METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">PING SERVIDORES</span>
            <span className="text-lg font-bold text-slate-800 block font-mono">{latency} ms</span>
            <span className="text-[10.5px] text-emerald-650 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold inline-block">Execução Nominal</span>
          </div>
          <span className="p-2.5 bg-slate-50 text-slate-400 rounded-lg border border-slate-200">
            <Activity className="w-4.5 h-4.5 text-brand-650" />
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">PROCESSAMENTO</span>
            <span className="text-lg font-bold text-slate-800 block font-mono">{systemLoad} %</span>
            <span className="text-[10.5px] text-sky-650 bg-sky-50 px-1.5 py-0.2 rounded font-semibold inline-block">Bateria de Threads Ok</span>
          </div>
          <span className="p-2.5 bg-slate-50 text-slate-400 rounded-lg border border-slate-200">
            <Cpu className="w-4.5 h-4.5 text-sky-650" />
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">ALERTAS DE CRÍTICO</span>
            <span className="text-lg font-bold text-slate-800 block font-mono">
              {countLowStock + activeOS} Alertas
            </span>
            <span className={`text-[10.5px] px-1.5 py-0.2 rounded font-semibold inline-block ${
              (countLowStock + activeOS) > 2 ? 'text-red-700 bg-red-50' : 'text-emerald-700 bg-emerald-50'
            }`}>
              {(countLowStock + activeOS) > 2 ? 'Reclama Ação Corretiva' : 'Parâmetros Normais'}
            </span>
          </div>
          <span className="p-2.5 bg-slate-50 text-slate-400 rounded-lg border border-slate-200">
            <Bell className="w-4.5 h-4.5 text-rose-500" />
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">PIPELINE CRM</span>
            <span className="text-lg font-bold text-slate-800 block font-mono">
              R$ {(leads.reduce((sum, l) => sum + l.value, 0) / 1000).toFixed(0)} k
            </span>
            <span className="text-[10.5px] text-yellow-700 bg-yellow-50 px-1.5 py-0.2 rounded font-semibold inline-block">
              {leads.filter(l => l.status === 'lead').length} novos contatos
            </span>
          </div>
          <span className="p-2.5 bg-slate-50 text-slate-400 rounded-lg border border-slate-200">
            <TrendingUp className="w-4.5 h-4.5 text-emerald-500" />
          </span>
        </div>
      </div>

      {/* SECTOR TELEMETRY BOARD AND LIVE CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. SECTORS TELEMETRY LISTING PANEL (Col-span 2) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-4 w-4 text-sky-505" />
              Painel de Telemetria de Todos os Setores ("Metasector")
            </h3>
            <p className="text-[11px] text-slate-400">Verifique os gargalos de recursos, conciliação e produtividade ativa.</p>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {sectors.map((sec) => {
              // Extract sector real values inside app state dynamically for live feedback
              let metricLabel1 = '';
              let metricValue1 = '';
              let metricLabel2 = '';
              let metricValue2 = '';
              let sectorStatus = 'Estável';
              let statusColor = 'text-emerald-600 bg-emerald-55 border-emerald-100';

              if (sec.key === 'vendas') {
                const totalVal = leads.filter(l => l.status === 'fechado').reduce((sum, l) => sum + l.value, 0);
                metricLabel1 = 'Faturamento Comercial';
                metricValue1 = totalVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                metricLabel2 = 'Conversões Efetivas';
                metricValue2 = `${leads.filter(l => l.status === 'fechado').length} contratos`;
                if (leads.filter(l => l.status === 'lead').length > 5) {
                  sectorStatus = 'Sobrecarga de Leads';
                  statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
                }
              } else if (sec.key === 'marketing') {
                const spent = campaigns.reduce((sum, c) => sum + c.spent, 0);
                metricLabel1 = 'Anúncios Investição';
                metricValue1 = spent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                metricLabel2 = 'Cliques Registrados';
                metricValue2 = `${campaigns.reduce((sum, c) => sum + c.clicks, 0)} cliques`;
                sectorStatus = campaigns.some(c => c.status === 'ativo') ? 'Campanhas Ativas' : 'Pausado';
              } else if (sec.key === 'rh') {
                metricLabel1 = 'Quadro Ativo';
                metricValue1 = `${employees.length} CLT`;
                metricLabel2 = 'Desempenho Geral';
                const avg = employees.length > 0 ? (employees.reduce((sum, e) => sum + e.performanceRating, 0) / employees.length).toFixed(1) : '5.0';
                metricValue2 = `★ ${avg} / 5.0`;
                sectorStatus = employees.some(e => e.vacationStatus === 'afastado') ? 'Férias / Licença' : 'Equipe Estável';
              } else if (sec.key === 'financeiro') {
                const totalRec = finances.filter(f => f.type === 'receita' && f.status === 'pago').reduce((sum, f) => sum + f.amount, 0);
                const totalDes = finances.filter(f => f.type === 'despesa' && f.status === 'pago').reduce((sum, f) => sum + f.amount, 0);
                metricLabel1 = 'Disponibilidade Caixa';
                metricValue1 = (totalRec - totalDes).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                metricLabel2 = 'Contas a Receber';
                metricValue2 = pendingReceivablesTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                if (totalRec - totalDes < 5000) {
                  sectorStatus = 'Caixa Apertado!';
                  statusColor = 'text-red-700 bg-red-50 border-red-200';
                }
              } else if (sec.key === 'producao') {
                metricLabel1 = 'Alertas Próximo Baixo';
                metricValue1 = `${countLowStock} insumos`;
                metricLabel2 = 'Backlog Reparos OS';
                metricValue2 = `${activeOS} OS abertas`;
                if (countLowStock > 0 || activeOS > 2) {
                  sectorStatus = 'Gargalo de Manufatura';
                  statusColor = 'text-red-700 bg-red-50 border-red-200';
                }
              }

              return (
                <div key={sec.id} className="p-4 border border-slate-200 bg-slate-50/40 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white transition-all">
                  
                  {/* Left tag and info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full bg-${sec.color}-500 shadow-sm`} />
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{sec.name}</h4>
                      <span className={`text-[9px] font-bold uppercase border px-2 py-0.5 rounded-full ${statusColor}`}>
                        {sectorStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-sans">Gestor: <strong>{sec.manager}</strong></p>
                  </div>

                  {/* Middle metrics dynamic readout */}
                  <div className="grid grid-cols-2 gap-4 md:gap-8 flex-1 max-w-md">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">{metricLabel1}</span>
                      <span className="text-xs font-bold text-slate-800">{metricValue1}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">{metricLabel2}</span>
                      <span className="text-xs font-semibold text-slate-700">{metricValue2}</span>
                    </div>
                  </div>

                  {/* Right small micro indicator */}
                  <div>
                    <span className="flex items-center justify-center h-8 w-8 bg-slate-100 rounded-lg text-slate-600 font-mono text-xs font-bold shrink-0">
                      Ok
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. REALTIME TRANSACTION VELOCITY AREA GRAPH */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-brand-500" />
                  Velocidade de Mudanças do Ciclo
                </h3>
                <p className="text-[11px] text-slate-400 mb-4">Relação ao vivo de alterações em CRM, Anúncios e Produção.</p>
              </div>
              <span className="text-[9px] font-bold font-mono text-sky-655 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded animate-pulse">
                AO VIVO
              </span>
            </div>

            {/* Area chart */}
            <div className="h-52 w-full text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityBuffer}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="cycle" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '10px' }} />
                  <Area type="monotone" name="CRM Vendas" dataKey="Vendas" stroke="#10b981" fillOpacity={1} fill="url(#colorVendas)" strokeWidth={1.5} />
                  <Area type="monotone" name="Comunicações" dataKey="Marketing" stroke="#6366f1" fillOpacity={0} strokeWidth={1.5} />
                  <Area type="monotone" name="Atividade Caixa" dataKey="Caixa" stroke="#f59e0b" fillOpacity={0} strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border-t border-slate-100 mt-4 pt-3.5 space-y-1.5 text-[11px]">
            <span className="text-slate-400 font-bold block">Consumo de Recursos de Infraestrutura:</span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Transações p/ ciclo:</span>
              <span className="font-semibold text-slate-800">1.6 eventos</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Largura de banda simulada:</span>
              <span className="font-semibold text-slate-800 font-mono">14.2 Kbit/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* MONITOR DE LEADS DISPONÍVEIS & COBRANÇA */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-rose-500" />
              Monitor de Leads Disponíveis & Cobrança de Setor (Comercial / Vendas)
            </h3>
            <p className="text-[11px] text-slate-500">
              Visualize candidatos, leads e oportunidades captadas que ainda estão sem andamento ou não assumidos pelos funcionários do setor. O proprietário pode cobrar o setor clicando no botão para disparar alertas formais de atendimento emergencial.
            </p>
          </div>

          {/* Filtros de Leads */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-450 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filtrar:
            </span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px] font-bold font-sans">
              <button
                onClick={() => setLeadFilter('unhandled')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  leadFilter === 'unhandled' 
                    ? 'bg-white text-rose-650 shadow-xs border border-slate-200/55 font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Novos (Aguardando)
              </button>
              <button
                onClick={() => setLeadFilter('in_progress')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  leadFilter === 'in_progress' 
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/55 font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Em Andamento
              </button>
              <button
                onClick={() => setLeadFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  leadFilter === 'all' 
                    ? 'bg-white text-slate-800 shadow-xs border border-slate-200/55 font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Todos
              </button>
            </div>
          </div>
        </div>

        {/* Lead tracker table wrapper */}
        <div className="border border-slate-200/60 rounded-xl overflow-hidden bg-slate-50/15">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                  <th className="py-2.5 px-4 font-sans text-slate-500">Lead Potencial / Empresa</th>
                  <th className="py-2.5 px-4 font-sans text-slate-500">Contato Direto</th>
                  <th className="py-2.5 px-4 font-sans text-slate-500">Estimativa Comercial</th>
                  <th className="py-2.5 px-4 font-sans text-slate-500 text-center">Última Interação</th>
                  <th className="py-2.5 px-4 font-sans text-slate-500 text-center">Etapa CRM</th>
                  <th className="py-2.5 px-4 font-sans text-slate-500 text-right">Controle Diretoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {(() => {
                  const filteredLeads = leads.filter(l => {
                    if (leadFilter === 'unhandled') return l.status === 'lead';
                    if (leadFilter === 'in_progress') return l.status === 'contato' || l.status === 'proposta';
                    return true;
                  });

                  if (filteredLeads.length === 0) {
                    return (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                          Não foram localizados potenciais leads nesta etapa de filtro para cobrança.
                        </td>
                      </tr>
                    );
                  }

                  return filteredLeads.map((lead) => {
                    const alertReceivedAt = chargedLeads[lead.id];
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors">
                        {/* Lead / Company info */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-800 block text-xs leading-none mb-0.5">{lead.name}</span>
                          <span className="text-[10px] font-semibold text-emerald-600 block uppercase tracking-wide">{lead.company}</span>
                        </td>
                        
                        {/* Contacts */}
                        <td className="py-3 px-4 text-slate-600 font-mono text-[10.5px]">
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="text-slate-400 text-[11px]">📧</span>
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5 text-[11px]">
                            <span className="text-slate-400 text-[11px]">📞</span>
                            {lead.phone}
                          </div>
                        </td>

                        {/* Financial weight */}
                        <td className="py-3 px-4 font-bold text-slate-800 font-mono text-xs">
                          {lead.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>

                        {/* Inactivity period */}
                        <td className="py-3 px-4 text-center font-mono text-slate-450 text-[11px]">
                          {lead.lastInteraction.split('-').reverse().join('/')}
                          {lead.status === 'lead' && (
                            <span className="block text-[8px] text-rose-500 font-extrabold uppercase mt-0.5 tracking-wider">Aguardando Equipe</span>
                          )}
                        </td>

                        {/* CRM step and fast override */}
                        <td className="py-3 px-4 text-center">
                          <select
                            value={lead.status}
                            onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as ClientLead['status'])}
                            className="bg-slate-50 border border-slate-200 py-1 px-1.5 rounded-lg text-[10.5px] font-bold text-slate-750 outline-none focus:bg-white focus:border-indigo-400"
                          >
                            <option value="lead">Visualização (Lead/Raw)</option>
                            <option value="contato">Contato Efetuado</option>
                            <option value="proposta">Proposta Enviada</option>
                            <option value="fechado">Ganho (Fechado) ✔</option>
                            <option value="perdido">Perdido / Cancelado ❌</option>
                          </select>
                        </td>

                        {/* Fast Warning Button */}
                        <td className="py-3 px-4 text-right">
                          {alertReceivedAt ? (
                            <div className="inline-flex flex-col items-end">
                              <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg flex items-center gap-1 animate-pulse">
                                🔔 Cobrado do Setor (Vendas)
                              </span>
                              <span className="text-[8px] font-semibold font-mono text-slate-400 mt-0.5">Alerta enviado às {alertReceivedAt}</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleChargeSector(lead)}
                              disabled={lead.status === 'fechado' || lead.status === 'perdido'}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold shadow-xs transition-all active:scale-95 flex items-center gap-1.5 ml-auto cursor-pointer ${
                                lead.status === 'lead'
                                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-650'
                              } disabled:opacity-40 disabled:pointer-events-none`}
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              Cobrar Setor urgentemente
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MANUAL INCIDENT INJECTORS & LIVE LOGGER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MANUAL EVENT INJECTOR PANE */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <Zap className="w-4.5 h-4.5 text-amber-500" />
              Injetor Manual de Eventos Empresariais
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Gere incidentes ou ganhos sob demanda de teste para auditoria.</p>
          </div>

          <div className="space-y-3">
            {/* Injector 1 */}
            <button
              onClick={handleManualLeadInject}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-left transition-all active:scale-98 flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-emerald-600">
                  <Briefcase className="w-4 h-4 text-emerald-500" /> Captar Lead Quente CRM
                </span>
                <p className="text-[10px] text-slate-400">Adiciona lead corporativo de R$15.000 ao funil.</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Injector 2 */}
            <button
              onClick={handleManualMaintenanceInject}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-left transition-all active:scale-98 flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-rose-600">
                  <Wrench className="w-4 h-4 text-rose-500" /> Disparar Alerta Manutenção OS
                </span>
                <p className="text-[10px] text-slate-400">Registra falha técnica crítica em compressor.</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Injector 3 */}
            <button
              onClick={handleManualPayoutInject}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-left transition-all active:scale-98 flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 text-amber-600">
                  <Coins className="w-4 h-4 text-amber-500" /> Lançar Despesa Extraordinária
                </span>
                <p className="text-[10px] text-slate-400">Reduz saldo de caixa em R$3.000 por compras de fluidos.</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-350 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="border-t border-slate-100 mt-4 pt-3 text-[10px] text-slate-400 leading-normal">
            Os botões acima realizam mutações diretamente no banco de dados persistido no LocalStorage, propagando os dados para as outras telas do portal.
          </div>
        </div>

        {/* LIVE TICKER CONSOLE LOG (Col-span 2) */}
        <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 shadow-md lg:col-span-2 flex flex-col justify-between font-mono">
          <div>
            <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-200">LOG DE TELEMETRIA AO VIVO</span>
              </div>
              
              <button 
                onClick={() => setSimLogs([{ id: '0', time: new Date().toLocaleTimeString(), sectorName: 'Geral', message: 'Fila de relatórios limpa.', status: 'info' }])}
                className="text-[10px] text-slate-500 hover:text-white transition-colors"
              >
                Limpar log
              </button>
            </div>

            <div className="space-y-2 lg:space-y-2.5 max-h-[340px] overflow-y-auto text-[11px] leading-relaxed pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {simLogs.map((log) => {
                let badgeColor = 'text-slate-400 bg-slate-800/80';
                if (log.status === 'success') badgeColor = 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/40';
                else if (log.status === 'warn') badgeColor = 'text-amber-400 bg-amber-950/60 border border-amber-900/40';
                else if (log.status === 'error') badgeColor = 'text-rose-400 bg-rose-950/60 border border-rose-900/40';

                return (
                  <div key={log.id} className="p-2 bg-slate-950/40 rounded-lg border border-slate-850 flex justify-between items-start gap-3 hover:bg-slate-850/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-505 text-[10px]">{log.time}</span>
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${badgeColor}`}>
                          {log.sectorName}
                        </span>
                      </div>
                      <p className="text-slate-250 font-sans text-xs">{log.message}</p>
                    </div>

                    {log.metricImpact && (
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded whitespace-nowrap self-center ${
                        log.status === 'success' ? 'text-emerald-400 bg-emerald-950' : 'text-rose-400 bg-rose-950'
                      }`}>
                        {log.metricImpact}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-3.5 mt-4 flex items-center justify-between">
            <span>SGCE_CLIENT_LOG_CONNECTED: TRUE</span>
            <span>API v2.4.0</span>
          </div>
        </div>
      </div>

    </div>
  );
}
