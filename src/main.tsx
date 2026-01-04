import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { TodoView } from './view/TodoView'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TodoView />
  </StrictMode>,
)
