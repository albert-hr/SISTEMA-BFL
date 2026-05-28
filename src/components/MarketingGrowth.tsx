/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Megaphone, 
  BarChart2, 
  Plus, 
  Trash2, 
  TrendingUp, 
  MousePointerClick, 
  Target, 
  Calendar, 
  Pause, 
  Play, 
  CheckCircle2,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { MarketingCampaign } from '../types';

interface MarketingGrowthProps {
  campaigns: MarketingCampaign[];
  onAddCampaign: (campaign: MarketingCampaign) => void;
  onUpdateCampaignStatus: (id: string, status: MarketingCampaign['status']) => void;
  onDeleteCampaign: (id: string) => void;
}

export default function MarketingGrowth({
  campaigns,
  onAddCampaign,
  onUpdateCampaignStatus,
  onDeleteCampaign
}: MarketingGrowthProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [channel, setChannel] = useState('Google Search');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState<MarketingCampaign['status']>('rascunho');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Simulated calendar items for scheduling
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleChannel, setScheduleChannel] = useState('Instagram Feed');
  const [scheduleDate, setScheduleDate] = useState('2026-05-30');
  
  const [scheduledPosts, setScheduledPosts] = useState([
    { id: 1, title: 'Lançamento Landing Page SGCI', channel: 'LinkedIn', date: '2026-05-29', status: 'confirmado' },
    { id: 2, title: 'Vídeo institucional nos Stories', channel: 'Instagram Feed', date: '2026-05-31', status: 'pendente' },
    { id: 3, title: 'Webinário ao vivo com CEO', channel: 'YouTube / Webinar', date: '2026-06-03', status: 'confirmado' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !budget) return;

    const newCampaign: MarketingCampaign = {
      id: 'cp_' + Date.now(),
      name: name.trim(),
      channel: channel,
      status: status,
      budget: parseFloat(budget) || 0,
      spent: status === 'rascunho' ? 0 : Math.round((parseFloat(budget) || 0) * 0.15), // Initial simulated spend
      clicks: status === 'rascunho' ? 0 : Math.round(Math.random() * 800 + 100),
      conversions: status === 'rascunho' ? 0 : Math.round(Math.random() * 50 + 5),
      startDate: startDate
    };

    onAddCampaign(newCampaign);
    setShowForm(false);
    setName('');
    setBudget('');
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTitle.trim()) return;
    
    setScheduledPosts([
      ...scheduledPosts,
      {
        id: Date.now(),
        title: scheduleTitle.trim(),
        channel: scheduleChannel,
        date: scheduleDate,
        status: 'pendente'
      }
    ]);

    setScheduleTitle('');
    setShowScheduleForm(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Recharts campaign performance dataset preps
  const chartData = campaigns.map(c => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + '...' : c.name,
    Investido: c.spent,
    Cliques: c.clicks,
    Conversões: c.conversions
  }));

  return (
    <div className="space-y-6">
      
      {/* Marketing Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Megaphone className="w-5.5 h-5.5 text-indigo-600" />
            Marketing & Growth de Campanhas
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Planejamento de mídias patrocinadas, conversões por canais digitais e cronograma integrado de publicações.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => {
              setShowScheduleForm(true);
              setShowForm(false);
            }}
            className="flex-1 sm:flex-initial px-3.5 py-2 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Agendar Publicação
          </button>
          <button 
            onClick={() => {
              setShowForm(!showForm);
              setShowScheduleForm(false);
            }}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Campanha Ads
          </button>
        </div>
      </div>

      {/* Campaign Form Overlay */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-xl animate-fadeIn">
          <h3 className="font-bold text-sm text-slate-800 mb-4 pb-1 border-b border-slate-100">Registrar Campanha Digital</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título da Campanha *</label>
              <input 
                type="text" 
                placeholder="Ex:: Retargeting Sacolas Abandonadas" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Canal de Mídia</label>
                <select 
                  value={channel} 
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500"
                >
                  <option value="Google Search">Google Search</option>
                  <option value="Facebook Ads">Facebook Ads</option>
                  <option value="LinkedIn Ads">LinkedIn Ads</option>
                  <option value="Instagram Ads">Instagram Ads</option>
                  <option value="E-mail / Organic">E-mail / Orgânico</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Orçamento Aprovado (R$)</label>
                <input 
                  type="number" 
                  placeholder="Ex: 5000" 
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Inicial</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as MarketingCampaign['status'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500"
                >
                  <option value="rascunho">Rascunho</option>
                  <option value="ativo">Ativo (Rodando)</option>
                  <option value="pausado">Pausado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Início da Campanha</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
              >
                Voltar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Criar Campanha
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Post Schedular Form Overlay */}
      {showScheduleForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-xl animate-fadeIn">
          <h3 className="font-bold text-sm text-slate-800 mb-4 pb-1 border-b border-slate-100">Agendar Novo Conteúdo de Marketing</h3>
          
          <form onSubmit={handleAddSchedule} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título de Publicação *</label>
              <input 
                type="text" 
                placeholder="Ex:: Carrossel sobre dicas de SGCI" 
                value={scheduleTitle} 
                onChange={(e) => setScheduleTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Canal de Publicação</label>
                <select 
                  value={scheduleChannel} 
                  onChange={(e) => setScheduleChannel(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="Instagram Feed">Instagram Feed</option>
                  <option value="LinkedIn Post">LinkedIn Post</option>
                  <option value="TikTok Video">TikTok Video</option>
                  <option value="Email Newsletter">Email Newsletter</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Agendamento Data</label>
                <input 
                  type="date" 
                  value={scheduleDate} 
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowScheduleForm(false)}
                className="px-4 py-1.5 border border-slate-200 text-slate-700 text-xs rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Confirmar Agendamento
              </button>
            </div>
          </form>
        </div>
      )}

      {/* METRIC CHARTS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Campaigns list */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-500" />
            Performance de Custo e Orçamento de Tráfego Pago
          </h3>

          <div className="h-64 text-xs w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="Investido" fill="#6366f1" name="Verba Utilizada" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Aguardando carregamento de campanhas.
              </div>
            )}
          </div>
        </div>

        {/* Conversions list */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500" />
            Meta de Conversões no Funil Digital
          </h3>

          <div className="h-64 text-xs w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Conversões" stroke="#10b981" strokeWidth={3} name="Conversões" />
                  <Line type="monotone" dataKey="Cliques" stroke="#0284c7" strokeWidth={2} name="Cliques de Tráfego" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Carregando cliques.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DYNAMICS CAMPAIGN SECTIONS LIST */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Controle de Mídias Ativas</h3>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
            {campaigns.filter(c => c.status === 'ativo').length} Rodando
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Campanha</th>
                <th className="px-5 py-3">Canal</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Orçamento</th>
                <th className="px-5 py-3 text-right">Gasto Real</th>
                <th className="px-5 py-3 text-right">Cliques</th>
                <th className="px-5 py-3 text-right">Conversões (CTR)</th>
                <th className="px-5 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((c) => {
                const ctr = c.clicks > 0 ? ((c.conversions / c.clicks) * 100).toFixed(1) : '0';
                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-800">{c.name}</td>
                    <td className="px-5 py-4 font-medium text-indigo-600">{c.channel}</td>
                    <td className="px-5 py-4">
                      {c.status === 'ativo' ? (
                        <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">Ativo</span>
                      ) : c.status === 'pausado' ? (
                        <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">Pausado</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">Rascunho</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">{formatCurrency(c.budget)}</td>
                    <td className="px-5 py-4 text-right font-medium text-slate-800">{formatCurrency(c.spent)}</td>
                    <td className="px-5 py-4 text-right font-mono text-slate-500">{c.clicks.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold text-slate-800">{c.conversions}</span>
                      <span className="text-[10px] text-emerald-600 font-medium block">({ctr}%)</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {c.status === 'ativo' ? (
                          <button 
                            onClick={() => onUpdateCampaignStatus(c.id, 'pausado')}
                            title="Pausar Campanha"
                            className="p-1 text-amber-500 hover:bg-amber-50 rounded-lg"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => onUpdateCampaignStatus(c.id, 'ativo')}
                            title="Ativar Campanha"
                            className="p-1 text-emerald-500 hover:bg-emerald-50 rounded-lg"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            if (window.confirm('Remover esta campanha da base de dados?')) {
                              onDeleteCampaign(c.id);
                            }
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PUBLICATION INTEGRATED SCHEDULER SECTION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-indigo-500" />
          Calendário Operacional de Publicações Sociais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scheduledPosts.map((post) => (
            <div key={post.id} className="p-4 border border-indigo-100/50 bg-indigo-50/20 rounded-xl relative flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
                  {post.channel} • {post.date.split('-').reverse().join('/')}
                </span>
                <p className="text-xs font-bold text-slate-800 leading-snug">{post.title}</p>
              </div>
              <div className="mt-3.5 flex justify-between items-center text-[10px]">
                {post.status === 'confirmado' ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Post Aprovado
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium animate-pulse">
                    ● Aguardando Criativo
                  </span>
                )}
                
                <button
                  onClick={() => setScheduledPosts(scheduledPosts.filter(p => p.id !== post.id))}
                  className="text-slate-400 hover:text-red-500 font-medium"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
