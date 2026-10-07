import { useState } from 'react'
import { MapPin, Users, Edit2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'
import { mockClassrooms } from '../../mock/data'
import type { Classroom } from '../../types'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'

export default function AdminClassrooms() {
  const { addToast } = useUIStore()
  const [classrooms, setClassrooms] = useState(mockClassrooms)
  const [editingRoom, setEditingRoom] = useState<Classroom | null>(null)
  const [editForm, setEditForm] = useState({ radius: 100, latitude: 0, longitude: 0 })

  const handleEdit = (room: Classroom) => {
    setEditingRoom(room)
    setEditForm({ radius: room.radius, latitude: room.latitude, longitude: room.longitude })
  }

  const handleSave = () => {
    if (!editingRoom) return
    setClassrooms(prev => prev.map(c => c.id === editingRoom.id ? { ...c, ...editForm } : c))
    addToast({ type: 'success', title: 'Classroom updated', message: `${editingRoom.name} geofence updated.` })
    setEditingRoom(null)
  }

  const toggleActive = (id: string) => {
    setClassrooms(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c))
    addToast({ type: 'info', title: 'Status updated' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Classrooms</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage classroom geofence configuration</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classrooms.map(room => {
          // SVG geofence preview
          const svgSize = 80
          const center = svgSize / 2
          return (
            <Card key={room.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">{room.name}</h3>
                  <p className="text-xs text-slate-400">{room.building}, Floor {room.floor}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(room)} className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => toggleActive(room.id)} className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${room.isActive ? 'text-green-500' : 'text-slate-400'}`}>
                    {room.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Mini geofence SVG */}
                <svg width={svgSize} height={svgSize} className="rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                  <circle cx={center} cy={center} r={center - 8} fill={room.isActive ? '#6366f120' : '#94a3b820'} stroke={room.isActive ? '#6366f1' : '#94a3b8'} strokeWidth="1.5" strokeDasharray="4,2" />
                  <circle cx={center} cy={center} r={4} fill={room.isActive ? '#6366f1' : '#94a3b8'} />
                  <text x={center} y={svgSize - 4} textAnchor="middle" fontSize="8" fill="#94a3b8">{room.radius}m</text>
                </svg>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin size={11} />
                    <span>{room.latitude.toFixed(4)}, {room.longitude.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Users size={11} />
                    <span>Capacity: {room.capacity}</span>
                  </div>
                  <Badge variant={room.isActive ? 'success' : 'error'} size="sm">{room.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Edit modal */}
      <Modal
        open={!!editingRoom}
        onClose={() => setEditingRoom(null)}
        title={`Edit Geofence — ${editingRoom?.name}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingRoom(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Radius (meters)" type="number" value={editForm.radius} onChange={e => setEditForm(p => ({ ...p, radius: Number(e.target.value) }))} />
          <Input label="Latitude" type="number" step="0.000001" value={editForm.latitude} onChange={e => setEditForm(p => ({ ...p, latitude: Number(e.target.value) }))} />
          <Input label="Longitude" type="number" step="0.000001" value={editForm.longitude} onChange={e => setEditForm(p => ({ ...p, longitude: Number(e.target.value) }))} />
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-400">
            The geofence radius defines the area around the classroom coordinates within which students can mark attendance.
          </div>
        </div>
      </Modal>
    </div>
  )
}
