import { TaskProvider } from './context/TaskContext';
import { Header } from './components/common/Header';
import { TaskForm } from './components/TaskForm/TaskForm';
import { TaskFilter } from './components/TaskFilter/TaskFilter';
import { TaskStats } from './components/TaskStats/TaskStats';
import { TaskList } from './components/TaskList/TaskList';

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen">
        <Header />
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <TaskStats />
            
            <div className="mb-6">
              <TaskForm />
            </div>
            
            <TaskFilter />
            <TaskList />
          </div>
        </main>
      </div>
    </TaskProvider>
  );
}

export default App;