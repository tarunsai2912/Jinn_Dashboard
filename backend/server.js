const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Task Schema
const TaskSchema = new mongoose.Schema({
    name: String,
    subtasks: [
        {
            name: String,
        },
    ],
});

const Task = mongoose.model('Task', TaskSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Jinn');
});

// Get All Tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add Task
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const task = await newTask.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add Subtask
app.post('/api/tasks/:taskId/subtasks', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.subtasks.push({ name: req.body.name });
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Subtask
app.delete('/api/tasks/:taskId/subtasks/:subtaskId', async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.subtasks = task.subtasks.filter((subtask) => subtask._id.toString() !== req.params.subtaskId);
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('connected', () => {
    console.log('MongoDB is connected...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
