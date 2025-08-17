import React, { useEffect, useState } from 'react'
import api from '../api'

export default function VersionHistory({ fileId }) {
  const [versions, setVersions] = useState([])

  const fetchVersions = async () => {
    const { data } = await api.get(`/files/${fileId}/versions`)
    setVersions(data)
  }

  useEffect(() => {
    fetchVersions()
  }, [])

  return (
    <div className="card space-y-2">
      <h3 className="font-semibold">Version History</h3>
      <div className="space-y-2">
        {versions.map((v) => (
          <div key={v.id} className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{v.id}</div>
              <div className="text-xs text-zinc-400">
                {new Date(v.created_at).toLocaleString()}
              </div>
            </div>
            <button
              className="btn"
              onClick={async () => {
                const { data } = await api.get(
                  `/files/${fileId}/versions/${v.id}/download`
                )
                window.open(data.url, '_blank')
              }}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
