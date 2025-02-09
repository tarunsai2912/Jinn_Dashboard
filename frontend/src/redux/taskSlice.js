import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

// Fetch Tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

// Add Task
export const addTask = createAsyncThunk('tasks/addTask', async (task) => {
    const response = await axios.post(API_URL, task);
    return response.data;
});

// Update Task
export const updateTask = createAsyncThunk('tasks/updateTask', async (task) => {
    const response = await axios.put(`${API_URL}/${task._id}`, task);
    return response.data;
});

// Delete Task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
    await axios.delete(`${API_URL}/${taskId}`);
    return taskId;
});

// Add Subtask
export const addSubtask = createAsyncThunk('tasks/addSubtask', async ({ taskId, subtask }) => {
    const response = await axios.post(`${API_URL}/${taskId}/subtasks`, subtask);
    return response.data;
});

// Delete Subtask
export const deleteSubtask = createAsyncThunk('tasks/deleteSubtask', async ({ taskId, subtaskId }) => {
    const response = await axios.delete(`${API_URL}/${taskId}/subtasks/${subtaskId}`);
    return response.data;
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => action.payload)
            .addCase(addTask.fulfilled, (state, action) => {
                state.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.findIndex((task) => task._id === action.payload._id);
                if (index !== -1) {
                    state[index] = action.payload;
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                return state.filter((task) => task._id !== action.payload);
            })
            .addCase(addSubtask.fulfilled, (state, action) => {
                const task = state.find((t) => t._id === action.payload._id);
                if (task) {
                    task.subtasks = action.payload.subtasks;
                }
            })
            .addCase(deleteSubtask.fulfilled, (state, action) => {
                const task = state.find((t) => t._id === action.payload._id);
                if (task) {
                    task.subtasks = action.payload.subtasks;
                }
            });
    },
});

export default taskSlice.reducer;
