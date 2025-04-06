import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import StatsCard from "@/components/dashboard/stats-card";
import { Input } from "@/components/ui/input";
import { Users, BookOpen, ChartLine, Star } from "lucide-react";
import CreateCourseModal from "@/components/modals/create-course-modal";
import UploadContentModal from "@/components/modals/upload-content-modal";
import AIContentModal from "@/components/modals/ai-content-modal";
import { Button } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseStatus } from "@shared/schema";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [createCourseModalOpen, setCreateCourseModalOpen] = useState(false);
  const [uploadContentModalOpen, setUploadContentModalOpen] = useState(false);
  const [aiContentModalOpen, setAIContentModalOpen] = useState(false);

  // Fetch teacher analytics
  const { data: analytics } = useQuery({
    queryKey: user ? [`/api/analytics/teacher/${user.id}`] : [],
    enabled: !!user,
  });

  // Fetch teacher courses
  const { data: courses } = useQuery({
    queryKey: user ? [`/api/teachers/${user.id}/courses`] : [],
    enabled: !!user,
  });

  // Filter courses based on search term
  const filteredCourses = courses
    ? courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Teacher Dashboard</h1>
        <p className="text-gray-600">Manage your courses and create content.</p>
      </div>

      {/* Teacher Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Students"
            value={analytics?.totalStudents || 0}
            icon={<Users className="h-5 w-5" />}
            borderColor="border-primary"
            iconBgColor="bg-primary bg-opacity-10"
            iconColor="text-primary"
            trend={{
              value: "12% from last month",
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
              value: `${analytics?.totalCourses - (analytics?.publishedCourses || 0)} in draft`,
              isPositive: true,
            }}
          />

          <StatsCard
            title="Completion Rate"
            value={`${Math.round(analytics?.completionRate || 0)}%`}
            icon={<ChartLine className="h-5 w-5" />}
            borderColor="border-success"
            iconBgColor="bg-success bg-opacity-10"
            iconColor="text-success"
            trend={{
              value: "5% from last month",
              isPositive: true,
            }}
          />

          <StatsCard
            title="Average Rating"
            value="4.7/5"
            icon={<Star className="h-5 w-5" />}
            borderColor="border-warning"
            iconBgColor="bg-warning bg-opacity-10"
            iconColor="text-warning"
            trend={{
              value: "Based on 127 reviews",
              isPositive: undefined,
            }}
          />
        </div>
      </div>

      {/* Teacher Actions */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setCreateCourseModalOpen(true)}
            className="bg-white rounded-lg shadow p-5 flex items-center hover:bg-gray-50 transition"
          >
            <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Create New Course</h3>
              <p className="text-gray-500 text-sm">
                Add a new course to your catalog
              </p>
            </div>
          </button>

          <button
            onClick={() => setUploadContentModalOpen(true)}
            className="bg-white rounded-lg shadow p-5 flex items-center hover:bg-gray-50 transition"
          >
            <div className="bg-accent bg-opacity-10 p-3 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Upload Content</h3>
              <p className="text-gray-500 text-sm">
                Add videos, documents, or resources
              </p>
            </div>
          </button>

          <button
            onClick={() => setAIContentModalOpen(true)}
            className="bg-white rounded-lg shadow p-5 flex items-center hover:bg-gray-50 transition"
          >
            <div className="bg-success bg-opacity-10 p-3 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-success"
              >
                <rect width="18" height="10" x="3" y="11" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" x2="8" y1="16" y2="16" />
                <line x1="16" x2="16" y1="16" y2="16" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Generate AI Content</h3>
              <p className="text-gray-500 text-sm">
                Create summaries or course materials
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Teacher Courses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Courses</h2>
          <div className="relative">
            <Input
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  Students
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
                  Status
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
                // For simplicity, we'll use dummy values for enrollment count and rating
                const enrollmentCount = Math.floor(Math.random() * 100);
                const rating = (4 + Math.random()).toFixed(1);

                return (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                          <img
                            src={
                              course.thumbnailUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=3B82F6&color=fff`
                            }
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
                        {enrollmentCount}
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
                      <Badge
                        variant={
                          course.status === CourseStatus.PUBLISHED
                            ? "success"
                            : "default"
                        }
                      >
                        {course.status === CourseStatus.PUBLISHED
                          ? "Published"
                          : "Draft"}
                      </Badge>
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
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <p className="text-gray-500">
                      No courses found. Create your first course to get started!
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateCourseModal
        open={createCourseModalOpen}
        onOpenChange={setCreateCourseModalOpen}
      />
      <UploadContentModal
        open={uploadContentModalOpen}
        onOpenChange={setUploadContentModalOpen}
      />
      <AIContentModal
        open={aiContentModalOpen}
        onOpenChange={setAIContentModalOpen}
      />
    </div>
  );
}
