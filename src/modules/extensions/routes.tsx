import { lazy } from 'react';
import type { ModuleRoute } from '../../app/registry/types';
const Overview = lazy(() => import('./screens/Overview'));
export const routes: ModuleRoute[] = [{ path: '', element: Overview }];
