import React, { useState } from 'react';
import { Match, BetSlipItem } from '../types';
import { getMatchInsight } from '../services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onAddToSlip: (selection: BetSlipItem) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onAddToSlip }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const handleGetInsight = async () => {
    if (insight) {
      setInsight(null); // Toggle off
      return;
    }
    setLoadingInsight(true);
    const text = await getMatchInsight(match);
    setInsight(text);
    setLoadingInsight(false);
  };

  const isLive = match.status === 'Live';

  return (
    <div className="bg-avetor-800 rounded-xl p-4 mb-4 border border-avetor-700 shadow-lg relative overflow-hidden">
      {isLive && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg animate-pulse">
          LIVE
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
        <span>{match.sport} • {match.league}</span>
        <span>{isLive ? 'In Play' : new Date(match.startTime).toLocaleString()}</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-start w-1/3">
          <span className="font-bold text-white text-lg truncate w-full">{match.homeTeam}</span>
          {isLive && <span className="text-2xl font-mono text-avetor-400">{match.score?.home}</span>}
        </div>
        
        <div className="text-gray-500 text-sm font-bold">VS</div>

        <div className="flex flex-col items-end w-1/3 text-right">
          <span className="font-bold text-white text-lg truncate w-full">{match.awayTeam}</span>
          {isLive && <span className="text-2xl font-mono text-avetor-400">{match.score?.away}</span>}
        </div>
      </div>

      {/* Insight Section */}
      {insight && (
        <div className="mb-3 p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-sm text-indigo-200 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
            <p>{insight}</p>
          </div>
        </div>
      )}

      {/* Odds Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onAddToSlip({
            id: `${match.id}-home`,
            matchId: match.id,
            selection: 'home',
            odds: match.odds.home,
            match: match,
            stake: 0
          })}
          className="bg-avetor-700 hover:bg-avetor-500 transition-colors py-2 rounded flex flex-col items-center group"
        >
          <span className="text-xs text-gray-400 group-hover:text-white">1</span>
          <span className="font-bold text-avetor-accent group-hover:text-white">{match.odds.home.toFixed(2)}</span>
        </button>

        <button
          disabled={!match.odds.draw}
          onClick={() => match.odds.draw && onAddToSlip({
            id: `${match.id}-draw`,
            matchId: match.id,
            selection: 'draw',
            odds: match.odds.draw,
            match: match,
            stake: 0
          })}
          className={`bg-avetor-700 ${match.odds.draw ? 'hover:bg-avetor-500' : 'opacity-50 cursor-not-allowed'} transition-colors py-2 rounded flex flex-col items-center group`}
        >
          <span className="text-xs text-gray-400 group-hover:text-white">X</span>
          <span className="font-bold text-avetor-accent group-hover:text-white">{match.odds.draw ? match.odds.draw.toFixed(2) : '-'}</span>
        </button>

        <button
          onClick={() => onAddToSlip({
            id: `${match.id}-away`,
            matchId: match.id,
            selection: 'away',
            odds: match.odds.away,
            match: match,
            stake: 0
          })}
          className="bg-avetor-700 hover:bg-avetor-500 transition-colors py-2 rounded flex flex-col items-center group"
        >
          <span className="text-xs text-gray-400 group-hover:text-white">2</span>
          <span className="font-bold text-avetor-accent group-hover:text-white">{match.odds.away.toFixed(2)}</span>
        </button>
      </div>

      <button 
        onClick={handleGetInsight}
        disabled={loadingInsight}
        className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors py-1"
      >
        {loadingInsight ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
        {loadingInsight ? 'Analyzing...' : insight ? 'Hide Insight' : 'Get AI Insight'}
      </button>
    </div>
  );
};
