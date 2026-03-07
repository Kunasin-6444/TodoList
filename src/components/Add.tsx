export default function Add({ onAddClick }: { onAddClick: () => void }) {
  return (
    <div className="py-4 mt-4">
      <button onClick={onAddClick} className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition">
        + Add New Task
      </button>
    </div>
  )
}