/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  Star, 
  UserPlus, 
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Employee } from '../types';

interface RecursosHumanosProps {
  employees: Employee[];
  onAddEmployee: (emp: Employee) => void;
  onUpdateVacationStatus: (id: string, status: Employee['vacationStatus']) => void;
  onUpdatePerformance: (id: string, rating: number) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function RecursosHumanos({
  employees,
  onAddEmployee,
  onUpdateVacationStatus,
  onUpdatePerformance,
  onDeleteEmployee
}: RecursosHumanosProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [sector, setSector] = useState('vendas');
  const [salary, setSalary] = useState('');
  const [hireDate, setHireDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !salary) return;

    const newEmp: Employee = {
      id: 'emp_' + Date.now(),
      name: name.trim(),
      role: role.trim(),
      sector: sector,
      salary: parseFloat(salary) || 0,
      hireDate: hireDate,
      vacationStatus: 'ativo',
      performanceRating: 5
    };

    onAddEmployee(newEmp);
    setShowForm(false);
    
    // reset form
    setName('');
    setRole('');
    setSalary('');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Human Resources stats calculations
  const totalEmployeesCount = employees.length;
  const activeStaff = employees.filter(e => e.vacationStatus === 'ativo').length;
  const totalPayrollValue = employees
    .filter(e => e.vacationStatus !== 'afastado')
    .reduce((sum, e) => sum + e.salary, 0);

  return (
    <div className="space-y-6">
      
      {/* RH Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
            <Users className="w-5.5 h-5.5 text-rose-600" />
            Recursos Humanos & Departamento de Pessoal (RH)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cadastro unificado de colaboradores, folha de salário estimada, programação de férias ordinárias e score de avaliação de clima.
          </p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Registrar Admissão
        </button>
      </div>

      {/* RENDER STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <span className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Users className="w-5 h-5" />
          </span>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Quadro Geral</span>
            <span className="text-xl font-bold text-slate-900 block mt-0.5">{totalEmployeesCount} Colaboradores</span>
            <span className="text-[10px] text-slate-400">{activeStaff} operando hoje</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </span>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Folha Mensal Estimada</span>
            <span className="text-xl font-bold text-slate-900 block mt-0.5">{formatCurrency(totalPayrollValue)}</span>
            <span className="text-[10px] text-slate-400">Encargos sociais sob alíquota padrão</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <span className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Star className="w-5 h-5" />
          </span>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Turnover & Clima</span>
            <span className="text-xl font-bold text-slate-900 block mt-0.5">★ 4.8 / 5.0</span>
            <span className="text-[10px] text-slate-400">Score de engajamento do período</span>
          </div>
        </div>
      </div>

      {/* Admissão New Employee Form overlay */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-xl animate-fadeIn">
          <h3 className="font-bold text-sm text-slate-800 mb-4 pb-1 border-b border-slate-100">Registrar Contratação de Empregado</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo do Candidato *</label>
              <input 
                type="text" 
                placeholder="Ex:: Aline Gomes Pereira" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-rose-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo de Admissão *</label>
                <input 
                  type="text" 
                  placeholder="Ex:: Analista Comercial" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Setor Designado</label>
                <select 
                  value={sector} 
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="vendas">Vendas & CRM</option>
                  <option value="marketing">Marketing & Growth</option>
                  <option value="rh">Recursos Humanos (RH)</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="producao">Produção & Estoque</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dotação Salarial Inicial (R$ CLT) *</label>
                <input 
                  type="number" 
                  placeholder="Ex:: 4500" 
                  value={salary} 
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data de Admissão</label>
                <input 
                  type="date" 
                  value={hireDate} 
                  onChange={(e) => setHireDate(e.target.value)}
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
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Efetivar Admissão
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EMPLOYEES DIRECTORY TABLE LIST */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Registro Central de Staff</h3>
          <span className="text-xs text-slate-500">{employees.length} registros cadastrados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Nome do Empregado</th>
                <th className="px-5 py-3.5">Cargo / Atribuição</th>
                <th className="px-5 py-3.5">Setor de Lotação</th>
                <th className="px-5 py-3.5 text-right">Salário Líquido</th>
                <th className="px-5 py-3.5 text-center">Data Posicionamento</th>
                <th className="px-5 py-3.5 text-center">Status Laboral</th>
                <th className="px-5 py-3.5 text-center">Avaliação (1-5★)</th>
                <th className="px-5 py-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-800 text-sm">{e.name}</td>
                  <td className="px-5 py-4 text-slate-600 font-medium">{e.role}</td>
                  <td className="px-5 py-4">
                    <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wide inline-block bg-slate-100/80 px-2 py-0.5 rounded-lg border border-slate-200/50">
                      {e.sector}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">{formatCurrency(e.salary)}</td>
                  <td className="px-5 py-4 text-center font-mono text-slate-400">
                    {e.hireDate.split('-').reverse().join('/')}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {e.vacationStatus === 'ativo' ? (
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider inline-block">Trabalhando</span>
                    ) : e.vacationStatus === 'ferias' ? (
                      <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider inline-block">Em Férias</span>
                    ) : (
                      <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider inline-block">Afastado</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => onUpdatePerformance(e.id, star)}
                          className="focus:outline-none cursor-pointer hover:scale-110 transition-transform"
                          title={`Classificar ${star} estrelas`}
                        >
                          <Star 
                            className={`w-3.5 h-3.5 ${
                              star <= e.performanceRating 
                                ? 'text-amber-400 fill-amber-400' 
                                : 'text-slate-200'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold">
                      
                      {/* Vacation Toggle */}
                      {e.vacationStatus === 'ativo' ? (
                        <button
                          onClick={() => onUpdateVacationStatus(e.id, 'ferias')}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-2.5 py-1 rounded-lg text-[10px] transition-all cursor-pointer"
                        >
                          Lançar Férias
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateVacationStatus(e.id, 'ativo')}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg text-[10px] transition-all cursor-pointer"
                        >
                          Retornar
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja simular o desligamento e exclusão de ${e.name}?`)) {
                            onDeleteEmployee(e.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"
                        title="Desligar colaborador"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
