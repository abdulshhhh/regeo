import { RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import { router } from './routes'
import { useUIStore } from './stores/uiStore'
import ToastContainer from './components/ui/Toast'

export default function App() {
  const { theme } = useUIStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}
