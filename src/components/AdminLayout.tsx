import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow p-8 bg-gray-100 h-screen overflow-y-auto">
        <Outlet /> {/* This will render the specific admin page content */}
      </main>
    </div>
  );
}