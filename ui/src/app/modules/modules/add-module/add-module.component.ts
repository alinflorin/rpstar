import { Component, OnInit } from '@angular/core';
import { ModuleDto } from '@rpstar/common/dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ModulesService } from '../../../services/modules.service';
import { WsService } from '../../../services/ws.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss']
})
export class AddModuleComponent implements OnInit {
  currentMessage = 'Initializing';
  loading = false;
  newModule: ModuleDto;
  repoUrlFc = new FormControl('', [Validators.required, Validators.pattern('(https://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]);
  formGroup = new FormGroup({
    repoUrl: this.repoUrlFc
  });
  constructor(
    private dialogRef: MatDialogRef<AddModuleComponent>,
    private modulesService: ModulesService,
    private ws: WsService) {

  }

  ngOnInit() {
  }

  addModule(moduleDto: ModuleDto) {
    const wsSub = this.ws.messages
      .pipe(filter(x => x.category === 'modules' && x.name === 'addmodule'))
      .subscribe(
        notif => {
          this.currentMessage = notif.payload;
        }
      );
    this.loading = true;
    this.modulesService.addModule(moduleDto).subscribe(savedModule => {
      this.loading = false;
      this.currentMessage = 'Done';
      wsSub.unsubscribe();
      this.dialogRef.close(savedModule);
    }, e => {
      this.loading = false;
      this.currentMessage = null;
      wsSub.unsubscribe();
    });
  }
}
