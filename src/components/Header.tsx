/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Bell, 
  Search, 
  Calendar, 
  User as UserIcon, 
  ShieldCheck, 
  Menu, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { User, SystemConfig } from '../types';

interface HeaderProps {
  currentUser: User;
  config: SystemConfig;
  onSetSidebarOpen: () => void;
  activeView: string;
}

export default function Header({
  currentUser,
  config,
  onSetSidebarOpen,
  activeView
}: HeaderProps) {
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Nova lead registrada no funil do CRM.', read: false },
    { id: 2, text: 'Hiring: Aline Gomes adicionada sob folha CLT.', read: false },
    { id: 3, text: 'Alerta: Insulmo Polímero ABS Virgem próximo ao limite mínimo.', read: true }
  ]);
  const [showNotificationList, setShowNotificationList] = useState(false);

  const getBreadcrumb = () => {
    switch (activeView) {
      case 'dashboard': return 'Monitor Executivo / Geral';
      case 'vendas': return 'Vendas & CRM / Funil Comercial';
      case 'marketing': return 'Marketing & Growth / Campanhas';
      case 'rh': return 'Recursos Humanos / Quadro CLT';
      case 'financeiro': return 'Fluxo Financeiro / Livro Razão';
      case 'producao': return 'Operações & Estoque / OS Backlog';
      case 'live': return 'Sala de Controle Ao Vivo / Telemetria';
      case 'pipeline-leads': return 'Auditoria / Pipeline de Leads Pendentes';
      case 'admin': return 'Painel de Governança / Config';
      default: return 'Portal SGCI';
    }
  };

  const getSystemHour = () => {
    const d = new Date();
    return d.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4.5 flex justify-between items-center sticky top-0 z-30 shadow-xs">
      
      {/* Breadcrumb section */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onSetSidebarOpen}
          className="md:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest block font-display">
            {config.companyName || 'SGCI corporativo'}
          </h2>
          <span className="text-sm font-bold text-slate-800 block mt-0.5 animate-fadeIn">
            {getBreadcrumb()}
          </span>
        </div>
      </div>

      {/* Profile section with clock & bells */}
      <div className="flex items-center gap-4">
        
        {/* Date visual pill */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200/50 px-3 py-1.5 rounded-xl text-xs text-slate-500 font-medium">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="capitalize">{getSystemHour()}</span>
        </div>

        {/* Dynamic Multi-fator Indicator */}
        {currentUser.is2FAEnabled && (
          <div className="hidden sm:inline-flex items-center gap-1 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-sky-700 uppercase">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            2FA Ativo
          </div>
        )}

        {/* User context role badge wrapper */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-450 font-mono text-[10px] uppercase font-bold tracking-wider inline-block">Role:</span>
          {currentUser.role === 'admin' ? (
            <span className="bg-sky-100 text-sky-800 text-[9px] font-bold px-2 py-0.5 rounded border border-sky-200 uppercase tracking-wider block">
              Geral Administrador
            </span>
          ) : (
            <span className="bg-slate-105 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider block">
              Colaborador: {currentUser.sector}
            </span>
          )}
        </div>

        {/* Alert Notifications bell trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationList(!showNotificationList)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative cursor-pointer"
            title="Avisos e Alarmes"
          >
            <Bell className="w-4.5 h-4.5" />
            
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dialog of alerts notification popup */}
          {showNotificationList && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-scaleUp">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800">Alertas Operacionais</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                    className="text-[10px] text-brand-600 hover:underline font-semibold"
                  >
                    Marcar lidas
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 pr-1 max-h-56 overflow-y-auto">
                {notifications.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3 text-[11px] leading-snug transition-colors ${
                      item.read ? 'text-slate-505 bg-white' : 'text-slate-800 bg-sky-50/20 font-medium'
                    }`}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
