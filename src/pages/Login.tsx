import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, MapPin, GraduationCap, BookOpen, Shield, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
import { DEMO_ACCOUNTS } from '../constants'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const roleIcons = {
  student: GraduationCap,
  staff: BookOpen,
  admin: Shield,
}

const roleColors = {
  student: 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:border-blue-400',
  staff: 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 hover:border-green-400',
  admin: 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 hover:border-purple-400',
}

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError, isAuthenticated, user } = useAuthStore()
  const { theme } = useUIStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    if (isAuthenticated && user) {
      const path = user.role === 'student' ? '/student' : user.role === 'staff' ? '/staff' : '/admin'
      navigate(path, { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    const ok = await login(email, password)
    if (ok && user) {
      const path = user.role === 'student' ? '/student' : user.role === 'staff' ? '/staff' : '/admin'
      navigate(path, { replace: true })
    }
  }

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[number]) => {
    setEmail(acc.email)
    setPassword(acc.password)
    clearError()
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-indigo-600 p-12 text-white">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <MapPin size={20} />
          </div>
          <span className="text-2xl font-bold">REGEO</span>
        </div>

        <div>
          <h1 className="text-4xl font-black leading-tight mb-4">
            Smart Geofenced<br />Attendance System
          </h1>
          <p className="text-indigo-200 text-lg mb-8">
            Mark attendance automatically when you enter the classroom. No manual roll calls. No proxy attendance.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: MapPin, label: 'GPS Verified', value: '100m radius' },
              { icon: Shield, label: 'Anti-Proxy', value: 'ID + Location' },
              { icon: GraduationCap, label: 'Students', value: '50+ enrolled' },
              { icon: BookOpen, label: 'Courses', value: '15 subjects' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4">
                <Icon size={20} className="mb-2 text-indigo-200" />
                <p className="text-sm text-indigo-200">{label}</p>
                <p className="font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-300 text-sm">
          REGEO &copy; 2024 &mdash; Geofencing-based Attendance Management
        </p>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <MapPin size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">REGEO</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Sign in to your account</p>
          </div>

          {/* Demo accounts */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const Icon = roleIcons[acc.role]
                return (
                  <button
                    key={acc.role}
                    onClick={() => fillDemo(acc)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-left ${roleColors[acc.role]}`}
                  >
                    <Icon size={18} className="mb-1 text-slate-600 dark:text-slate-300" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">{acc.role}</p>
                    <p className="text-xs text-slate-400 truncate">{acc.name.split(' ')[0]}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative flex items-center">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
            <span className="mx-3 text-xs text-slate-400">or sign in manually</span>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@regeo.demo"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Demo@123"
              required
              autoComplete="current-password"
              rightIcon={
                <button type="button" onClick={() => setShowPassword(p => !p)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
            </div>

            <Button type="submit" className="w-full" loading={isLoading} iconRight={!isLoading ? <ArrowRight size={16} /> : undefined}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Demo credentials: <strong>Demo@123</strong> for all accounts
          </p>

          <div className="text-center">
            <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
