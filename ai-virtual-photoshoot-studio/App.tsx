/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { StudioHeader } from './components/StudioHeader';
import { StudioWorkspace } from './components/StudioWorkspace';
import { Key, AlertTriangle, ExternalLink } from 'lucide-react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } catch (e) {
        setHasKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    setHasKey(true); // Assume success as per guidelines
  };

  if (hasKey === null) return null;

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full glass rounded-[2.5rem] p-10 text-center space-y-8 border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <Key className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-serif italic text-gradient">Studio Access</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              To enable high-fidelity video generation and advanced photoshoot features, please select a paid Google Cloud project API key.
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Billing Required</p>
              <p className="text-[11px] text-amber-200/70">
                Veo video models require a paid Tier API key. Ensure your project has billing enabled.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleSelectKey}
              className="w-full py-4 rounded-2xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              Select API Key
            </button>
            
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              View Billing Documentation
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">      
      <StudioHeader />
      
      <main className="max-w-[1600px] mx-auto pt-32 pb-20 px-6">
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-serif italic mb-4">The Digital Runway</h2>
          <p className="text-zinc-500 max-w-2xl text-lg">
            Combine high-fidelity human parsing with diffusion inpainting to create professional fashion campaigns in seconds.
          </p>
        </div>

        <StudioWorkspace />
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 rounded bg-zinc-800" />
            <span className="text-xs font-bold uppercase tracking-widest">AI Studio Production</span>
          </div>
          
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
            <a href="#" className="hover:text-zinc-400">Privacy Protocol</a>
            <a href="#" className="hover:text-zinc-400">Terms of Service</a>
            <a href="#" className="hover:text-zinc-400">API Documentation</a>
          </div>
          
          <p className="text-[10px] text-zinc-700 font-mono">© 2026 VIRTUAL_PHOTOSHOOT_ENGINE_V2.5</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
