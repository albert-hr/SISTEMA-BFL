/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Play, 
  AlertTriangle, 
  Archive,
  ClipboardList,
  AlertCircle,
  TrendingUp,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { WorkOrder, StockItem } from '../types';

interface ProducaoOperacoesProps {
  orders: WorkOrder[];
  stock: StockItem[];
  onAddOrder: (order: WorkOrder) => void;
  onUpdateOrderStatus: (id: string, status: WorkOrder['status']) => void;
  onDeleteOrder: (id: string) => void;
  onRestockItem: (id: string, quantity: number) => void;
}

export default function ProducaoOperacoes({
  orders,
  stock,
  onAddOrder,
  onUpdateOrderStatus,
  onDeleteOrder,
  onRestockItem
}: ProducaoOperacoesProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<WorkOrder['priority']>('media');
  const [responsible, setResponsible] = useState('');
  const [dueDate, setDueDate] = useState('2026-06-05');

  // Quality check logger simulator (Section 4.3: "gestão de qualidade")
  const [showQualityLog, setShowQualityLog] = useState(true);
  const [qualityAudits, setQualityAudits] = useState([
    { id: 1, machinery: 'Injetora Termoplástica #4', status: 'Conforme', auditorMsg: 'Calibração térmica dentro das margens toleráveis de +-1.5°C.' },
    { id: 2, machinery: 'Unidade Hidráulica Extrusora #2', status: 'Requer Ajuste', auditorMsg: 'Substituição de filtro com 95% de saturação observada no sensor.' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !responsible.trim()) return;

    const newOrder: WorkOrder = {
      id: 'wo_' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'Sem detalhamento complementar cadastrado.',
      priority: priority,
      status: 'pendente',
      dueDate: dueDate,
      responsible: responsible.trim()
    };

    onAddOrder(newOrder);
    setShowForm(false);
    
    // reset form
    setTitle('');
    setDescription('');
    setResponsible('');
  };

  const handleAuditAction = (id: number) => {
    setQualityAudits(
      qualityAudits.map(qa => qa.id === id ? { ...qa, status: 'Conforme', auditorMsg: 'Ajustado com sucesso. Parâmetros operacionais restabelecidos.' } : qa)
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Produção Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Wrench className="w-5.5 h-5.5 text-blue-600" />
            Produção, Manutenção & Controle de Estoque
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Backlog de manutenção industrial de máquinas, ordens de serviço (OS) de fabricação, controle de qualidade de maquinários e níveis de insumos secundários.
          </p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Abertura de OS
        </button>
      </div>

      {/* RENDER INVENTORY CRITICAL LEVEL WARNING ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* STOCK INVENTORY MANAGER */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Archive className="w-4.5 h-4.5 text-slate-500" />
                Matérias-Primas & Nível de Estoque Real
              </h3>
              <p className="text-[11px] text-slate-400">Clique em "Comprar Resgaste" para reabastecer suprimentos em falta.</p>
            </div>
            <span className="text-[10px] text-red-600 font-bold bg-red-50 border border-red-100 px-2.5 py-1 rounded-full animate-pulse">
              {stock.filter(s => s.quantity <= s.minQuantity).length} ALERTAS DE INSUMO BAIXO
            </span>
          </div>

          <div className="space-y-4">
            {stock.map((item) => {
              const isCritical = item.quantity <= item.minQuantity;
              const fillPercentage = Math.min(Math.round((item.quantity / (item.minQuantity * 2.5)) * 100), 100);

              return (
                <div key={item.id} className="p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                      <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                      <span className="text-[9px] text-slate-400">Mínimo: {item.minQuantity} {item.unit}</span>
                    </div>

                    {/* Progress indicator level */}
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 rounded-full h-2 max-w-xs">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${fillPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">{item.quantity} {item.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isCritical && (
                      <span className="text-[10px] text-red-600 font-medium flex items-center gap-0.5 mr-1 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Reposição Urgente
                      </span>
                    )}
                    <button
                      onClick={() => onRestockItem(item.id, item.minQuantity * 1.5)}
                      className="bg-slate-900 text-white hover:bg-slate-850 px-3 py-1.5 rounded-lg text-[10px] font-bold active:scale-95 transition-all text-center cursor-pointer whitespace-nowrap"
                    >
                      Comprar Suprimento
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FACTORY OS WORKFLOW Backlog LIST (Mini Columns or Cards) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <ClipboardList className="w-4.5 h-4.5 text-blue-500" />
              Fluxo Operacional de Ordens de Serviço (OS)
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">Promova ou remova ordens de manufatura abertas.</p>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {orders.map((order) => {
              const priorityColor = order.priority === 'alta' ? 'text-red-600 bg-red-50 border-red-100' : order.priority === 'media' ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-slate-500 bg-slate-50 border-slate-100';

              return (
                <div key={order.id} className="p-3 border border-slate-100 rounded-xl relative hover:border-slate-200 hover:shadow-xs transition-shadow">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-[8px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityColor}`}>
                      PRIORIDADE {order.priority}
                    </span>
                    
                    <span className="text-[10px] font-bold font-mono text-slate-400">#OS-{order.id.slice(-4)}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 leading-snug">{order.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-1 line-clamp-2">{order.description}</p>
                  
                  <div className="mt-2.5 pt-2 border-t border-slate-150 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 text-[10px]">Resp: <strong>{order.responsible}</strong></span>
                    
                    <div className="flex items-center gap-1">
                      {order.status === 'pendente' ? (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'em_progresso')}
                          className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded flex items-center gap-0.5"
                        >
                          <Play className="w-3 h-3" /> Iniciar
                        </button>
                      ) : order.status === 'em_progresso' ? (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'concluido')}
                          className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-0.5"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Concluir
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold text-[9px] uppercase tracking-wide">
                          ✓ CONCLUÍDO
                        </span>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm('Excluir esta ordem de manutenção?')) onDeleteOrder(order.id);
                        }}
                        className="text-slate-350 hover:text-red-500 pl-1"
                        title="Deletar OS"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* OS WORK BACKLOG FORM OVERLAY */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-xl animate-fadeIn">
          <h3 className="font-bold text-sm text-slate-800 mb-4 pb-1 border-b border-slate-100">Registrar Ordem de Manutenção / Operação</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título de Reparo ou Fabricação *</label>
              <input 
                type="text" 
                placeholder="Ex:: Trocar vedante extrusora inox" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ementa Complementar do Problema</label>
              <textarea 
                rows={3}
                placeholder="Descreva detalhadamente a falha técnica ou diretrizes da produção."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-sans focus:bg-white focus:border-blue-500 resize-none outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grau de Urgência</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value as WorkOrder['priority'])}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-[#cbd5e1] rounded-lg text-xs"
                >
                  <option value="baixa">Baixa prioridade</option>
                  <option value="media">Média prioridade</option>
                  <option value="alta">Alta prioridade</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Técnico Encarregado *</label>
                <input 
                  type="text" 
                  placeholder="Ex:: Lucas Antunes" 
                  value={responsible} 
                  onChange={(e) => setResponsible(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prazo Final</label>
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs"
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Ativar Ordem de Serviço
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QUALITY MANAGEMENT SYSTEM ROW (Section 4.3: "gestão de qualidade") */}
      {showQualityLog && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-blue-50/50 border-l border-b border-blue-100 text-blue-600 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 rounded-bl-xl shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> ISO 9001 Compliance
          </div>

          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-1.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-blue-500" />
            Controle de Qualidade Industrial de Maquinários
          </h3>

          <div className="space-y-3.5 mt-2">
            {qualityAudits.map((item) => (
              <div key={item.id} className="p-3.5 border border-slate-150 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 hover:bg-white transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.status === 'Conforme' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="font-bold text-slate-800 text-xs">{item.machinery}</span>
                    <span className={`text-[10px] font-bold uppercase ${item.status === 'Conforme' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'} px-2 py-0.5 rounded border border-slate-250`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans">{item.auditorMsg}</p>
                </div>

                <div className="flex items-center gap-3 pt-1 sm:pt-0 self-end sm:self-center">
                  {item.status !== 'Conforme' ? (
                    <button
                      onClick={() => handleAuditAction(item.id)}
                      className="bg-blue-600 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg active:scale-95 hover:bg-blue-700 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      Realizar Calibração Rápida
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-semibold italic">Ajuste Ok</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
