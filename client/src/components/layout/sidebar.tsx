import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@shared/schema';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  activeRole: string;
  setActiveRole: (role: string) => void;
  onClose: () => void;
}

export default function Sidebar({ isOpen, activeRole, setActiveRole, onClose }: SidebarProps) {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/auth');
  };

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    onClose();
  };

  if (!user) return null;

  return (
    <aside 
      className={cn(
        "bg-white w-64 shadow-md flex-shrink-0 fixed md:static h-full z-20 transition-transform transform duration-300 md:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="text-center md:hidden">
            <span className="text-primary font-bold text-xl">Learn<span className="text-emerald-500">Hub</span></span>
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold px-3 mb-2">Main</div>
          
          <Link href="/">
            <button 
              className={cn(
                "flex items-center px-3 py-2 rounded-md w-full text-left", 
                activeRole === UserRole.STUDENT && location === '/' 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
              onClick={() => handleRoleChange(UserRole.STUDENT)}
              data-role={UserRole.STUDENT}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3 lucide lucide-graduation-cap">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
              </svg>
              <span>Student Dashboard</span>
            </button>
          </Link>
          
          {(user.role === UserRole.TEACHER || user.role === UserRole.ADMIN) && (
            <Link href="/teacher">
              <button 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md w-full text-left", 
                  activeRole === UserRole.TEACHER && location === '/teacher' 
                    ? "bg-primary text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
                onClick={() => handleRoleChange(UserRole.TEACHER)}
                data-role={UserRole.TEACHER}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3 lucide lucide-presentation">
                  <path d="M2 3h20"/>
                  <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/>
                  <path d="m7 21 5-5 5 5"/>
                </svg>
                <span>Teacher Dashboard</span>
              </button>
            </Link>
          )}
          
          {user.role === UserRole.ADMIN && (
            <Link href="/admin">
              <button
                className={cn(
                  "flex items-center px-3 py-2 rounded-md w-full text-left", 
                  activeRole === UserRole.ADMIN && location === '/admin' 
                    ? "bg-primary text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
                onClick={() => handleRoleChange(UserRole.ADMIN)}
                data-role={UserRole.ADMIN}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3 lucide lucide-shield-check">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                <span>Admin Dashboard</span>
              </button>
            </Link>
          )}
          
          <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold px-3 mt-6 mb-2">Account</div>
          
          <Link href="/settings">
            <button className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 w-full text-left">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3 lucide lucide-settings">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>User Settings</span>
            </button>
          </Link>
          
          {user.role === UserRole.ADMIN && (
            <Link href="/admin-settings">
              <button className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 w-full text-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3 lucide lucide-sliders-horizontal">
                  <line x1="21" y1="4" x2="14" y2="4"/>
                  <line x1="10" y1="4" x2="3" y2="4"/>
                  <line x1="21" y1="12" x2="12" y2="12"/>
                  <line x1="8" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="20" x2="16" y2="20"/>
                  <line x1="12" y1="20" x2="3" y2="20"/>
                  <line x1="14" y1="2" x2="14" y2="6"/>
                  <line x1="8" y1="10" x2="8" y2="14"/>
                  <line x1="16" y1="18" x2="16" y2="22"/>
                </svg>
                <span>Admin Settings</span>
              </button>
            </Link>
          )}
          
          <button 
            className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 w-full text-left"
            onClick={handleLogout}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-3 lucide lucide-log-out">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
