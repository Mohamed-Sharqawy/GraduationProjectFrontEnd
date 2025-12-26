import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { FindMyAgentComponent } from './Components/find-my-agent/find-my-agent';
import { Listingproperties } from './Components/listingproperties/listingproperties';
import { Propertyview } from './Components/propertyview/propertyview';
import { AgentProfile } from './Components/agent-profile/agent-profile';
import { UserDashboard } from './Components/userdashboard/userdashboard';
import { authGuard } from './Gaurds/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Added default route
  { path: 'home', component: Home },
  { path: 'find-my-agent', component: FindMyAgentComponent, canActivate: [authGuard] },
  { path: 'listingproperties', component: Listingproperties, canActivate: [authGuard] },
  { path: 'propertyview/:id', component: Propertyview },
  { path: 'agent-profile/:id', component: AgentProfile },
  { path: 'user-dashboard', component: UserDashboard, canActivate: [authGuard] },
  {
    path: 'login', loadComponent: () =>
      import('./Components/login/login').then(m => m.Login)
  },
  {
    path: 'register', loadComponent: () =>
      import('./Components/register/register').then(m => m.Register)
  },
  // Protected route for testing auth guard
  {
    path: 'dashboard',
    component: Home, // Using Home component as placeholder for testing
    canActivate: [authGuard]
  }
];

