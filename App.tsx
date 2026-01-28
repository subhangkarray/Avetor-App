import React, { useState } from 'react';
import { ViewState, User, BetSlipItem, BetHistoryItem } from './types';
import { MOCK_MATCHES, INITIAL_BALANCE } from './constants';
import { MatchCard } from './components/MatchCard';
import { AvetorCrashGame } from './components/AvetorCrashGame';
import { BetSlip } from './components/BetSlip';
import { Layout, Home, Trophy, User as UserIcon, LogOut, Wallet, Rocket, Receipt } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.AUTH);
  const [user, setUser] = useState<User | null>(null);
  const [betSlip, setBetSlip] = useState<BetSlipItem[]>([]);
  const [betHistory, setBetHistory] = useState<BetHistoryItem[]>([]);
  const [isSlipOpen, setIsSlipOpen] = useState(false);

  // Authentication Mock
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: 'u1',
      username: 'DemoUser',
      balance: INITIAL_BALANCE
    });
    setView(ViewState.HOME);
  };

  // Betting Logic
  const addToSlip = (item: BetSlipItem) => {
    setBetSlip(prev => {
      // Don't duplicate matches in slip, replace selection if same match
      const existing = prev.find(i => i.matchId === item.matchId);
      if (existing) {
        return prev.map(i => i.matchId === item.matchId ? item : i);
      }
      return [...prev, item];
    });
    setIsSlipOpen(true);
  };

  const removeFromSlip = (id: string) => {
    setBetSlip(prev => prev.filter(i => i.id !== id));
  };

  const updateStake = (id: string, stake: number) => {
    setBetSlip(prev => prev.map(i => i.id === id ? { ...i, stake } : i));
  };

  const placeBets = () => {
    if (!user) return;
    const totalStake = betSlip.reduce((sum, item) => sum + item.stake, 0);
    
    if (totalStake > user.balance) return;

    // Deduct balance
    setUser({ ...user, balance: user.balance - totalStake });

    // Add to history
    const newHistory: BetHistoryItem[] = betSlip.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      type: 'Sports',
      detail: `${item.selection.toUpperCase()} - ${item.match.homeTeam} vs ${item.match.awayTeam}`,
      stake: item.stake,
      multiplier: item.odds,
      payout: 0,
      timestamp: new Date(),
      status: 'Pending'
    }));
    
    setBetHistory(prev => [...newHistory, ...prev]);
    setBetSlip([]);
    setIsSlipOpen(false);
    
    alert("Bets placed successfully!");
  };

  const recordHistory = (type: 'Avetor', detail: string, stake: number, multiplier: number, payout: number, status: 'Won' | 'Lost') => {
    setBetHistory(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      type,
      detail,
      stake,
      multiplier,
      payout,
      timestamp: new Date(),
      status
    }, ...prev]);
  };

  const updateBalance = (amount: number) => {
    if (user) {
      setUser({ ...user, balance: user.balance + amount });
    }
  };

  if (view === ViewState.AUTH) {
    return (
      <div className="min-h-screen bg-avetor-900 flex items-center justify-center p-4">
        <div className="bg-avetor-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-avetor-700">
          <div className="flex justify-center mb-6">
            <div className="bg-avetor-500 p-3 rounded-full">
               <Trophy className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white text-center mb-2">AVETOR</h1>
          <p className="text-gray-400 text-center mb-8">Premium Betting & Crash Games</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Email or Phone</label>
              <input type="text" defaultValue="demo@avetor.com" className="w-full bg-avetor-900 border border-avetor-700 rounded-lg p-3 text-white focus:border-avetor-500 focus:ring-1 focus:ring-avetor-500 outline-none transition-all" />
            </div>
            <div>
               <label className="block text-gray-400 text-sm mb-1">Password</label>
               <input type="password" defaultValue="password" className="w-full bg-avetor-900 border border-avetor-700 rounded-lg p-3 text-white focus:border-avetor-500 focus:ring-1 focus:ring-avetor-500 outline-none transition-all" />
            </div>
            <button type="submit" className="w-full bg-avetor-500 hover:bg-avetor-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02]">
              Start Betting
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-500">
            By logging in, you certify that you are 18+ years of age.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-avetor-900 text-white pb-20 md:pb-0 md:pl-64">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-avetor-800 border-r border-avetor-700 z-30">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-avetor-500 p-2 rounded-lg">
             <Trophy className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-black tracking-wide">AVETOR</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={<Home size={20}/>} label="Sportsbook" active={view === ViewState.HOME} onClick={() => setView(ViewState.HOME)} />
          <SidebarItem icon={<Rocket size={20}/>} label="Avetor Crash" active={view === ViewState.AVETOR} onClick={() => setView(ViewState.AVETOR)} />
          <div className="h-px bg-avetor-700 my-4" />
          <SidebarItem icon={<Layout size={20}/>} label="My Bets" active={view === ViewState.HISTORY} onClick={() => setView(ViewState.HISTORY)} />
          <SidebarItem icon={<UserIcon size={20}/>} label="Profile" active={view === ViewState.PROFILE} onClick={() => setView(ViewState.PROFILE)} />
        </nav>

        <div className="p-4 border-t border-avetor-700">
           <div className="bg-avetor-900 rounded-xl p-3 mb-3">
              <div className="text-xs text-gray-400 mb-1">Balance</div>
              <div className="font-mono font-bold text-green-400 text-lg">${user?.balance.toFixed(2)}</div>
           </div>
           <button onClick={() => setView(ViewState.AUTH)} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
             <LogOut size={16}/> Logout
           </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-avetor-800 border-b border-avetor-700 flex items-center justify-between px-4 z-30">
        <div className="font-black text-xl flex items-center gap-2">
          <div className="bg-avetor-500 p-1.5 rounded">
             <Trophy size={16} />
          </div>
          AVETOR
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-avetor-900 px-3 py-1 rounded-full border border-avetor-700">
             <span className="text-green-400 font-mono text-sm font-bold">${user?.balance.toFixed(2)}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 md:pt-0 p-4 max-w-5xl mx-auto min-h-screen">
        {view === ViewState.HOME && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Promo Banner */}
            <div className="bg-gradient-to-r from-avetor-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-10 -translate-y-10" />
               <div className="relative z-10">
                 <div className="inline-block bg-white/20 px-2 py-0.5 rounded text-xs font-bold mb-2">NEW GAME</div>
                 <h2 className="text-2xl font-black mb-1">PLAY AVETOR CRASH</h2>
                 <p className="text-sm opacity-90 mb-4 max-w-xs">Multiplier goes up to 100x! Cash out before it crashes.</p>
                 <button onClick={() => setView(ViewState.AVETOR)} className="bg-white text-avetor-600 font-bold px-4 py-2 rounded-lg text-sm shadow-lg hover:bg-gray-100 transition-colors">
                   Play Now
                 </button>
               </div>
            </div>

            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1 h-6 bg-avetor-500 rounded-full"/> 
              Live & Upcoming
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {MOCK_MATCHES.map(match => (
                <MatchCard key={match.id} match={match} onAddToSlip={addToSlip} />
              ))}
            </div>
          </div>
        )}

        {view === ViewState.AVETOR && (
           <div className="h-[80vh] animate-in fade-in zoom-in-95 duration-300">
             <AvetorCrashGame 
                balance={user?.balance || 0} 
                onUpdateBalance={updateBalance} 
                onRecordHistory={recordHistory}
              />
           </div>
        )}

        {view === ViewState.HISTORY && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Bet History</h2>
            {betHistory.length === 0 ? (
               <div className="text-center text-gray-500 py-10">No bets placed yet.</div>
            ) : (
              betHistory.map(bet => (
                <div key={bet.id} className="bg-avetor-800 p-4 rounded-xl border border-avetor-700 flex justify-between items-center">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${bet.type === 'Avetor' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
                          {bet.type}
                        </span>
                        <span className="text-xs text-gray-500">{bet.timestamp.toLocaleTimeString()}</span>
                     </div>
                     <div className="font-medium text-sm text-gray-200">{bet.detail}</div>
                   </div>
                   <div className="text-right">
                     <div className={`font-bold ${bet.status === 'Won' ? 'text-green-400' : bet.status === 'Lost' ? 'text-red-400' : 'text-yellow-400'}`}>
                       {bet.status === 'Won' ? `+${bet.payout.toFixed(2)}` : bet.status === 'Lost' ? `-${bet.stake.toFixed(2)}` : 'Pending'}
                     </div>
                     <div className="text-xs text-gray-500">Stake: {bet.stake}</div>
                   </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === ViewState.PROFILE && (
          <div className="space-y-6">
             <div className="bg-avetor-800 p-6 rounded-2xl border border-avetor-700 text-center">
                <div className="w-20 h-20 bg-avetor-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-400">
                  {user?.username.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{user?.username}</h2>
                <div className="text-green-400 font-mono text-xl mb-6">${user?.balance.toFixed(2)}</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-bold transition-colors">Deposit</button>
                  <button className="bg-avetor-700 hover:bg-avetor-600 text-white py-2 rounded-lg font-bold transition-colors">Withdraw</button>
                </div>
             </div>

             <div className="bg-avetor-800 p-4 rounded-xl border border-avetor-700">
               <h3 className="font-bold mb-4 text-gray-300">Account Details</h3>
               <div className="space-y-3 text-sm">
                 <div className="flex justify-between border-b border-avetor-700 pb-2">
                   <span className="text-gray-500">Email</span>
                   <span className="text-white">demo@avetor.com</span>
                 </div>
                 <div className="flex justify-between border-b border-avetor-700 pb-2">
                   <span className="text-gray-500">Member Since</span>
                   <span className="text-white">Oct 2023</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500">Status</span>
                   <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"/> Verified</span>
                 </div>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* Floating Bet Slip Button (Mobile) */}
      {view === ViewState.HOME && betSlip.length > 0 && !isSlipOpen && (
        <button 
          onClick={() => setIsSlipOpen(true)}
          className="md:hidden fixed bottom-20 right-4 bg-avetor-500 text-white p-4 rounded-full shadow-lg shadow-avetor-500/40 z-40 animate-bounce"
        >
          <Receipt size={24} />
          <span className="absolute -top-1 -right-1 bg-white text-avetor-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {betSlip.length}
          </span>
        </button>
      )}

      {/* Bet Slip Drawer/Modal */}
      <BetSlip 
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        items={betSlip}
        onRemove={removeFromSlip}
        onUpdateStake={updateStake}
        onPlaceBet={placeBets}
        balance={user?.balance || 0}
      />

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-avetor-800 border-t border-avetor-700 flex justify-around p-3 z-30 pb-safe">
        <MobileNavItem icon={<Home size={24}/>} label="Sports" active={view === ViewState.HOME} onClick={() => setView(ViewState.HOME)} />
        <MobileNavItem icon={<Rocket size={24}/>} label="Crash" active={view === ViewState.AVETOR} onClick={() => setView(ViewState.AVETOR)} />
        <div className="w-px bg-avetor-700 h-full mx-2" />
        <MobileNavItem icon={<Layout size={24}/>} label="Bets" active={view === ViewState.HISTORY} onClick={() => setView(ViewState.HISTORY)} />
        <MobileNavItem icon={<UserIcon size={24}/>} label="Profile" active={view === ViewState.PROFILE} onClick={() => setView(ViewState.PROFILE)} />
      </nav>
    </div>
  );
};

// Helper Components for Nav
const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
      ${active ? 'bg-avetor-700 text-white shadow-md' : 'text-gray-400 hover:bg-avetor-700/50 hover:text-white'}`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-avetor-500' : 'text-gray-500'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
