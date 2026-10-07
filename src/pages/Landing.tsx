import { useNavigate } from 'react-router-dom'
import { MapPin, Shield, BarChart2, Bell, Clock, GraduationCap, CheckCircle, ArrowRight, Star, Zap } from 'lucide-react'
import { useUIStore } from '../stores/uiStore'
import { useEffect } from 'react'
import Button from '../components/ui/Button'

const features = [
  {
    icon: MapPin,
    title: 'GPS Geofencing',
    description: 'Students can only mark attendance when physically present within the classroom radius. Configurable per classroom.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Shield,
    title: 'Anti-Proxy System',
    description: 'Double verification with GPS location + identity check eliminates proxy attendance completely.',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: BarChart2,
    title: 'Real-time Analytics',
    description: 'Instant dashboards for students, faculty, and administrators. Track trends, identify at-risk students.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Automated alerts for low attendance, class reminders, timetable changes, and verification failures.',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon: Clock,
    title: 'Auto Timetable',
    description: 'Intelligent period detection shows the right class at the right time. No manual period selection needed.',
    color: 'text-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: GraduationCap,
    title: 'Multi-Role Support',
    description: 'Separate dashboards for students, faculty, and administrators with role-appropriate features.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
]

const stats = [
  { value: '99.2%', label: 'Accuracy Rate' },
  { value: '< 3s', label: 'Mark Time' },
  { value: '0', label: 'Proxy Incidents' },
  { value: '50+', label: 'Students' },
]

const testimonials = [
  { name: 'Dr. Meera Nair', role: 'Faculty, CSE', text: 'REGEO eliminated proxy attendance in my classes. The real-time dashboard helps me track student engagement instantly.' },
  { name: 'Arjun Krishnan', role: 'Student, 3rd Year CSE', text: 'Marking attendance takes under 5 seconds. No more rushing to sign the register before class starts!' },
  { name: 'Prof. Rajan Kumar', role: 'Principal', text: 'Attendance accuracy improved from 78% to 99.2% in the first semester. The analytics help us identify and help struggling students.' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { theme } = useUIStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl">REGEO</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
            <Button size="sm" onClick={() => navigate('/login')}>Get started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-6">
            <Zap size={14} />
            Geofencing-Based Attendance
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Attendance that
            <span className="text-indigo-600"> knows </span>
            you're there
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            REGEO uses GPS geofencing and identity verification to automate attendance — eliminating proxy fraud and manual registers forever.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" iconRight={<ArrowRight size={18} />} onClick={() => navigate('/login')}>
              Try Demo Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              View Dashboard
            </Button>
          </div>

          {/* Mock Dashboard Preview */}
          <div className="mt-14 relative mx-auto max-w-4xl">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
              {/* Mock header */}
              <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4 h-6 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center px-3">
                  <span className="text-xs text-slate-400">app.regeo.demo/student</span>
                </div>
              </div>
              {/* Mock content */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                {[
                  { label: 'Overall Attendance', value: '88%', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                  { label: 'Present This Week', value: '18/20', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Absent Count', value: '2', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
                  { label: 'Classes Today', value: '5', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-4`}>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                    <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">CS301 - Data Structures & Algorithms</p>
                    <p className="text-xs text-slate-500">Period 1 &bull; 08:00 - 08:50 &bull; CS-101 &bull; Dr. Meera Nair</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                    Present
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-black text-indigo-600">{value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Everything you need</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              A complete attendance management solution built for modern educational institutions.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">How it works</h2>
            <p className="text-slate-500 dark:text-slate-400">Mark attendance in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enter Classroom', description: 'Walk into the classroom. REGEO detects your GPS coordinates and checks if you are within the geofence boundary.', icon: MapPin },
              { step: '02', title: 'Verify Identity', description: 'Quick camera-based identity verification confirms you are physically present, eliminating proxy attempts.', icon: Shield },
              { step: '03', title: 'Attendance Marked', description: 'Attendance is instantly recorded with timestamp, location data, and verification status. No manual action needed.', icon: CheckCircle },
            ].map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black">
                  {step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">What people say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text }) => (
              <div key={name} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">"{text}"</p>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-black mb-4">Ready to eliminate proxy attendance?</h2>
          <p className="text-indigo-200 mb-8">Try the demo now. No signup required — just pick a role and explore.</p>
          <div className="flex gap-3 justify-center">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
              iconRight={<ArrowRight size={18} />}
              onClick={() => navigate('/login')}
            >
              Try Demo
            </Button>
          </div>
          <p className="text-sm text-indigo-300 mt-4">Student, Staff, and Admin views available</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <MapPin size={13} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">REGEO</span>
          </div>
          <p className="text-sm text-slate-400">
            &copy; 2024 REGEO &mdash; Geofencing-Based Attendance Management System
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
