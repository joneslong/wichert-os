import type { PropsWithChildren } from 'react';
import { DepsContext } from './useDeps';
import { LocalStorage } from '../services/storage/LocalStorage';
import { EventBus } from '../services/bus/EventBus';

const storage = new LocalStorage();
const bus = new EventBus();

// Bridge für Stores außerhalb von React (Zustand):
// Achtung: Nur temporär für frühe Phase; später ersetzen wir direkte window-Zugriffe.
;(window as any).__wos_deps = { storage, bus };

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <DepsContext.Provider value={{ storage, bus }}>
      {children}
    </DepsContext.Provider>
  );
}
