import { useMap } from '@vis.gl/react-google-maps';
import { Maximize2, LocateFixed, Layers, Compass, Printer } from 'lucide-react';
import { useState } from 'react';

interface MapControlsProps {
  onFitBounds: () => void;
  onRequestGps: () => void;
  onOpenPrintModal?: () => void;
}

export function MapControls({ onFitBounds, onRequestGps, onOpenPrintModal }: MapControlsProps) {
  const map = useMap();
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid' | 'terrain'>('roadmap');

  const toggleMapType = () => {
    if (!map) return;
    let next: 'roadmap' | 'hybrid' | 'terrain' = 'roadmap';
    if (mapTypeId === 'roadmap') next = 'hybrid';
    else if (mapTypeId === 'hybrid') next = 'terrain';
    else next = 'roadmap';

    map.setMapTypeId(next);
    setMapTypeId(next);
  };

  const resetHeading = () => {
    if (!map) return;
    map.setHeading(0);
    map.setTilt(0);
  };

  return (
    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col gap-2">
      {/* Map Type Switcher */}
      <button
        onClick={toggleMapType}
        className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-white/95 active:bg-slate-100 hover:bg-white text-slate-700 hover:text-slate-950 shadow-md border border-slate-200/80 flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer group"
        title={`Alternar visualização: Atual (${mapTypeId})`}
        aria-label="Alternar tipo de mapa"
      >
        <Layers className="w-4.5 h-4.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
      </button>

      {/* Frame all markers */}
      <button
        onClick={onFitBounds}
        className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-white/95 active:bg-slate-100 hover:bg-white text-slate-700 hover:text-slate-950 shadow-md border border-slate-200/80 flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer group"
        title="Enquadrar todos os marcadores do KMZ"
        aria-label="Enquadrar todos os marcadores"
      >
        <Maximize2 className="w-4.5 h-4.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
      </button>

      {/* GPS Location Button */}
      <button
        onClick={onRequestGps}
        className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-white/95 active:bg-emerald-50 hover:bg-white text-emerald-600 hover:text-emerald-700 shadow-md border border-slate-200/80 flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer group"
        title="Centralizar na minha localização GPS"
        aria-label="Minha localização GPS"
      >
        <LocateFixed className="w-4.5 h-4.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
      </button>

      {/* Print PDF Button */}
      {onOpenPrintModal && (
        <button
          onClick={onOpenPrintModal}
          className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-white/95 active:bg-emerald-50 hover:bg-white text-emerald-600 hover:text-emerald-700 shadow-md border border-slate-200/80 flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer group"
          title="Imprimir mapa e localidades selecionadas em PDF"
          aria-label="Imprimir em PDF"
        >
          <Printer className="w-4.5 h-4.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Reset North */}
      <button
        onClick={resetHeading}
        className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-white/95 active:bg-slate-100 hover:bg-white text-slate-700 hover:text-slate-950 shadow-md border border-slate-200/80 flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer group"
        title="Redefinir orientação para o Norte"
        aria-label="Redefinir orientação Norte"
      >
        <Compass className="w-4.5 h-4.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
