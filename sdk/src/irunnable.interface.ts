import { ParameterDefinition } from "./parameter-definition.interface";

export interface IRunnable {
  name: string;
  displayName?: string;
  inputs?: ParameterDefinition[];
  outputs?: ParameterDefinition[];
}
