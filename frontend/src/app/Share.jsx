import React, { useState } from 'react'
import api from '../api'

export default function Share({ fileId, folderId }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('viewer')

  const share = async () => {
    const endpoint = fileId ? `/files/${fileId}/share` : `/folders/${folderId}/share`
    await api.post(endpoint, { email, role })
    alert('Shared successfully!')
    setEmail('')
  }

  return (
    <div className="card space-y-2">
      <h3 className="font-semibold">Share</h3>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="User email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>
        <button className="btn" onClick={share}>
          Share
        </button>
      </div>
    </div>
  )
}
