import { useState } from 'react';
import { RouteResultDetails, RouteAlternative, TravelMode, LatLng, LiveNavigationState } from '../types/kml';
import {
  Navigation,
  Car,
  Footprints,
  Bike,
  Bus,
  ChevronDown,
  ChevronUp,
  X,
  Maximize2,
  ExternalLink,
  Milestone,
  LocateFixed,
  Gauge,
  Compass,
  ArrowRight,
  Sparkles,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  ArrowUpRight,
  ArrowUpLeft,
  RotateCcw,
  Flag,
} from 'lucide-react';
import { formatDistance, formatDuration } from '../utils/routeGuidance';

interface ActiveRouteOverlayProps {
  routeDetails: RouteResultDetails | null;
  origin: LatLng | null;
  originLabel: string;
  destination: LatLng | null;
  destinationLabel: string;
  travelMode: TravelMode;
  isLiveNavigating: boolean;
  liveNavState: LiveNavigationState;
  onClearRoute: () => void;
  onFitRouteBounds: () => void;
  onToggleLiveNavigation: () => void;
  onRecenterOnUser: () => void;
  onSelectAlternative?: (index: number) => void;
}

function renderManeuverIcon(type?: string, modifier?: string) {
  if (type === 'arrive') return <Flag className="w-5 h-5 text-emerald-400" />;
  if (modifier === 'left' || modifier === 'sharp left') return <CornerUpLeft className="w-5 h-5 text-emerald-400" />;
  if (modifier === 'right' || modifier === 'sharp right') return <CornerUpRight className="w-5 h-5 text-emerald-400" />;
  if (modifier === 'slight left') return <ArrowUpLeft className="w-5 h-5 text-emerald-400" />;
  if (modifier === 'slight right') return <ArrowUpRight className="w-5 h-5 text-emerald-400" />;
  if (modifier === 'u-turn') return <RotateCcw className="w-5 h-5 text-emerald-400" />;
  return <ArrowUp className="w-5 h-5 text-emerald-400" />;
}

