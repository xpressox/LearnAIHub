import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Award, 
  Users, 
  BarChart, 
  Check, 
  ArrowRight, 
  MessageSquare, 
  Brain, 
  FileText, 
  PlayCircle,
  Globe
} from "lucide-react";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would subscribe the user to a newsletter
    alert(`Thank you for subscribing with ${email}! We'll keep you updated.`);
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/20 via-emerald-100/15 to-background pt-16 pb-20">
        <div className="absolute inset-0 bg-[url('/client/public/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">Transform</span> Your Dental Education
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Join India's premier dental e-learning platform with courses designed specifically for BDS and MDS students. Access expert-led dental courses, clinical case studies, and AI-powered study tools.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white" 
                  onClick={() => navigate("/auth")}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Courses
                </Button>
              </div>
              <div className="mt-8 flex items-center text-sm text-muted-foreground">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Access to free courses</span>
                <span className="mx-2">•</span>
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Personalized experience</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-px bg-gradient-to-r from-primary/30 to-emerald-500/40 rounded-xl blur-xl"></div>
              <div className="relative bg-background rounded-xl border shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                  alt="Students learning together"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-emerald-50/20 to-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Expert Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1.2M+</div>
              <div className="text-sm text-muted-foreground">Students Worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2,500+</div>
              <div className="text-sm text-muted-foreground">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">92%</div>
              <div className="text-sm text-muted-foreground">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-50/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose DentalLearnHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              India's premier dental e-learning platform combines cutting-edge technology with expert-led instruction from top dental professionals to enhance your dental education.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
                <p className="text-muted-foreground">
                  Our intelligent system adapts to your learning style, helping you focus on areas that need improvement.
                </p>
              </CardContent>
            </Card>
            
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
                <p className="text-muted-foreground">
                  Learn from industry professionals with real-world experience and proven teaching methods.
                </p>
              </CardContent>
            </Card>
            
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comprehensive Resources</h3>
                <p className="text-muted-foreground">
                  Access a wide range of learning materials, from video lectures to interactive quizzes and projects.
                </p>
              </CardContent>
            </Card>
            
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Community</h3>
                <p className="text-muted-foreground">
                  Connect with fellow learners worldwide, collaborate on projects, and expand your network.
                </p>
              </CardContent>
            </Card>
            
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Recognized Certificates</h3>
                <p className="text-muted-foreground">
                  Earn industry-recognized certificates that enhance your resume and career prospects.
                </p>
              </CardContent>
            </Card>
            
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your learning journey with detailed analytics and personalized recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section id="courses" className="py-20 bg-gradient-to-b from-background to-emerald-50/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Explore Our Dental Course Categories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover specialized dental courses covering clinical skills, dental sciences, practice management, and continuing dental education for BDS and MDS students in India.
            </p>
          </div>
          
          <Tabs defaultValue="clinical" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full mb-8">
              <TabsTrigger value="clinical">Clinical Skills</TabsTrigger>
              <TabsTrigger value="sciences">Dental Sciences</TabsTrigger>
              <TabsTrigger value="management">Practice Management</TabsTrigger>
              <TabsTrigger value="continuing">Continuing Education</TabsTrigger>
            </TabsList>
            
            {['clinical', 'sciences', 'management', 'continuing'].map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} className="group relative bg-background rounded-lg border overflow-hidden transition-all hover:shadow-md">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                          <div className="p-4 w-full">
                            <Button 
                              variant="default" 
                              className="w-full" 
                              onClick={() => navigate("/auth")}
                            >
                              Enroll Now
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {category === 'clinical' && 'Practical Skills'}
                            {category === 'sciences' && 'Dental Sciences'}
                            {category === 'management' && 'Management'}
                            {category === 'continuing' && 'CE Credits'}
                          </div>
                          <div className="text-sm font-bold">
                            {num % 2 === 0 ? 'Free' : '₹4,999'}
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                          {category === 'clinical' && 'Advanced Dental Implant Techniques'}
                          {category === 'sciences' && 'Oral Pathology Masterclass'}
                          {category === 'management' && 'Dental Practice Management'}
                          {category === 'continuing' && 'Latest Updates in Endodontics'}
                          {' '}
                          {num}
                        </h3>
                        <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {category === 'clinical' && 'Master the latest dental implant techniques with hands-on training and live case studies from top Indian specialists.'}
                          {category === 'sciences' && 'Comprehensive study of oral pathology with focus on conditions prevalent in the Indian subcontinent.'}
                          {category === 'management' && 'Learn to run a successful dental practice in India, covering patient acquisition, staff management, and regulatory compliance.'}
                          {category === 'continuing' && 'Stay updated with the latest advancements in endodontic treatments and earn required CE credits from DCI.'}
                        </div>
                        <div className="flex items-center text-sm">
                          <PlayCircle className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-muted-foreground">{10 + num} lessons</span>
                          <span className="mx-2 text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{4 + (num * 2)} hours</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="outline" className="px-6" onClick={() => navigate("/auth")}>
                    View All {category.charAt(0).toUpperCase() + category.slice(1)} Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-t from-emerald-50/10 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Dental Students Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of dental professionals who have enhanced their skills and advanced their careers with DentalLearnHub.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Priya Sharma",
                role: "BDS, Private Practice",
                image: "https://randomuser.me/api/portraits/women/32.jpg",
                quote: "The implantology course on DentalLearnHub helped me master advanced techniques that I now use daily in my practice. The AI-assisted learning made complex concepts easy to understand."
              },
              {
                name: "Dr. Rajesh Kumar",
                role: "MDS Prosthodontics, Dental College Professor",
                image: "https://randomuser.me/api/portraits/men/22.jpg",
                quote: "As a faculty member, I've recommended DentalLearnHub to all my students. The practice management courses helped me streamline operations at our university clinic."
              },
              {
                name: "Dr. Ananya Mehta",
                role: "BDS, Dental Surgery Resident",
                image: "https://randomuser.me/api/portraits/women/45.jpg",
                quote: "The continuing education courses on DentalLearnHub are exceptional. I was able to earn all my required CE credits through their DCI-approved courses while preparing for my MDS entrance exams."
              }
            ].map((testimonial, i) => (
              <Card key={i} className="relative">
                <CardContent className="pt-6">
                  <div className="mb-4 text-primary">
                    {Array(5).fill(0).map((_, j) => (
                      <svg key={j} className="w-5 h-5 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <p className="mb-6 italic text-muted-foreground">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-emerald-500/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Dental Practice?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of dental professionals across India who are advancing their skills and careers with DentalLearnHub.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white" 
                onClick={() => navigate("/auth")}
              >
                Sign Up Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Subscribe to Updates
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-20 bg-gradient-to-r from-primary/5 to-emerald-500/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated on Dental Advancements</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to receive updates on new dental courses, clinical techniques, research findings, and special offers directly to your inbox.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow"
                required
              />
              <Button type="submit" className="bg-primary text-white">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-primary/5 via-emerald-500/5 to-muted py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/auth" className="text-muted-foreground hover:text-foreground">Sign Up</Link></li>
                <li><Link to="/auth" className="text-muted-foreground hover:text-foreground">Log In</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Features</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Career Guides</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Press</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Accessibility</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl font-bold">
                <span className="text-primary">Dental</span><span className="text-emerald-500">LearnHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 50 50" fill="none" className="ml-2 inline-block">
                  <path d="M25 5C21.5 5 18.3333 8.3333 17 10C15.5 10 13.5 10.5 12.5 12.5C11.5 14.5 11 20 11.5 22.5C12 25 13 30 15 33.5C17 37 19.5 40.5 21.5 41.5C23.5 42.5 28 43 30 41.5C32 40 34.5 37 36.5 33.5C38.5 30 39.5 25 40 22.5C40.5 20 40 14.5 39 12.5C38 10.5 36 10 34.5 10C33.1667 8.3333 30 5 25 5Z" fill="#32CD32"/>
                  <path d="M25 10C22.5 10 20 12.5 19 14C17.8333 14 16.5 14.5 16 16C15.5 17.5 15 21.5 15.5 23.5C16 25.5 16.5 29 18 31.5C19.5 34 21.5 36.5 23 37C24.5 37.5 27.5 38 29 37C30.5 36 33 34 34.5 31.5C36 29 36.5 25.5 37 23.5C37.5 21.5 37 17.5 36.5 16C36 14.5 34.5 14 33.5 14C32.5 12.5 30 10 25 10Z" fill="white"/>
                  <path d="M20 20C22 21 25 21.5 30 20" stroke="#32CD32" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M20 25C22 26 25 26.5 30 25" stroke="#32CD32" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M22 30C24 31 26 31.5 28 30" stroke="#32CD32" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                © {new Date().getFullYear()} DentalLearnHub India. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">YouTube</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}