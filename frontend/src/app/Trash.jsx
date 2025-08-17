import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Trash() {
  const [deletedFiles, setDeletedFiles] = useState([])

  const fetchDeletedFiles = async () => {
    const { data } = await api.get('/files/deleted')
    setDeletedFiles(data)
  }

  const restoreFile = async (id) => {
    await api.post(`/files/${id}/restore`)
    fetchDeletedFiles()
  }

  useEffect(() => {
    fetchDeletedFiles()
  }, [])

  return (
    <div className="card space-y-2">
      <h2 className="text-lg font-semibold">Trash</h2>
      <div className="space-y-2">
        {deletedFiles.map((f) => (
          <div key={f.id} className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{f.name}</div>
              <div className="text-xs text-zinc-400">
                Deleted at: {new Date(f.deleted_at).toLocaleString()}
              </div>
            </div>
            <button className="btn" onClick={() => restoreFile(f.id)}>
              Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
