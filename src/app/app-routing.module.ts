import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { ErrorComponent } from './welcome/error/error.component';


const routes: Routes = [
  {path: '', component: WelcomeComponent},
  { // lazy loading the training module
    path: 'training',
    loadChildren: () =>
      import('./training/training.module').then((module) => module.TrainingModule),
    canLoad: [AuthGuardService]
  },
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
