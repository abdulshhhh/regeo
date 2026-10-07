import type { Coordinates, GeofenceResult } from '../types'

const EARTH_RADIUS_M = 6371000

export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function haversineDistance(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const c = sinDLat * sinDLat + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * sinDLng * sinDLng
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
}

export function checkGeofence(
  studentLocation: Coordinates,
  classroomLocation: Coordinates,
  radius: number,
  accuracy: number
): GeofenceResult {
  const distance = haversineDistance(studentLocation, classroomLocation)
  const inside = distance <= radius
  if (accuracy > 50) {
    return { distance, inside, accuracy, status: 'low_accuracy' }
  }
  return { distance, inside, accuracy, status: inside ? 'verified' : 'outside' }
}
