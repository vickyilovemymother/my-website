import React, { useState } from 'react';
import { UploadZone } from './UploadZone';
import { generatePhotoshoot, generateAnimation } from '../services/geminiService';
import { GenerationStatus, ApiError, PhotoshootResult } from '../types';
import { Wand2, Play, Download, Maximize2, Loader2, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';

export const StudioWorkspace: React.FC = () => {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [topFile, setTopFile] = useState<File | null>(null);
  const [bottomFile, setBottomFile] = useState<File | null>(null);
  const [dressFile, setDressFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [error, setError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<PhotoshootResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGenerate = async () => {
    if (!modelFile) {
      setError({ message: "Missing Model", details: "Please upload a model image first." });
      return;
    }

    const garments = [];
    if (topFile) garments.push({ file: topFile, type: 'top' });
    if (bottomFile) garments.push({ file: bottomFile, type: 'bottom' });
    if (dressFile) garments.push({ file: dressFile, type: 'dress' });

    if (garments.length === 0) {
      setError({ message: "Missing Garments", details: "Please upload at least one garment image." });
      return;
    }

    setStatus(GenerationStatus.LOADING);
    setError(null);
    setResult(null);

    try {
      const imageUrl = await generatePhotoshoot(modelFile, garments, prompt);
      setResult({
        id: crypto.randomUUID(),
        imageUrl,
        prompt,
        timestamp: Date.now()
      });
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setError({ message: "Generation Failed", details: err.message });
    }
  };

  const handleAnimate = async () => {
    if (!result) return;
    setIsAnimating(true);
    try {
      const videoUrl = await generateAnimation(result.imageUrl, "Cinematic fashion motion, subtle breeze, runway walk");
      setResult(prev => prev ? { ...prev, videoUrl } : null);
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setError({ 
          message: "API Key Error", 
          details: "The selected API key is invalid or lacks permissions. Please re-select a paid Tier key." 
        });
        await window.aistudio.openSelectKey();
      } else {
        setError({ message: "Animation Failed", details: err.message });
      }
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-120px)]">
      {/* Sidebar Controls */}
      <div className="lg:col-span-4 space-y-8">
        <section className="glass rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Assets Library</h2>
          </div>
          
          <UploadZone 
            label="Model Base" 
            description="Upload model image"
            file={modelFile}
            onFileSelect={setModelFile}
          />

          <div className="grid grid-cols-2 gap-4">
            <UploadZone 
              label="Top Wear" 
              file={topFile}
              onFileSelect={setTopFile}
            />
            <UploadZone 
              label="Bottom Wear" 
              file={bottomFile}
              onFileSelect={setBottomFile}
            />
          </div>
          
          <UploadZone 
            label="Full Dress" 
            file={dressFile}
            onFileSelect={setDressFile}
          />
        </section>

        <section className="glass rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Photoshoot Config</h2>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-500">Environment & Lighting Prompt</label>
              <div className="flex gap-2">
                {['Lace', 'Silk', 'Sheer'].map(fabric => (
                  <button
                    key={fabric}
                    onClick={() => setPrompt(prev => prev ? `${prev}, ${fabric} texture` : `${fabric} texture`)}
                    className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400"
                  >
                    +{fabric}
                  </button>
                ))}
              </div>
            </div>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Detailed lace texture, sheer sleeves, cinematic lighting, high-end fashion studio, soft shadows..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={status === GenerationStatus.LOADING}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20"
          >
            {status === GenerationStatus.LOADING ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            Generate Photoshoot
          </button>
        </section>
      </div>

      {/* Main Preview Area */}
      <div className="lg:col-span-8 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 text-red-200 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-400">{error.message}</h4>
              <p className="text-xs text-red-300/70 mt-1">{error.details}</p>
            </div>
          </div>
        )}

        <div className="glass rounded-[2rem] aspect-[4/5] relative overflow-hidden flex items-center justify-center">
          {status === GenerationStatus.LOADING ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-lg font-serif italic text-zinc-300">Crafting your vision...</p>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Processing AI Segmentation</p>
              </div>
            </div>
          ) : result ? (
            <div className="absolute inset-0 group">
              {result.videoUrl ? (
                <video 
                  src={result.videoUrl} 
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={result.imageUrl} 
                  alt="Photoshoot Result" 
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Overlay Controls */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={handleAnimate}
                  disabled={isAnimating || !!result.videoUrl}
                  className="px-6 py-3 rounded-full bg-white text-zinc-950 text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isAnimating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  {result.videoUrl ? 'Animation Ready' : 'Generate Animation'}
                </button>
                <button className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-30">
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-xl font-serif italic mb-2">Studio Empty</h3>
              <p className="text-sm max-w-xs mx-auto">Upload your model and garments to begin the production process.</p>
            </div>
          )}
        </div>

        {/* Export Options */}
        {result && (
          <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
            <button className="glass rounded-2xl p-4 text-left hover:border-indigo-500/30 transition-colors group">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Standard</p>
              <p className="text-sm font-medium">Original Resolution</p>
            </button>
            <button className="glass rounded-2xl p-4 text-left hover:border-indigo-500/30 transition-colors group">
              <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">Enhanced</p>
              <p className="text-sm font-medium">High Quality (SUPIR)</p>
            </button>
            <button className="glass rounded-2xl p-4 text-left hover:border-indigo-500/30 transition-colors group">
              <p className="text-[10px] uppercase tracking-widest text-purple-400 font-bold mb-1">Ultra HD</p>
              <p className="text-sm font-medium">4K Upscale (RealESRGAN)</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
