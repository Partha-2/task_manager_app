import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">Task Manager</h1>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user.name}</span>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
