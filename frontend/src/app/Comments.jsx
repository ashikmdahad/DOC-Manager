import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Comments({ fileId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const fetchComments = async () => {
    const { data } = await api.get(`/files/${fileId}/comments`)
    setComments(data)
  }

  const addComment = async () => {
    await api.post(`/files/${fileId}/comments`, { content: newComment })
    setNewComment('')
    fetchComments()
  }

  useEffect(() => {
    fetchComments()
  }, [])

  return (
    <div className="card space-y-2">
      <h3 className="font-semibold">Comments</h3>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="New comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn" onClick={addComment}>
          Add
        </button>
      </div>
      <div className="space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="bg-zinc-800 px-2 py-1 rounded text-sm">
            <div className="font-semibold">{c.user.email}</div>
            <div>{c.content}</div>
            <div className="text-xs text-zinc-400">
              {new Date(c.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
