import { IRunnable } from "./irunnable.interface";
import { ActionExecutionResult } from "./action-execution-result.interface";

export interface IAction extends IRunnable {
  execute<TInput, TOutput>(inputValues: TInput): Promise<ActionExecutionResult<TOutput>>;
}
