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

  subscribeToEvents(callback: (event: TaskEvent) => void) {
    let eventSource: EventSource | null = null

    const connect = () => {
      eventSource = new EventSource(
        'https://todo-engenharia-software.onrender.com/task/events'
      )

      eventSource.onmessage = e => {
        const event: TaskEvent = JSON.parse(e.data)

        if (event.type === 'HEARTBEAT') return

        callback(event)
      }

      eventSource.onerror = () => {
        eventSource?.close()
        setTimeout(connect, 3000)
      }
    }

    connect()

    return () => {
      eventSource?.close()
    }
  }
}
