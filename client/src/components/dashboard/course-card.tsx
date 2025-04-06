import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Course } from '@shared/schema';

interface CourseCardProps {
  course: Course;
  onEnrollClick?: (courseId: number) => void;
}

export default function CourseCard({ course, onEnrollClick }: CourseCardProps) {
  const { id, title, category, price, isFree, thumbnailUrl } = course;
  
  // Default placeholder thumbnail
  const defaultThumbnail = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <img 
          src={thumbnailUrl || defaultThumbnail} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <Badge variant={isFree ? "success" : "secondary"}>
            {isFree ? 'Free' : 'Premium'}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1 course-title">{title}</h3>
        <p className="text-gray-500 text-sm mb-2 course-category">{category}</p>
        <div className="flex items-center mb-3">
          <div className="mr-1 flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star}
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill={star <= 4 ? "currentColor" : "none"}
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-yellow-400"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">(128)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`font-bold text-lg ${isFree ? 'text-success' : ''}`}>
            {isFree ? 'Free' : `$${price.toFixed(2)}`}
          </span>
          <Button 
            size="sm"
            onClick={() => onEnrollClick && onEnrollClick(id)}
          >
            Enroll Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
