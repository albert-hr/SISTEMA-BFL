/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
  users: User[];
  onRegisterUser: (newUser: User) => void;
}

export default function Auth({ onLoginSuccess, users, onRegisterUser }: AuthProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedSector, setSelectedSector] = useState('vendas');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // 2FA state simulation
  const [show2FA, setShow2FA] = useState(false);
  const [code2FA, setCode2FA] = useState('');
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  // Recovery email
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // Email confirmation simulation
  const [showEmailActivationNotification, setShowEmailActivationNotification] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    const foundUser = users.find(u => u.email.toLowerCase() === trimmedEmail && u.password === password);

    if (!foundUser) {
      setErrorMsg('E-mail ou senha incorretos. Tente com um dos acessos rápidos abaixo.');
      return;
    }

    if (foundUser.is2FAEnabled) {
      // Prompt for 2FA code
      setPendingUser(foundUser);
      setShow2FA(true);
    } else {
      onLoginSuccess(foundUser);
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (code2FA === '123456' || code2FA.trim().length === 6) {
      if (pendingUser) {
        onLoginSuccess(pendingUser);
      }
    } else {
      setErrorMsg('Código 2FA incorreto! Dica: use o código temporário mostrado acima (123456).');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const alreadyExists = users.some(u => u.email.toLowerCase() === trimmedEmail);
    if (alreadyExists) {
      setErrorMsg('Este e-mail já está cadastrado no sistema corporativo.');
      return;
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: trimmedEmail,
      password: password,
      sector: selectedSector,
      role: 'user', // Default registered users are regular users. Admin can change this.
      is2FAEnabled: false
    };

    onRegisterUser(newUser);
    
    // Simulate email confirmation
    setShowEmailActivationNotification(trimmedEmail);
    setSuccessMsg('Cadastro realizado com sucesso! Um e-mail de ativação foi enviado.');
    
    // Switch state
    setName('');
    setPassword('');
    // Keep email for login
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!recoveryEmail.trim()) {
      setErrorMsg('Preencha seu e-mail corporativo.');
      return;
    }

    setRecoverySent(true);
    setSuccessMsg(`Solicitação enviada! Verifique o link de redefinição enviado para: ${recoveryEmail}`);
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
    setSuccessMsg('');
    setShow2FA(false);

    // Auto submit feeling
    const foundUser = users.find(u => u.email.toLowerCase() === demoEmail.toLowerCase() && u.password === demoPass);
    if (foundUser) {
      if (foundUser.is2FAEnabled) {
        setPendingUser(foundUser);
        setShow2FA(true);
      } else {
        onLoginSuccess(foundUser);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-8 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/50 overflow-hidden transition-all duration-300">
        
        {/* Banner Header */}
        <div className="bg-slate-900 px-6 py-8 text-center text-white relative">
          <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Offline Sandbox
          </div>
          <div className="inline-flex p-3 bg-brand-600/10 text-brand-400 rounded-xl mb-3 border border-brand-500/20">
            <Building className="w-7 h-7 text-sky-400" />
          </div>
          <h2 className="text-2xl font-semibold font-display tracking-tight text-white">SGCI Corporativo</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
            Sistema de Gestão Corporativa Integrada para múltiplos setores corporativos.
          </p>
        </div>

        {/* Email activation popup simulation (Toast Style) */}
        {showEmailActivationNotification && (
          <div className="m-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Simulador de E-mail de Ativação</span>
            </div>
            <p>
              Prezado colaborador, enviamos um link criptografado para <strong>{showEmailActivationNotification}</strong>.
            </p>
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setShowEmailActivationNotification(null);
                  setActiveTab('login');
                }}
                className="bg-emerald-600 text-white rounded px-2.5 py-1 font-medium hover:bg-emerald-700 active:scale-95 transition-all"
              >
                Simular Ativação (Logar Agora)
              </button>
            </div>
          </div>
        )}

        {/* Main interactive state panels */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && !showEmailActivationNotification && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {show2FA ? (
            /* 2FA Form Simulation */
            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-800 mb-2">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" /> Autenticação Multi-Fator (2FA) Ativa
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Para garantir a segurança desta conta administrativa, insira o token gerado no seu dispositivo.
                </p>
                <p className="mt-2 text-[11px] font-mono text-sky-700 bg-white/60 p-1.5 rounded text-center border border-sky-100">
                  TOKEN DE TESTE RÁPIDO: <strong className="text-sky-900 select-all">123456</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Código de Verificação (6 dígitos)</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={code2FA}
                  onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-widest font-mono text-xl py-2.5 px-4 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShow2FA(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium shadow-md shadow-brand-500/10 active:scale-95 transition-all text-center"
                >
                  Confirmar 2FA
                </button>
              </div>
            </form>
          ) : activeTab === 'login' ? (
            /* Login panel */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="email@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Senha de Acesso</label>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryEmail(email);
                      setActiveTab('recover');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-xs font-medium text-brand-600 hover:underline"
                  >
                    Esqueceu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/10 active:scale-95 transition-all cursor-pointer"
              >
                Autenticar no SGCI
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Novo colaborador? </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  Solicitar Cadastro
                </button>
              </div>
            </form>
          ) : activeTab === 'register' ? (
            /* Register panel */
            <form onSubmit={handleRegister} className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="nome.sobrenome@sgci.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Senha Corporativa (mín. 6 dígitos)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Mínimo de 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Setor de Atuação</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none appearance-none"
                  >
                    <option value="vendas">Vendas & CRM</option>
                    <option value="marketing">Marketing & Growth</option>
                    <option value="rh">Recursos Humanos (RH)</option>
                    <option value="financeiro">Financeiro</option>
                    <option value="producao">Produção & Estoque</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium tracking-wide shadow-md hover:shadow-slate-900/10 active:scale-95 transition-all text-center"
              >
                Cadastrar Colaborador
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500">Já tem uma conta? </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  Fazer Login
                </button>
              </div>
            </form>
          ) : (
            /* Forgot Password panel */
            <form onSubmit={handleRecoverySubmit} className="space-y-4 animate-fadeIn">
              <div className="text-xs text-slate-600 leading-relaxed">
                Insira o seu e-mail corporativo cadastrado, e simularemos o envio imediato da chave segura para redefinir as credenciais.
              </div>

              {recoverySent ? (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-3">
                  <p className="text-xs text-amber-900 font-semibold flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" /> Link de Redefinição Gerado!
                  </p>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    [E-mail de Teste]: Clique no botão abaixo para simular a mudança de senha diretamente para <code className="bg-white/80 px-1 py-0.5 rounded border border-slate-200">senha123</code>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(recoveryEmail);
                      setPassword('senha123');
                      setActiveTab('login');
                      setRecoverySent(false);
                      setSuccessMsg('Senha resetada com sucesso para "senha123"! Use-a para entrar.');
                    }}
                    className="w-full text-center bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium py-1.5 rounded-lg active:scale-95 transition-all"
                  >
                    Simular Restauração Automática
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">E-mail Registrado</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="colaborador@sgci.com"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                    setRecoverySent(false);
                  }}
                  className="flex-1 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all"
                >
                  Voltar ao Login
                </button>
                {!recoverySent && (
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold active:scale-95 transition-all"
                  >
                    Recuperar Senha
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* ACCESS SHORTCUTS FOR CONVENIENT TESTING - HIGHLY UX COMPLIANT */}
        <div className="bg-slate-50 border-t border-slate-100 p-4.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Acesso Rápido - Perfis Homologados para Teste:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('albertyhenrique846@gmail.com', 'senha123')}
              className="p-2 text-left bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col justify-between h-16 group"
            >
              <span className="font-semibold text-slate-800 line-clamp-1 group-hover:text-brand-600">Alberty Henrique</span>
              <span className="text-[10px] text-indigo-600 font-medium">Administrador (2FA)</span>
            </button>
            <button
              onClick={() => handleQuickLogin('admin@sgci.com', 'admin123')}
              className="p-2 text-left bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col justify-between h-16 group"
            >
              <span className="font-semibold text-slate-800 line-clamp-1 group-hover:text-brand-600">Administrador Geral</span>
              <span className="text-[10px] text-pink-600 font-medium">Administrador (Direto)</span>
            </button>
            <button
              onClick={() => handleQuickLogin('carlos@sgci.com', 'user123')}
              className="p-2 text-left bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col justify-between h-16 group"
            >
              <span className="font-semibold text-slate-800 line-clamp-1 group-hover:text-brand-600">Carlos Viana</span>
              <span className="text-[10px] text-emerald-600 font-medium">Usuário Comum: Vendas</span>
            </button>
            <button
              onClick={() => handleQuickLogin('mariana@sgci.com', 'user123')}
              className="p-2 text-left bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col justify-between h-16 group"
            >
              <span className="font-semibold text-slate-800 line-clamp-1 group-hover:text-brand-600">Mariana Costa</span>
              <span className="text-[10px] text-amber-600 font-medium">Usuário Comum: Marketing</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center italic">
            Colaboradores de Vendas, Marketing, RH, Financeiro ou Produção terão acessos restritos apenas aos seus respectivos setores.
          </p>
        </div>
      </div>
    </div>
  );
}
