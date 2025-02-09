import React from 'react';
import TaskManager from './components/TaskManager';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/tasks/:id" element={<TaskManager />} />
                <Route path="/" element={<TaskManager />} />
            </Routes>
        </Router>
    );
}

export default App;
