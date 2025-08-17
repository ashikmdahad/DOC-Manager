import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = async () => {
    const { data } = await api.get('/notifications')
    setNotifications(data)
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 5000) // Poll for new notifications every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-20 right-4 space-y-2">
      {notifications.map((n) => (
        <div key={n.id} className="card bg-zinc-800 text-sm">
          {n.message}
        </div>
      ))}
    </div>
  )
}
