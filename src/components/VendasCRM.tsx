/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  User as UserIcon, 
  Phone, 
  Mail, 
  FileText, 
  Briefcase, 
  Plus, 
  Trash2, 
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { ClientLead } from '../types';

interface VendasCRMProps {
  leads: ClientLead[];
  onAddLead: (lead: ClientLead) => void;
  onUpdateLeadStatus: (leadId: string, status: ClientLead['status']) => void;
  onDeleteLead: (leadId: string) => void;
}

export default function VendasCRM({
  leads,
  onAddLead,
  onUpdateLeadStatus,
  onDeleteLead
}: VendasCRMProps) {
  // New Lead form inputs
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<ClientLead['status']>('lead');
  const [notes, setNotes] = useState('');

  // Selected Lead for view modal
  const [selectedLead, setSelectedLead] = useState<ClientLead | null>(null);

  // Form validations
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim() || !company.trim() || !value) {
      setValidationError('Por favor, preencha os dados obrigatórios: Nome do Contato, Empresa e Valor.');
      return;
    }

    const numericValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;

    const newLead: ClientLead = {
      id: 'ld_' + Date.now(),
      name: name.trim(),
      company: company.trim(),
      email: email.trim() || 'contato@' + company.toLowerCase().replace(/\s+/g, '') + '.com.br',
      phone: phone.trim() || '(11) 90000-0000',
      status: status,
      value: numericValue,
      notes: notes.trim() || 'Oportunidade criada no portal SGCI.',
      lastInteraction: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      sectorKey: 'vendas'
    };

    onAddLead(newLead);
    setShowForm(false);
    
    // reset form
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setValue('');
    setStatus('lead');
    setNotes('');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const pipelineColumns: { key: ClientLead['status']; title: string; color: string; badge: string }[] = [
    { key: 'lead', title: 'Captação (Lead)', color: 'bg-slate-100 text-slate-800 border-slate-200', badge: 'bg-slate-400' },
    { key: 'contato', title: 'Contato Feito', color: 'bg-sky-50 text-sky-800 border-sky-100', badge: 'bg-sky-500' },
    { key: 'proposta', title: 'Proposta Enviada', color: 'bg-amber-50 text-amber-800 border-amber-100', badge: 'bg-amber-500' },
    { key: 'fechado', title: 'Contrato Ganho', color: 'bg-emerald-50 text-emerald-800 border-[#bbf7d0]', badge: 'bg-emerald-500' },
    { key: 'perdido', title: 'Perdido / Sem Retorno', color: 'bg-rose-50 text-rose-800 border-rose-100', badge: 'bg-rose-400' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Vendas Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5.5 h-5.5 text-emerald-600" />
            CRM & Gestão Comercial de Vendas
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestão do funil de vendas, valor estimado em propostas e ações imediatas sobre leads cadastrados.
          </p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Lead Comercial
        </button>
      </div>

      {/* New Lead Form Modal / Section */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-2xl animate-fadeIn">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">Registrar Nova Oportunidade CRM</h3>
            <button 
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-medium"
            >
              Cancelar
            </button>
          </div>

          {validationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs font-medium">
              {validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Cliente Potencial *</label>
              <input 
                type="text" 
                placeholder="Ex: João da Silva" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all outline-none"	
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa / Razão Social *</label>
              <input 
                type="text" 
                placeholder="Ex: S/A Construtora" 
                value={company} 
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all outline-none"	
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail Corporativo</label>
              <input 
                type="email" 
                placeholder="cliente@empresa.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all outline-none"	
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input 
                type="text" 
                placeholder="Ex: (11) 98765-4321" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all outline-none"	
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Valor do Contrato (R$) *</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={value} 
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Etapa Inicial do Funil</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value as ClientLead['status'])}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500"
              >
                <option value="lead">Visualização Inicial (Lead)</option>
                <option value="contato">Contato em andamento</option>
                <option value="proposta">Análise de Orçamento (Proposta)</option>
                <option value="fechado">Ganhos / Ativado (Fechado)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notas do Negócio / Histórico da Interação</label>
              <textarea 
                rows={3}
                placeholder="Descreva o perfil do cliente, demandas e o que foi conversado."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 font-sans bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all outline-none resize-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2.5 pt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Salvar Oportunidade
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PIPELINE KANBAN VIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {pipelineColumns.map((col) => {
          const colLeads = leads.filter(l => l.status === col.key);
          const colSum = colLeads.reduce((t, l) => t + l.value, 0);

          return (
            <div key={col.key} className="bg-slate-100/50 border border-slate-200/60 rounded-2xl p-3 flex flex-col h-[600px] overflow-hidden">
              {/* Column Header */}
              <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${col.badge}`} />
                    {col.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                    {colLeads.length} {colLeads.length === 1 ? 'negócio' : 'negócios'} • {formatCurrency(colSum)}
                  </span>
                </div>
              </div>

              {/* Column Cards (Scrollable) */}
              <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                {colLeads.length > 0 ? (
                  colLeads.map((lead) => (
                    <div 
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white p-3.5 border border-slate-200 hover:border-emerald-300 rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer group relative"
                    >
                      <span className="text-[10px] font-semibold text-emerald-600 tracking-wide block mb-1 uppercase">
                        {lead.company}
                      </span>
                      <h5 className="text-xs font-bold font-display text-slate-800 truncate leading-snug">
                        {lead.name}
                      </h5>
                      <span className="text-xs font-bold text-slate-900 block mt-2">
                        {formatCurrency(lead.value)}
                      </span>

                      {/* Mini stats footer inside card */}
                      <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-300" />
                          {lead.lastInteraction.split('-').reverse().slice(0, 2).join('/')}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 font-medium italic">Nenhum lead nesta etapa</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL DRAWER / MODAL FOR SELECTED LEAD */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-scaleUp">
            
            {/* Modal Header banner */}
            <div className="bg-slate-900 p-5 text-white flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-sky-400 tracking-widest block uppercase">DADOS DO LEAD • CRM</span>
                <h4 className="text-lg font-bold font-display text-white mt-1 leading-snug">{selectedLead.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{selectedLead.company}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Valor Estimado</span>
                  <span className="text-base font-bold text-slate-900 block mt-1">{formatCurrency(selectedLead.value)}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">E-mail</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-xs font-medium text-blue-600 hover:underline block truncate mt-1.5 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {selectedLead.email}
                  </a>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Telefone</span>
                  <span className="text-xs font-semibold text-slate-800 block mt-1.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {selectedLead.phone}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Último Contato</span>
                  <span className="text-xs font-semibold text-slate-800 block mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {selectedLead.lastInteraction.split('-').reverse().join('/')}
                  </span>
                </div>
              </div>

              {/* Status workflow selector inside detailing */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Alterar Status de Conversão</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {(['lead', 'contato', 'proposta', 'fechado', 'perdido'] as ClientLead['status'][]).map((st) => {
                    const isSelected = selectedLead.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => {
                          onUpdateLeadStatus(selectedLead.id, st);
                          setSelectedLead({ ...selectedLead, status: st, lastInteraction: new Date().toISOString().split('T')[0] });
                        }}
                        className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {st === 'lead' ? 'Lead' : st === 'contato' ? 'Contato' : st === 'proposta' ? 'Proposta' : st === 'fechado' ? 'Ganho' : 'Perdido'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CRM note and interaction history */}
              <div className="p-4.5 bg-yellow-50/50 border border-amber-200/60 rounded-xl">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block mb-1">Notas do Negócio & Histórico Comercial</span>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{selectedLead.notes}</p>
              </div>

              {/* Delete lead option inside modal */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const confirm = window.confirm('Deseja excluir permanentemente este lead da base de dados?');
                    if (confirm) {
                      onDeleteLead(selectedLead.id);
                      setSelectedLead(null);
                    }
                  }}
                  className="text-xs text-red-500 font-bold hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Remover Oportunidade
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4.5 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl active:scale-95 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Fechar Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
