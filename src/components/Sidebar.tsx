/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Building, 
  Layers, 
  Briefcase, 
  Megaphone, 
  Users, 
  Coins, 
  Wrench, 
  ShieldAlert,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Activity,
  Clock
} from 'lucide-react';
import { User, Sector } from '../types';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentUser: User;
  onLogout: () => void;
  sectors: Sector[];
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

export default function Sidebar({
  activeView,
  onNavigate,
  currentUser,
  onLogout,
  sectors,
  sidebarOpen,
  setSidebarOpen
}: SidebarProps) {
  const isAdmin = currentUser.role === 'admin';
  const assignedSector = currentUser.sector;

  // Navigation Links definition
  const menuItems = [
    { key: 'dashboard', label: 'Monitor Executivo', icon: Layers, roles: ['admin', 'user'], visible: true },
    { key: 'vendas', label: 'CRM & Vendas', icon: Briefcase, roles: ['admin'], sector: 'vendas' },
    { key: 'marketing', label: 'Marketing & Ads', icon: Megaphone, roles: ['admin'], sector: 'marketing' },
    { key: 'rh', label: 'Gestão de Pessoal', icon: Users, roles: ['admin'], sector: 'rh' },
    { key: 'financeiro', label: 'Fluxo Financeiro', icon: Coins, roles: ['admin'], sector: 'financeiro' },
    { key: 'producao', label: 'Operações & Estoque', icon: Wrench, roles: ['admin'], sector: 'producao' },
  ];

  // Check if user has permission to click a specific menu item
  const hasAccess = (item: typeof menuItems[0]) => {
    if (isAdmin) return true;
    
    // Non-admin can only access the "dashboard" and their "assigned sector" menu item
    if (item.key === 'dashboard') return true;
    return assignedSector === item.sector;
  };

  const handleNavigate = (view: string) => {
    onNavigate(view);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-screen bg-slate-900 text-white z-40 flex flex-col justify-between border-r border-slate-800 transition-all duration-300 
        ${sidebarOpen 
          ? 'w-64 translate-x-0' 
          : 'w-64 -translate-x-full md:w-20 md:translate-x-0'
        }
      `}
    >
      
      {/* Top logo branding */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="p-2.5 bg-brand-600 rounded-xl text-white shrink-0">
            <Building className="w-5.5 h-5.5 text-sky-300" />
          </div>
          {sidebarOpen && (
            <div className="animate-fadeIn">
              <h1 className="text-sm font-extrabold font-display tracking-tight text-white uppercase">SGCI Premium</h1>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">Enterprise Suite</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation menus */}
      <div className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest px-3 mb-2">
          {sidebarOpen ? 'Menu Corporativo' : 'Menu'}
        </div>

        {menuItems.map((item) => {
          const isSelected = activeView === item.key;
          const allowed = hasAccess(item);

          if (!allowed) return null; // Hide other sectors if user has restricted role

          return (
            <button
              key={item.key}
              onClick={() => handleNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group cursor-pointer ${
                isSelected 
                  ? 'bg-brand-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-sky-300' : 'text-slate-400 group-hover:text-white'}`} />
              
              {sidebarOpen ? (
                <span className="truncate">{item.label}</span>
              ) : (
                /* Tooltip for collapsed mode */
                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}

        {/* Separator for Restricted Area/Admin Tab */}
        {isAdmin && (
          <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-1">
            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest px-3 mb-2">
              {sidebarOpen ? 'Configuração' : 'Adm'}
            </div>
            <button
              onClick={() => handleNavigate('live')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group cursor-pointer ${
                activeView === 'live' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-white" />
              {sidebarOpen ? (
                <span>Sala de Controle Ao Vivo</span>
              ) : (
                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Sala de Controle Ao Vivo
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavigate('pipeline-leads')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group cursor-pointer ${
                activeView === 'pipeline-leads' 
                  ? 'bg-rose-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-white" />
              {sidebarOpen ? (
                <span>Pipeline de Leads Pendentes</span>
              ) : (
                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Leads Pendentes (Real-time)
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavigate('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group cursor-pointer ${
                activeView === 'admin' 
                  ? 'bg-sky-600 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-white" />
              {sidebarOpen ? (
                <span>Painel Administrador</span>
              ) : (
                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-950 text-white text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  Painel Administrador
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Bottom user status & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-3.5">
        
        {/* Visual card for user if open */}
        {sidebarOpen && (
          <div className="p-3 bg-slate-800/40 border border-slate-800/50 rounded-xl flex items-center gap-2.5">
            <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center font-bold text-white uppercase text-sm border border-slate-600 shrink-0">
              {currentUser.name.slice(0,2)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate leading-snug">{currentUser.name}</h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition-all group cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-rose-400" />
          {sidebarOpen && <span>Encerrar Sessão</span>}
        </button>

        {/* Small toggle icon to fold sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex items-center justify-center w-full text-slate-500 hover:text-slate-300 text-xs py-0.5"
          title={sidebarOpen ? "Recolher Menu" : "Expandir Menu"}
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
