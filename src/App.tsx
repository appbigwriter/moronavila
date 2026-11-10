import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ShieldAlert, Loader2, Eye } from 'lucide-react';

import { supabase } from './lib/supabase';
import {
  fetchResidents, fetchRooms, fetchPayments, fetchMaintenance,
  fetchComplaints, fetchNotices, fetchCalendarEvents, fetchLaundrySchedules, fetchDevices,
  fetchPropertyDescription, fetchCurrentResident
} from './lib/database';

import {
  Resident, Room, Payment, MaintenanceRequest,
  Complaint, Notice, CalendarEvent, UserRole, LaundrySchedule,
  PropertyDescription
} from './types';

import { Login } from './components/Login';
import { Layout } from './components/Layout';

import { DashboardView } from './views/DashboardView';
import { RoomsView } from './views/RoomsView';
import { ResidentsView } from './views/ResidentsView';
import { PaymentsView } from './views/PaymentsView';
import { MaintenanceView } from './views/MaintenanceView';
import { InternetView } from './views/InternetView';
import { ComplaintsView } from './views/ComplaintsView';
import { NoticesView } from './views/NoticesView';
import { CalendarView } from './views/CalendarView';
import { LaundryView } from './views/LaundryView';
import { PropertyDescView } from './views/PropertyDescView';
import { LandingPage } from './views/LandingPage';
import { RulesAcceptanceView } from './views/RulesAcceptanceView';
import { ResidentProfileView } from './views/ResidentProfileView';
import { ResidentDashboardView } from './views/ResidentDashboardView';

const SoftphoneDock = lazy(() =>
  import('./modules/softphone/SoftphoneDock').then((module) => ({
    default: module.SoftphoneDock,
  }))
);

