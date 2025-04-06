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
import { ContentType } from '@shared/schema';
import { Loader2, Upload } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  contentType: z.string().min(1, "Please select content type"),
  contentUrl: z.string().optional(),
  order: z.number().default(1),
});

type FormValues = z.infer<typeof formSchema>;

interface UploadContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadContentModal({ open, onOpenChange }: UploadContentModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fileSelected, setFileSelected] = useState<boolean>(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      title: "",
      contentType: "",
      contentUrl: "",
      order: 1,
    },
  });

  // Fetch teacher's courses
  const { data: courses } = useQuery({
    queryKey: user ? [`/api/teachers/${user.id}/courses`] : [],
    enabled: !!user,
  });

  const uploadContentMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // In a real application, you would first upload the file to storage
      // and then create the lesson with the file URL
      
      // Convert courseId to number
      const lessonData = {
        ...data,
        courseId: parseInt(data.courseId),
        contentUrl: data.contentUrl || "https://example.com/placeholder-content", // Placeholder
      };

      const res = await apiRequest("POST", "/api/lessons", lessonData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Content uploaded",
        description: "Your content has been uploaded successfully",
      });
      
      // Reset form and close modal
      form.reset();
      setFileSelected(false);
      onOpenChange(false);
      
      // Invalidate relevant queries
      if (form.getValues().courseId) {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/courses/${form.getValues().courseId}/lessons`] 
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error uploading content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    uploadContentMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you would handle file upload here
      // For now, just mark as selected
      setFileSelected(true);
      form.setValue("contentUrl", `file://${file.name}`); // Placeholder
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Course</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses?.map((course: any) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.title}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Introduction to React Hooks" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ContentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
              name="contentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className={`mx-auto h-12 w-12 ${fileSelected ? 'text-primary' : 'text-gray-400'} mb-3`} />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="content-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark">
                            <span>Upload a file</span>
                            <input 
                              id="content-upload" 
                              name="content-upload" 
                              type="file" 
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">MP4, PDF, PPT, DOC up to 500MB</p>
                        {fileSelected && (
                          <p className="text-sm text-primary mt-2">File selected</p>
                        )}
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
                disabled={uploadContentMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={uploadContentMutation.isPending || !fileSelected}
              >
                {uploadContentMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Upload Content
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
