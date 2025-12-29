import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'propertyview/:id',
    renderMode: RenderMode.Server  // Use SSR for dynamic routes
  },
  {
    path: 'agent-profile/:id',
    renderMode: RenderMode.Server  // Use SSR for dynamic routes
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender  // Prerender static routes
  }
];
