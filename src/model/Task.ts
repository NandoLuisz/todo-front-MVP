export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Task {
  id: number
  title: string
  description: string
  priority: Priority
  isCompleted: boolean
  createdAt: string
}
