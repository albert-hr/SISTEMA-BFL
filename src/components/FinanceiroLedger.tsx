/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Coins, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertCircle,
  PiggyBank,
  FileSpreadsheet,
  DollarSign
} from 'lucide-react';
import { FinancialRecord } from '../types';

interface FinanceiroLedgerProps {
  finances: FinancialRecord[];
  onAddRecord: (record: FinancialRecord) => void;
  onUpdateRecordStatus: (id: string, status: FinancialRecord['status']) => void;
  onDeleteRecord: (id: string) => void;
}

export default function FinanceiroLedger({
  finances,
  onAddRecord,
  onUpdateRecordStatus,
  onDeleteRecord
}: FinanceiroLedgerProps) {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'receita' | 'despesa'>('receita');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Serviços');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<FinancialRecord['status']>('pago');

  // New checklist item simulator for reconciliation (Section 4.3 Finanças: "conciliação bancária")
  const [showChecklist, setShowChecklist] = useState(true);
  const [reconciliationItems, setReconciliationItems] = useState([
    { id: 1, docName: 'Extrato Itaú C/C #448920', val: 14200, systemFlag: true, match: true },
    { id: 2, docName: 'Repasse Gateway Pagamento Cora', val: 5800, systemFlag: true, match: true },
    { id: 3, docName: 'Boleto Compra Insumos Bradesco', val: 7200, systemFlag: false, match: false }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    const newRecord: FinancialRecord = {
      id: 'fin_' + Date.now(),
      description: description.trim(),
      type: type,
      amount: parseFloat(amount) || 0,
      category: category,
      date: date,
      status: status
    };

    onAddRecord(newRecord);
    setShowForm(false);
    
    // reset form
    setDescription('');
    setAmount('');
    setCategory('Serviços');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Finance calculations
  const receitasPagas = finances
    .filter(f => f.type === 'receita' && f.status === 'pago')
    .reduce((sum, f) => sum + f.amount, 0);

  const despesasPagas = finances
    .filter(f => f.type === 'despesa' && f.status === 'pago')
    .reduce((sum, f) => sum + f.amount, 0);

  const saldoLiquido = receitasPagas - despesasPagas;

  const contasAReceber = finances
    .filter(f => f.type === 'receita' && f.status === 'pendente')
    .reduce((sum, f) => sum + f.amount, 0);

  const contasAPagar = finances
    .filter(f => f.type === 'despesa' && f.status === 'pendente')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Finance Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Coins className="w-5.5 h-5.5 text-amber-500" />
            Controladoria & Fluxo Financeiro (Financeiro)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Análise e registro de fluxo de caixa (receitas e despesas), autorização de contas a pagar e receber, e reconciliação bancária de conciliação.
          </p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Lançar Movimentação
        </button>
      </div>

      {/* FINANCE HIGHLIGHT REPORTING GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Cash balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Caixa Realizado Líquido</span>
          <span className={`text-2xl font-bold font-display block ${saldoLiquido >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {formatCurrency(saldoLiquido)}
          </span>
          <p className="text-[10px] text-slate-400 mt-2">Diferença de valores liquidados (pagos).</p>
        </div>

        {/* Total revenues */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 bg-emerald-50/10 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Receitas Realizadas</span>
          <span className="text-2xl font-bold font-display text-slate-900 block">{formatCurrency(receitasPagas)}</span>
          <span className="text-[10px] text-emerald-600 font-medium block mt-2">+{formatCurrency(contasAReceber)} em aberto</span>
        </div>

        {/* Total expenses */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 bg-rose-50/10 shadow-sm">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block mb-1">Despesas Liquidadas</span>
          <span className="text-2xl font-bold font-display text-slate-900 block">{formatCurrency(despesasPagas)}</span>
          <span className="text-[10px] text-rose-600 font-medium block mt-2">-{formatCurrency(contasAPagar)} agendadas</span>
        </div>

        {/* Bank reconciliation progress */}
        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Conciliação Bancária</span>
          <span className="text-2xl font-bold text-indigo-700 font-display block">
            {reconciliationItems.filter(i => i.match).length} / {reconciliationItems.length} Match
          </span>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full" 
              style={{ width: `${(reconciliationItems.filter(i => i.match).length / reconciliationItems.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Ledger Form Overlay */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-xl animate-fadeIn">
          <h3 className="font-bold text-sm text-slate-800 mb-4 pb-1 border-b border-slate-100">Lançamento de Entrada / Saída de Caixa</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Movimento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('receita')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      type === 'receita' 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Receita (Entrada)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('despesa')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      type === 'despesa'
                        ? 'bg-rose-500 border-rose-500 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    Despesa (Saída)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Valor Unitário (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Ex:: 12000" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-200 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição / Histórico Contábil *</label>
              <input 
                type="text" 
                placeholder="Ex:: Assinatura Trimestral Cloud Server" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria Contábil</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500"
                >
                  <option value="Vendas Serviços">Vendas Serviços</option>
                  <option value="Mensalidades SaaS">Mensalidades SaaS</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="RH / Salários">RH / Salários CLT</option>
                  <option value="Serviços de Terceiros">Serviços de Terceiros</option>
                  <option value="Escritório / Custos Fixos">Escritório / Custos Fixos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Base</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as FinancialRecord['status'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-amber-500"
                >
                  <option value="pago">Liquidado (Pago)</option>
                  <option value="pendente">Aberto (Agendado)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Data Lançamento</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
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
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Registrar Lançamento
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LEDGER TRANSACTIONS LIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Livro Razão Corporativo (Lançamentos de Caixa)</h3>
          <span className="text-xs text-slate-400">{finances.length} transações</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Descrição da Atividade</th>
                <th className="px-5 py-3">Categoria</th>
                <th className="px-5 py-3 text-center">Fluxo</th>
                <th className="px-5 py-3 text-right">Valor Unitário</th>
                <th className="px-5 py-3 text-center">Liquidação</th>
                <th className="px-5 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...finances].sort((a, b) => b.date.localeCompare(a.date)).map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-slate-400 text-[11px]">
                    {f.date.split('-').reverse().join('/')}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-800">{f.description}</td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200/40">
                      {f.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {f.type === 'receita' ? (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                        <ArrowUpRight className="w-3.5 h-3.5" /> Entrada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">
                        <ArrowDownRight className="w-3.5 h-3.5" /> Saída
                      </span>
                    )}
                  </td>
                  <td className={`px-5 py-4 text-right font-bold text-sm ${f.type === 'receita' ? 'text-slate-850' : 'text-slate-700'}`}>
                    {f.type === 'receita' ? '+' : '-'}{formatCurrency(f.amount)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {f.status === 'pago' ? (
                      <span className="text-emerald-700 font-extrabold text-[10px] uppercase">Liquidado</span>
                    ) : (
                      <button
                        onClick={() => onUpdateRecordStatus(f.id, 'pago')}
                        className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer hover:bg-amber-200 hover:text-amber-950"
                        title="Marcar como Pago"
                      >
                        Pendente (Autorizar)
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm('Excluir este lançamento contábil definitivamente?')) {
                          onDeleteRecord(f.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECONCILIATION SIMULATION WIDGET */}
      {showChecklist && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Simulador de Conciliação Bancária Integrada</h3>
              <p className="text-xs text-slate-400">Verifique se o extrato da conta PJ da empresa corresponde aos lançamentos internos do SGCI.</p>
            </div>
            <button 
              onClick={() => setShowChecklist(false)} 
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Ocultar Painel
            </button>
          </div>

          <div className="space-y-3">
            {reconciliationItems.map((item) => (
              <div key={item.id} className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-start gap-2.5">
                  <span className={`p-1.5 rounded-lg shrink-0 ${item.match ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {item.match ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{item.docName}</h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Processamento eletrônico automatizado via API</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs font-bold text-slate-800">{formatCurrency(item.val)}</span>
                  <div>
                    {item.match ? (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold border border-emerald-100">
                        CONCILIADO OK
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setReconciliationItems(
                            reconciliationItems.map(ri => ri.id === item.id ? { ...ri, match: true } : ri)
                          );
                        }}
                        className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg active:scale-95 hover:bg-indigo-700 transition-all cursor-pointer"
                      >
                        Autorizar Match Manual
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
