export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Welcome to{' '}
            <span className="ai-gradient-text">Aether!</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            AI-powered website builder that creates professional websites in 30 seconds
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
            Get Started
          </button>
          <button className="px-8 py-4 glass text-white font-semibold rounded-lg transition-all duration-200 hover:bg-white/20">
            Learn More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="glass p-6 rounded-xl space-y-2">
            <div className="text-3xl">⚡</div>
            <h3 className="text-xl font-semibold text-white">Lightning Fast</h3>
            <p className="text-gray-300">Generate complete websites in under 30 seconds</p>
          </div>
          <div className="glass p-6 rounded-xl space-y-2">
            <div className="text-3xl">🎨</div>
            <h3 className="text-xl font-semibold text-white">Visual Editor</h3>
            <p className="text-gray-300">Drag-and-drop interface for easy customization</p>
          </div>
          <div className="glass p-6 rounded-xl space-y-2">
            <div className="text-3xl">🚀</div>
            <h3 className="text-xl font-semibold text-white">Instant Deploy</h3>
            <p className="text-gray-300">One-click deployment to production with custom domains</p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
      </div>
    </main>
  )
}