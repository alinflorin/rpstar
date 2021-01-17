import { ITrigger } from "./itrigger.interface";
import { IAction } from "./iaction.interface";

export interface Module {
  name: string;
  icon: string;
  author: string;
  triggers?: ITrigger[];
  actions?: IAction[];
}