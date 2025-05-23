import { useState, useEffect } from "react";
import { Switch, Route, useLocation, useRoute } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import AuthPage from "@/pages/auth-page";
import StudentDashboard from "@/pages/student-dashboard";
import TeacherDashboard from "@/pages/teacher-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import SettingsPage from "@/pages/settings-page";
import AdminSettingsPage from "@/pages/admin-settings";
import LandingPage from "@/pages/landing-page";
import ProfilePage from "@/pages/profile-page";
import { UserRole } from "@shared/schema";

function App() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRole, setActiveRoleState] = useState<string>(UserRole.STUDENT);

  // Create a wrapper function for setActiveRole that accepts string
  const setActiveRole = (role: string) => {
    setActiveRoleState(role);
  };

  // Set the active role based on the user's role
  useEffect(() => {
    if (user) {
      setActiveRole(user.role);
    }
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if we're on the auth page to prevent redirect loops
  const [, params] = useRoute('/auth');
  const isAuthPage = params !== null;
  const [location] = useLocation();

  // If user is not logged in and not on auth page, show landing page
  if (!user && !isAuthPage && location === '/') {
    return (
      <>
        <LandingPage />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {user && (
          <Header 
            onMenuClick={toggleSidebar} 
            activeRole={activeRole} 
            setActiveRole={setActiveRole} 
          />
        )}
        
        <div className="flex flex-1 overflow-hidden">
          {user && (
            <Sidebar 
              isOpen={sidebarOpen} 
              activeRole={activeRole} 
              setActiveRole={setActiveRole} 
              onClose={() => setSidebarOpen(false)} 
            />
          )}
          
          <main className="flex-1 overflow-y-auto">
            <Switch>
              <Route path="/auth" component={AuthPage} />
              <ProtectedRoute path="/" component={StudentDashboard} />
              <ProtectedRoute path="/teacher" component={TeacherDashboard} />
              <ProtectedRoute path="/admin" component={AdminDashboard} />
              <ProtectedRoute path="/settings" component={SettingsPage} />
              <ProtectedRoute path="/admin-settings" component={AdminSettingsPage} />
              <ProtectedRoute path="/profile" component={ProfilePage} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
