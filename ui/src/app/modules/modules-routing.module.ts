import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModulesComponent } from './modules/modules.component';
import { LoggedInGuard } from '../services/guards/logged-in.guard';

const routes: Routes = [{ path: '', component: ModulesComponent, canActivate: [LoggedInGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
