import { Plus } from 'lucide-react'

export default function TaskForm({ value, onChange, onSubmit, saving }) {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="task-title">Task title</label>
      <input
        id="task-title"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="What needs to get done?"
        maxLength={160}
        autoComplete="off"
      />
      <button className="primary-button" type="submit" disabled={saving || !value.trim()}>
        <Plus size={18} />
        <span>{saving ? 'Adding…' : 'Add task'}</span>
      </button>
    </form>
  )
}
