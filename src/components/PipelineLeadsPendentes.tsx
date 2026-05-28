/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Briefcase, 
  Mail, 
  Phone, 
  ShieldAlert, 
  Sparkles, 
  Plus, 
  Search, 
  ArrowRight, 
  Megaphone,
  UserCheck,
  CheckCircle,
  Building,
  Filter,
  DollarSign,
  Layers,
  ChevronRight,
  UserX,
  Bell
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell
} from 'recharts';
import { ClientLead, Employee, Sector, User } from '../types';

interface PipelineLeadsPendentesProps {
  leads: ClientLead[];
  sectors: Sector[];
  employees: Employee[];
  currentUser: User;
  onUpdateLeadDetails: (leadId: string, updatedFields: Partial<ClientLead>) => void;
  onAddLead: (lead: ClientLead) => void;
}

export default function PipelineLeadsPendentes({
  leads,
  sectors,
  employees,
  currentUser,
  onUpdateLeadDetails,
  onAddLead
}: PipelineLeadsPendentesProps) {
  
  // Real-time ticking trigger
  const [ticks, setTicks] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState<string>('all');
  const [slaFilter, setSlaFilter] = useState<'all' | 'normal' | 'warn' | 'delayed'>('all');
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null); // leadId
  const [assigneeName, setAssigneeName] = useState('');
  
  // Create state to simulate alerts / sector warnings sent
  const [chargedLeads, setChargedLeads] = useState<{ [id: string]: string }>({});

  // Effect to trigger ticking dynamic render of response time (every 5 seconds is enough but 1000ms is standard)
  useEffect(() => {
    const interval = setInterval(() => {
      setTicks(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter leads to get only PENDING (unassigned) and starting stage (lead / raw)
  const pendingLeads = leads.filter(l => {
    const isUnassigned = !l.assignedTo;
    const isRawLead = l.status === 'lead';
    return isUnassigned && isRawLead;
  });

  // Calculate elapsed helper
  const getElapsedSeconds = (createdAtIso?: string) => {
    if (!createdAtIso) return 0;
    const created = new Date(createdAtIso).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((now - created) / 1000));
  };

  const formatElapsed = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // SLA assessment
  // Normal: < 1 hour (less than 3600s)
  // Warning: 1 to 4 hours (3600s - 14400s)
  // Delayed: > 4 hours (greater than 14400s)
  const getSlaStatus = (seconds: number) => {
    if (seconds < 3600) {
      return { label: 'Sob Controle (SLA verde)', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500', level: 'normal' };
    }
    if (seconds < 14400) {
      return { label: 'Tempo Limite (Atenção)', color: 'text-amber-700 bg-amber-50 border-amber-100', dot: 'bg-amber-500', level: 'warn' };
    }
    return { label: 'SLA Rompido (Urgente!)', color: 'text-rose-700 bg-rose-50 border-rose-150 animate-pulse', dot: 'bg-rose-500', level: 'delayed' };
  };

  // Process search and filters
  const filteredPending = pendingLeads.filter(lead => {
    // Search filter
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));

    // Sector key filter
    const leadSector = lead.sectorKey || 'vendas';
    const matchesSector = filterSector === 'all' || leadSector === filterSector;

    // SLA state filter
    const elapsed = getElapsedSeconds(lead.createdAt);
    const slaDetail = getSlaStatus(elapsed);
    const matchesSla = slaFilter === 'all' || slaDetail.level === slaFilter;

    return matchesSearch && matchesSector && matchesSla;
  });

  // Calculate high-level stats
  const totalValuePending = pendingLeads.reduce((acc, l) => acc + l.value, 0);
  const breachedSlaCount = pendingLeads.filter(l => getElapsedSeconds(l.createdAt) >= 14400).length;
  const warningSlaCount = pendingLeads.filter(l => {
    const t = getElapsedSeconds(l.createdAt);
    return t >= 3600 && t < 14400;
  }).length;

  // Average pending latency (excluding leads with no createdAt)
  const leadsWithCreated = pendingLeads.filter(l => !!l.createdAt);
  const averageLatencySeconds = leadsWithCreated.length > 0 
    ? Math.floor(leadsWithCreated.reduce((sum, l) => sum + getElapsedSeconds(l.createdAt), 0) / leadsWithCreated.length)
    : 0;

  // Quick action mock generator
  const handleInjectPendingLead = () => {
    const candidateNames = [
      'Glauber Rocha', 'Thais Araújo', 'Rodrigo Fagundes', 'Helena Rinaldi', 
      'Alessandro Neto', 'Priscila Alvarenga', 'Igor Guimarães'
    ];
    const candidateComps = [
      'Universal Empreendimentos', 'Vanguardia Digital', 'Fraga Alimentos', 
      'Rinaldi Construtora', 'Selo Verde Recicláveis', 'Alvarenga Advogados', 'Guimarães Auto'
    ];
    const itemIdx = Math.floor(Math.random() * candidateNames.length);
    const value = Math.floor(Math.random() * 8 + 3) * 5000;
    
    // Distribute randomly between sectors
    const randSector = sectors[Math.floor(Math.random() * sectors.length)]?.key || 'vendas';
    
    const newLead: ClientLead = {
      id: 'lead_live_' + Date.now(),
      name: candidateNames[itemIdx],
      company: candidateComps[itemIdx],
      email: `${candidateNames[itemIdx].toLowerCase().replace(/\s+/g, '')}@empresa.com`,
      phone: `(31) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'lead',
      value: value,
      notes: 'Lead injetado para testar o tempo de resposta em tempo real no monitor.',
      lastInteraction: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(), // Created exactly right now! Ticking starts!
      sectorKey: randSector
    };

    onAddLead(newLead);
  };

  // Charge/Warn Sector
  const handleChargeSector = (leadId: string, leadName: string, sectorKey: string) => {
    const timeStr = new Date().toLocaleTimeString('pt-BR');
    setChargedLeads(prev => ({
      ...prev,
      [leadId]: timeStr
    }));

    // Trigger local audio alert if desired, or message
    const secName = sectors.find(s => s.key === sectorKey)?.name || 'Vendas';
    alert(`Notificação de Cobrança enviada com sucesso para o Setor ${secName}! O gestor foi alertado sobre a demora de atendimento no lead de '${leadName}'.`);
  };

  // Delegate Lead
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAssignModal) return;

    if (!assigneeName.trim()) {
      alert('Por favor, informe ou selecione o funcionário.');
      return;
    }

    // Update lead values: set assigned employee, set stage to 'contato' (meaning assumed!)
    onUpdateLeadDetails(showAssignModal, {
      assignedTo: assigneeName.trim(),
      status: 'contato'
    });

    // Reset fields
    setShowAssignModal(null);
    setAssigneeName('');
  };

  // Data processing for Recharts graph: Group pending leads by SLA category
  const chartData = [
    { name: 'Normal (<1 hora)', quantidade: pendingLeads.filter(l => getElapsedSeconds(l.createdAt) < 3600).length, fill: '#10b981' },
    { name: 'Atenção (1h-4h)', quantidade: pendingLeads.filter(l => { const t = getElapsedSeconds(l.createdAt); return t >= 3600 && t < 14400; }).length, fill: '#f59e0b' },
    { name: 'Urgente (>4h)', quantidade: pendingLeads.filter(l => getElapsedSeconds(l.createdAt) >= 14400).length, fill: '#f43f5e' }
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl relative overflow-hidden shadow-lg">
        {/* Decorative dynamic glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-[10px] font-bold tracking-widest text-rose-400 uppercase bg-rose-950 px-2.5 py-1 rounded-full border border-rose-900/40">
                AUDITORIA DE GARGALOS E ATENDIMENTO
              </span>
            </div>
            
            <h2 className="text-2xl font-extrabold font-display tracking-tight text-white flex items-center gap-2">
              <Clock className="w-5.5 h-5.5 text-rose-400" />
              Pipeline de Leads Pendentes
            </h2>
            
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Monitore em tempo real as oportunidades e contatos captados que ainda <strong>não foram assumidos por nenhum colaborador</strong>. Rastreie a latência de atendimento de cada setor e envie alertas de cobrança imediatos para forçar o andamento da operação comercial.
            </p>
          </div>

          <button
            onClick={handleInjectPendingLead}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Simular / Injetar Lead Pendente
          </button>
        </div>
      </div>

      {/* ANALYTICS HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Metric 1: Total volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Volume Ocioso</span>
            <span className="text-2xl font-black text-slate-800 block font-mono">
              {totalValuePending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10.5px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-bold inline-block">
              {pendingLeads.length} leads abandonados
            </span>
          </div>
          <span className="p-3 bg-red-50 text-red-650 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </span>
        </div>

        {/* Metric 2: Breached SLA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">SLA Rompido (&gt;4h)</span>
            <span className="text-2xl font-black text-rose-650 block font-mono">
              {breachedSlaCount} {breachedSlaCount === 1 ? 'Lead' : 'Leads'}
            </span>
            <span className="text-[10.5px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold inline-block">
              Crítico / Reclama Atenção
            </span>
          </div>
          <span className="p-3 bg-rose-50 text-rose-600 rounded-xl animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </span>
        </div>

        {/* Metric 3: Warning SLA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Atenção (1h à 4h)</span>
            <span className="text-2xl font-black text-amber-600 block font-mono">
              {warningSlaCount} {warningSlaCount === 1 ? 'Lead' : 'Leads'}
            </span>
            <span className="text-[10.5px] text-amber-700 bg-amber-55 px-1.5 py-0.5 rounded font-bold inline-block">
              Aproximando do limite
            </span>
          </div>
          <span className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </span>
        </div>

        {/* Metric 4: Avg Response Clock */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Tempo Médio Espera</span>
            <span className="text-xl font-bold text-slate-800 block font-mono">
              {pendingLeads.length > 0 ? formatElapsed(averageLatencySeconds) : 'Sem pendências'}
            </span>
            <span className="text-[10.5px] text-sky-600 bg-sky-55 px-1.5 py-0.5 rounded font-bold inline-block">
              Média de resposta ideal: &lt; 30m
            </span>
          </div>
          <span className="p-3 bg-indigo-50 text-indigo-650 rounded-xl">
            <Clock className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* MIDDLE ROW: LATENCY GRAPH AND DETAILED DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Latency distribution bar chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              Severidade de Latência de Leads
            </h3>
            <p className="text-[11px] text-slate-400 mb-6">Concentração de oportunidades sem resposta por faixa de tempo.</p>
          </div>

          <div className="h-52 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '10px' }} />
                <Bar dataKey="quantidade" barSize={34} radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-slate-100 mt-4 pt-3 text-[10.5px] text-slate-500">
            <span className="font-bold text-slate-700 block mb-1">Métricas Importantes:</span>
            O tempo de resposta ideal para conversões ótimas é de até 5 minutos após o preenchimento. Com a rastreabilidade em tempo real, garanta que os prazos internos de atendimento sejam cumpridos.
          </div>
        </div>

        {/* Responsible Sectors Latency Auditor */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Auditoria de Tempo de Resposta por Setor Responsável
            </h3>
            <p className="text-[11px] text-slate-500">Avalie qual divisão organizacional está com acúmulo de demandas comerciais ociosas.</p>
          </div>

          <div className="space-y-3.5">
            {sectors.map(sec => {
              // Calculate sector specific stats
              const secLeads = pendingLeads.filter(l => (l.sectorKey || 'vendas') === sec.key);
              const secTotalSum = secLeads.reduce((s, l) => s + l.value, 0);
              const secElapsedSeconds = secLeads.map(l => getElapsedSeconds(l.createdAt));
              const secAvgWait = secElapsedSeconds.length > 0 
                ? Math.floor(secElapsedSeconds.reduce((sum, current) => sum + current, 0) / secElapsedSeconds.length)
                : 0;
              
              const isCrit = secAvgWait >= 14400 && secLeads.length > 0;
              const isWarning = secAvgWait >= 3600 && secAvgWait < 14400 && secLeads.length > 0;
              
              let badgesText = 'Sem Pendências';
              let badgeColor = 'text-slate-500 bg-slate-50 border-slate-200';
              if (secLeads.length > 0) {
                if (isCrit) {
                  badgesText = 'Atraso Crítico';
                  badgeColor = 'text-red-700 bg-red-50 border-red-200 animate-pulse';
                } else if (isWarning) {
                  badgesText = 'Gargalo Moderado';
                  badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
                } else {
                  badgesText = 'Dentro da Meta';
                  badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-150';
                }
              }

              return (
                <div key={sec.id} className="p-3.5 border border-slate-200 bg-slate-50/40 rounded-xl hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full bg-${sec.color}-500 shadow-sm shrink-0`} />
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{sec.name}</h4>
                      <p className="text-[10.5px] text-slate-450 leading-snug">Gestor do Setor: <strong>{sec.manager}</strong></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 flex-1 md:max-w-md">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Leads Ociosos</span>
                      <span className="text-xs font-bold text-slate-800">{secLeads.length} {secLeads.length === 1 ? 'oportunidade' : 'oportunidades'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Valor em Espera</span>
                      <span className="text-xs font-bold text-indigo-600 font-mono">{secTotalSum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Tempo Médio Espera</span>
                      <span className={`text-xs font-bold font-mono ${isCrit ? 'text-rose-600' : isWarning ? 'text-amber-500' : 'text-slate-700'}`}>
                        {secLeads.length > 0 ? formatElapsed(secAvgWait) : '---'}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-black uppercase text-center border px-2.5 py-1 rounded-full whitespace-nowrap self-start md:self-center ${badgeColor}`}>
                    {badgesText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* REAL-TIME TRACKER WORK TABLE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        
        {/* Table Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-slate-650" />
              Monitoramento e Cobrança Direta de Leads Pendentes
            </h3>
            <p className="text-[11px] text-slate-405">Configure filtros de gravidade, busque nomes, re-designe ou cobre atenção imediatamente.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-9 pr-4 text-xs placeholder-slate-405 outline-none focus:bg-white focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all"
              />
            </div>

            {/* Filter by Sector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-450 whitespace-nowrap font-bold">Setor:</span>
              <select
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
                className="bg-slate-50 border border-slate-200 py-1.5 px-2.5 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white"
              >
                <option value="all">Ver Todos os Setores</option>
                {sectors.map(s => (
                  <option key={s.id} value={s.key}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Filter by SLA Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-450 whitespace-nowrap font-bold">Prazo:</span>
              <select
                value={slaFilter}
                onChange={(e) => setSlaFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 py-1.5 px-2.5 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white"
              >
                <option value="all">SLA (Geral)</option>
                <option value="normal">Sob Controle (&lt;1h)</option>
                <option value="warn">Atenção Limite (1h-4h)</option>
                <option value="delayed">SLA Rompido (&gt;4h)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lead List Table */}
        <div className="border border-slate-200/60 rounded-xl overflow-hidden bg-slate-50/15">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                  <th className="py-3 px-4 font-sans text-slate-500">Razão Social / Cliente</th>
                  <th className="py-3 px-4 font-sans text-slate-500">Setor Responsável</th>
                  <th className="py-3 px-4 font-sans text-slate-500">Estimativa Orçamentária</th>
                  <th className="py-3 px-4 font-sans text-slate-500">Tempo Decorrido Sem Contato (Real-time)</th>
                  <th className="py-3 px-4 font-sans text-slate-500 text-center">Status Interno</th>
                  <th className="py-3 px-4 font-sans text-slate-500 text-right">Controle Corporativo / Intervenção</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredPending.length > 0 ? (
                  filteredPending.map((lead) => {
                    const elapsed = getElapsedSeconds(lead.createdAt);
                    const slaState = getSlaStatus(elapsed);
                    const isWarned = chargedLeads[lead.id];
                    const leadSecKey = lead.sectorKey || 'vendas';
                    const sectorObj = sectors.find(s => s.key === leadSecKey);

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/20 transition-colors">
                        
                        {/* Company & Client Name */}
                        <td className="py-3 px-4">
                          <span className="text-[10px] uppercase font-mono font-bold tracking-wide text-indigo-600 block leading-none mb-1">
                            {lead.company}
                          </span>
                          <span className="font-bold text-slate-800 text-xs block leading-tight">{lead.name}</span>
                          
                          <div className="flex gap-2.5 text-[10px] text-slate-400 mt-1.5 font-sans leading-none">
                            <span className="flex items-center gap-0.5"><Mail className="w-3 h-3" /> {lead.email}</span>
                            <span className="flex items-center gap-0.5"><Phone className="w-3 h-3" /> {lead.phone}</span>
                          </div>
                        </td>

                        {/* Sector Responsible */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full bg-${sectorObj?.color || 'emerald'}-500 shrink-0`} />
                            <div>
                              <span className="text-[10.5px] font-bold text-slate-755 uppercase tracking-wide">
                                {sectorObj?.name || 'CRM / Vendas'}
                              </span>
                              <span className="block text-[9px] text-slate-400 leading-tight">
                                Gestor: {sectorObj?.manager || 'Carlos Viana'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Estimated Revenue Weight */}
                        <td className="py-3 px-4">
                          <span className="font-black text-slate-800 font-mono text-xs">
                            {lead.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </td>

                        {/* Live ticking counter with SLA colored details */}
                        <td className="py-3 px-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-450 animate-spin-slow text-slate-550" />
                              <span className="font-bold text-slate-800 font-mono text-xs tracking-wider">
                                {formatElapsed(elapsed)}
                              </span>
                            </div>
                            <span className={`text-[8.5px] font-bold uppercase border px-2 py-0.5 rounded ${slaState.color}`}>
                              {slaState.label}
                            </span>
                          </div>
                        </td>

                        {/* Internal State Badge */}
                        <td className="py-3 px-4 text-center">
                          <span className="text-[9.5px] font-extrabold uppercase bg-red-50 text-red-700 border border-red-150 px-2 py-0.6 rounded-full flex items-center justify-center gap-1 w-max mx-auto">
                            <UserX className="w-3 h-3" /> Sem Alocação
                          </span>
                        </td>

                        {/* Intervention Action Controls */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* Warning button */}
                            {isWarned ? (
                              <div className="text-right">
                                <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1 justify-end animate-pulse">
                                  <Bell className="w-3 h-3" /> Setor Cobrado
                                </span>
                                <span className="block text-[8px] font-mono text-slate-400 mt-0.5">Alerta enviado {isWarned}</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleChargeSector(lead.id, lead.name, leadSecKey)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-650 border border-rose-200 text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                                title="Enviar aviso de cobrança urgente para o canal do gestor"
                              >
                                <Megaphone className="w-3.5 h-3.5" />
                                Cobrar
                              </button>
                            )}

                            {/* Assign button */}
                            <button
                              onClick={() => {
                                setShowAssignModal(lead.id);
                                // Default first employee of that sector if available
                                const defaultEmp = employees.find(e => e.sector === leadSecKey);
                                setAssigneeName(defaultEmp ? defaultEmp.name : '');
                              }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              Assumir / Delegar
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs italic">
                      <div>
                        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        Nenhum lead pendente aguardando atendimento! Todo o pipeline imobiliário/comercial foi assumido.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ASSIGN / DELEGATE MINI MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full overflow-hidden shadow-2xl animate-scaleUp">
            
            <div className="bg-slate-900 px-5 py-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4.5 h-4.5 text-sky-400" />
                <h4 className="text-sm font-bold font-display text-white">Delegar Oportunidade</h4>
              </div>
              <button 
                onClick={() => setShowAssignModal(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-5 space-y-4">
              <p className="text-[11px] text-slate-500 leading-snug">
                Selecione ou digite o funcionário responsável para assumir este lead. O lead mudará automaticamente para a etapa <strong>"Contato Feito" (Andamento)</strong> no CRM.
              </p>

              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase">Selecione o Colaborador</label>
                
                {/* Select list of employees of this specific sector */}
                <select
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                >
                  <option value="">-- Escolha um colaborador --</option>
                  {employees
                    .filter(emp => emp.sector === (leads.find(l => l.id === showAssignModal)?.sectorKey || 'vendas'))
                    .map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                    ))
                  }
                  {/* Append other employees just in case */}
                  <option disabled>──────────</option>
                  {employees
                    .filter(emp => emp.sector !== (leads.find(l => l.id === showAssignModal)?.sectorKey || 'vendas'))
                    .map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                    ))
                  }
                </select>
              </div>

              {/* Free type input alternative */}
              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase">Ou especifique outro nome:</label>
                <input
                  type="text"
                  placeholder="Nome do operador comercial"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(null)}
                  className="px-3.5 py-1.5 border border-slate-200 text-slate-650 text-xs font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  Confirmar Alocação
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
