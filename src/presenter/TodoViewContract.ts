import type { Task } from "../model/Task"

export interface TodoViewContract {
  renderTasks(tasks: Task[]): void
  clearForm(): void
}
