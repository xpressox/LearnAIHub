import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface CourseProgressCardProps {
  id: number;
  title: string;
  category: string;
  progress: number;
  lessons: {
    total: number;
    completed: number;
  };
  thumbnail?: string;
}

export default function CourseProgressCard({
  id,
  title,
  category,
  progress,
  lessons,
  thumbnail
}: CourseProgressCardProps) {
  // Default placeholder thumbnail
  const defaultThumbnail = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

  return (
    <Card className="overflow-hidden course-card">
      <div className="relative h-40">
        <img 
          src={thumbnail || defaultThumbnail} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <Badge variant="default" className="bg-accent text-white">In Progress</Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1 course-title">{title}</h3>
        <p className="text-gray-500 text-sm mb-2 course-category">{category}</p>
        <div className="mb-2">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-gray-500 mt-1 flex justify-between">
            <span>{progress}% complete</span>
            <span>{lessons.completed}/{lessons.total} lessons</span>
          </div>
        </div>
        <div className="mt-4">
          <Link href={`/courses/${id}`}>
            <Button className="w-full">Continue Learning</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
