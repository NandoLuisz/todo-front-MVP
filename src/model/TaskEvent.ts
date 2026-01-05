import type { Task } from './Task'

export type TaskEvent =
  | {
      type: 'CREATED' | 'UPDATED'
      task: Task
    }
  | {
      type: 'DELETED'
      taskId: number
    }
  | {
      type: 'HEARTBEAT'
    }
