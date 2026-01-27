// Application Configuration
// Central config for API, auth, and UI modes

export type UIMode = 'user' | 'observer' | 'dev';
export type AuthMode = 'cookies' | 'mock';

interface AppConfig {
  // API Configuration
  apiBaseUrl: string;
  
  // Authentication mode
  authMode: AuthMode;
  
  // UI mode determines available features
  uiMode: UIMode;
  
  // Feature flags
  useMockData: boolean;
}

// Read from environment or use defaults
export const appConfig: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  authMode: (import.meta.env.VITE_AUTH_MODE as AuthMode) || 'mock',
  uiMode: (import.meta.env.VITE_UI_MODE as UIMode) || 'user',
  useMockData: import.meta.env.VITE_USE_MOCK !== 'false',
};

// Runtime mode switching (for dev purposes)
let runtimeUIMode: UIMode = appConfig.uiMode;

export function getUIMode(): UIMode {
  return runtimeUIMode;
}

export function setUIMode(mode: UIMode): void {
  runtimeUIMode = mode;
}

// Mode checks
export function isObserverMode(): boolean {
  return getUIMode() === 'observer';
}

export function isDevMode(): boolean {
  return getUIMode() === 'dev';
}

export function isUserMode(): boolean {
  return getUIMode() === 'user';
}

export function canPerformActions(): boolean {
  return getUIMode() === 'user' || getUIMode() === 'dev';
}
