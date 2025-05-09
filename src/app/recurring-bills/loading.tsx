export default function Loading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-10 w-64 bg-gray-200 rounded mb-6"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
        <div className="lg:col-span-2">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
