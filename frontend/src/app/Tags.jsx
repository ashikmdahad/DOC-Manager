import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Tags({ fileId }) {
  const [tags, setTags] = useState([])
  const [newTagName, setNewTagName] = useState('')

  const fetchTags = async () => {
    const { data } = await api.get(`/files/${fileId}/tags`)
    setTags(data)
  }

  const addTag = async () => {
    await api.post(`/files/${fileId}/tags`, { name: newTagName })
    setNewTagName('')
    fetchTags()
  }

  const removeTag = async (tagId) => {
    await api.delete(`/files/${fileId}/tags/${tagId}`)
    fetchTags()
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Tags</h3>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="New tag name..."
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
        <button className="btn" onClick={addTag}>
          Add
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {tags.map((t) => (
          <div key={t.id} className="bg-zinc-800 px-2 py-1 rounded-full text-xs flex items-center gap-2">
            {t.name}
            <button onClick={() => removeTag(t.id)}>x</button>
          </div>
        ))}
      </div>
    </div>
  )
}
