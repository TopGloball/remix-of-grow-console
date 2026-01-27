import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { appConfig, UIMode, getUIMode, setUIMode, canPerformActions, isDevMode, isObserverMode } from '@/config/app';

interface ModeContextValue {
  uiMode: UIMode;
  setMode: (mode: UIMode) => void;
  canAct: boolean;
  isDevMode: boolean;
  isObserverMode: boolean;
  apiBaseUrl: string;
  authMode: string;
  useMockData: boolean;
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [uiMode, setUIModeState] = useState<UIMode>(getUIMode());

  const handleSetMode = (mode: UIMode) => {
    setUIMode(mode);
    setUIModeState(mode);
  };

  const value: ModeContextValue = {
    uiMode,
    setMode: handleSetMode,
    canAct: uiMode === 'user' || uiMode === 'dev',
    isDevMode: uiMode === 'dev',
    isObserverMode: uiMode === 'observer',
    apiBaseUrl: appConfig.apiBaseUrl,
    authMode: appConfig.authMode,
    useMockData: appConfig.useMockData,
  };

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): ModeContextValue {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
