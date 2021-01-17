import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ModulesRoutingModule } from './modules-routing.module';
import { ModulesComponent } from './modules/modules.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { AddModuleComponent } from './modules/add-module/add-module.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModulesComponent, AddModuleComponent],
  entryComponents: [AddModuleComponent],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule
  ]
})
export class ModulesModule { }
