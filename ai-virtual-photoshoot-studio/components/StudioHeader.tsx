import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

export const StudioHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Camera className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gradient">AI Virtual Photoshoot Studio</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">Production Engine v2.5</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <a href="#" className="text-zinc-100">Studio</a>
          <a href="#" className="hover:text-zinc-100 transition-colors">Collections</a>
          <a href="#" className="hover:text-zinc-100 transition-colors">Assets</a>
        </nav>
        
        <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
        
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors">
          <Sparkles className="w-4 h-4" />
          Go Pro
        </button>
      </div>
    </header>
  );
};
