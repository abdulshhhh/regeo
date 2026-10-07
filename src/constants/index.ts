export const DEMO_ACCOUNTS = [
  { email: 'student@regeo.demo', password: 'Demo@123', role: 'student', name: 'Arjun Krishnan' },
  { email: 'staff@regeo.demo', password: 'Demo@123', role: 'staff', name: 'Dr. Meera Nair' },
  { email: 'admin@regeo.demo', password: 'Demo@123', role: 'admin', name: 'Prof. Rajan Kumar' },
] as const

export const PERIODS = [
  { number: 1, start: '08:00', end: '08:50' },
  { number: 2, start: '08:50', end: '09:40' },
  { number: 3, start: '09:50', end: '10:40' },
  { number: 4, start: '10:40', end: '11:30' },
  { number: 5, start: '11:40', end: '12:30' },
  { number: 6, start: '13:30', end: '14:20' },
  { number: 7, start: '14:20', end: '15:10' },
  { number: 8, start: '15:20', end: '16:10' },
]

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

export const DEPARTMENTS = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'EEE'] as const

export const GEOFENCE_ACCURACY_THRESHOLD = 50
export const DEFAULT_GEOFENCE_RADIUS = 100
