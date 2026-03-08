import { useState } from "react";

interface OverlayProps {
  onClose: () => void;
  onAdd: (name: string, priority: string) => void;
}

export default function Overlay({ onClose, onAdd }: OverlayProps) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("Normal");

  return (
    <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-white text-black p-8 rounded-xl w-96 text-left shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">Add New Task</h2>
        
        <label className="block text-sm font-medium mb-1">Task Name</label>
        <input type="text" placeholder="What to do?" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full mb-4 rounded outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
        
        <label className="block text-sm font-medium mb-1">Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border p-2 w-full mb-6 rounded outline-none focus:ring-2 focus:ring-blue-500">
          <option value="High">High</option>
          <option value="Normal">Normal</option>
          <option value="Low">Low</option>
        </select>
        
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium">Cancel</button>
          <button onClick={() => { if(name.trim()) onAdd(name, priority) }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium">Save Task</button>
        </div>
      </div>
    </div>
  )
}