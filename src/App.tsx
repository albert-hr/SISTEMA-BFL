/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  INITIAL_USERS,
  INITIAL_SECTORS,
  INITIAL_LEADS,
  INITIAL_CAMPAIGNS,
  INITIAL_EMPLOYEES,
  INITIAL_FINANCES,
  INITIAL_ORDERS,
  INITIAL_STOCK,
  INITIAL_CONFIG
} from './mockData';
import { 
  User, 
  Sector, 
  ClientLead, 
  MarketingCampaign, 
  Employee, 
  FinancialRecord, 
  WorkOrder, 
  StockItem, 
  SystemConfig 
} from './types';

// Component imports
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardGlobal from './components/DashboardGlobal';
import VendasCRM from './components/VendasCRM';
import MarketingGrowth from './components/MarketingGrowth';
import RecursosHumanos from './components/RecursosHumanos';
import FinanceiroLedger from './components/FinanceiroLedger';
import ProducaoOperacoes from './components/ProducaoOperacoes';
import AdminPanel from './components/AdminPanel';
import ControleTempoReal from './components/ControleTempoReal';
import PipelineLeadsPendentes from './components/PipelineLeadsPendentes';

import { RefreshCw, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  // --- AUTHENTICATED USER SESSION ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sgci_session');
    return saved ? JSON.parse(saved) : null;
  });

  // --- CORPORATE DATABASE STATES ---
  const [users, setUsers] = useState<User[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [leads, setLeads] = useState<ClientLead[]>([]);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [config, setConfig] = useState<SystemConfig>(INITIAL_CONFIG);

  // Layout UI states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [dbSeeded, setDbSeeded] = useState(false);

  // --- 1. LOCAL STORAGE SEED & LOAD BOOTSTRAP ---
  useEffect(() => {
    // Users
    const storedUsers = localStorage.getItem('sgci_db_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(INITIAL_USERS);
      localStorage.setItem('sgci_db_users', JSON.stringify(INITIAL_USERS));
    }

    // Sectors
    const storedSectors = localStorage.getItem('sgci_db_sectors');
    if (storedSectors) {
      setSectors(JSON.parse(storedSectors));
    } else {
      setSectors(INITIAL_SECTORS);
      localStorage.setItem('sgci_db_sectors', JSON.stringify(INITIAL_SECTORS));
    }

    // Leads / CRM
    const storedLeads = localStorage.getItem('sgci_db_leads');
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    } else {
      setLeads(INITIAL_LEADS);
      localStorage.setItem('sgci_db_leads', JSON.stringify(INITIAL_LEADS));
    }

    // Campaigns
    const storedCampaigns = localStorage.getItem('sgci_db_campaigns');
    if (storedCampaigns) {
      setCampaigns(JSON.parse(storedCampaigns));
    } else {
      setCampaigns(INITIAL_CAMPAIGNS);
      localStorage.setItem('sgci_db_campaigns', JSON.stringify(INITIAL_CAMPAIGNS));
    }

    // Employees
    const storedEmployees = localStorage.getItem('sgci_db_employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      setEmployees(INITIAL_EMPLOYEES);
      localStorage.setItem('sgci_db_employees', JSON.stringify(INITIAL_EMPLOYEES));
    }

    // Finances
    const storedFinances = localStorage.getItem('sgci_db_finances');
    if (storedFinances) {
      setFinances(JSON.parse(storedFinances));
    } else {
      setFinances(INITIAL_FINANCES);
      localStorage.setItem('sgci_db_finances', JSON.stringify(INITIAL_FINANCES));
    }

    // Work Orders
    const storedOrders = localStorage.getItem('sgci_db_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('sgci_db_orders', JSON.stringify(INITIAL_ORDERS));
    }

    // Stock Items
    const storedStock = localStorage.getItem('sgci_db_stock');
    if (storedStock) {
      setStock(JSON.parse(storedStock));
    } else {
      setStock(INITIAL_STOCK);
      localStorage.setItem('sgci_db_stock', JSON.stringify(INITIAL_STOCK));
    }

    // System configurations
    const storedConfig = localStorage.getItem('sgci_db_config');
    if (storedConfig) {
      setConfig(JSON.parse(storedConfig));
    } else {
      setConfig(INITIAL_CONFIG);
      localStorage.setItem('sgci_db_config', JSON.stringify(INITIAL_CONFIG));
    }

    setDbSeeded(true);
  }, []);

  // --- 2. RESTORING COOLDOWN / ERASE ENGINE SIMULATOR ---
  const handleResetSandbox = () => {
    const confirm = window.confirm('Deseja realmente reiniciar todo o banco de dados corporativo local para os dados iniciais de fábrica? Desfará suas edições de teste.');
    if (confirm) {
      localStorage.clear();
      
      // Seed afresh
      setUsers(INITIAL_USERS);
      setSectors(INITIAL_SECTORS);
      setLeads(INITIAL_LEADS);
      setCampaigns(INITIAL_CAMPAIGNS);
      setEmployees(INITIAL_EMPLOYEES);
      setFinances(INITIAL_FINANCES);
      setOrders(INITIAL_ORDERS);
      setStock(INITIAL_STOCK);
      setConfig(INITIAL_CONFIG);
      
      localStorage.setItem('sgci_db_users', JSON.stringify(INITIAL_USERS));
      localStorage.setItem('sgci_db_sectors', JSON.stringify(INITIAL_SECTORS));
      localStorage.setItem('sgci_db_leads', JSON.stringify(INITIAL_LEADS));
      localStorage.setItem('sgci_db_campaigns', JSON.stringify(INITIAL_CAMPAIGNS));
      localStorage.setItem('sgci_db_employees', JSON.stringify(INITIAL_EMPLOYEES));
      localStorage.setItem('sgci_db_finances', JSON.stringify(INITIAL_FINANCES));
      localStorage.setItem('sgci_db_orders', JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem('sgci_db_stock', JSON.stringify(INITIAL_STOCK));
      localStorage.setItem('sgci_db_config', JSON.stringify(INITIAL_CONFIG));

      // Reset Active Session to Admin default for safety
      const defaultAdmin = INITIAL_USERS.find(u => u.email === 'albertyhenrique846@gmail.com') || INITIAL_USERS[0];
      setCurrentUser(defaultAdmin);
      localStorage.setItem('sgci_session', JSON.stringify(defaultAdmin));
      
      setActiveView('dashboard');
      alert('Banco de dados corporativo restaurado!');
    }
  };

  // --- 3. SESSION MUTATIONS ---
  const handleLoginSuccess = (userSession: User) => {
    setCurrentUser(userSession);
    localStorage.setItem('sgci_session', JSON.stringify(userSession));
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sgci_session');
  };

  const handleRegisterUser = (newUser: User) => {
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('sgci_db_users', JSON.stringify(updated));
  };

  // --- 4. BACKEND BUSINESS MUTATIONS (Saves to state & Syncs localStorage) ---
  
  // CRM Leads Mutations
  const handleAddLead = (newLead: ClientLead) => {
    const updated = [newLead, ...leads];
    setLeads(updated);
    localStorage.setItem('sgci_db_leads', JSON.stringify(updated));
  };
  
  const handleUpdateLeadStatus = (leadId: string, status: ClientLead['status']) => {
    const updated = leads.map(l => l.id === leadId ? { ...l, status, lastInteraction: new Date().toISOString().split('T')[0] } : l);
    setLeads(updated);
    localStorage.setItem('sgci_db_leads', JSON.stringify(updated));
  };

  const handleUpdateLeadDetails = (leadId: string, updatedFields: Partial<ClientLead>) => {
    const updated = leads.map(l => l.id === leadId ? { ...l, ...updatedFields, lastInteraction: new Date().toISOString().split('T')[0] } : l);
    setLeads(updated);
    localStorage.setItem('sgci_db_leads', JSON.stringify(updated));
  };

  const handleDeleteLead = (leadId: string) => {
    const updated = leads.filter(l => l.id !== leadId);
    setLeads(updated);
    localStorage.setItem('sgci_db_leads', JSON.stringify(updated));
  };

  // Campaigns Mutations
  const handleAddCampaign = (newCamp: MarketingCampaign) => {
    const updated = [newCamp, ...campaigns];
    setCampaigns(updated);
    localStorage.setItem('sgci_db_campaigns', JSON.stringify(updated));
  };

  const handleUpdateCampaignStatus = (id: string, status: MarketingCampaign['status']) => {
    const updated = campaigns.map(c => c.id === id ? { ...c, status } : c);
    setCampaigns(updated);
    localStorage.setItem('sgci_db_campaigns', JSON.stringify(updated));
  };

  const handleDeleteCampaign = (id: string) => {
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    localStorage.setItem('sgci_db_campaigns', JSON.stringify(updated));
  };

  // Employees Mutations
  const handleAddEmployee = (newEmp: Employee) => {
    const updated = [newEmp, ...employees];
    setEmployees(updated);
    localStorage.setItem('sgci_db_employees', JSON.stringify(updated));
  };

  const handleUpdateVacationStatus = (id: string, status: Employee['vacationStatus']) => {
    const updated = employees.map(e => e.id === id ? { ...e, vacationStatus: status } : e);
    setEmployees(updated);
    localStorage.setItem('sgci_db_employees', JSON.stringify(updated));
  };

  const handleUpdatePerformance = (id: string, rating: number) => {
    const updated = employees.map(e => e.id === id ? { ...e, performanceRating: rating } : e);
    setEmployees(updated);
    localStorage.setItem('sgci_db_employees', JSON.stringify(updated));
  };

  const handleDeleteEmployee = (id: string) => {
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    localStorage.setItem('sgci_db_employees', JSON.stringify(updated));
  };

  // Ledger Mutations
  const handleAddFinanceRecord = (newRec: FinancialRecord) => {
    const updated = [newRec, ...finances];
    setFinances(updated);
    localStorage.setItem('sgci_db_finances', JSON.stringify(updated));
  };

  const handleUpdateFinanceStatus = (id: string, status: FinancialRecord['status']) => {
    const updated = finances.map(f => f.id === id ? { ...f, status } : f);
    setFinances(updated);
    localStorage.setItem('sgci_db_finances', JSON.stringify(updated));
  };

  const handleDeleteFinanceRecord = (id: string) => {
    const updated = finances.filter(f => f.id !== id);
    setFinances(updated);
    localStorage.setItem('sgci_db_finances', JSON.stringify(updated));
  };

  // Work Orders Mutations
  const handleAddWorkOrder = (newOrder: WorkOrder) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('sgci_db_orders', JSON.stringify(updated));
  };

  const handleUpdateOrderStatus = (id: string, status: WorkOrder['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('sgci_db_orders', JSON.stringify(updated));
  };

  const handleDeleteOrder = (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    localStorage.setItem('sgci_db_orders', JSON.stringify(updated));
  };

  // Inventory/Stock restocking
  const handleRestockItem = (id: string, qtyToAdd: number) => {
    const updated = stock.map(s => s.id === id ? { ...s, quantity: s.quantity + qtyToAdd } : s);
    setStock(updated);
    localStorage.setItem('sgci_db_stock', JSON.stringify(updated));
  };

  // Admin Configurations Sync
  const handleUpdateUsersList = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('sgci_db_users', JSON.stringify(updatedUsers));
  };

  const handleUpdateSectorsList = (updatedSectors: Sector[]) => {
    setSectors(updatedSectors);
    localStorage.setItem('sgci_db_sectors', JSON.stringify(updatedSectors));
  };

  const handleUpdateConfigItem = (updatedConfig: SystemConfig) => {
    setConfig(updatedConfig);
    localStorage.setItem('sgci_db_config', JSON.stringify(updatedConfig));
  };

  // --- 5. RENDER CHANNELS DETECTOR (RBAC PROTECTOR) ---
  const renderActiveView = () => {
    if (!currentUser) return null;
    const isAdmin = currentUser.role === 'admin';
    const sectorKey = currentUser.sector;

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardGlobal
            sectors={sectors}
            leads={leads}
            campaigns={campaigns}
            employees={employees}
            finances={finances}
            orders={orders}
            stock={stock}
            currentUser={currentUser}
          />
        );

      case 'vendas':
        if (!isAdmin && sectorKey !== 'vendas') return <ForbiddenView />;
        return (
          <VendasCRM
            leads={leads}
            onAddLead={handleAddLead}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onDeleteLead={handleDeleteLead}
          />
        );

      case 'marketing':
        if (!isAdmin && sectorKey !== 'marketing') return <ForbiddenView />;
        return (
          <MarketingGrowth
            campaigns={campaigns}
            onAddCampaign={handleAddCampaign}
            onUpdateCampaignStatus={handleUpdateCampaignStatus}
            onDeleteCampaign={handleDeleteCampaign}
          />
        );

      case 'rh':
        if (!isAdmin && sectorKey !== 'rh') return <ForbiddenView />;
        return (
          <RecursosHumanos
            employees={employees}
            onAddEmployee={handleAddEmployee}
            onUpdateVacationStatus={handleUpdateVacationStatus}
            onUpdatePerformance={handleUpdatePerformance}
            onDeleteEmployee={handleDeleteEmployee}
          />
        );

      case 'financeiro':
        if (!isAdmin && sectorKey !== 'financeiro') return <ForbiddenView />;
        return (
          <FinanceiroLedger
            finances={finances}
            onAddRecord={handleAddFinanceRecord}
            onUpdateRecordStatus={handleUpdateFinanceStatus}
            onDeleteRecord={handleDeleteFinanceRecord}
          />
        );

      case 'producao':
        if (!isAdmin && sectorKey !== 'producao') return <ForbiddenView />;
        return (
          <ProducaoOperacoes
            orders={orders}
            stock={stock}
            onAddOrder={handleAddWorkOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onRestockItem={handleRestockItem}
          />
        );

      case 'live':
        if (!isAdmin) return <ForbiddenView />;
        return (
          <ControleTempoReal
            sectors={sectors}
            leads={leads}
            campaigns={campaigns}
            employees={employees}
            finances={finances}
            orders={orders}
            stock={stock}
            currentUser={currentUser}
            onAddLead={handleAddLead}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onAddFinanceRecord={handleAddFinanceRecord}
            onAddOrder={handleAddWorkOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onRestockItem={handleRestockItem}
            onUpdatePerformance={handleUpdatePerformance}
          />
        );

      case 'pipeline-leads':
        if (!isAdmin) return <ForbiddenView />;
        return (
          <PipelineLeadsPendentes
            leads={leads}
            sectors={sectors}
            employees={employees}
            currentUser={currentUser}
            onUpdateLeadDetails={handleUpdateLeadDetails}
            onAddLead={handleAddLead}
          />
        );

      case 'admin':
        if (!isAdmin) return <ForbiddenView />;
        return (
          <AdminPanel
            users={users}
            sectors={sectors}
            config={config}
            onUpdateUsers={handleUpdateUsersList}
            onUpdateSectors={handleUpdateSectorsList}
            onUpdateConfig={handleUpdateConfigItem}
            currentUser={currentUser}
          />
        );

      default:
        return <div className="text-center py-10 font-bold text-slate-400">View Desconhecida</div>;
    }
  };

  // If DB hasn't finished seeding, display sleek loading splash
  if (!dbSeeded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white gap-4">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
        <span className="text-xs font-mono tracking-widest text-slate-500 uppercase">Inicializando Sistema SGCI...</span>
      </div>
    );
  }

  // --- RENDER UNCONNECTED/LOGIN COMPONENT ---
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Auth 
          onLoginSuccess={handleLoginSuccess} 
          users={users} 
          onRegisterUser={handleRegisterUser} 
        />
      </div>
    );
  }

  // --- RENDER MAIN LAYOUT WRAPPER ---
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Side collapsible navigation link tree */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        currentUser={currentUser}
        onLogout={handleLogout}
        sectors={sectors}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Backdrop overlay for mobile layout */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-35 md:hidden"
        />
      )}

      {/* Main active container */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'pl-0 md:pl-64' : 'pl-0 md:pl-20'}`}>
        
        {/* Dynamic header pane */}
        <Header
          currentUser={currentUser}
          config={config}
          onSetSidebarOpen={() => setSidebarOpen(!sidebarOpen)}
          activeView={activeView}
        />

        {/* Dynamic primary content viewport */}
        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Corporate legalities footer */}
        <footer className="px-6 py-4 border-t border-slate-200/60 bg-white/50 text-[10px] text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            © 2026 {config.companyName || 'SGCI Premium S/A'}. Todos os direitos reservados.
          </span>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-500">Sandbox Administrativo Ativo</span>
            <button
              onClick={handleResetSandbox}
              className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              title="Restaurar dados iniciais do dashboard"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Resetar Banco de Dados de Teste
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Forbidden View Component for unauthorized sector browsing
function ForbiddenView() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-2xl text-center shadow-xs">
      <div className="text-red-500 bg-red-50 border border-red-100 p-4 rounded-full mb-4 animate-bounce">
        ⚠️
      </div>
      <h3 className="font-bold text-slate-800 text-base font-display">Acesso Restrito ao Setor</h3>
      <p className="text-xs text-slate-500 mt-2 max-w-md leading-relaxed font-sans">
        Lamentamos, mas suas credenciais de <strong>Colaborador Comum</strong> não possuem as permissões autorizadas necessárias para abrir este departamento. Solicite suporte ao Administrador Geral no SGCI.
      </p>
    </div>
  );
}
