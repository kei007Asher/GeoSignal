import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SignalDetail from './pages/SignalDetail';
import Chains from './pages/Chains';
import RunSettings from './pages/RunSettings';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/chains', label: 'Chains' },
  { path: '/run', label: 'Run / Settings' },
];

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold text-gray-900">
                GeoSignal
              </Link>
              <div className="flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded font-mono">
                LLM: OFF
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signals/:id" element={<SignalDetail />} />
          <Route path="/chains" element={<Chains />} />
          <Route path="/run" element={<RunSettings />} />
        </Routes>
      </main>
    </div>
  );
}
