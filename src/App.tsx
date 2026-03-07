import { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem"
import Add from "./components/Add"
import Overlay from "./components/Overlay"
import Auth from "./components/Auth" 
import { supabase } from "./lib/supabase" 

export type taskItems = {
  id: number,
  name: string,
  status: "Todo" | "Done",
  priority: string,
  user_id?: string
}

function App() {
  const [session, setSession] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [tasks, setTasks] = useState<taskItems[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  const fetchTasks = async () => {
    if (!session?.user?.id) return;
    const { data, error } = await supabase.from('tasks').select('*').order('id', { ascending: true });
    if (!error) setTasks(data || []);
  }

  useEffect(() => {
    if (session) fetchTasks();
  }, [session]);

  const openForm = () => setIsFormOpen(true)
  const closeForm = () => setIsFormOpen(false)
  
  const handleAddTask = async (taskName: string, priority: string) => {
    const newTask = { name: taskName, status: "Todo", priority: priority, user_id: session.user.id }
    const { data, error } = await supabase.from('tasks').insert([newTask]).select();
    if (!error && data) {
      setTasks([...tasks, data[0]]);
      closeForm();
    }
  }

  const handleDeleteTask = async (id: number) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) setTasks(tasks.filter(task => task.id !== id));
  }

  const handleStatusClick = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Todo" ? "Done" : "Todo";
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
    if (!error) setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  }

  if (!session) return <Auth />

  return (
    <div className="w-full h-screen overflow-hidden">        
        <header className="text-center bg-red-50 relative py-2">
          <h1 className="font-bold">Task Management</h1>
          <button onClick={() => supabase.auth.signOut()} className="absolute right-4 top-2 text-sm text-red-500 hover:text-red-700">
            Logout
          </button>
        </header>
        <div className="bg-black h-full text-white text-center px-[25%] overflow-hidden">
          <div className="bg-white h-full relative overflow-y-auto">
            <TodoItem tasks={tasks} deleteTask={handleDeleteTask} changeStatus={handleStatusClick}/>
            <Add onAddClick={openForm}/>
          </div>
          {isFormOpen && <Overlay onClose={closeForm} onAdd={handleAddTask}/>}
        </div>
    </div>
  )
}

export default App