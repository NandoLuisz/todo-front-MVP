import { useEffect, useRef, useState } from 'react'
import { Plus, X, Check, Square } from 'lucide-react'

import type { Task } from '../model/Task'
import { TaskPresenter } from '../presenter/TaskPresenter'
import type { TodoViewContract } from '../presenter/TodoViewContract'

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

const shortenWord = (word: string, maxLetters = 35, suffix = '...') => {
  if (word && word.length > maxLetters) {
    return word.slice(0, maxLetters) + suffix
  }
  return word
}

const priorityColor = (priority: Priority) => {
  switch (priority) {
    case 'HIGH':
      return 'text-red-500'
    case 'MEDIUM':
      return 'text-yellow-500'
    case 'LOW':
      return 'text-green-500'
    default:
      return 'text-zinc-500'
  }
}

export function TodoView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')

  console.log(tasks)

  const showDescription = title.trim() !== ''

  const presenterRef = useRef<TaskPresenter | null>(null)

  useEffect(() => {
    const view: TodoViewContract = {
      renderTasks: (tasks: Task[]) => setTasks(tasks),
      clearForm: () => {
        setTitle('')
        setDescription('')
        setPriority('MEDIUM')
      }
    }

    presenterRef.current = new TaskPresenter(view)
    presenterRef.current.init()

    return () => {
      presenterRef.current?.destroy()
      presenterRef.current = null
    }
  }, [])

  const handleCreateTask = () => {
    if (!title.trim()) return

    presenterRef.current?.addTask({
      title,
      description,
      priority,
      isCompleted: false
    })
  }

  const handleDeleteTask = (id: number) => {
    presenterRef.current?.deleteTask(id)
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-120 min-h-80 px-4 py-4">
        <h1 className="text-3xl font-semibold mb-4">Teu ToDo</h1>

        <div className="w-full flex flex-row items-end gap-3 mb-8">
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              placeholder="adicionar título"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="outline-none border-b-2 border-zinc-300 focus:border-zinc-500
                         px-1 py-2 w-full transition-colors"
            />

            <div
              className={`
                flex flex-row items-end gap-4 overflow-hidden
                transition-all duration-300 ease-in-out
                ${showDescription ? 'max-h-20 opacity-100 mt-1' : 'max-h-0 opacity-0'}
              `}
            >
              <input
                type="text"
                placeholder="adicionar descrição"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="outline-none border-b-2 border-zinc-300 focus:border-zinc-500
                           px-1 py-2 flex-[2] w-full transition-colors"
              />

              <div className="relative flex items-center">
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as Priority)}
                  className={`
                    appearance-none outline-none border-b-2 bg-transparent
                    px-2 py-1 pr-8 cursor-pointer text-sm font-medium
                    transition-colors
                    ${
                      priority === 'HIGH'
                        ? 'border-red-500 text-red-500'
                        : priority === 'MEDIUM'
                        ? 'border-yellow-500 text-yellow-500'
                        : 'border-green-500 text-green-500'
                    }
                  `}
                >
                  <option value="LOW" className="text-zinc-900">Baixa</option>
                  <option value="MEDIUM" className="text-zinc-900">Média</option>
                  <option value="HIGH" className="text-zinc-900">Alta</option>
                </select>

                <div className="absolute right-2 pointer-events-none">
                  <div
                    className={`w-1.5 h-1.5 border-r-2 border-b-2 rotate-45 ${priorityColor(priority)}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={!showDescription}
            onClick={handleCreateTask}
            className="bg-zinc-800 hover:bg-zinc-900 disabled:bg-zinc-200 disabled:text-zinc-400
                       w-10 h-10 rounded-xl text-white flex items-center justify-center
                       transition-all shadow-sm active:scale-95 mb-1 cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>

        <div>
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex flex-row justify-between items-center
                         border-2 border-zinc-400 rounded-lg
                         px-2 py-2 mb-3"
            >
              <div className="flex flex-row gap-2 items-start">
                <div
                  onClick={() => presenterRef.current!.toggleTask(task.id)}
                  className="cursor-pointer"
                >
                  {task.isCompleted ? (
                    <div className="bg-zinc-600 text-white rounded-[3px]">
                      <Check className="size-6" />
                    </div>
                  ) : (
                    <Square className="size-6 text-zinc-500" />
                  )}
                </div>

                <div className="flex flex-col -mt-1">
                  <span
                    className={
                      task.isCompleted
                        ? 'line-through text-zinc-400'
                        : 'font-semibold'
                    }
                  >
                    {shortenWord(task.title)}
                  </span>

                  <span className="text-zinc-600">
                    {shortenWord(task.description)}
                  </span>

                  <span className={`text-xs font-semibold ${priorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <X
                className="size-5 cursor-pointer"
                onClick={() => handleDeleteTask(task.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
