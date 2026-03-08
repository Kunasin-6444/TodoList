import { useState } from "react";

interface EditOverlayProps {
  onClose: () => void;
  onEdit: (newName: string, newPriority: string) => void; 
  initialName: string;
  initialPriority: string; 
}

export default function EditOverlay({ onClose, onEdit, initialName, initialPriority }: EditOverlayProps) {
  const [taskName, setTaskName] = useState(initialName);
  const [taskPriority, setTaskPriority] = useState(initialPriority); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim() !== "") {
      onEdit(taskName.trim(), taskPriority); 
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl w-[80%] max-w-md shadow-2xl flex flex-col gap-4 text-left">
        <h2 className="text-xl font-bold text-gray-800 text-center">Edit</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* ช่องแก้ชื่อ */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="border-2 border-gray-300 rounded-xl p-3 text-black focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>

          {/* ช่องแก้ความสำคัญ */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Priority</label>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="border-2 border-gray-300 rounded-xl p-3 text-black focus:outline-none focus:border-blue-500 transition-colors bg-white cursor-pointer"
            >
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
          </div>
          
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}