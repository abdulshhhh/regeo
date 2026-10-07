import { getInitials } from '../../utils/format'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  src?: string
  className?: string
}

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

const colors = [
  'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
]

function getColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i)
  return colors[hash % colors.length]
}

export default function Avatar({ name, size = 'md', src, className = '' }: AvatarProps) {
  if (src) {
    return (
      <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ${className}`} />
    )
  }
  return (
    <div className={`${sizes[size]} ${getColor(name)} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ${className}`}>
      {getInitials(name)}
    </div>
  )
}
