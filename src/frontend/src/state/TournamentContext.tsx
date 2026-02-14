import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface TournamentContextType {
  activeTournamentId: bigint | null;
  setActiveTournamentId: (id: bigint | null) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [activeTournamentId, setActiveTournamentIdState] = useState<bigint | null>(() => {
    const stored = localStorage.getItem('activeTournamentId');
    return stored ? BigInt(stored) : null;
  });

  const setActiveTournamentId = (id: bigint | null) => {
    setActiveTournamentIdState(id);
    if (id !== null) {
      localStorage.setItem('activeTournamentId', id.toString());
    } else {
      localStorage.removeItem('activeTournamentId');
    }
  };

  return (
    <TournamentContext.Provider value={{ activeTournamentId, setActiveTournamentId }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournamentContext() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournamentContext must be used within TournamentProvider');
  }
  return context;
}
