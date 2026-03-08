import { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem"
import Overlay from "./components/Overlay"
import Auth from "./components/Auth" 
import { supabase } from "./lib/supabase" 
import EditOverlay from "./components/EditOverlay"

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
  const [filter,setFilter] = useState<"All"| "Todo"|"Done">("All")

  const priorityWeight: Record<string, number> = { High: 1, Normal: 2, Low: 3 };
  const statusWeight: Record<string, number> = { Todo: 1, Done: 2 };

  const [editingTask, setEditingTask] = useState<{ id: number; name: string; priority: string} | null>(null);
  const [showProgress, setShowProgress] = useState(true);
  // State For Profile Menu
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Progree Bar
  const totalTasks = tasks.length; 
  const completedTasks = tasks.filter(task => task.status === "Done").length; 
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100); 


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

// Edit Tasks
  const openEditForm = (id: number, currentName: string, currentPriority: string) => {
    setEditingTask({ id, name: currentName, priority: currentPriority });
  };

  const handleSaveEditedTask = async (newName: string, newPriority: string) => {
    if (!editingTask) return; 
    
    // Priority changed and update Database
    if (newName !== editingTask.name || newPriority !== editingTask.priority) {
      const { error } = await supabase
        .from('tasks')
        .update({ name: newName, priority: newPriority }) 
        .eq('id', editingTask.id);
      
      if (!error) {
        //Update screen
        setTasks(tasks.map(task => 
          task.id === editingTask.id ? { ...task, name: newName, priority: newPriority } : task
        ));
      }
    }
    setEditingTask(null);
  };

  const handleStatusClick = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Todo" ? "Done" : "Todo";
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
    if (!error) setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  }

const sortedAndFilteredTasks = tasks
    .filter(task => {
      if (filter === "All") return true;
      return task.status === filter;
    })
    .sort((a, b) => {
      // Check status
      if (statusWeight[a.status] !== statusWeight[b.status]) {
        return statusWeight[a.status] - statusWeight[b.status];
      }
      // Check priority if status are same
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    });

  if (!session) return <Auth />

  return (
    <div className="w-full h-screen overflow-hidden">        
        <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center relative z-20">
          <h1 className="font-bold text-xl text-blue-600 tracking-wide">Task Management</h1>

          <div className="relative">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-full transition-colors focus:outline-none"
            >
              {session.user.user_metadata?.avatar_url ? (
                <img 
                  src={session.user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full border border-gray-200 shadow-sm object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
                  {session.user.email?.[0].toUpperCase()}
                </div>
              )}
            </button>

            {/* Dropdown*/}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in z-50">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {session.user.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {session.user.email}
                  </p>
                </div>

                {/* Logout in Dropdown*/}
                <button 
                  onClick={() => supabase.auth.signOut()} 
                  className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="bg-slate-50 h-full text-black text-center md:px-[10%] lg:px-[20%] xl:px-[25%] overflow-hidden flex flex-col">
          <div className="bg-white px-8 pt-6 pb-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-800">Your Progress</h2>
              <button 
                onClick={() => setShowProgress(!showProgress)}
                className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {showProgress ? "Hide 🔼" : "Show 🔽"}
              </button>
            </div>

            {showProgress && (
              <div className="mt-4 animate-fade-in">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-sm text-gray-500 font-medium">
                    Completed <span className="text-blue-600 font-bold">{completedTasks}</span> out of {totalTasks} tasks
                  </p>
                  <div className="text-blue-600 font-bold text-xl">
                    {progressPercent}%
                  </div>
                </div>
                {/* Progress Bar*/}
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white text-black py-4 px-4 sm:px-8 flex flex-wrap gap-3 justify-between items-center border-b border-gray-100 shadow-sm z-10">
            {/*Filter */}
            <div className="flex gap-2 sm:gap-4">
              <button 
                onClick={() => setFilter("All")}
                className={`px-4 py-1.5 rounded-full font-bold text-sm transition-colors ${filter === "All" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("Todo")}
                className={`px-4 py-1.5 rounded-full font-bold text-sm transition-colors ${filter === "Todo" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Todo
              </button>
              <button 
                onClick={() => setFilter("Done")}
                className={`px-4 py-1.5 rounded-full font-bold text-sm transition-colors ${filter === "Done" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Done
              </button>
            </div>

            {/*Add Task */}
            <button 
              onClick={openForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="hidden sm:inline">Add Task</span>
            </button>

          </div>
          <div className="bg-white h-full relative overflow-y-auto pb-[20%]">
            <TodoItem tasks={sortedAndFilteredTasks} deleteTask={handleDeleteTask} changeStatus={handleStatusClick} editTaskName={openEditForm}/>
          </div>
          {isFormOpen && <Overlay onClose={closeForm} onAdd={handleAddTask}/>}
          {editingTask && (
            <EditOverlay 
              onClose={() => setEditingTask(null)} 
              onEdit={handleSaveEditedTask} 
              initialName={editingTask.name}
              initialPriority={editingTask.priority} 
            />
          )}
        </div>
    </div>
  )
}

export default App