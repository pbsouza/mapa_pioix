import { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Upload,
  Navigation,
  Menu,
  X,
  Route,
  Printer,
  FileJson,
  Smartphone,
  MoreVertical,
  Check,
  HardDrive,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  fileName: string;
  totalPlacemarks: number;
  filteredCount: number;
  hasActiveRoute: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenUploadTab: () => void;
  onRequestGps: () => void;
  onOpenRouteTab: () => void;
  onOpenPrintModal: () => void;
  onOpenJsonModal: () => void;
  onOpenMobileGuide: () => void;
  onOpenOfflineModal: () => void;
}

export function Header({
  fileName,
  totalPlacemarks,
  filteredCount,
  hasActiveRoute,
  sidebarOpen,
  onToggleSidebar,
  onOpenUploadTab,
  onRequestGps,
  onOpenRouteTab,
  onOpenPrintModal,
  onOpenJsonModal,
  onOpenMobileGuide,
  onOpenOfflineModal,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="h-14 bg-slate-900 text-white px-2.5 sm:px-4 md:px-5 flex items-center justify-between border-b border-slate-800 shadow-md shrink-0 z-30 select-none relative">
      {/* Brand & Drawer Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors shrink-0"
          aria-label={sidebarOpen ? 'Fechar menu lateral' : 'Abrir menu lateral'}
        >
          {sidebarOpen ? <X className="w-5 h-5 text-rose-300" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <img
            src="./icons/pwa-192x192.png"
            alt="Rotas Pio IX"
            className="w-8 h-8 rounded-lg object-cover shadow-sm shrink-0 border border-slate-700/60"
          />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm md:text-base font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
              <span className="truncate">KMZ Viewer</span>
              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1 py-0.2 rounded shrink-0">
                Maps
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block truncate max-w-[200px] md:max-w-xs">
              Visualizador KMZ com rotas integradas
            </p>
          </div>
        </div>

        {/* Current File indicator - Desktop */}
        {fileName && (
          <div className="hidden xl:flex items-center gap-2 ml-3 pl-3 border-l border-slate-800 text-xs text-slate-300">
            <span className="font-medium text-slate-200 truncate max-w-[180px]" title={fileName}>
              📄 {fileName}
            </span>
            <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full shrink-0">
              {filteredCount} de {totalPlacemarks} visíveis
            </span>
          </div>
        )}
      </div>

      {/* Desktop Actions (md and up) */}
      <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
        <button
          onClick={onRequestGps}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
          title="Detectar minha localização atual com GPS"
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span>Onde Estou</span>
        </button>

        <button
          onClick={onOpenRouteTab}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            hasActiveRoute
              ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400 shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
          }`}
          title={hasActiveRoute ? (sidebarOpen ? 'Ir direto para o mapa' : 'Abrir painel de rotas') : 'Abrir painel de rotas'}
        >
          <Route className="w-3.5 h-3.5 text-cyan-300" />
          <span>
            {hasActiveRoute
              ? sidebarOpen
                ? 'Ver no Mapa'
                : 'Painel de Rota'
              : 'Traçar Rota'}
          </span>
        </button>

        <button
          onClick={onOpenMobileGuide}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
          title="Ver como abrir este mapa no Google Maps do celular"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>No Celular</span>
        </button>

        <button
          onClick={onOpenOfflineModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-colors shadow-sm cursor-pointer border border-amber-500/40"
          title="Configurar modo offline e baixar blocos do mapa"
        >
          <HardDrive className="w-3.5 h-3.5 text-amber-400" />
          <span>Mapa Offline</span>
        </button>

        <button
          onClick={onOpenJsonModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer border border-indigo-500"
          title="Converter e exportar para GeoJSON ou JSON"
        >
          <FileJson className="w-3.5 h-3.5" />
          <span>JSON</span>
        </button>

        <button
          onClick={onOpenPrintModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer border border-emerald-500"
          title="Imprimir mapa em PDF com links do Google Maps"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>PDF / Imprimir</span>
        </button>

        <button
          onClick={onOpenUploadTab}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          title="Carregar outro arquivo KMZ ou KML"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Abrir KMZ</span>
        </button>

        <PWAInstallButton />
      </div>

      {/* Mobile Actions (< md): Compact touch buttons + Dropdown */}
      <div className="flex md:hidden items-center gap-1.5" ref={menuRef}>
        {/* Direct Install button on mobile */}
        <PWAInstallButton variant="compact" />

        {/* Quick GPS button on mobile */}
        <button
          onClick={onRequestGps}
          className="w-9 h-9 rounded-lg bg-slate-800 active:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors border border-slate-700 shrink-0"
          title="Detectar minha localização GPS"
          aria-label="Minha Localização GPS"
        >
          <Navigation className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Quick Route button on mobile */}
        <button
          onClick={onOpenRouteTab}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border shrink-0 ${
            hasActiveRoute
              ? 'bg-blue-600 text-white border-blue-400'
              : 'bg-slate-800 active:bg-slate-700 text-cyan-300 border-slate-700'
          }`}
          title={hasActiveRoute ? (sidebarOpen ? 'Ir direto para o mapa' : 'Abrir painel de rotas') : 'Traçar Rotas'}
          aria-label={hasActiveRoute ? 'Ver Rota no Mapa' : 'Traçar Rotas'}
        >
          <Route className="w-4 h-4" />
        </button>

        {/* More Tools Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border shrink-0 ${
            mobileMenuOpen
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-slate-800 active:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          title="Mais opções e exportações"
          aria-label="Mais opções"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* Dropdown Menu Modal for Mobile */}
        {mobileMenuOpen && (
          <div className="absolute top-14 right-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 flex flex-col gap-1.5 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
              <span>Opções do Aplicativo</span>
            </div>

            <div className="py-1">
              <PWAInstallButton variant="sidebar" className="w-full" />
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenUploadTab();
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors text-left"
            >
              <Upload className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <div className="font-semibold">Abrir Arquivo KMZ</div>
                <div className="text-[10px] text-slate-400">Carregar outro mapa ou camada</div>
              </div>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOfflineModal();
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors text-left"
            >
              <HardDrive className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="font-semibold text-amber-300">Modo Offline & Cache</div>
                <div className="text-[10px] text-slate-400">Baixar mapa para usar sem internet</div>
              </div>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrintModal();
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors text-left"
            >
              <Printer className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-semibold">PDF / Imprimir Mapa</div>
                <div className="text-[10px] text-slate-400">Baixar relatório com QR codes</div>
              </div>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJsonModal();
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors text-left"
            >
              <FileJson className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="font-semibold">Exportar JSON / GeoJSON</div>
                <div className="text-[10px] text-slate-400">Dados estruturados e geometrias</div>
              </div>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMobileGuide();
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors text-left border-t border-slate-800/80 mt-1 pt-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-semibold">Guia para Celular</div>
                <div className="text-[10px] text-slate-400">Como abrir no app Google Maps</div>
              </div>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
