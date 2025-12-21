import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { FindMyAgentComponent } from './find-my-agent/find-my-agent';
import { Listingproperties } from './Components/listingproperties/listingproperties';
import { Propertyview } from './Components/propertyview/propertyview';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Added default route
  { path: 'home', component: Home },
  { path: 'find-my-agent', component: FindMyAgentComponent },
  { path: 'listingproperties', component: Listingproperties },
  { path: 'propertyview/:id', component: Propertyview },
];
