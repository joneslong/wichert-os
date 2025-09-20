import React from 'react';

export type ModuleRoute = {
  path: string;
  element: React.ReactNode;
};

export type ModuleDefinition = {
  id: string;
  base: string;
  routes: ModuleRoute[];
};
