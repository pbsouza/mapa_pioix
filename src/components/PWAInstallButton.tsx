import { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton({ className = '' }: { className?: string }) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already running standalone, hide the prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer min-h-[36px] ${className}`}
        title="Instalar aplicativo no dispositivo"
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer min-h-[36px] ${className}`}
          title="Como instalar no iPhone/iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full text-white shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-bold">Instalar no iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p>
                  Para instalar este aplicativo no seu dispositivo Apple (iOS):
                </p>
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <Share className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">1. Toque em Compartilhar</span>
                    <span className="text-[11px] text-slate-400">Na barra inferior do Safari.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <PlusSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">2. Adicionar à Tela de Início</span>
                    <span className="text-[11px] text-slate-400">Role para baixo e selecione essa opção.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
