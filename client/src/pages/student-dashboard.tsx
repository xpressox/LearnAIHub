import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import StatsCard from "@/components/dashboard/stats-card";
import CourseProgressCard from "@/components/dashboard/course-progress-card";
import CourseCard from "@/components/dashboard/course-card";
import Tabs from "@/components/dashboard/tabs";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch student enrollments
  const { data: enrollments, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: user ? [`/api/students/${user.id}/enrollments`] : [],
    enabled: !!user,
  });

  // Fetch all published courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/courses"],
    enabled: !!user,
  });

  // Enroll in a course
  const handleEnroll = async (courseId: number) => {
    if (!user) return;

    try {
      await apiRequest("POST", "/api/enrollments", {
        studentId: user.id,
        courseId,
      });

      toast({
        title: "Enrolled successfully",
        description: "You have been enrolled in the course",
      });

      // Refetch enrollments
      if (user) {
        await fetch(`/api/students/${user.id}/enrollments`, {
          credentials: "include",
        });
      }
    } catch (error) {
      toast({
        title: "Enrollment failed",
        description: "Failed to enroll in the course",
        variant: "destructive",
      });
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses
    ? courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Get user stats
  const inProgressCount = enrollments?.filter((e) => !e.completed)?.length || 0;
  const completedCount = enrollments?.filter((e) => e.completed)?.length || 0;
  
  // Add a placeholder for hours spent - in a real app this would come from the API
  const hoursSpent = enrollments?.length ? Math.round(enrollments.length * 3.5) : 0;

  // Create tabs content for courses section
  const allCourses = filteredCourses;
  const freeCourses = filteredCourses.filter((course) => course.isFree);
  const premiumCourses = filteredCourses.filter((course) => !course.isFree);

  const tabsContent = [
    {
      id: "all",
      label: "All Courses",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnrollClick={handleEnroll}
            />
          ))}
          {allCourses.length === 0 && (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">No courses found</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "free",
      label: "Free Courses",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freeCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnrollClick={handleEnroll}
            />
          ))}
          {freeCourses.length === 0 && (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">No free courses found</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "premium",
      label: "Premium Courses",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnrollClick={handleEnroll}
            />
          ))}
          {premiumCourses.length === 0 && (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">No premium courses found</p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Continue your learning journey or explore new courses.
        </p>
      </div>

      {/* Student Progress Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Courses in Progress"
            value={inProgressCount}
            icon={<BookOpen className="h-5 w-5" />}
            borderColor="border-primary"
            iconBgColor="bg-primary bg-opacity-10"
            iconColor="text-primary"
            link={{
              text: "View all courses",
              url: "#",
            }}
          />

          <StatsCard
            title="Courses Completed"
            value={completedCount}
            icon={<CheckCircle className="h-5 w-5" />}
            borderColor="border-emerald-500"
            iconBgColor="bg-emerald-500 bg-opacity-10"
            iconColor="text-emerald-500"
            link={{
              text: "View certificates",
              url: "#",
            }}
          />

          <StatsCard
            title="Hours Spent Learning"
            value={hoursSpent}
            icon={<Clock className="h-5 w-5" />}
            borderColor="border-primary"
            iconBgColor="bg-primary bg-opacity-10"
            iconColor="text-primary"
            link={{
              text: "View statistics",
              url: "#",
            }}
          />
        </div>
      </div>

      {/* Continue Learning Section */}
      {enrollments && enrollments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments
              .filter((enrollment) => !enrollment.completed)
              .map((enrollment) => (
                <CourseProgressCard
                  key={enrollment.id}
                  id={enrollment.course.id}
                  title={enrollment.course.title}
                  category={enrollment.course.category}
                  progress={enrollment.completionPercentage}
                  lessons={{
                    total: 12, // This would come from the API in a real app
                    completed: Math.round(
                      (enrollment.completionPercentage / 100) * 12
                    ),
                  }}
                  thumbnail={enrollment.course.thumbnailUrl}
                />
              ))}
            {enrollments.filter((enrollment) => !enrollment.completed).length ===
              0 && (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">
                  No courses in progress. Enroll in a course below to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Explore Courses Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Explore Courses</h2>
          <div className="relative">
            <Input
              placeholder="Search courses..."
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

        <Tabs tabs={tabsContent} defaultTab="all" />
      </div>
    </div>
  );
}
