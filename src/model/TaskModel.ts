import { api } from '../service/api'
import type { Task } from './Task'
import type { TaskEvent } from './TaskEvent'

export class TaskModel {

  async getAll(): Promise<Task[]> {
    const res = await api.get('/task')
    return res.data
  }

  async create(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const res = await api.post('/task', task)
    return res.data
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/task/${id}`)
  }

  async toggleCompleted(id: number): Promise<void> {
    await api.patch(`/task/${id}/toggle`)
  }

  subscribeToEvents(onEvent: (event: TaskEvent) => void) {
    const source = new EventSource('http://localhost:8080/task/events')

    source.onmessage = e => {
      onEvent(JSON.parse(e.data))
    }

    return () => source.close()
  }
}
