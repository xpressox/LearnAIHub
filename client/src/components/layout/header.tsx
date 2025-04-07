import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRole } from '@shared/schema';
import useMobile from '@/hooks/use-mobile';
// Import logo from assets directory
import dentalIconSrc from '@/assets/dental-icon.svg';

interface HeaderProps {
  onMenuClick: () => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
}

export default function Header({ onMenuClick, activeRole, setActiveRole }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  const isMobile = useMobile();

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/auth');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="md:hidden mr-4 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="text-primary font-bold text-2xl">Dental<span className="text-emerald-500">LearnHub</span></span>
              <img src={dentalIconSrc} alt="Dental Icon" className="h-6 w-6 ml-2" />
            </div>
          </div>
        </div>
        
        {user && (
          <div className="hidden md:flex items-center space-x-4">
            {user.role === UserRole.ADMIN && (
              <select 
                className="p-2 border rounded text-sm bg-gray-50"
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
              >
                <option value={UserRole.STUDENT}>Student View</option>
                <option value={UserRole.TEACHER}>Teacher View</option>
                <option value={UserRole.ADMIN}>Admin View</option>
              </select>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profilePicUrl} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{`${user.firstName} ${user.lastName}`}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {user && isMobile && (
          <div className="flex md:hidden items-center">
            <span id="current-view" className="text-sm font-medium mr-2">
              {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Dashboard
            </span>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profilePicUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
}
