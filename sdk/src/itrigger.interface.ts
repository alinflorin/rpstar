import { IRunnable } from "./irunnable.interface";
import { TriggerExecutionResult } from "./trigger-execution-result.interface";

export interface ITrigger extends IRunnable {
  canExecute<TInput, TOutput>(inputValues: TInput): Promise<TriggerExecutionResult<TOutput>>;
}
