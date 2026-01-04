import type { Task } from './Task'

export type TaskEvent =
  | { type: 'CREATED'; task: Task }
  | { type: 'UPDATED'; task: Task }
  | { type: 'DELETED'; taskId: number }

