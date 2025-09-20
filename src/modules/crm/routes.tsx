import { lazy } from 'react';
import type { ModuleRoute } from '../../app/registry/types';
const Contacts = lazy(() => import('./screens/Contacts'));
export const routes: ModuleRoute[] = [{ path: '', element: Contacts }];
