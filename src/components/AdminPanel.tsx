/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Layers, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  ToggleLeft,
  Mail,
  FolderPlus,
  Briefcase
} from 'lucide-react';
import { User, Sector, SystemConfig } from '../types';

interface AdminPanelProps {
  users: User[];
  sectors: Sector[];
  config: SystemConfig;
  onUpdateUsers: (updated: User[]) => void;
  onUpdateSectors: (updated: Sector[]) => void;
  onUpdateConfig: (updated: SystemConfig) => void;
  currentUser: User;
}

export default function AdminPanel({
  users,
  sectors,
  config,
  onUpdateUsers,
  onUpdateSectors,
  onUpdateConfig,
  currentUser
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<'users' | 'sectors' | 'config'>('users');

  // New User Form State
  const [showAddUser, setShowAddUser] = useState(false);
  const [usrName, setUsrName] = useState('');
  const [usrEmail, setUsrEmail] = useState('');
  const [usrPassword, setUsrPassword] = useState('senha123');
  const [usrSector, setUsrSector] = useState('vendas');
  const [usrRole, setUsrRole] = useState<'admin' | 'user'>('user');

  // New Sector Form State
  const [showAddSector, setShowAddSector] = useState(false);
  const [secName, setSecName] = useState('');
  const [secKey, setSecKey] = useState('');
  const [secDesc, setSecDesc] = useState('');
  const [secManager, setSecManager] = useState('');
  const [secColor, setSecColor] = useState('indigo');

  // Form errors
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. USER ACTIONS
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!usrName.trim() || !usrEmail.trim()) {
      setErrorMsg('Preencha os dados obrigatórios do colaborador.');
      return;
    }

    const trimmed = usrEmail.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === trimmed)) {
      setErrorMsg('Este e-mail corporativo já consta na base do SGCI.');
      return;
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: usrName.trim(),
      email: trimmed,
      password: usrPassword,
      sector: usrSector,
      role: usrRole,
      is2FAEnabled: false
    };

    onUpdateUsers([...users, newUser]);
    setSuccessMsg(`Colaborador ${usrName} inserido no quadro com sucesso!`);
    setShowAddUser(false);
    
    // reset form
    setUsrName('');
    setUsrEmail('');
    setUsrPassword('senha123');
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert('Você não pode excluir sua própria conta enquanto logado.');
      return;
    }
    const confirm = window.confirm('Excluir este login do banco de dados corporativo?');
    if (confirm) {
      onUpdateUsers(users.filter(u => u.id !== userId));
      setSuccessMsg('Colaborador removido com sucesso.');
    }
  };

  const handleToggleUserRole = (userId: string) => {
    if (userId === currentUser.id) {
      alert('Você não pode revogar o seu próprio perfil de Administrador.');
      return;
    }
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, role: (u.role === 'admin' ? 'user' : 'admin') as 'admin' | 'user' };
      }
      return u;
    });
    onUpdateUsers(updated);
    setSuccessMsg('Perfil/Cargo do colaborador atualizado.');
  };

  const handleUpdateUserSector = (userId: string, newSecKey: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, sector: newSecKey };
      }
      return u;
    });
    onUpdateUsers(updated);
    setSuccessMsg('Lotação do colaborador realocada.');
  };

  // 2. SECTOR ACTIONS
  const handleCreateSector = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!secName.trim() || !secKey.trim() || !secManager.trim()) {
      setErrorMsg('Dados obrigatórios em falta.');
      return;
    }

    const normalizedKey = secKey.trim().toLowerCase().replace(/\s+/g, '');
    if (sectors.some(s => s.key === normalizedKey)) {
      setErrorMsg('Uma divisão/setor já está portando esta chave única de registro.');
      return;
    }

    const newSector: Sector = {
      id: 'sec_' + Date.now(),
      name: secName.trim(),
      key: normalizedKey,
      description: secDesc.trim() || 'Sem detalhamento complementar.',
      manager: secManager.trim(),
      color: secColor
    };

    onUpdateSectors([...sectors, newSector]);
    setSuccessMsg(`Setor "${secName}" incluído dinamicamente!`);
    setShowAddSector(false);

    // reset form
    setSecName('');
    setSecKey('');
    setSecDesc('');
    setSecManager('');
  };

  const handleDeleteSector = (sectorId: string) => {
    const sectorToDelete = sectors.find(s => s.id === sectorId);
    if (!sectorToDelete) return;

    if (['vendas', 'marketing', 'rh', 'financeiro', 'producao'].includes(sectorToDelete.key)) {
      alert('Por diretrizes operacionais de segurança, os 5 setores padrão não podem ser deletados desta simulação.');
      return;
    }

    const confirm = window.confirm(`Deseja apagar permanentemente o setor "${sectorToDelete.name}"?`);
    if (confirm) {
      onUpdateSectors(sectors.filter(s => s.id !== sectorId));
      setSuccessMsg(`Setor "${sectorToDelete.name}" apagado da empresa.`);
    }
  };

  // 3. SYSTEM SETTINGS ACTIONS
  const handleSaveSettings = (updated: SystemConfig) => {
    onUpdateConfig(updated);
    setSuccessMsg('Configurações globais do sistema armazenadas com segurança.');
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Title Board */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden border border-slate-800 shadow-lg">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldAlert className="w-40 h-40" />
        </div>

        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full inline-block">
            Módulo Administrativo Restrito
          </span>
          <h2 className="text-2xl font-bold font-display tracking-tight text-white">Central de Governança Corporativa</h2>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Olá, <strong>{currentUser.name}</strong>. Adicione divisões, redefina níveis de privilégio (RBAC), controle notificações eletrônicas ou insira novos colaboradores licenciados.
          </p>
        </div>
      </div>

      {/* ADMIN LEVEL NOTIFICATIONS & MOCK SYSTEM FEEDBACKS */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SUBS-BAR NAVIGATION INTERFACE */}
      <div className="flex bg-white p-2.5 rounded-2xl border border-slate-200/85 shadow-xs justify-start gap-1">
        <button
          onClick={() => { setAdminTab('users'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'users' 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4.5 h-4.5" />
          Gerenciamento de Usuários ({users.length})
        </button>
        <button
          onClick={() => { setAdminTab('sectors'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'sectors' 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4.5 h-4.5" />
          Gerenciamento de Setores ({sectors.length})
        </button>
        <button
          onClick={() => { setAdminTab('config'); setErrorMsg(''); setSuccessMsg(''); }}
          className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'config' 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4.5 h-4.5" />
          Configurações Globais
        </button>
      </div>

      {/* PANEL CONTENTS */}
      {adminTab === 'users' && (
        /* TAB 1: USERS CRUD */
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Quadro Geral de Credenciais ativas</h3>
              <p className="text-xs text-slate-400">Total de {users.length} usuários autorizados a acessar os módulos do portal.</p>
            </div>
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Novo Usuário / Acesso
            </button>
          </div>

          {/* Form Create User */}
          {showAddUser && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md max-w-xl animate-fadeIn">
              <h4 className="font-bold text-slate-800 text-xs mb-3">Registrar Credencial de Colaborador</h4>
              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nome Completo</label>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={usrName}
                    onChange={(e) => setUsrName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">E-mail Operacional *</label>
                    <input
                      type="email"
                      placeholder="email@empresa.com"
                      value={usrEmail}
                      onChange={(e) => setUsrEmail(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Senha Padrão Provisória</label>
                    <input
                      type="password"
                      value={usrPassword}
                      onChange={(e) => setUsrPassword(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Setor Alocado</label>
                    <select
                      value={usrSector}
                      onChange={(e) => setUsrSector(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      {sectors.map(s => (
                        <option key={s.id} value={s.key}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Perfil de Privilégios (RBAC)</label>
                    <select
                      value={usrRole}
                      onChange={(e) => setUsrRole(e.target.value as 'admin' | 'user')}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="user">Usuário Comum (Acesso Limitado)</option>
                      <option value="admin">Administrador (Acesso Total)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddUser(false)}
                    className="px-3.5 py-1.5 border border-slate-200 rounded-lg"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg font-bold"
                  >
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Nome / Usuário</th>
                    <th className="px-5 py-3">E-mail de Acesso</th>
                    <th className="px-5 py-3 text-center">Setor de Lotação</th>
                    <th className="px-5 py-3 text-center">Privilégio</th>
                    <th className="px-5 py-3 text-center">Ações de Conta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-bold text-slate-800 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${u.role === 'admin' ? 'bg-sky-500' : 'bg-slate-300'}`}></span>
                        {u.name}
                        {u.id === currentUser.id && (
                          <span className="text-[9px] font-bold text-sky-850 bg-sky-50 border border-sky-200 px-1.5 py-0.2 rounded">Sessão Atual</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-500">{u.email}</td>
                      <td className="px-5 py-3.5 text-center">
                        <select
                          value={u.sector}
                          onChange={(e) => handleUpdateUserSector(u.id, e.target.value)}
                          className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 outline-none"
                        >
                          {sectors.map(secOpt => (
                            <option key={secOpt.id} value={secOpt.key}>{secOpt.name.split(' ')[0]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleUserRole(u.id)}
                          className={`font-semibold text-[10px] px-2.5 py-1 rounded inline-block cursor-pointer transition-all ${
                            u.role === 'admin' 
                              ? 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100' 
                              : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {u.role === 'admin' ? 'Administrador' : 'Colaborador Comum'}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={u.id === currentUser.id}
                          className={`p-1 text-slate-400 rounded hover:text-red-600 disabled:opacity-30`}
                          title="Excluir Colaborador"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {adminTab === 'sectors' && (
        /* TAB 2: SECTORS CRUD */
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Gestão de Divisões e Departamentos</h3>
              <p className="text-xs text-slate-400">Total de {sectors.length} divisões listadas no portal integrado.</p>
            </div>
            <button
              onClick={() => setShowAddSector(!showAddSector)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FolderPlus className="w-4.5 h-4.5" />
              Adicionar Setor
            </button>
          </div>

          {/* Form Create Sector */}
          {showAddSector && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md max-w-xl animate-fadeIn">
              <h4 className="font-bold text-slate-800 text-xs mb-3">Cadastrar Novo Setor</h4>
              <form onSubmit={handleCreateSector} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nome do Setor *</label>
                    <input
                      type="text"
                      placeholder="Ex: Comercial Atacado"
                      value={secName}
                      onChange={(e) => setSecName(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Chave Única do Setor (Código) *</label>
                    <input
                      type="text"
                      placeholder="Ex:: atacado"
                      value={secKey}
                      onChange={(e) => setSecKey(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Diretor / Gestor Encarregado *</label>
                    <input
                      type="text"
                      placeholder="Ex: Amanda Gontijo"
                      value={secManager}
                      onChange={(e) => setSecManager(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Esquema de Cor Visual</label>
                    <select
                      value={secColor}
                      onChange={(e) => setSecColor(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="emerald">Smaragd Emerald (Verde)</option>
                      <option value="indigo">Cool Indigo (Azul Escuro)</option>
                      <option value="rose">Soft Rose (Rosa)</option>
                      <option value="amber">Warm Amber (Laranja)</option>
                      <option value="blue">Electric Blue (Azul)</option>
                      <option value="pink">Plum Pink (Rosa Escuro)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Objetivos e Descrição Técnica do Setor</label>
                  <textarea
                    rows={2}
                    placeholder="Descrição das responsabilidades principais desta divisão..."
                    value={secDesc}
                    onChange={(e) => setSecDesc(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-sans resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddSector(false)}
                    className="px-3.5 py-1.5 border border-slate-200 rounded-lg"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg font-bold"
                  >
                    Salvar Setor
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Sectors list layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectors.map((sec) => {
              const isBase = ['vendas', 'marketing', 'rh', 'financeiro', 'producao'].includes(sec.key);

              return (
                <div key={sec.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full bg-${sec.color}-500 shadow-xs inline-block`} />
                        <h4 className="font-bold text-slate-800 text-base">{sec.name}</h4>
                      </div>

                      {isBase ? (
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Módulo Base Padrão
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDeleteSector(sec.id)}
                          className="text-slate-400 hover:text-red-500 rounded p-1 transition-all cursor-pointer"
                          title="Remover Setor customizado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-sans">{sec.description}</p>
                  </div>

                  <div className="border-t border-slate-100 mt-4 pt-3.5 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Gestor Diretor: <strong>{sec.manager}</strong></span>
                    <span className="text-slate-400 font-mono font-semibold">Chave: {sec.key}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {adminTab === 'config' && (
        /* TAB 3: CONFIG */
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs max-w-xl">
          <h3 className="font-bold text-slate-800 text-base mb-1">Configurações Globais do SGCI</h3>
          <p className="text-xs text-slate-400 mb-6">Controles operacionais e de conexões para a plataforma empresarial sandbox.</p>

          <div className="space-y-5 text-sm">
            
            {/* CompName */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Razão Social Corporativa (Nome)</label>
              <input
                type="text"
                value={config.companyName}
                onChange={(e) => onUpdateConfig({ ...config, companyName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-250 font-semibold rounded-xl text-xs text-slate-800"
              />
            </div>

            {/* Email dispatch placeholder */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Servidor de Despacho de E-mails corporativos</label>
              <input
                type="email"
                value={config.notificationEmail}
                onChange={(e) => onUpdateConfig({ ...config, notificationEmail: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-250 font-semibold rounded-xl text-xs text-slate-800"
              />
            </div>

            <hr className="border-slate-100" />

            {/* Toggles */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Autenticação 2FA Obrigatória para Administradores</span>
                  <span className="text-[11px] text-slate-400">Exigir inserção de código temporário de 6 dígitos no login do administrador.</span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ ...config, twoFactorRequired: !config.twoFactorRequired })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    config.twoFactorRequired ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span 
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      config.twoFactorRequired ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Permitir Auto-Cadastro de novos funcionários</span>
                  <span className="text-[11px] text-slate-400">Habilitar botão de cadastro de novos usuários na tela principal de login.</span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ ...config, allowSelfRegistration: !config.allowSelfRegistration })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    config.allowSelfRegistration ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span 
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      config.allowSelfRegistration ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveSettings(config)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wider hover:shadow transition-all cursor-pointer"
              >
                Salvar Configurações Globais
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
