import React from 'react';
import { X, History, Trash2, ArrowUpRight, Clock } from 'lucide-react';
import type { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base">Conversion History</h3>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                title="Clear all history"
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500 my-auto">
              <Clock className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-medium">No history recorded yet</p>
              <p className="text-xs text-slate-600 mt-1">Conversions you perform will automatically appear here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex flex-col gap-2 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSelect(item)}
                      title="Load this expression"
                      className="p-1 rounded text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50 flex items-center gap-0.5 text-xs font-semibold"
                    >
                      <span>Load</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      title="Delete entry"
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="font-mono text-xs text-slate-300 font-semibold truncate" title={item.infix}>
                  Infix: <span className="text-white">{item.infix}</span>
                </div>

                <div className="font-mono text-xs text-indigo-300 font-bold truncate" title={item.prefix}>
                  Prefix: <span>{item.prefix}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
