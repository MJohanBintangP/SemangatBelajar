import DashboardNavbar from '../../components/userPage/DashboardNavbar';
import { Outlet } from 'react-router-dom';

export default function LayoutDashboard() {
  return (
    <div className="bg-white h-screen flex flex-col md:flex-row overflow-hidden">
      <aside className="hidden md:block w-76 bg-white h-screen flex-shrink-0 shadow-lg">
        <div className="h-full flex flex-col overflow-hidden">
          <DashboardNavbar />
        </div>
      </aside>
      <div className="md:hidden">
        <DashboardNavbar />
      </div>
      <main className="flex-1 overflow-y-auto px-2 pt-20 md:px-20 md:pt-5 pb-5">
        <Outlet />
      </main>
    </div>
  );
}
