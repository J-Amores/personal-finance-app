export default function Loading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-10 w-48 bg-gray-200 rounded mb-6"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
}
