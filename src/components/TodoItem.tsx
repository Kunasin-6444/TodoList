import type { taskItems } from "../App" 

interface todoItemProp {
    tasks: taskItems[] 
    deleteTask: (id: number) => void
    changeStatus: (id: number, currentStatus: string) => void
    editTaskName: (id: number, currentName: string ,currentPriority: string) => void
}

export default function TodoItem({tasks, deleteTask, changeStatus, editTaskName}: todoItemProp){
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High":
                return "bg-red-100 text-red-700 border border-red-200";
            case "Normal":
                return "bg-yellow-100 text-yellow-700 border border-yellow-200";
            case "Low":
                return "bg-gray-100 text-gray-600 border border-gray-200";
            default:
                return "bg-gray-100 text-gray-500";
        }
    };
    let listItems = tasks.map((task, index) => 
        //คลุม li ใหม่ ให้เป็น flex-col บนมือถือ และเป็น flex-row บนจอใหญ่ (sm:)
        <li key={task.id} className="text-black bg-white rounded-[18px] text-left shadow-md border-[1px] flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between px-4 py-3 items-start sm:items-center">
            
            {/* ซีกซ้าย: ลำดับ สถานะ ชื่องาน (ให้ตัดคำถ้าชื่อยาวเกินไป) */}
            <div className="flex gap-[10px] items-start sm:items-center w-full sm:w-auto">
                <div className="min-w-[20px]">{index+1}.</div>
                <div className={`cursor-pointer font-bold whitespace-nowrap ${task.status === "Todo" ? "text-black" : "text-emerald-600"}`} onClick={() => changeStatus(task.id, task.status)}>
                    {task.status}
                </div>
                {/* ใส่ break-words เพื่อให้ชื่องานยาวๆ ปัดบรรทัดใหม่ ไม่ดันกล่องพัง */}
                <div className="break-words w-full pe-2">{task.name}</div>
            </div>

            {/* ซีกขวา: Priority และปุ่มต่างๆ (บนมือถือจะขยับไปชิดขวา) */}
            <div className="flex gap-[10px] items-center self-end sm:self-auto bg-gray-50 sm:bg-transparent px-3 py-1 sm:p-0 rounded-lg">
                <div className={`text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-sm ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </div>
                
                <button 
                  onClick={() => editTaskName(task.id, task.name, task.priority)}
                  className="text-blue-500 text-sm hover:text-blue-700 font-bold px-2"
                >
                  Edit
                </button>

                <div className="cursor-pointer text-red-500 font-bold hover:text-red-700 px-2" onClick={() => deleteTask(task.id)}>X</div>
            </div>
        </li>
    )
    
    return (
        <ul className="pt-[2.5%] pb-[5rem] px-[2.5%] flex flex-col gap-[1rem]">{listItems}</ul>
    )
}