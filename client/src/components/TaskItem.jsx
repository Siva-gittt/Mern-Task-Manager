import { Check, Circle, Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'

export default function TaskItem({ task, onToggle, onUpdate, onDelete, busy }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)

  async function saveEdit(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    await onUpdate(task._id, { title: cleanTitle })
    setEditing(false)
  }

  return (
    <li className={`task-item ${task.completed ? 'is-complete' : ''}`}>
      <button
        className="status-button"
        aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
        onClick={() => onToggle(task)}
        disabled={busy}
      >
        {task.completed ? <Check size={17} /> : <Circle size={19} />}
      </button>

      {editing ? (
        <form className="edit-form" onSubmit={saveEdit}>
          <input value={title} onChange={(event) => setTitle(event.target.value)} autoFocus maxLength={160} />
          <button className="icon-button save-icon" aria-label="Save task" type="submit"><Check size={17} /></button>
          <button className="icon-button" aria-label="Cancel edit" type="button" onClick={() => { setTitle(task.title); setEditing(false) }}><X size={17} /></button>
        </form>
      ) : (
        <>
          <span className="task-title">{task.title}</span>
          <div className="task-actions">
            <button className="icon-button" aria-label="Edit task" title="Edit task" onClick={() => setEditing(true)} disabled={busy}><Pencil size={16} /></button>
            <button className="icon-button delete-icon" aria-label="Delete task" title="Delete task" onClick={() => onDelete(task._id)} disabled={busy}><Trash2 size={16} /></button>
          </div>
        </>
      )}
    </li>
  )
}
