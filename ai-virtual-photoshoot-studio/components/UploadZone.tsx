import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface UploadZoneProps {
  label: string;
  description?: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  accept?: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ label, description, file, onFileSelect, accept = "image/*" }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</label>
        {file && (
          <button 
            onClick={() => onFileSelect(null)}
            className="text-zinc-500 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div 
        onClick={() => !file && inputRef.current?.click()}
        className={`
          relative aspect-square rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
          ${file ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'}
        `}
      >
        <input 
          type="file" 
          ref={inputRef} 
          onChange={handleFileChange} 
          accept={accept}
          className="hidden" 
        />
        
        {file ? (
          <img 
            src={URL.createObjectURL(file)} 
            alt={label} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-xs font-medium text-zinc-300">{description || 'Click to upload'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
