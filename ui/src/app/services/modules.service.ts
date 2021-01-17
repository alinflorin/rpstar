import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModuleDto, BaseDto } from '@rpstar/common/dto';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  constructor(private http: HttpClient) { }

  getAccessibleModules() {
    return this.http.get<ModuleDto[]>('/api/services/modules/getmodules');
  }
  addModule(module: ModuleDto) {
    return this.http.post<ModuleDto>('/api/services/modules/addmodule', module);
  }

  deleteModule(moduleId: string) {
    return this.http.delete<BaseDto>('/api/services/modules/deletemodule/' + moduleId);
  }
}
