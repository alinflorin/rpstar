import { Component, OnInit } from '@angular/core';
import { ModulesService } from '../../services/modules.service';
import { ModuleDto } from '@rpstar/common/dto';
import { MatDialog } from '@angular/material/dialog';
import { AddModuleComponent } from './add-module/add-module.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {
  accessibleModules: ModuleDto[];
  constructor(private modulesService: ModulesService, public dialog: MatDialog, private authService: AuthService,
    private toastService: ToastService) { }

  ngOnInit() {
    this.modulesService.getAccessibleModules().subscribe(modules => {
      this.accessibleModules = modules;
    });
  }

  openAddModuleDialog() {
    const dialogRef = this.dialog.open<AddModuleComponent, any, ModuleDto>(AddModuleComponent, {

    });
    dialogRef.afterClosed().subscribe(newModule => {
      if (!newModule) {
        return;
      }
      this.accessibleModules.push(newModule);
      this.accessibleModules = this.accessibleModules.sort((a, b) => {
        if (a.owner == null && b.owner == null) {
          return 0;
        }
        if (a.owner == null && b.owner != null) {
          return -1;
        }
        if (a.owner != null && b.owner == null) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        if (b.name < a.name) {
          return 1;
        }
        if (a.name === b.name) {
          return 0;
        }
        return 0;
      });

      this.toastService.info('Module added successfully');
    });
  }

  deleteModule(module: ModuleDto) {
    this.modulesService.deleteModule(module._id).subscribe(() => {
      this.accessibleModules.splice(this.accessibleModules.indexOf(module), 1);
      this.toastService.info('Module deleted successfully');
    });
  }
}
