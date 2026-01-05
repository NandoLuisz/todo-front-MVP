import type { Task } from "../model/Task"
import { TaskModel } from "../model/TaskModel"
import type { TodoViewContract } from "./TodoViewContract"

export class TaskPresenter {
  private model: TaskModel
  private view: TodoViewContract
  private tasks: Task[] = []
  private unsubscribe?: () => void

  constructor(view: TodoViewContract) {
    this.model = new TaskModel()
    this.view = view
  }

  async init() {
    this.tasks = await this.model.getAll()
    this.view.renderTasks(this.tasks)

    this.unsubscribe = this.model.subscribeToEvents(event => {
      if (event.type === 'HEARTBEAT') return

      if (event.type === 'CREATED' && event.task) {
        const exists = this.tasks.some(t => t.id === event.task.id)
        if (!exists) {
          this.tasks = [...this.tasks, event.task]
          this.view.renderTasks(this.tasks)
        }
      }

      if (event.type === 'UPDATED' && event.task) {
        this.tasks = this.tasks.map(t =>
          t.id === event.task.id ? event.task : t
        )
        this.view.renderTasks(this.tasks)
      }

      if (event.type === 'DELETED') {
        this.tasks = this.tasks.filter(t => t.id !== event.taskId)
        this.view.renderTasks(this.tasks)
      }
    })
  }

  destroy() {
    this.unsubscribe?.()
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt'>) {
    await this.model.create(task)
    this.view.clearForm()
  }

  async toggleTask(id: number) {
    await this.model.toggleCompleted(id)
  }

  async deleteTask(id: number) {
    await this.model.delete(id)
  }
}
