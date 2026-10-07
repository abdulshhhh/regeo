import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center px-4">
        <div className="text-8xl font-black text-slate-200 dark:text-slate-800 select-none">404</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">Page Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button icon={<Home size={16} />} onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </div>
    </div>
  )
}
