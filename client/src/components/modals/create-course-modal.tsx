import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CourseCategory, CourseStatus } from '@shared/schema';
import { Loader2, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().nonempty("Please select a category"),
  price: z.coerce.number().min(0, "Price must be 0 or higher"),
  isFree: z.boolean().default(false),
  status: z.string().default(CourseStatus.DRAFT),
  thumbnailUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCourseModal({ open, onOpenChange }: CreateCourseModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      isFree: true,
      status: CourseStatus.DRAFT,
      thumbnailUrl: "",
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Add teacher ID from current user
      const courseData = {
        ...data,
        teacherId: user?.id as number,
      };

      const res = await apiRequest("POST", "/api/courses", courseData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Course created",
        description: "Your course has been created successfully",
      });
      
      // Reset form and close modal
      form.reset();
      setThumbnailPreview(null);
      onOpenChange(false);
      
      // Invalidate courses queries
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      if (user) {
        queryClient.invalidateQueries({ queryKey: [`/api/teachers/${user.id}/courses`] });
      }
    },
    onError: (error) => {
      toast({
        title: "Error creating course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createCourseMutation.mutate(data);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you would upload this file to a server
      // and get back a URL to use for the thumbnail
      // For now, we'll just create a local object URL as a preview
      const objectUrl = URL.createObjectURL(file);
      setThumbnailPreview(objectUrl);
      form.setValue("thumbnailUrl", objectUrl);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    form.setValue("isFree", checked);
    if (checked) {
      form.setValue("price", 0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Modern Web Development" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(CourseCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe what students will learn in this course"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        min={0} 
                        step={0.01}
                        disabled={form.watch("isFree")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-2 space-y-0 pt-8">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={handleCheckboxChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Make this course free</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {thumbnailPreview ? (
                          <div className="mb-3">
                            <img 
                              src={thumbnailPreview} 
                              alt="Thumbnail preview" 
                              className="mx-auto h-32 w-32 object-cover rounded"
                            />
                          </div>
                        ) : (
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        )}
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark">
                            <span>Upload a file</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              className="sr-only"
                              onChange={handleThumbnailChange}
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={createCourseMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createCourseMutation.isPending}
              >
                {createCourseMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create Course
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
