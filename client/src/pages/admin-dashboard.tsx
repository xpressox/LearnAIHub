import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import StatsCard from "@/components/dashboard/stats-card";
import { Input } from "@/components/ui/input";
import {
  UserCircle,
  Presentation,
  BookOpen,
  DollarSign,
} from "lucide-react";
import Tabs from "@/components/dashboard/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddTeacherModal from "@/components/modals/add-teacher-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole, CourseStatus } from "@shared/schema";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [addTeacherModalOpen, setAddTeacherModalOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [courseStatusFilter, setCourseStatusFilter] = useState("all");
  const [courseCategoryFilter, setCourseCategoryFilter] = useState("all");

  // Fetch platform analytics
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics/overview"],
    enabled: !!user,
  });

  // Fetch all users
  const { data: users } = useQuery({
    queryKey: ["/api/users"],
    enabled: !!user,
  });

  // Fetch all courses
  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
    enabled: !!user,
  });

  // Filter users based on search term and role filter
  const filteredUsers = users
    ? users.filter((user) => {
        const matchesSearch =
          user.firstName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
        
        const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
        
        return matchesSearch && matchesRole;
      })
    : [];

  // Filter courses based on search term, status and category filters
  const filteredCourses = courses
    ? courses.filter((course) => {
        const matchesSearch = course.title
          .toLowerCase()
          .includes(courseSearchTerm.toLowerCase());
        
        const matchesStatus =
          courseStatusFilter === "all" || course.status === courseStatusFilter;
        
        const matchesCategory =
          courseCategoryFilter === "all" || course.category === courseCategoryFilter;
        
        return matchesSearch && matchesStatus && matchesCategory;
      })
    : [];

  // Create tabs content for admin dashboard
  const tabsContent = [
    {
      id: "users",
      label: "Users",
      content: (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                onClick={() => setAddTeacherModalOpen(true)}
                className="bg-primary text-white"
                size="sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add Teacher
              </Button>
              
              <Select 
                value={userRoleFilter} 
                onValueChange={setUserRoleFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={UserRole.STUDENT}>Students</SelectItem>
                  <SelectItem value={UserRole.TEACHER}>Teachers</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Input
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="pl-3 pr-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-3 top-2.5 text-gray-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                          <img
                            src={user.profilePicUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=3B82F6&color=fff`}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-primary hover:text-primary-dark">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 12h.01" />
                            <path d="M19 12h.01" />
                            <path d="M5 12h.01" />
                          </svg>
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      <p className="text-gray-500">No users found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{filteredUsers.length}</span> of{" "}
                    <span className="font-medium">{users?.length || 0}</span>{" "}
                    users
                  </p>
                </div>
                <div>
                  <nav className="flex items-center">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="ml-3" disabled>
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "courses",
      label: "Courses",
      content: (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <Select 
                value={courseStatusFilter} 
                onValueChange={setCourseStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value={CourseStatus.PUBLISHED}>Published</SelectItem>
                  <SelectItem value={CourseStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={CourseStatus.ARCHIVED}>Archived</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={courseCategoryFilter} 
                onValueChange={setCourseCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="AI & Machine Learning">AI & ML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Input
                placeholder="Search courses..."
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
                className="pl-3 pr-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-3 top-2.5 text-gray-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Teacher
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Students
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Revenue
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => {
                  // For simplicity, let's generate some fake data
                  const teacher = users?.find(u => u.id === course.teacherId);
                  const studentCount = Math.floor(Math.random() * 100);
                  const revenue = course.isFree ? "$0" : `$${(course.price * studentCount).toFixed(2)}`;

                  return (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                            <img
                              src={course.thumbnailUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=3B82F6&color=fff`}
                              alt={course.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {course.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{studentCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            course.status === CourseStatus.PUBLISHED
                              ? "success"
                              : "default"
                          }
                        >
                          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{revenue}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-primary hover:text-primary-dark">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <p className="text-gray-500">No courses found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{filteredCourses.length}</span> of{" "}
                    <span className="font-medium">{courses?.length || 0}</span>{" "}
                    courses
                  </p>
                </div>
                <div>
                  <nav className="flex items-center">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="ml-3" disabled>
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      content: (
        <>
          {/* Analytics Header */}
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Platform Performance</h3>
            <div className="flex space-x-2">
              <Select defaultValue="30">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="180">Last 6 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Export
              </Button>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h4 className="text-lg font-medium mb-4">Revenue Overview</h4>
            <div className="relative" style={{ height: "300px" }}>
              {/* Placeholder for chart */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300 mb-3 mx-auto"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  <p className="text-gray-500">
                    Revenue chart would be rendered here
                  </p>
                  <p className="text-xs text-gray-400">
                    Shows monthly revenue trends and projections
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* User Growth */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium mb-4">User Growth</h4>
              <div className="relative" style={{ height: "220px" }}>
                {/* Placeholder for chart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-300 mb-3 mx-auto"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <p className="text-gray-500">
                      User growth chart would be rendered here
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Completion */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium mb-4">
                Course Completion Rates
              </h4>
              <div className="relative" style={{ height: "220px" }}>
                {/* Placeholder for chart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-300 mb-3 mx-auto"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    <p className="text-gray-500">
                      Completion rate chart would be rendered here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Courses */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h4 className="text-lg font-medium">Top Performing Courses</h4>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Enrollments
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Completion
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Generate top 3 courses based on enrollment count */}
                {filteredCourses
                  .slice(0, 3)
                  .map((course) => {
                    // For simplicity, generate some fake stats
                    const enrollments = Math.floor(Math.random() * 100) + 10;
                    const completion = Math.floor(Math.random() * 30) + 70;
                    const rating = (4 + Math.random()).toFixed(1);
                    const revenue = course.isFree
                      ? "$0"
                      : `$${(course.price * enrollments).toFixed(2)}`;

                    return (
                      <tr key={course.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {course.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {enrollments}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {completion}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <span className="mr-1">{rating}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-yellow-400 text-xs"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{revenue}</div>
                        </td>
                      </tr>
                    );
                  })}
                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      <p className="text-gray-500">No courses data available.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage platform users, courses, and view analytics.
        </p>
      </div>

      {/* Admin Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Students"
            value={analytics?.totalStudents || 0}
            icon={<UserCircle className="h-5 w-5" />}
            borderColor="border-primary"
            iconBgColor="bg-primary bg-opacity-10"
            iconColor="text-primary"
            trend={{
              value: "8% from last month",
              isPositive: true,
            }}
          />

          <StatsCard
            title="Active Teachers"
            value={analytics?.totalTeachers || 0}
            icon={<Presentation className="h-5 w-5" />}
            borderColor="border-success"
            iconBgColor="bg-success bg-opacity-10"
            iconColor="text-success"
            trend={{
              value: "3 new this month",
              isPositive: true,
            }}
          />

          <StatsCard
            title="Active Courses"
            value={analytics?.publishedCourses || 0}
            icon={<BookOpen className="h-5 w-5" />}
            borderColor="border-accent"
            iconBgColor="bg-accent bg-opacity-10"
            iconColor="text-accent"
            trend={{
              value: "12 new this month",
              isPositive: true,
            }}
          />

          <StatsCard
            title="Monthly Revenue"
            value="$24,389"
            icon={<DollarSign className="h-5 w-5" />}
            borderColor="border-warning"
            iconBgColor="bg-warning bg-opacity-10"
            iconColor="text-warning"
            trend={{
              value: "15% from last month",
              isPositive: true,
            }}
          />
        </div>
      </div>

      {/* Admin Tabs */}
      <Tabs tabs={tabsContent} defaultTab="users" />

      {/* Modals */}
      <AddTeacherModal
        open={addTeacherModalOpen}
        onOpenChange={setAddTeacherModalOpen}
      />
    </div>
  );
}
