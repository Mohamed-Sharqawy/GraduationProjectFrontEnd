import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { FindMyAgentComponent } from './Components/find-my-agent/find-my-agent';
import { Listingproperties } from './Components/listingproperties/listingproperties';
// Propertyview is lazy loaded now
import { AgentProfile } from './Components/agent-profile/agent-profile';
import { UserDashboard } from './Components/userdashboard/userdashboard';
import { authGuard } from './Gaurds/auth-guard';
import { agentGuard } from './Gaurds/agent-guard';
import { subscriptionGuard } from './Gaurds/subscription-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Added default route
  { path: 'home', component: Home },
  { path: 'find-my-agent', component: FindMyAgentComponent },
  { path: 'listingproperties', component: Listingproperties },
  { 
    path: 'propertyview/:id', 
    loadComponent: () => import('./Components/propertyview/propertyview').then(m => m.Propertyview)
  },
  { path: 'agent-profile/:id', component: AgentProfile },
  // Profile requires authentication AND agent role
  {
    path: 'user-profile',
    loadComponent: () => import('./Components/user-profile/user-profile').then(m => m.UserProfile),
    canActivate: [authGuard, agentGuard]
  },
  // Dashboard requires authentication, agent role, AND active subscription
  { path: 'user-dashboard', component: UserDashboard, canActivate: [authGuard, agentGuard, subscriptionGuard] },
  // Saved Properties for owners (requires authentication only)
  {
    path: 'saved-properties',
    loadComponent: () => import('./Components/saved-properties/saved-properties.component').then(m => m.SavedPropertiesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login', loadComponent: () =>
      import('./Components/login/login').then(m => m.Login)
  },
  {
    path: 'register', loadComponent: () =>
      import('./Components/register/register').then(m => m.Register)
  },
  // Payment callback route for PayPal redirect
  {
    path: 'payment-callback',
    loadComponent: () => import('./Components/payment-callback/payment-callback').then(m => m.PaymentCallbackComponent),
    data: { ssr: false } // Disable SSR for this route as it depends on query params
  },
  // Protected dashboard route
  {
    path: 'dashboard',
    component: Home, // Using Home component as placeholder for testing
    canActivate: [authGuard, subscriptionGuard]
  },
  { path: '**', redirectTo: 'home' } // Wildcard route for a 404 page or redirect
];

