import React from 'react';
import { IconSparkles, IconTrash } from './Icons';

interface AIControlsProps {
  onGenerate: () => void;
  onDelete: () => void;
  isGenerating: boolean;
  position: { x: number; y: number; width: number; height: number };
}

const AIControls: React.FC<AIControlsProps> = ({ onGenerate, onDelete, isGenerating, position }) => {
  return (
    <div 
      className="absolute z-50 flex gap-2 animate-in fade-in zoom-in duration-200"
      style={{
        transform: `translate(${position.x}px, ${position.y - 60}px)`,
        width: position.width, // Center relative to node width if we wanted, but left aligned is fine
      }}
    >
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-sm"
      >
        <IconSparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? 'Thinking...' : 'Expand Idea'}
      </button>

      <button
        onClick={onDelete}
        className="flex items-center justify-center bg-white text-slate-500 px-3 py-2 rounded-full shadow-lg border border-slate-100 hover:text-red-500 hover:bg-red-50 transition-all"
        title="Delete"
      >
        <IconTrash className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AIControls;
