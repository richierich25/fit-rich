import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingComponent } from './training.component';

const routes: Routes = [
  // {path: 'training', component: TrainingComponent, canActivate: [AuthGuardService]}, // for lazy loading
  // removed the canActivate and replaced by canLoad to check for authentication before loading this module itself as otherwise this module will have to be loaded
  {path: '', component: TrainingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
