import React, { useState } from 'react';
import {
    LayoutDashboard, Bed, Users, CreditCard,
    Wrench, MessageSquare, Wifi, Megaphone,
    Calendar as CalendarIcon, LogOut, Home, Music,
    Search, AlertCircle, Menu, X, Trello, Droplets,
    Globe, ExternalLink
} from 'lucide-react';
import { UserRole, Resident } from '../types';
import { signOut } from '../lib/database';
import { ProfileModal } from './ProfileModal';

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${active
            ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40 scale-[1.02]'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
    >
        <Icon size={20} className={active ? 'animate-pulse' : ''} />
        <span className="font-semibold text-sm">{label}</span>
    </button>
);

interface LayoutProps {
    currentUser: Resident;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
    onRefresh: () => void;
    onGoToLanding?: () => void;
    children: React.ReactNode;
}

export function Layout({ currentUser, activeTab, setActiveTab, onLogout, onRefresh, onGoToLanding, children }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const isAdmin = currentUser.role === UserRole.ADMIN;

    const handleSetActiveTab = (tab: string) => {
        setActiveTab(tab);
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        onLogout();
    };

    return (
        <div className="min-h-screen flex bg-slate-950 text-slate-300">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-[60] w-72 bg-slate-900/95 lg:bg-slate-900/50 backdrop-blur-2xl border-r border-slate-800 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 flex flex-col h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo Section */}
                <div className="p-6 lg:p-8 flex items-center justify-between gap-3 mb-2 lg:mb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <Home size={28} className="text-rose-600 drop-shadow-lg" />
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">
                            MORONA<span className="text-rose-600">VILA</span>
                        </h1>
                    </div>
                </div>

                {/* Botão Ver Site Público */}
                {onGoToLanding && (
                    <div className="px-5 mb-4">
                        <button
                            onClick={onGoToLanding}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-black uppercase tracking-widest transition-all"
                        >
                            <Globe size={15} /> Ver Site Público
                        </button>
                    </div>
                )}

                {/* Navigation Menu (Scrollable) */}
                <nav className="px-5 space-y-2 flex-1 overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => handleSetActiveTab('dashboard')} />
                    <SidebarItem icon={Megaphone} label="Mural" active={activeTab === 'notices'} onClick={() => handleSetActiveTab('notices')} />
                    <SidebarItem icon={CalendarIcon} label="Calendário" active={activeTab === 'calendar'} onClick={() => handleSetActiveTab('calendar')} />
                    <SidebarItem icon={Bed} label={isAdmin ? "Cômodos" : "Meu Quarto"} active={activeTab === 'rooms'} onClick={() => handleSetActiveTab('rooms')} />
                    {isAdmin && (
                        <>
                            <SidebarItem icon={Users} label="Moradores" active={activeTab === 'residents'} onClick={() => handleSetActiveTab('residents')} />
                            <SidebarItem icon={Home} label="Descrição da Casa" active={activeTab === 'property-description'} onClick={() => handleSetActiveTab('property-description')} />
                        </>
                    )}
                    <SidebarItem icon={CreditCard} label="Financeiro" active={activeTab === 'payments'} onClick={() => handleSetActiveTab('payments')} />
                    <SidebarItem icon={Droplets} label="Lavanderia" active={activeTab === 'laundry'} onClick={() => handleSetActiveTab('laundry')} />
                    <SidebarItem icon={Trello} label={isAdmin ? "Painel Reparos" : "Reparos"} active={activeTab === 'maintenance'} onClick={() => handleSetActiveTab('maintenance')} />
                    <SidebarItem icon={Wifi} label={isAdmin ? "Internet" : "Dispositivos"} active={activeTab === 'internet'} onClick={() => handleSetActiveTab('internet')} />
                    {isAdmin && (
                        <SidebarItem icon={MessageSquare} label="Reclamações" active={activeTab === 'complaints'} onClick={() => handleSetActiveTab('complaints')} />
                    )}
                </nav>

                {/* Footer / Profile Section */}
                <div className="w-full px-6 pb-8 pt-4 space-y-4 shrink-0 mt-auto border-t border-slate-800/50 lg:border-transparent bg-slate-900/90 lg:bg-transparent backdrop-blur-xl">
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="w-full bg-slate-800/40 hover:bg-slate-800/70 p-4 lg:p-5 rounded-3xl border border-slate-800 transition-all duration-300 text-left group"
                    >
                        <p className="text-[10px] text-slate-500 group-hover:text-rose-500 transition-colors font-black uppercase tracking-[0.2em] mb-2 lg:mb-3">
                            Perfil de Acesso
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-950/30 border border-rose-500/20 flex items-center justify-center text-rose-500 font-black text-sm uppercase shrink-0">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-slate-100 truncate">{currentUser.name}</p>
                                <p className="text-[10px] text-slate-500 font-bold truncate uppercase">{currentUser.role === UserRole.ADMIN ? 'Administrador' : 'Morador'}</p>
                            </div>
                        </div>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all duration-300 text-xs font-black uppercase tracking-widest"
                    >
                        <LogOut size={16} /> Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-slate-950/70 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-[50]">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2.5 text-slate-400 hover:bg-slate-800 rounded-2xl transition-all"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Mobile Logo */}
                        <div className="flex lg:hidden items-center gap-2">
                             <Home size={24} className="text-rose-600" />
                            <span className="text-lg font-black text-white tracking-tighter uppercase italic">
                                MORONA<span className="text-rose-600">VILA</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {onGoToLanding && (
                            <button
                                onClick={onGoToLanding}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                <Globe size={14} className="text-rose-500" /> Ver Site Público
                            </button>
                        )}
                        <div className="flex items-center gap-3">
                            <div className="hidden md:block text-right">
                                <div className="text-xs font-black text-white">{currentUser.name}</div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase">{currentUser.role === UserRole.ADMIN ? 'Painel Administrativo' : 'Painel do Residente'}</div>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-lg shadow-rose-900/30">
                                {currentUser.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 lg:p-10 overflow-y-auto">
                    {children}
                </div>
            </main>

            {/* Profile Modal */}
            {isProfileModalOpen && (
                <ProfileModal
                    currentUser={currentUser}
                    onClose={() => setIsProfileModalOpen(false)}
                    onUpdate={onRefresh}
                />
            )}
        </div>
    );
}