export function ActiveRouteOverlay({
  routeDetails,
  origin,
  originLabel,
  destination,
  destinationLabel,
  travelMode,
  isLiveNavigating,
  liveNavState,
  onClearRoute,
  onFitRouteBounds,
  onToggleLiveNavigation,
  onRecenterOnUser,
  onSelectAlternative,
}: ActiveRouteOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!routeDetails || !origin || !destination) {
    return null;
  }

  const travelIcons: Record<TravelMode, any> = {
    DRIVING: Car,
    WALKING: Footprints,
    BICYCLING: Bike,
    TRANSIT: Bus,
  };
  const Icon = travelIcons[travelMode] || Car;

  const externalMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=${travelMode.toLowerCase()}`;

  const highways = routeDetails.highways || [];
  const alternatives = routeDetails.alternatives || [];
  const selectedIndex = routeDetails.selectedAlternativeIndex ?? 0;

  // Real-time remaining values if live navigating
  const displayDistance = isLiveNavigating && liveNavState.remainingDistanceMeters !== null
    ? formatDistance(liveNavState.remainingDistanceMeters)
    : routeDetails.distanceText;

  const displayDuration = isLiveNavigating && liveNavState.remainingDurationSeconds !== null
    ? formatDuration(liveNavState.remainingDurationSeconds)
    : routeDetails.durationText;

  return (
    <div className="absolute top-3 left-3 sm:left-4 z-20 max-w-sm sm:max-w-md w-[92%] sm:w-auto bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md text-white overflow-hidden transition-all duration-200">
      {/* Live Navigation Active Top HUD Bar */}
      {isLiveNavigating && (
        <div className="bg-emerald-950/90 border-b border-emerald-600/60 px-3 py-2 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold text-white tracking-wide">Navegação em Tempo Real</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-mono font-bold text-emerald-300">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {liveNavState.speedKmh !== null && liveNavState.speedKmh > 1
                  ? `${Math.round(liveNavState.speedKmh)} km/h`
                  : 'Parado'}
              </span>
            </div>

            <button
              onClick={onRecenterOnUser}
              className="p-1 rounded-md bg-emerald-800/80 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              title="Centralizar mapa no veículo"
            >
              <LocateFixed className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Real-time Google Maps Style Turn Banner */}
      {isLiveNavigating && liveNavState.nextStep && (
        <div className="bg-emerald-900/95 border-b border-emerald-700/80 p-3 flex items-start gap-3 shadow-inner">
          <div className="p-2 rounded-xl bg-emerald-800 text-white shrink-0 mt-0.5 border border-emerald-600/50">
            {renderManeuverIcon(liveNavState.nextStep.type, liveNavState.nextStep.modifier)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>{liveNavState.nextStep.distanceText || 'Em frente'}</span>
              {liveNavState.nextStep.highway && (
                <span className="px-1.5 py-0.2 rounded bg-amber-400/30 text-amber-300 border border-amber-400/50 font-mono text-[9px]">
                  {liveNavState.nextStep.highway}
                </span>
              )}
            </div>
            <div
              className="text-xs text-white font-medium leading-snug mt-0.5 [&_b]:font-bold [&_b]:text-emerald-200"
              dangerouslySetInnerHTML={{ __html: liveNavState.nextStep.instruction }}
            />
          </div>
        </div>
      )}

      {/* Main summary bar */}
      <div className="p-3 sm:p-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                <span className="truncate max-w-[100px] sm:max-w-[130px]" title={originLabel}>
                  {originLabel}
                </span>
                <span className="text-slate-400 font-normal">➔</span>
                <span className="truncate max-w-[100px] sm:max-w-[130px] text-cyan-300" title={destinationLabel}>
                  {destinationLabel}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>{routeDetails.summary || 'Rota traçada no mapa'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onFitRouteBounds}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Centralizar toda a rota no mapa"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClearRoute}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/80 text-slate-300 hover:text-rose-200 transition-colors cursor-pointer"
              title="Fechar rota"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Highway Badges (Que rodovias seguir) */}
        {highways.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Rodovias do Percurso:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {highways.map((hw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono font-bold text-[10px] tracking-wide shadow-2xs"
                >
                  {hw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Alternative Routes Switcher (Melhores Trajetos) */}
        {alternatives.length > 1 && onSelectAlternative && (
          <div className="space-y-1 pt-0.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Opções de Melhores Trajetos:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {alternatives.map((alt, idx) => (
                <button
                  key={alt.id}
                  onClick={() => onSelectAlternative(idx)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedIndex === idx
                      ? 'bg-blue-600/30 border-blue-400 text-white shadow-sm'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate flex items-center justify-between">
                    <span>{alt.title}</span>
                    {selectedIndex === idx && <Sparkles className="w-3 h-3 text-cyan-300" />}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300 mt-0.5">
                    {alt.distanceText} • {alt.durationText}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Big metrics */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-mono">
              {displayDistance}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-cyan-400">
              • {displayDuration}
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-blue-950/40"
          >
            <span>{isExpanded ? 'Ocultar passos' : 'Ver passo a passo'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Real-Time Live Navigation Toggle Button */}
        <button
          onClick={onToggleLiveNavigation}
          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            isLiveNavigating
              ? 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white border border-rose-400/40'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 text-white border border-emerald-400/40'
          }`}
        >
          <Navigation className={`w-4 h-4 shrink-0 ${isLiveNavigating ? 'animate-pulse text-white' : 'rotate-45'}`} />
          <span>
            {isLiveNavigating
              ? 'Parar Navegação em Tempo Real'
              : 'Navegar em Tempo Real (GPS ao vivo)'}
          </span>
        </button>
      </div>

      {/* Expandable Step-by-Step Directions */}
      {isExpanded && routeDetails.steps && routeDetails.steps.length > 0 && (
        <div className="border-t border-slate-800 bg-slate-950/95 p-3 max-h-64 sm:max-h-72 overflow-y-auto space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pb-1 border-b border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Milestone className="w-3.5 h-3.5 text-blue-400" />
              <span>Instruções de Navegação ({routeDetails.steps.length} etapas)</span>
            </div>
            <a
              href={externalMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
              title="Abrir no Google Maps externo (requer internet)"
            >
              <span>Abrir no Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-1.5 pr-0.5">
            {routeDetails.steps.map((st, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800/90 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div
                    className="text-slate-200 leading-snug text-[11px] [&_b]:text-white [&_b]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: st.instruction }}
                  />
                  {(st.distanceText || st.durationText) && (
                    <div className="text-[10px] text-cyan-400 font-medium mt-0.5 font-mono">
                      {[st.distanceText, st.durationText].filter(Boolean).join(' • ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
