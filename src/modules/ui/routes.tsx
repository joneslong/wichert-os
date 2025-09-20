import { lazy } from 'react';
import type { ModuleRoute } from '../../app/registry/types';
const UiPlayground = lazy(() => import('./screens/UiPlayground'));
export const routes: ModuleRoute[] = [{ path: '', element: UiPlayground }];
