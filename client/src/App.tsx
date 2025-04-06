import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
import { UserRole } from "@shared/schema";

function App() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(UserRole.STUDENT);

  // Set the active role based on the user's role
  useEffect(() => {
    if (user) {
      setActiveRole(user.role);
    }
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
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
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
