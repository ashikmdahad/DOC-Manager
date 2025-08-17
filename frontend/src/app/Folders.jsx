import React, { useEffect, useState } from 'react'
import api from '../api'
import Share from './Share'

export default function Folders() {
  const [folders, setFolders] = useState([])
  const [newFolderName, setNewFolderName] = useState('')
  const [sharingFolderId, setSharingFolderId] = useState(null)

  const fetchFolders = async () => {
    const { data } = await api.get('/folders')
    setFolders(data)
  }

  const createFolder = async () => {
    await api.post('/folders', { name: newFolderName })
    setNewFolderName('')
    fetchFolders()
  }

  useEffect(() => {
    fetchFolders()
  }, [])

  const deleteFolder = async (id) => {
    await api.delete(`/folders/${id}`)
    fetchFolders()
  }

  const renameFolder = async (id, newName) => {
    await api.patch(`/folders/${id}`, { name: newName })
    fetchFolders()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Folders</h2>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="New folder name..."
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button className="btn" onClick={createFolder}>
          Create
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {folders.map((f) => (
          <div key={f.id} className="card space-y-2">
            <div className="font-semibold">{f.name}</div>
            <div className="flex gap-2">
              <button
                className="btn-secondary"
                onClick={() => {
                  const newName = prompt('Enter new name', f.name)
                  if (newName) {
                    renameFolder(f.id, newName)
                  }
                }}
              >
                Rename
              </button>
              <button className="btn-secondary" onClick={() => setSharingFolderId(sharingFolderId === f.id ? null : f.id)}>Share</button>
              <button
                className="btn-secondary"
                onClick={() => deleteFolder(f.id)}
              >
                Delete
              </button>
            </div>
            {sharingFolderId === f.id && <Share folderId={f.id} />}
          </div>
        ))}
      </div>
    </div>
  )
}
