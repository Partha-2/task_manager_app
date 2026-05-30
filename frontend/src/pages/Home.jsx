import Navbar from "../components/Layout/Navbar";
import TaskBoard from "../components/Tasks/TaskBoard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <TaskBoard />
      </main>
    </div>
  );
}
