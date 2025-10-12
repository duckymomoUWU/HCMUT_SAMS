import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo Section */}
        <div className="flex justify-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer"
             className="transition-transform hover:scale-110">
            <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer"
             className="transition-transform hover:scale-110 animate-spin-slow">
            <img src={reactLogo} className="h-24 w-24" alt="React logo" />
          </a>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
          Vite + React + TypeScript
        </h1>

        {/* Counter Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 mb-6 shadow-lg">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="w-full bg-white text-blue-600 font-semibold py-4 px-6 rounded-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
          >
            <span className="text-2xl">Count is {count}</span>
          </button>
          <p className="text-white text-center mt-4 text-sm">
            Edit <code className="bg-white/20 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>

        {/* Info Text */}
        <p className="text-gray-600 text-center text-sm">
          🎉 Click on the Vite and React logos to learn more
        </p>
        
        {/* Tailwind CSS Badge */}
        <div className="mt-6 flex justify-center">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium shadow-lg">
            ⚡ Powered by Tailwind CSS
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
