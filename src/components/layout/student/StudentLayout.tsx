import { Outlet } from 'react-router-dom';
import { StudentHeader } from './StudentHeader';

export function StudentLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <StudentHeader />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
