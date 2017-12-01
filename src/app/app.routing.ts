import { Routes, RouterModule } from '@angular/router';

import { DashbordComponent } from './components/dashbord/dashbord.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './register/register.component';

const appRoutes: Routes = [
  { path: '', component: DashbordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },


// otherwise redirect to home
{path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