function App() {
  const [session, setSession] = useState<any>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  // Controla se estamos vendo 'landing', 'login', 'app' (dashboard) ou 'regras'
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app' | 'regras'>('landing');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [initialModal, setInitialModal] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Resident | null>(null);
  const [selectedProfileResident, setSelectedProfileResident] = useState<Resident | null>(null);
  const [previewAsResident, setPreviewAsResident] = useState(false);

  // Data state
  const [residents, setResidents] = useState<Resident[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [laundrySchedules, setLaundrySchedules] = useState<LaundrySchedule[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [propertyDescription, setPropertyDescription] = useState<PropertyDescription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [authNotice, setAuthNotice] = useState('');

  const buildResidentDisabledMessage = (resident?: Resident | null, fallback?: string) => {
    const reason = resident?.motivo_bloqueio?.trim();
    if (reason) {
      return `Seu acesso ao aplicativo esta desabilitado no momento. Motivo: ${reason}`;
    }
    return fallback || 'Seu acesso ao aplicativo esta desabilitado no momento. Procure a administracao da casa.';
  };

  const handleResidentAccessDisabled = async (message: string) => {
    setCurrentUser(null);
    setResidents([]);
    setAuthNotice(message);
    setErrorMsg('');
    await supabase.auth.signOut();
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadAllData(session.user.id);
      } else {
        setLoadingInitial(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadAllData(session.user.id);
      } else {
        setCurrentUser(null);
        setResidents([]);
        setLoadingInitial(false);
      }
    });

    // Permitir link direto por URL: /?view=login, /#login, /?view=regras, /#regras
    const checkViewFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      if (window.location.hash === '#login' || params.get('view') === 'login') {
        setCurrentView('login');
      } else if (
        window.location.hash === '#regras' ||
        window.location.hash === '#rules' ||
        params.get('view') === 'regras' ||
        params.get('view') === 'rules' ||
        window.location.pathname.startsWith('/regras')
      ) {
        setCurrentView('regras');
      }
    };

    checkViewFromUrl();
    window.addEventListener('hashchange', checkViewFromUrl);
    window.addEventListener('popstate', checkViewFromUrl);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', checkViewFromUrl);
      window.removeEventListener('popstate', checkViewFromUrl);
    };
  }, []);

  // Limpar modal inicial ao mudar de aba
  useEffect(() => {
    if (initialModal) {
      const timer = setTimeout(() => setInitialModal(null), 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const loadAllData = async (userId: string) => {
    setIsLoading(true);
    setErrorMsg('');
    setAuthNotice('');
    try {
      const user = await fetchCurrentResident(userId);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const emailFallback = authUser?.email?.split('@')[0] || 'Administrador';
      if (user) {
        if (!user.name || user.name.trim() === '' || user.name === 'Administrador') {
          user.name = emailFallback;
        }

        if (user.role === UserRole.RESIDENT && user.habilitado === false) {
          const disabledMessage = buildResidentDisabledMessage(user);
          await handleResidentAccessDisabled(disabledMessage);
          throw new Error(disabledMessage);
        }

        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        await supabase.auth.signOut();
        throw new Error('Cadastro do usuario nao encontrado na base de moradores.');
      }

      await refreshData();
    } catch (err: any) {
      console.error(err);
      if (err?.message) {
        setAuthNotice(err.message);
      }
    } finally {
      setIsLoading(false);
      setLoadingInitial(false);
    }
  };

  const refreshData = async () => {
    const errors: string[] = [];
    try {
      try { setRooms(await fetchRooms()); } catch (e) { console.error('Rooms:', e); errors.push('Comodos'); }
      try { setPayments(await fetchPayments()); } catch (e) { console.error('Payments:', e); errors.push('Financeiro'); }
      try { setMaintenance(await fetchMaintenance()); } catch (e) { console.error('Maintenance:', e); errors.push('Reparos'); }
      try { setComplaints(await fetchComplaints()); } catch (e) { console.error('Complaints:', e); errors.push('Reclamacoes'); }
      try { setNotices(await fetchNotices()); } catch (e) { console.error('Notices:', e); errors.push('Mural'); }
      try { setEvents(await fetchCalendarEvents()); } catch (e) { console.error('Events:', e); errors.push('Agenda'); }
      try { setLaundrySchedules(await fetchLaundrySchedules()); } catch (e) { console.error('Laundry:', e); }
      try { setDevices(await fetchDevices()); } catch (e) { console.error('Devices:', e); }
      try { setResidents(await fetchResidents()); } catch (e) { console.error('Residents:', e); errors.push('Moradores'); }
      try {
        const desc = await fetchPropertyDescription();
        setPropertyDescription(desc);
      } catch (e) { console.error('PropertyDesc:', e); errors.push('Descricao da Propriedade'); }

      if (errors.length > 0) {
        setErrorMsg(`Aviso: Alguns dados principais (${errors.join(', ')}) nao puderam ser carregados.`);
      } else {
        setErrorMsg('');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Aviso: Alguns dados podem nao ter sido carregados.');
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-rose-600" size={48} />
      </div>
    );
  }

  // 1. PÁGINA: ACEITE DE REGRAS E CADASTRO DE RESIDENTE
  if (currentView === 'regras') {
    return (
      <RulesAcceptanceView
        onBack={() => {
          if (window.location.hash === '#regras' || window.location.hash === '#rules') {
            window.location.hash = '';
          }
          if (currentUser) {
            setCurrentView('app');
          } else {
            setCurrentView('landing');
          }
        }}
        currentUser={currentUser}
      />
    );
  }

  // 2. O DOMÍNIO CARREGA DIRETAMENTE A LANDING PAGE
  if (currentView === 'landing') {
    return (
      <LandingPage
        onLoginClick={() => {
          if (currentUser) {
            setCurrentView('app');
          } else {
            setCurrentView('login');
          }
        }}
        isLoggedIn={!!currentUser}
        currentUser={currentUser}
        onGoToDashboard={() => setCurrentView('app')}
        onOpenRules={() => {
          window.location.hash = '#regras';
          setCurrentView('regras');
        }}
      />
    );
  }

  // 3. TELA DE LOGIN DO MORADOR
  if (currentView === 'login' || !currentUser) {
    return (
      <Login
        onLogin={async (userId, newSession) => {
          if (newSession) setSession(newSession);
          await loadAllData(userId);
          setCurrentView('app');
        }}
        onBack={() => setCurrentView('landing')}
        onNavigateToRules={() => {
          window.location.hash = '#regras';
          setCurrentView('regras');
        }}
        externalMessage={authNotice}
      />
    );
  }

  const isAdmin = currentUser.role === UserRole.ADMIN;

  return (
    <Layout
      currentUser={currentUser}
      activeTab={activeTab}
      setActiveTab={(tab) => {
        setSelectedProfileResident(null);
        setActiveTab(tab);
      }}
      onLogout={() => {
        setSession(null);
        setCurrentUser(null);
        setCurrentView('landing');
      }}
      onRefresh={() => loadAllData(session.user.id)}
      onGoToLanding={() => setCurrentView('landing')}
      onOpenRules={() => {
        window.location.hash = '#regras';
        setCurrentView('regras');
      }}
    >
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3">
          <ShieldAlert size={20} />
          <p className="font-bold text-sm">{errorMsg}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-medium text-slate-500">Sincronizando dados...</p>
        </div>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            (isAdmin && !previewAsResident) ? (
              <DashboardView
                payments={payments} maintenance={maintenance}
                residents={residents} rooms={rooms}
                laundrySchedules={laundrySchedules}
                currentUser={currentUser}
                setActiveTab={setActiveTab}
                setShowAddResidentModal={() => setInitialModal('add-resident')}
                setShowAddNoticeModal={() => setInitialModal('add-notice')}
                setShowAddEventModal={() => setInitialModal('add-event')}
                onPreviewResidentDashboard={() => setPreviewAsResident(true)}
              />
            ) : (
              <div className="space-y-4">
                {isAdmin && previewAsResident && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-lg shadow-amber-950/40">
                        <Eye size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                            Modo de Teste & Simulação do Morador
                          </span>
                          <span className="text-[10px] bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                            Visão do Administrador
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Você está visualizando e interagindo com a versão oficial do Dashboard dos Residentes.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPreviewAsResident(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider border border-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-lg"
                    >
                      ✕ Voltar ao Painel Admin
                    </button>
                  </div>
                )}
                <ResidentDashboardView
                  currentUser={
                    (isAdmin && previewAsResident)
                      ? (residents.find(r => r.role === UserRole.RESIDENT && r.status === 'Ativo') || currentUser)
                      : currentUser
                  }
                  payments={payments}
                  maintenance={maintenance}
                  laundrySchedules={laundrySchedules}
                  rooms={rooms}
                  notices={notices}
                  setActiveTab={setActiveTab}
                  onRefresh={refreshData}
                  onOpenRules={() => {
                    window.location.hash = '#regras';
                    setCurrentView('regras');
                  }}
                />
              </div>
            )
          )}

          {activeTab === 'rooms' && (
            <RoomsView
              rooms={rooms} maintenance={maintenance}
              isAdmin={isAdmin} currentUser={currentUser} onRefresh={refreshData}
            />
          )}

          {activeTab === 'residents' && isAdmin && (
            selectedProfileResident ? (
              <ResidentProfileView
                resident={selectedProfileResident}
                onBack={() => setSelectedProfileResident(null)}
                onRefresh={() => {
                  refreshData();
                  const updated = residents.find(r => r.id === selectedProfileResident.id);
                  if (updated) setSelectedProfileResident(updated);
                }}
                isAdmin={isAdmin}
                rooms={rooms}
              />
            ) : (
              <ResidentsView
                residents={residents}
                isAdmin={isAdmin}
                currentUser={currentUser}
                onRefresh={refreshData}
                initialModal={initialModal as any}
                onOpenResidentProfile={(res) => setSelectedProfileResident(res)}
              />
            )
          )}

          {activeTab === 'payments' && (
            <PaymentsView
              payments={payments} residents={residents}
              isAdmin={isAdmin} currentUser={currentUser} onRefresh={refreshData}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceView
              maintenance={maintenance} rooms={rooms} residents={residents}
              isAdmin={isAdmin} currentUser={currentUser} onRefresh={refreshData}
            />
          )}

          {activeTab === 'complaints' && (
            <ComplaintsView
              complaints={complaints} residents={residents}
              isAdmin={isAdmin} currentUser={currentUser} onRefresh={refreshData}
            />
          )}
          {activeTab === 'internet' && <InternetView residents={residents} devices={devices} currentUser={currentUser} onUpdate={refreshData} />}

          {activeTab === 'notices' && (
            <NoticesView notices={notices} residents={residents} isAdmin={isAdmin} currentUser={currentUser} onRefresh={refreshData} initialModal={initialModal as any} />
          )}

          {activeTab === 'calendar' && (
            <CalendarView events={events} isAdmin={isAdmin} onRefresh={refreshData} initialModal={initialModal as any} />
          )}

          {activeTab === 'laundry' && (
            <LaundryView schedules={laundrySchedules} residents={residents} currentUser={currentUser} isAdmin={isAdmin} onRefresh={refreshData} />
          )}

          {activeTab === 'property-description' && propertyDescription && (
            <PropertyDescView
              data={propertyDescription}
              onUpdate={refreshData}
              rooms={rooms}
            />
          )}
        </>
      )}

      {currentUser.role === UserRole.RESIDENT && (
        <Suspense fallback={null}>
          <SoftphoneDock currentUser={currentUser} />
        </Suspense>
      )}
    </Layout>
  );
}

export default App;
