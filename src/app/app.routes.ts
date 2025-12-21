import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Listingproperties } from './Components/listingproperties/listingproperties';
import { Propertyview } from './Components/propertyview/propertyview';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'listingproperties', component: Listingproperties },
    { path: 'propertyview/:id', component: Propertyview },
];
