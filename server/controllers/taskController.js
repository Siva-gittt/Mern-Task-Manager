const mongoose = require('mongoose')
const Task = require('../models/Task')

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.json(tasks)
  } catch (error) {
    next(error)
  }
}

exports.getTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' })
    }
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (error) {
    next(error)
  }
}

exports.createTask = async (req, res, next) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''
    if (!title) return res.status(400).json({ message: 'Task title is required' })
    const task = await Task.create({ title })
    res.status(201).json(task)
  } catch (error) {
    next(error)
  }
}

exports.updateTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' })
    }

    const updates = {}
    if (Object.hasOwn(req.body, 'title')) {
      if (typeof req.body.title !== 'string' || !req.body.title.trim()) {
        return res.status(400).json({ message: 'Task title cannot be empty' })
      }
      updates.title = req.body.title.trim()
    }
    if (Object.hasOwn(req.body, 'completed')) {
      if (typeof req.body.completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed must be true or false' })
      }
      updates.completed = req.body.completed
    }
    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'Provide a title or completed value to update' })
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (error) {
    next(error)
  }
}

exports.deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID' })
    }
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    next(error)
  }
}
