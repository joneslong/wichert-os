import { createContext, useContext } from 'react';
import type { IStorage } from '../services/storage/IStorage';
import { EventBus } from '../services/bus/EventBus';

export type Deps = { storage: IStorage; bus: EventBus; };
export const DepsContext = createContext<Deps | null>(null);
export const useDeps = () => {
  const ctx = useContext(DepsContext);
  if (!ctx) throw new Error('DepsContext not provided');
  return ctx;
};
