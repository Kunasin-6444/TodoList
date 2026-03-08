import type { taskItems } from "../App" 

interface todoItemProp {
    tasks: taskItems[] 
    deleteTask: (id: number) => void
    changeStatus: (id: number, currentStatus: string) => void
    editTaskName: (id: number, currentName: string ,currentPriority: string) => void
}

export default function TodoItem({tasks, deleteTask, changeStatus, editTaskName}: todoItemProp){
    let listItems = tasks.map((task, index) => 
        <li key={task.id} className={`text-black bg-white shadow-sm rounded-[18px] flex justify-between px-[1rem] py-2 border-2 ${task.status === "Todo" ? " shadow-gray" : "border-emerald-600 shadow-emerald-600"}`}>
            <div className="flex items-center justify-center gap-[10px]">
                <div>{index+1}.</div>
                <div className={`text-xl cursor-pointer font-bold ${task.status === "Todo" ? "text-black" : "text-emerald-600"}`} onClick={() => changeStatus(task.id, task.status)}>
                    {task.status}
                </div>
                <div>{task.name}</div>
            </div>
            <div className="flex items-center justify-center gap-[10px]">
                <div className={`flex items-center text-xl font-bold ${task.priority === "High"? "text-red-600 ":task.priority === "Normal"? "text-amber-300":"text-gray-500"}`}>{task.priority}</div>
                <button 
                  onClick={() => editTaskName(task.id, task.name, task.priority)}
                  className="text-blue-500 text-sm hover:text-blue-700 font-bold px-2"
                >
                  Edit
                </button>
                <div className="cursor-pointer text-red-500 font-bold hover:text-red-700" onClick={() => deleteTask(task.id)}>X</div>
            </div>
        </li>
    )
    
    return (
        <ul className="pt-[2.5%] pb-[5rem] px-[2.5%] flex flex-col gap-[1rem]">{listItems}</ul>
    )
}