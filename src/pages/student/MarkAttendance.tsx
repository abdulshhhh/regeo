import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CheckCircle, XCircle, Camera, AlertTriangle, Navigation, Clock, BookOpen, ArrowLeft, ArrowRight, Shield } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useAttendanceStore } from '../../stores/attendanceStore'
import { useUIStore } from '../../stores/uiStore'
import { mockTimetable, mockCourses, mockClassrooms, mockStaff } from '../../mock/data'
import { checkGeofence } from '../../utils/geofence'
import { getCurrentDay, getCurrentPeriod } from '../../utils/format'
import { PERIODS } from '../../constants'
import type { AttendanceRecord } from '../../types'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

type Step = 'select' | 'details' | 'location' | 'geofence' | 'identity' | 'confirm' | 'success'

const steps: { id: Step; label: string }[] = [
  { id: 'select', label: 'Select Class' },
  { id: 'details', label: 'Class Details' },
  { id: 'location', label: 'Location' },
  { id: 'geofence', label: 'Geofence' },
  { id: 'identity', label: 'Identity' },
  { id: 'confirm', label: 'Confirm' },
  { id: 'success', label: 'Done' },
]

export default function MarkAttendance() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addRecord } = useAttendanceStore()
  const { addToast } = useUIStore()

  const [step, setStep] = useState<Step>('select')
  const [selectedEntry, setSelectedEntry] = useState<typeof mockTimetable[0] | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [geofenceResult, setGeofenceResult] = useState<ReturnType<typeof checkGeofence> | null>(null)
  const [identityProgress, setIdentityProgress] = useState(0)
  const [identityDone, setIdentityDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentDay = getCurrentDay()
  const currentPeriod = getCurrentPeriod(PERIODS)

  // Today's timetable for CSE student
  const todayEntries = currentDay !== 'weekend'
    ? mockTimetable.filter(t => t.day === currentDay && ['c001', 'c002', 'c003', 'c004', 'c015'].includes(t.courseId))
    : mockTimetable.filter(t => t.day === 'monday' && ['c001', 'c002', 'c003', 'c004', 'c015'].includes(t.courseId))

  const goNext = () => {
    const idx = steps.findIndex(s => s.id === step)
    if (idx < steps.length - 1) setStep(steps[idx + 1].id)
  }

  const goPrev = () => {
    const idx = steps.findIndex(s => s.id === step)
    if (idx > 0) setStep(steps[idx - 1].id)
  }

  const stepIndex = steps.findIndex(s => s.id === step)

  // Location detection
  const detectLocation = () => {
    setLocationLoading(true)
    setLocationError(null)
    if (!navigator.geolocation) {
      // Simulate demo location (inside classroom geofence)
      setTimeout(() => {
        setLocation({ lat: 13.0108, lng: 80.0031, accuracy: 15 })
        setLocationLoading(false)
      }, 1500)
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy })
        setLocationLoading(false)
      },
      () => {
        // Demo fallback
        setLocation({ lat: 13.0108, lng: 80.0031, accuracy: 15 })
        setLocationLoading(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  // Calculate geofence when we have location and selected entry
  useEffect(() => {
    if (step === 'geofence' && location && selectedEntry) {
      const classroom = mockClassrooms.find(c => c.id === selectedEntry.classroomId)
      if (classroom) {
        const result = checkGeofence(
          { lat: location.lat, lng: location.lng },
          { lat: classroom.latitude, lng: classroom.longitude },
          classroom.radius,
          location.accuracy
        )
        setGeofenceResult(result)
      }
    }
  }, [step, location, selectedEntry])

  // Identity verification progress
  useEffect(() => {
    if (step === 'identity') {
      setIdentityProgress(0)
      setIdentityDone(false)
      let progress = 0
      timerRef.current = setInterval(() => {
        progress += 8
        setIdentityProgress(Math.min(progress, 100))
        if (progress >= 100) {
          clearInterval(timerRef.current!)
          setIdentityDone(true)
        }
      }, 150)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
  }, [step])

  const handleSubmit = async () => {
    if (!selectedEntry || !user) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    const record: AttendanceRecord = {
      id: `ar_${Date.now()}`,
      studentId: user.id,
      courseId: selectedEntry.courseId,
      timetableEntryId: selectedEntry.id,
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      locationVerified: geofenceResult?.status === 'verified',
      identityVerified: identityDone,
      distance: geofenceResult?.distance ? Math.round(geofenceResult.distance) : undefined,
      accuracy: location?.accuracy,
      markedAt: new Date().toTimeString().slice(0, 5),
    }
    addRecord(record)
    addToast({ type: 'success', title: 'Attendance Marked!', message: `${mockCourses.find(c => c.id === selectedEntry.courseId)?.code} - Period ${selectedEntry.period}` })
    setSubmitting(false)
    setStep('success')
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
      <div className="flex items-center gap-1">
        {steps.slice(0, -1).map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              step === s.id ? 'bg-indigo-600 text-white' :
              i < stepIndex ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
              'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              {i < stepIndex ? <CheckCircle size={12} /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 2 && (
              <div className={`w-6 h-0.5 mx-1 ${i < stepIndex - 1 ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  // Step: Select class
  const renderSelect = () => (
    <div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Select Your Class</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {currentDay === 'weekend' ? 'Showing Monday\'s schedule as demo (it\'s the weekend)' : `Today's classes — ${currentDay.charAt(0).toUpperCase() + currentDay.slice(1)}`}
      </p>
      <div className="space-y-3">
        {todayEntries.map(entry => {
          const course = mockCourses.find(c => c.id === entry.courseId)
          const classroom = mockClassrooms.find(c => c.id === entry.classroomId)
          const faculty = mockStaff.find(f => f.id === entry.facultyId)
          const isCurrent = entry.period === currentPeriod && currentDay !== 'weekend'
          return (
            <div
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedEntry?.id === entry.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {entry.period}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{course?.code} - {course?.name}</p>
                    {isCurrent && <Badge variant="success" size="sm">Now</Badge>}
                  </div>
                  <p className="text-xs text-slate-400">{entry.startTime}–{entry.endTime} • {classroom?.name} • {faculty?.name}</p>
                </div>
                {selectedEntry?.id === entry.id && <CheckCircle size={20} className="text-indigo-500 flex-shrink-0" />}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 flex justify-end">
        <Button disabled={!selectedEntry} iconRight={<ArrowRight size={16} />} onClick={goNext}>
          Continue
        </Button>
      </div>
    </div>
  )

  // Step: Details
  const renderDetails = () => {
    if (!selectedEntry) return null
    const course = mockCourses.find(c => c.id === selectedEntry.courseId)
    const classroom = mockClassrooms.find(c => c.id === selectedEntry.classroomId)
    const faculty = mockStaff.find(f => f.id === selectedEntry.facultyId)
    return (
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Class Details</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Verify the class information before marking attendance</p>
        <div className="space-y-3">
          {[
            { label: 'Course', value: `${course?.code} — ${course?.name}`, icon: BookOpen },
            { label: 'Period', value: `Period ${selectedEntry.period} (${selectedEntry.startTime}–${selectedEntry.endTime})`, icon: Clock },
            { label: 'Classroom', value: `${classroom?.name}, ${classroom?.building}, Floor ${classroom?.floor}`, icon: MapPin },
            { label: 'Faculty', value: faculty?.name || 'Unknown', icon: Shield },
            { label: 'Geofence Radius', value: `${classroom?.radius}m from classroom`, icon: Navigation },
            { label: 'Section', value: `Section ${selectedEntry.section}`, icon: BookOpen },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <Icon size={16} className="text-indigo-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3 justify-between">
          <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={goPrev}>Back</Button>
          <Button iconRight={<ArrowRight size={16} />} onClick={() => { goNext(); detectLocation() }}>
            Detect Location
          </Button>
        </div>
      </div>
    )
  }

  // Step: Location
  const renderLocation = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Detecting Location</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">We need your GPS location to verify you are in the classroom</p>
      <div className="flex flex-col items-center gap-6">
        {locationLoading ? (
          <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          </div>
        ) : location ? (
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-500" />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle size={40} className="text-red-500" />
          </div>
        )}

        {locationLoading && <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Acquiring GPS signal...</p>}
        {location && (
          <div className="space-y-1 text-sm">
            <p className="text-green-600 dark:text-green-400 font-semibold">Location acquired!</p>
            <p className="text-slate-400">Lat: {location.lat.toFixed(6)}</p>
            <p className="text-slate-400">Lng: {location.lng.toFixed(6)}</p>
            <p className="text-slate-400">Accuracy: ±{Math.round(location.accuracy)}m</p>
          </div>
        )}
        {locationError && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle size={16} />
            <p className="text-sm">{locationError}</p>
          </div>
        )}
      </div>
      <div className="mt-8 flex gap-3 justify-between">
        <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={goPrev}>Back</Button>
        {!locationLoading && !location && (
          <Button onClick={detectLocation} icon={<Navigation size={16} />}>Retry</Button>
        )}
        {location && (
          <Button iconRight={<ArrowRight size={16} />} onClick={goNext}>Check Geofence</Button>
        )}
      </div>
    </div>
  )

  // Step: Geofence
  const renderGeofence = () => {
    if (!selectedEntry || !location) return null
    const classroom = mockClassrooms.find(c => c.id === selectedEntry.classroomId)
    if (!classroom) return null

    const inside = geofenceResult?.inside ?? false
    const distance = geofenceResult?.distance ?? 0
    const maxDisplay = classroom.radius * 2.5

    // SVG map visualization
    const svgSize = 260
    const center = svgSize / 2
    const scale = (center - 20) / maxDisplay

    // Classroom pin at center
    // Student offset (simulated)
    const dx = (location.lng - classroom.longitude) * 111320 * Math.cos(classroom.latitude * Math.PI / 180)
    const dy = -(location.lat - classroom.latitude) * 111320
    const studentX = center + Math.min(Math.max(dx * scale, -center + 20), center - 20)
    const studentY = center + Math.min(Math.max(dy * scale, -center + 20), center - 20)
    const radiusPx = classroom.radius * scale

    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Geofence Verification</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Checking if you are within the classroom boundary</p>

        {/* SVG Map */}
        <div className="flex justify-center mb-4">
          <svg width={svgSize} height={svgSize} className="rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {/* Grid */}
            {[0.25, 0.5, 0.75].map(f => (
              <circle key={f} cx={center} cy={center} r={center * f} fill="none" stroke="#e2e8f0" strokeWidth="1" className="dark:opacity-20" />
            ))}
            {/* Geofence circle */}
            <circle
              cx={center} cy={center} r={Math.max(radiusPx, 10)}
              fill={inside ? '#10b98120' : '#ef444420'}
              stroke={inside ? '#10b981' : '#ef4444'}
              strokeWidth="2" strokeDasharray="5,3"
            />
            {/* Classroom marker */}
            <g transform={`translate(${center},${center})`}>
              <circle r={8} fill="#6366f1" />
              <text x="0" y="4" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">C</text>
            </g>
            {/* Student marker */}
            <g transform={`translate(${studentX},${studentY})`}>
              <circle r={7} fill={inside ? '#10b981' : '#ef4444'} stroke="white" strokeWidth="2" />
              <text x="0" y="4" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">S</text>
            </g>
            {/* Distance line */}
            <line x1={center} y1={center} x2={studentX} y2={studentY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" />
            {/* Labels */}
            <text x={center} y={svgSize - 8} textAnchor="middle" fontSize="9" fill="#94a3b8">
              Radius: {classroom.radius}m | Distance: {Math.round(distance)}m
            </text>
          </svg>
        </div>

        {geofenceResult && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm mb-4 ${
            geofenceResult.status === 'verified' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
            geofenceResult.status === 'low_accuracy' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {geofenceResult.status === 'verified' ? <CheckCircle size={16} /> : geofenceResult.status === 'low_accuracy' ? <AlertTriangle size={16} /> : <XCircle size={16} />}
            {geofenceResult.status === 'verified' ? 'Inside Geofence — Verified' :
             geofenceResult.status === 'low_accuracy' ? 'Low GPS Accuracy — Demo Mode' :
             `Outside Geofence (${Math.round(distance)}m away)`}
          </div>
        )}

        <div className="mt-6 flex gap-3 justify-between">
          <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={goPrev}>Back</Button>
          <Button iconRight={<ArrowRight size={16} />} onClick={goNext} disabled={!geofenceResult}>
            Verify Identity
          </Button>
        </div>
      </div>
    )
  }

  // Step: Identity
  const renderIdentity = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Identity Verification</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Camera-based facial recognition to confirm your identity</p>

      <div className="relative inline-block mb-6">
        <div className="w-48 h-36 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border-2 border-indigo-500">
          {identityDone ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle size={32} className="text-green-400" />
              <span className="text-white text-sm font-semibold">Identity Confirmed</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Camera size={28} className="text-slate-400 animate-pulse" />
              <span className="text-slate-400 text-xs">Scanning face...</span>
            </div>
          )}
        </div>
        {!identityDone && (
          <div className="absolute -inset-1 rounded-xl border-2 border-indigo-400 animate-ping opacity-40" />
        )}
      </div>

      <div className="max-w-xs mx-auto mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400">{identityDone ? 'Verification complete' : 'Analyzing...'}</span>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{identityProgress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-200"
            style={{ width: `${identityProgress}%` }}
          />
        </div>
        {identityProgress > 0 && identityProgress < 100 && (
          <div className="flex gap-2 mt-2 justify-center text-xs text-slate-400">
            {identityProgress < 40 && <span>Detecting face...</span>}
            {identityProgress >= 40 && identityProgress < 70 && <span>Analyzing features...</span>}
            {identityProgress >= 70 && identityProgress < 100 && <span>Matching identity...</span>}
          </div>
        )}
      </div>

      {identityDone && (
        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-4">
          <CheckCircle size={16} />
          <span className="text-sm font-semibold">Matched: {user?.name}</span>
        </div>
      )}

      <div className="mt-6 flex gap-3 justify-between">
        <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={goPrev}>Back</Button>
        <Button iconRight={<ArrowRight size={16} />} disabled={!identityDone} onClick={goNext}>
          Confirm Attendance
        </Button>
      </div>
    </div>
  )

  // Step: Confirm
  const renderConfirm = () => {
    if (!selectedEntry) return null
    const course = mockCourses.find(c => c.id === selectedEntry.courseId)
    const classroom = mockClassrooms.find(c => c.id === selectedEntry.classroomId)
    return (
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Confirm Attendance</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Review and submit your attendance</p>

        <div className="space-y-3 mb-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <p className="text-xs text-slate-400 mb-3">Class Information</p>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{course?.code} — {course?.name}</p>
              <p className="text-xs text-slate-400">Period {selectedEntry.period} • {selectedEntry.startTime}–{selectedEntry.endTime}</p>
              <p className="text-xs text-slate-400">{classroom?.name}, {classroom?.building}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl flex items-center gap-2 ${geofenceResult?.status === 'verified' || geofenceResult?.status === 'low_accuracy' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <MapPin size={16} className={geofenceResult?.inside || geofenceResult?.status === 'low_accuracy' ? 'text-green-500' : 'text-red-500'} />
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location</p>
                <p className="text-xs text-slate-400">{geofenceResult?.status === 'verified' ? `${Math.round(geofenceResult.distance)}m away` : 'Demo mode'}</p>
              </div>
            </div>
            <div className={`p-3 rounded-xl flex items-center gap-2 ${identityDone ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <Shield size={16} className={identityDone ? 'text-green-500' : 'text-red-500'} />
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Identity</p>
                <p className="text-xs text-slate-400">{identityDone ? 'Verified' : 'Not verified'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-between">
          <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={goPrev}>Back</Button>
          <Button onClick={handleSubmit} loading={submitting}>
            Submit Attendance
          </Button>
        </div>
      </div>
    )
  }

  // Step: Success
  const renderSuccess = () => {
    const course = selectedEntry ? mockCourses.find(c => c.id === selectedEntry.courseId) : null
    return (
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Attendance Marked!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Your attendance for <strong>{course?.code}</strong> has been recorded successfully.
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-8 text-sm">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
            <MapPin size={16} className="text-green-500 mx-auto mb-1" />
            <p className="text-slate-400 text-xs">Location</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 text-xs">Verified</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
            <Shield size={16} className="text-green-500 mx-auto mb-1" />
            <p className="text-slate-400 text-xs">Identity</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 text-xs">Confirmed</p>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate('/student/history')}>View History</Button>
          <Button onClick={() => navigate('/student')}>Go to Dashboard</Button>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (step) {
      case 'select': return renderSelect()
      case 'details': return renderDetails()
      case 'location': return renderLocation()
      case 'geofence': return renderGeofence()
      case 'identity': return renderIdentity()
      case 'confirm': return renderConfirm()
      case 'success': return renderSuccess()
      default: return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mark Attendance</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">GPS-verified geofenced attendance marking</p>
      </div>

      {step !== 'success' && renderStepIndicator()}

      <Card>
        {renderStep()}
      </Card>
    </div>
  )
}
