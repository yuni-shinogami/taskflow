import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { Header } from './components/common/Header';
import { TaskForm } from './components/TaskForm/TaskForm';
import { TaskFilter } from './components/TaskFilter/TaskFilter';
import { TaskStats } from './components/TaskStats/TaskStats';
import { TaskList } from './components/TaskList/TaskList';

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <TaskStats />
            <TaskForm />
            <TaskFilter />
            <TaskList />
          </div>
        </main>
      </div>
    </TaskProvider>
  );
}

export default App;