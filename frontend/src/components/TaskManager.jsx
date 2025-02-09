import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchTasks, addTask, deleteTask, updateTask, deleteSubtask
} from '../redux/taskSlice';
import { Link, useParams } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaBars } from 'react-icons/fa';
import Modal from './Modal';
import toast, { Toaster } from 'react-hot-toast';

function TaskManager() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const tasks = useSelector(state => state.tasks);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskName, setTaskName] = useState('');
    const [subtasks, setSubtasks] = useState(['']);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        setLoading(true); 
        dispatch(fetchTasks())
            .unwrap()
            .then(() => setLoading(false)) 
            .catch(() => {
                setLoading(false);
                toast.error('Failed to fetch tasks');
            });
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            const task = tasks.find(task => task._id === id);
            setSelectedTask(task);
        }
    }, [id, tasks]);

    const handleAddTask = async () => {
        if (subtasks.some(subtask => subtask.trim() === '')) {
            toast.error('Subtasks cannot be empty');
            return;
        }
        if (!taskName.trim()) {
            toast.error('Task name cannot be empty');
            return;
        }
        setModalLoading(true);
        const newTask = {
            name: taskName,
            subtasks: subtasks.map(name => ({ name }))
        };
        try {
            await dispatch(addTask(newTask)).unwrap();
            setTaskName('');
            setSubtasks(['']);
            setModalOpen(false);
            toast.success('Task added successfully');
        } catch (error) {
            toast.error('Failed to add task');
        } finally {
            setModalLoading(false);
        }
    };

    const handleAddSubtaskField = () => {
        setSubtasks([...subtasks, '']);
    };

    const handleSubtaskChange = (index, value) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index] = value;
        setSubtasks(newSubtasks);
    };

    const handleDeleteTask = async (taskId) => {
        setLoading(true);
        try {
            await dispatch(deleteTask(taskId)).unwrap();
            setSelectedTask(null);
            toast.success('Task deleted successfully');
        } catch (error) {
            toast.error('Failed to delete task');
        } finally {
            setLoading(false);
        }
    };

    const handleEditTask = (task) => {
        setTaskName(task.name);
        setSubtasks(task.subtasks.map(subtask => subtask.name));
        setEditTaskId(task._id);
        setIsEditMode(true);
        setModalOpen(true);
    };

    const handleUpdateTask = async () => {
        if (!taskName.trim()) {
            toast.error('Task name cannot be empty');
            return;
        }
        if (subtasks.some(subtask => subtask.trim() === '')) {
            toast.error('Subtasks cannot be empty');
            return;
        }
        setModalLoading(true); 
        const updatedTask = {
            _id: editTaskId,
            name: taskName,
            subtasks: subtasks.map(name => ({ name }))
        };
        try {
            await dispatch(updateTask(updatedTask)).unwrap();
            setModalOpen(false);
            setIsEditMode(false);
            setTaskName('');
            setSubtasks(['']);
            toast.success('Task updated successfully');
        } catch (error) {
            toast.error('Failed to update task');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteSubtaskField = (index) => {
        setSubtasks(subtasks.filter((_, subtaskIndex) => subtaskIndex !== index));
    };

    const handleDeleteSubtask = async (taskId, subtaskId) => {
        setLoading(true);
        try {
            await dispatch(deleteSubtask({ taskId, subtaskId })).unwrap();
            toast.success('Subtask deleted successfully');
        } catch (error) {
            toast.error('Failed to delete subtask');
        } finally {
            setLoading(false); 
        }
    };

    const filteredTasks = Array.isArray(tasks) ? tasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="flex h-screen bg-gradient-to-br from-[#dfe9f3] to-[#efefef]">
            <Toaster />
            <div className={`fixed inset-y-0 left-0 top-4 transform z-10 flex flex-col gap-2 md:w-1/4 bg-[#17A2B8] text-black p-4 md:ml-2 overflow-y-auto h-[95vh] shadow-lg rounded-xl [box-shadow:2px_2px_4px_0px_#00000040] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 md:relative md:translate-x-0`}>
                <div className="md:hidden flex items-end justify-end">
                    <IoMdClose className='text-white' size={30} onClick={() => setIsSidebarOpen(false)} />
                </div>
                <div className="relative border-[1px] [@media(max-width:500px)]:[box-shadow:0px_1px_4px_0px_#00000040] border-solid border-[#B1B1B1] rounded-lg">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <LuSearch />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border-[1px] border-solid border-[#FFFFFF] rounded-lg focus:outline-none"
                    />
                </div>
                <div>
                    {loading ? (
                        <div className="flex justify-center items-center p-2 text-white">
                            <span>Loading tasks...</span>
                        </div>
                    ) : (
                        filteredTasks.map(task => (
                            <div
                                key={task._id}
                                className="p-2 mb-2 bg-gray-200 cursor-pointer flex justify-between rounded"
                                onClick={() => {
                                    setSelectedTask(task);
                                    setIsSidebarOpen(false);
                                }}
                            >
                                <Link to={`/tasks/${task._id}`}>
                                    <h1>{task.name}</h1>
                                </Link>
                                <div>
                                    <button onClick={() => handleEditTask(task)} className="mr-2 text-blue-500"><MdEdit /></button>
                                    <button onClick={() => handleDeleteTask(task._id)} className="text-red-500"><MdDelete /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="w-full md:w-3/4 bg-gradient-to-br from-[#dfe9f3] to-[#efefef] p-4 overflow-y-auto flex flex-col gap-2">
                <div className='flex flex-row items-center justify-between md:text-left'>
                    <div className="lg:hidden text-left text-[#17A2B8]">
                        <FaBars className="text-xl" onClick={toggleSidebar} />
                    </div>
                    <button onClick={() => {
                        setSelectedTask(null);
                        setModalOpen(true);
                        setIsEditMode(false);
                    }} className="flex flex-row items-center gap-2 bg-[#17A2B8] text-white p-2 rounded-lg hover:opacity-[0.5]">
                        <FaPlus />
                        Add Task
                    </button>
                </div>
                {selectedTask ? (
                    <div className='mt-4'>
                        <h2 className="text-xl font-bold mb-4">{selectedTask.name}</h2>
                        {selectedTask.subtasks.map((subtask, index) => (
                            <div key={index} className="p-2 mb-2 bg-gray-200 hover:bg-gray-300 cursor-pointer flex justify-between rounded">
                                <span>{subtask.name}</span>
                                <div>
                                    <button onClick={() => handleDeleteSubtask(selectedTask._id, subtask._id)} className="text-red-500"><MdDelete /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex justify-center items-center mt-[10vh]'>
                        <h1 className='text-3xl'>Please Select a Task</h1>
                    </div>
                )}
            </div>
            <Modal isOpen={modalOpen}>
                <div className='md:w-[50vw] w-[70vw]'>
                    <div className='flex flex-row justify-between items-center mb-4'>
                        <h2 className="text-xl font-bold">{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>
                        <IoMdClose className='cursor-pointer' size={30} onClick={() => {
                            setModalOpen(false);
                            setIsEditMode(false);
                            setTaskName('');
                            setSubtasks(['']);
                        }} />
                    </div>
                    <input
                        type="text"
                        placeholder="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                        className="focus:outline-none mb-4 p-2 w-full text-[#9B959F] bg-white rounded border-[1px] border-solid border-[#E2E2E2] [box-shadow:0px_1px_2px_0px_#4D40551A]"
                    />
                    <div className='w-full max-h-[15vh] overflow-y-scroll flex flex-col'>
                        {subtasks.map((subtask, index) => (
                            <div key={index} className="p-2 flex items-center gap-2 mb-4 rounded border-[1px] border-solid border-[#E2E2E2]">
                                <input
                                    type="text"
                                    placeholder={`Subtask ${index + 1}`}
                                    value={subtask}
                                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                                    className="w-full bg-white text-[#828282] focus:outline-none"
                                    required
                                />
                                <button onClick={() => handleDeleteSubtaskField(index)} className="text-red-500"><MdDelete /></button>
                            </div>
                        ))}
                    </div>
                    <div onClick={handleAddSubtaskField} className="mb-4 w-full text-[#767575] flex flex-row items-center gap-2 cursor-pointer"><FaPlus /> Add Subtask Field</div>
                    <button
                        onClick={isEditMode ? handleUpdateTask : handleAddTask}
                        disabled={modalLoading}
                        className="mb-4 p-2 w-full bg-green-500 rounded cursor-pointer hover:opacity-[0.5] text-white flex justify-center items-center"
                    >
                        {modalLoading ? (
                            <span>Loading...</span>
                        ) : (
                            isEditMode ? 'Update Task' : 'Save Task'
                        )}
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default TaskManager;