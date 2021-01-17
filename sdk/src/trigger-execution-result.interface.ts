export interface TriggerExecutionResult<TOutput> {
  canExecute: boolean;
  data?: TOutput;
}