export default function TemplatesPage() {
  const templates = [
    { id: 1, name: 'Business Landing', category: 'Business', preview: '🏢' },
    { id: 2, name: 'E-Commerce Store', category: 'E-Commerce', preview: '🛍️' },
    { id: 3, name: 'Portfolio', category: 'Creative', preview: '🎨' },
    { id: 4, name: 'Blog', category: 'Content', preview: '📝' },
    { id: 5, name: 'SaaS Product', category: 'Tech', preview: '🚀' },
    { id: 6, name: 'Restaurant', category: 'Food', preview: '🍽️' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Templates</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose a template to start with or let AI create from scratch
        </p>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        <button className="flex-1 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow dark:bg-gray-700 dark:text-white">
          All Templates
        </button>
        <button className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          Business
        </button>
        <button className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          E-Commerce
        </button>
        <button className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          Creative
        </button>
      </div>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 p-8 dark:from-gray-700 dark:to-gray-800">
              <div className="flex h-full items-center justify-center text-6xl">
                {template.preview}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{template.category}</p>
                </div>
                <button className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}