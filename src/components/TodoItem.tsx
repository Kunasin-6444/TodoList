import type { taskItems } from "../App" 

interface todoItemProp {
    tasks: taskItems[] 
    deleteTask: (id: number) => void
    changeStatus: (id: number, currentStatus: string) => void
}

export default function TodoItem({tasks, deleteTask, changeStatus}: todoItemProp){
    let listItems = tasks.map((task, index) => 
        <li key={task.id} className="text-black bg-white rounded-[18px] text-left shadow-md border-[1px] flex justify-between px-[1rem] py-2">
            <div className="flex gap-[10px]">
                <div>{index+1}.</div>
                <div className={`cursor-pointer font-bold ${task.status === "Todo" ? "text-black" : "text-emerald-600"}`} onClick={() => changeStatus(task.id, task.status)}>
                    {task.status}
                </div>
                <div>{task.name}</div>
            </div>
            <div className="flex gap-[10px]">
                <div className="text-gray-500 text-sm flex items-center">{task.priority}</div>
                <div className="cursor-pointer text-red-500 font-bold hover:text-red-700" onClick={() => deleteTask(task.id)}>X</div>
            </div>
        </li>
    )
    
    return (
        <ul className="pt-[2.5%] pb-[5rem] px-[2.5%] flex flex-col gap-[1rem]">{listItems}</ul>
    )
}