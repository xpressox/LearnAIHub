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
import { Loader2, Upload, Bot } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  generationType: z.string().min(1, "Please select generation type"),
  instructions: z.string().optional(),
  referenceFile: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AIContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AIContentModal({ open, onOpenChange }: AIContentModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fileSelected, setFileSelected] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      generationType: "",
      instructions: "",
      referenceFile: undefined,
    },
  });

  // Fetch teacher's courses
  const { data: courses } = useQuery({
    queryKey: user ? [`/api/teachers/${user.id}/courses`] : [],
    enabled: !!user,
  });

  const generateContentMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      setLoading(true);
      
      // Based on generation type, call the appropriate API
      let endpoint;
      let payload: any = {};
      
      switch (data.generationType) {
        case 'notes':
          endpoint = '/api/ai/generate-notes';
          payload = {
            text: data.instructions || 'Generate comprehensive study notes for this course.',
          };
          break;
        case 'quiz':
          endpoint = '/api/ai/generate-quiz';
          payload = {
            text: data.instructions || 'Generate quiz questions from this course content.',
            numberOfQuestions: 5,
          };
          break;
        case 'summary':
          endpoint = '/api/ai/generate-summary';
          payload = {
            text: data.instructions || 'Generate a summary for this course.',
          };
          break;
        case 'lesson-plan':
          endpoint = '/api/ai/generate-lesson-plan';
          payload = {
            topic: data.instructions || `Generate a lesson plan for course ID ${data.courseId}`,
          };
          break;
        default:
          endpoint = '/api/ai/generate-custom';
          payload = {
            instructions: data.instructions || 'Generate educational content for this course.',
            reference: 'Sample reference text to generate content from.',
          };
      }

      const res = await apiRequest("POST", endpoint, payload);
      return await res.json();
    },
    onSuccess: (data) => {
      // Extract the generated content based on the response structure
      const content = 
        data.summary || 
        data.notes || 
        data.lessonPlan || 
        data.content || 
        JSON.stringify(data, null, 2);
      
      setGeneratedContent(content);
      setLoading(false);
      
      toast({
        title: "Content generated",
        description: "AI content has been successfully generated",
      });
    },
    onError: (error) => {
      setLoading(false);
      toast({
        title: "Error generating content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    setGeneratedContent(null);
    generateContentMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(true);
      form.setValue("referenceFile", file);
    }
  };

  const handleCloseModal = () => {
    form.reset();
    setFileSelected(false);
    setGeneratedContent(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate AI Content</DialogTitle>
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
              name="generationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Generation Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select generation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="notes">Generate Notes from Video</SelectItem>
                      <SelectItem value="quiz">Create Quiz from Content</SelectItem>
                      <SelectItem value="summary">Generate Summary</SelectItem>
                      <SelectItem value="lesson-plan">Create Lesson Plan</SelectItem>
                      <SelectItem value="custom">Custom Content</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Instructions (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="E.g., Focus on key concepts, Include code examples..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="referenceFile"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Upload Reference File (optional)</FormLabel>
                  <FormControl>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className={`mx-auto h-12 w-12 ${fileSelected ? 'text-primary' : 'text-gray-400'} mb-3`} />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="ai-reference-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark">
                            <span>Upload a file</span>
                            <input 
                              id="ai-reference-upload" 
                              name="ai-reference-upload" 
                              type="file" 
                              className="sr-only"
                              onChange={handleFileChange}
                              {...field}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">MP4, PDF, PPT, DOC up to 100MB</p>
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
            
            {generatedContent && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Generated Content
                </h3>
                <div className="max-h-60 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">{generatedContent}</pre>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseModal}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading || form.getValues('courseId') === "" || form.getValues('generationType') === ""}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Generate Content
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
