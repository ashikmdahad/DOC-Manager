import React, { useEffect, useState } from 'react'
import api from '../api'

export default function ActivityLog() {
  const [activities, setActivities] = useState([])

  const fetchActivities = async () => {
    const { data } = await api.get('/activity')
    setActivities(data)
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  return (
    <div className="card space-y-2">
      <h2 className="text-lg font-semibold">Activity Log</h2>
      <div className="space-y-2">
        {activities.map((a) => (
          <div key={a.id} className="text-sm">
            <span className="font-semibold">{a.user.email}</span> {a.action}{' '}
            {a.entity} <span className="font-semibold">{a.entity_id}</span> at{' '}
            {new Date(a.created_at).toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  )
}
