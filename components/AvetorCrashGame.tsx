import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Trophy, AlertTriangle, History } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

interface AvetorCrashGameProps {
  balance: number;
  onUpdateBalance: (amount: number) => void;
  onRecordHistory: (type: 'Avetor', detail: string, stake: number, multiplier: number, payout: number, status: 'Won' | 'Lost') => void;
}

export const AvetorCrashGame: React.FC<AvetorCrashGameProps> = ({ balance, onUpdateBalance, onRecordHistory }) => {
  const [gameState, setGameState] = useState<'IDLE' | 'RUNNING' | 'CRASHED'>('IDLE');
  const [multiplier, setMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(10);
  const [cashOutPoint, setCashOutPoint] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([1.45, 2.10, 1.15, 8.40, 1.80]);
  
  // Animation ref
  const reqRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const crashPointRef = useRef<number>(0);

  // Chart data
  const [chartData, setChartData] = useState<{ time: number; val: number }[]>([]);

  const startGame = () => {
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    onUpdateBalance(-betAmount);
    setGameState('RUNNING');
    setCashOutPoint(null);
    setMultiplier(1.00);
    setChartData([{ time: 0, val: 1 }]);
    startTimeRef.current = Date.now();
    
    // Determine crash point (random weighted towards lower numbers for realism)
    // Simple logic: 1 / Math.random() has too high EV. 
    // Usually logic is E = 0.99 * (1 / (1-R)).
    const r = Math.random();
    // Simplified logic: 30% chance of instant crash (<1.2), 5% chance of moon (>10)
    let crash = 1 / (1 - r);
    // Cap strictly for simulation safety
    if (!Number.isFinite(crash)) crash = 100;
    // Apply house edge simulation
    crash = Math.max(1.0, crash * 0.95);
    
    crashPointRef.current = parseFloat(crash.toFixed(2));
    
    runGameLoop();
  };

  const runGameLoop = () => {
    const now = Date.now();
    const elapsed = (now - startTimeRef.current) / 1000; // seconds
    
    // Exponential growth curve: y = e^(0.1 * t)
    const currentMult = Math.max(1, Math.exp(elapsed * 0.2));
    
    setMultiplier(parseFloat(currentMult.toFixed(2)));
    setChartData(prev => [...prev, { time: prev.length, val: currentMult }]);

    if (currentMult >= crashPointRef.current) {
      crashGame(crashPointRef.current);
    } else {
      reqRef.current = requestAnimationFrame(runGameLoop);
    }
  };

  const crashGame = (finalVal: number) => {
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    setGameState('CRASHED');
    setMultiplier(finalVal);
    setHistory(prev => [finalVal, ...prev].slice(0, 8)); // Keep last 8
    
    // If user hasn't cashed out, they lose
    if (!cashOutPoint) {
      onRecordHistory('Avetor', `Crashed @ ${finalVal}x`, betAmount, finalVal, 0, 'Lost');
    }
  };

  const handleCashOut = () => {
    if (gameState !== 'RUNNING') return;
    
    // Successful cash out
    const winAmount = betAmount * multiplier;
    setCashOutPoint(multiplier);
    onUpdateBalance(winAmount);
    // Don't stop the game visualization, just mark user as safe
    onRecordHistory('Avetor', `Cashed out @ ${multiplier.toFixed(2)}x`, betAmount, multiplier, winAmount, 'Won');
  };

  useEffect(() => {
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-avetor-900 text-white p-4">
      {/* History Bar */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center text-gray-400 text-sm gap-1 mr-2">
           <History size={16}/>
        </div>
        {history.map((h, i) => (
          <div 
            key={i} 
            className={`px-3 py-1 rounded-full text-xs font-bold min-w-[3rem] text-center
              ${h < 2.0 ? 'bg-avetor-700 text-gray-300' : 
                h < 10.0 ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400 border border-yellow-600'}`}
          >
            {h.toFixed(2)}x
          </div>
        ))}
      </div>

      {/* Game Canvas */}
      <div className="flex-1 bg-avetor-800 rounded-2xl relative overflow-hidden border border-avetor-700 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
        {/* Background Grid/Chart */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area type="monotone" dataKey="val" stroke="#e11d48" fill="#e11d48" strokeWidth={3} isAnimationActive={false} />
              <YAxis domain={['dataMin', 'dataMax']} hide />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Center Display */}
        <div className="relative z-10 text-center">
          {gameState === 'CRASHED' ? (
            <div className="animate-bounce">
              <div className="text-6xl font-black text-gray-500 mb-2">CRASHED</div>
              <div className="text-4xl font-bold text-red-500">@{multiplier.toFixed(2)}x</div>
            </div>
          ) : (
            <>
              {gameState === 'RUNNING' && <Rocket className="w-16 h-16 text-avetor-500 animate-pulse mx-auto mb-4" />}
              <div className={`text-7xl font-black tabular-nums tracking-tighter ${gameState === 'RUNNING' ? 'text-white' : 'text-gray-400'}`}>
                {multiplier.toFixed(2)}x
              </div>
              {cashOutPoint && (
                <div className="mt-2 text-green-400 font-bold bg-green-900/50 px-4 py-1 rounded-full border border-green-500/50">
                  You Won {(betAmount * cashOutPoint).toFixed(2)}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 bg-avetor-800 p-4 rounded-xl border border-avetor-700">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-gray-400 text-xs mb-1 block">Bet Amount</label>
            <div className="flex items-center gap-2 bg-avetor-900 rounded-lg p-1 border border-avetor-700">
              <button onClick={() => setBetAmount(Math.max(1, betAmount - 5))} className="p-2 hover:bg-avetor-700 rounded text-gray-400">-</button>
              <input 
                type="number" 
                value={betAmount} 
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="bg-transparent w-full text-center font-bold text-lg outline-none"
              />
              <button onClick={() => setBetAmount(betAmount + 5)} className="p-2 hover:bg-avetor-700 rounded text-gray-400">+</button>
            </div>
            <div className="flex gap-2 mt-2">
               {[10, 50, 100, 200].map(amt => (
                 <button key={amt} onClick={() => setBetAmount(amt)} className="text-xs bg-avetor-700 hover:bg-avetor-600 px-2 py-1 rounded text-gray-300">
                   {amt}
                 </button>
               ))}
            </div>
          </div>
          
          <div className="flex-1">
             {gameState === 'IDLE' || gameState === 'CRASHED' ? (
               <button 
                 onClick={startGame}
                 className="w-full h-14 bg-avetor-500 hover:bg-avetor-400 text-white font-black text-xl rounded-lg shadow-lg shadow-avetor-500/30 transition-all active:scale-95"
               >
                 BET
               </button>
             ) : (
               <button 
                 onClick={handleCashOut}
                 disabled={!!cashOutPoint}
                 className={`w-full h-14 font-black text-xl rounded-lg shadow-lg transition-all active:scale-95 flex flex-col items-center justify-center leading-none
                   ${cashOutPoint ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400 text-white shadow-green-500/30'}`}
               >
                 <span>CASH OUT</span>
                 {!cashOutPoint && <span className="text-sm opacity-80">{(betAmount * multiplier).toFixed(2)}</span>}
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
