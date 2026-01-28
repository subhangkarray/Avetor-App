import React, { useMemo } from 'react';
import { BetSlipItem } from '../types';
import { X, Trash2, Receipt } from 'lucide-react';

interface BetSlipProps {
  items: BetSlipItem[];
  onRemove: (id: string) => void;
  onUpdateStake: (id: string, stake: number) => void;
  onPlaceBet: () => void;
  isOpen: boolean;
  onClose: () => void;
  balance: number;
}

export const BetSlip: React.FC<BetSlipProps> = ({ 
  items, onRemove, onUpdateStake, onPlaceBet, isOpen, onClose, balance 
}) => {
  const totalStake = useMemo(() => items.reduce((sum, item) => sum + item.stake, 0), [items]);
  const potentialReturn = useMemo(() => items.reduce((sum, item) => sum + (item.stake * item.odds), 0), [items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-md h-full bg-avetor-900 border-l border-avetor-700 shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 bg-avetor-800 border-b border-avetor-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Receipt className="text-avetor-500" />
            <h2 className="font-bold text-white text-lg">Bet Slip <span className="text-sm text-gray-400 font-normal">({items.length})</span></h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-avetor-700 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p>Your bet slip is empty.</p>
              <p className="text-sm mt-2">Add selections to place a bet.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="bg-avetor-800 rounded-lg p-3 border border-avetor-700 relative group">
                <button 
                  onClick={() => onRemove(item.id)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="pr-6">
                  <div className="text-sm text-avetor-400 font-semibold mb-1">
                    {item.selection === 'home' ? '1 (Home)' : item.selection === 'away' ? '2 (Away)' : 'X (Draw)'} @ {item.odds.toFixed(2)}
                  </div>
                  <div className="text-xs text-white mb-2">{item.match.homeTeam} vs {item.match.awayTeam}</div>
                  <div className="text-xs text-gray-500 mb-3">{item.match.league}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Stake</span>
                  <input 
                    type="number" 
                    value={item.stake || ''}
                    placeholder="0"
                    onChange={(e) => onUpdateStake(item.id, parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-avetor-900 border border-avetor-700 rounded px-2 py-1 text-right text-white focus:border-avetor-500 outline-none"
                  />
                </div>
                {item.stake > 0 && (
                   <div className="text-right text-xs text-green-400 mt-1">
                     Return: {(item.stake * item.odds).toFixed(2)}
                   </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-avetor-800 border-t border-avetor-700">
           <div className="flex justify-between text-sm text-gray-400 mb-2">
             <span>Total Stake</span>
             <span className="text-white font-bold">{totalStake.toFixed(2)}</span>
           </div>
           <div className="flex justify-between text-sm text-gray-400 mb-4">
             <span>Est. Return</span>
             <span className="text-green-400 font-bold">{potentialReturn.toFixed(2)}</span>
           </div>

           <button 
             disabled={items.length === 0 || totalStake > balance || totalStake <= 0}
             onClick={onPlaceBet}
             className="w-full bg-avetor-500 hover:bg-avetor-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
           >
             {totalStake > balance ? 'Insufficient Funds' : 'Place Bet'}
           </button>
        </div>
      </div>
    </div>
  );
};
