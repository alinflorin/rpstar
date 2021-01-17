import { FieldType } from "./field-type.enum";
import { ValidationResult } from "./validation-result.interface";

export interface ParameterDefinition {
  fieldType: FieldType;
  multiple?: boolean;
  name: string;
  displayName: string;
  possibleValues?: string[];
  defaultValue?: string;
  required?: boolean;
  validate(value: any): Promise<ValidationResult>;
}