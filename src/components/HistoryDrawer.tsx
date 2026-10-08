import React, { useState } from 'react';
import { X, History, Trash2, ArrowUpRight, Clock, Search } from 'lucide-react';
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
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      (item.infix || '').toLowerCase().includes(q) ||
      (item.prefix || '').toLowerCase().includes(q) ||
      (item.postfix || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#09090B] border-l border-[#27272A] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 text-[#F8FAFC]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#6366F1]" />
            <h3 className="font-bold text-[#F8FAFC] text-base">Conversion History</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-[#18181B] text-[#71717A] font-mono border border-[#27272A]">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                title="Clear all history"
                className="px-2 py-1 rounded text-[#EF4444] hover:bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs font-mono flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CLEAR</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#71717A] hover:text-[#F8FAFC] hover:bg-[#18181B] transition-colors"
              aria-label="Close history drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Input */}
        {history.length > 0 && (
          <div className="px-4 pt-3 pb-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#71717A] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search history expressions..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-[#111318] border border-[#27272A] rounded text-[#F8FAFC] placeholder-[#71717A] focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>
        )}

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 text-[#71717A] my-auto">
              <Clock className="w-10 h-10 mb-2 opacity-40 text-[#71717A]" />
              <p className="text-sm font-medium font-mono">NO_HISTORY_LOGGED</p>
              <p className="text-xs text-[#71717A] mt-1">Conversions you perform will automatically appear here.</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center p-6 text-[#71717A] text-xs font-mono italic">
              NO_MATCHING_RECORDS: "{filterQuery}".
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-[#111318] border border-[#27272A] hover:border-[#3F3F46] rounded p-3.5 flex flex-col gap-2 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#71717A]">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    {item.stepCount && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#18181B] text-[#C0C1FF] border border-[#27272A]">
                        {item.stepCount} STEPS
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSelect(item)}
                      title="Load this expression"
                      className="px-2 py-0.5 rounded text-[#06B6D4] hover:bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center gap-0.5 text-xs font-mono font-bold"
                    >
                      <span>LOAD</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      title="Delete entry"
                      className="p-1 rounded text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/15"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="font-mono text-xs text-[#71717A] font-semibold truncate" title={item.infix}>
                  INFIX: <span className="text-[#F8FAFC]">{item.infix}</span>
                </div>

                <div className="font-mono text-xs text-[#C0C1FF] font-bold truncate" title={item.prefix}>
                  PREFIX: <span>{item.prefix}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

