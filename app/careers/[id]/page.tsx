"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Briefcase, 
  MapPin, 
  Clock, 
  Home,
  Upload,
  Linkedin,
  Github,
  ExternalLink,
  Send
} from "lucide-react";
import Link from "next/link";

// Mock job data (in real app would come from a database)
const jobOpenings = [
  {
    id: 1,
    title: "AI Research Engineer",
    department: "Engineering",
    location: "Chandigarh, India",
    type: "Full-time",
    remote: false,
    description: "Join our AI research team to develop cutting-edge models and algorithms for our platform. You'll work on optimizing model performance, implementing new features, and pushing the boundaries of what's possible with AI.",
    aboutRole: "As an AI Research Engineer, you'll be at the forefront of innovation, working on projects that push the boundaries of what's possible with artificial intelligence. You'll collaborate with a talented team of researchers and engineers to develop new models, optimize existing ones, and implement cutting-edge techniques from academic research into our production systems.",
    responsibilities: [
      "Research and implement state-of-the-art AI models and algorithms",
      "Optimize model performance, accuracy, and efficiency",
      "Collaborate with cross-functional teams to integrate AI solutions",
      "Stay current with academic research and industry trends",
      "Publish research findings in academic journals and conferences",
      "Mentor junior team members and contribute to knowledge sharing"
    ],
    requirements: [
      "Masters or PhD in Computer Science, Machine Learning, or related field",
      "3+ years experience with deep learning frameworks (PyTorch, TensorFlow)",
      "Strong publication record or demonstrable research experience",
      "Excellent communication skills"
    ],
    preferred: [
      "Experience with large language models (LLMs)",
      "Background in computer vision or natural language processing",
      "Contributions to open-source AI projects",
      "Experience deploying models to production environments"
    ]
  },
  {
    id: 2,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Chandigarh, India",
    type: "Full-time",
    remote: false,
    description: "We're looking for a talented frontend developer to create beautiful, responsive interfaces for our AI model marketplace. You'll work closely with designers and backend engineers to implement new features and improve user experience.",
    aboutRole: "As a Frontend Developer, you'll be responsible for building the user interfaces that bring our AI platform to life. You'll work with designers to translate mockups into functional, responsive, and accessible web applications that delight our users and make complex AI capabilities easy to use.",
    responsibilities: [
      "Develop responsive, accessible web applications using React/Next.js",
      "Collaborate with designers to implement UI/UX designs",
      "Write clean, maintainable, and well-tested code",
      "Optimize application performance and responsiveness",
      "Work with backend developers to integrate APIs",
      "Participate in code reviews and contribute to technical decisions"
    ],
    requirements: [
      "3+ years experience with React/Next.js",
      "Strong TypeScript skills",
      "Experience with modern CSS frameworks (Tailwind, Styled Components)",
      "Eye for design and attention to detail",
      "Experience with state management libraries"
    ],
    preferred: [
      "Experience with animation libraries (Framer Motion, GSAP)",
      "Knowledge of accessibility standards and best practices",
      "Experience with testing frameworks (Jest, React Testing Library)",
      "Understanding of CI/CD workflows"
    ]
  },
  // Other jobs would be defined here, following the same pattern
];

export default function JobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const jobId = parseInt(params.id);
  const job = jobOpenings.find(j => j.id === jobId);
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    coverLetter: '',
    resume: null as File | null,
    submitted: false,
    submitting: false,
    error: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormState(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormState(prev => ({ ...prev, submitting: true, error: '' }));
    
    // Validate form
    if (!formState.name || !formState.email || !formState.resume) {
      setFormState(prev => ({ 
        ...prev, 
        submitting: false,
        error: 'Please fill out all required fields and upload your resume.'
      }));
      return;
    }
    
    // In a real application, you would submit the form data to your API here
    // For demo purposes, we'll just simulate a submission with a timeout
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormState(prev => ({ ...prev, submitted: true, submitting: false }));
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        submitting: false,
        error: 'There was an error submitting your application. Please try again.'
      }));
    }
  };
  
  if (!job) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Position Not Found</h1>
            <p className="text-gray-300 mb-8">
              The job position you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              href="/careers"
              className="inline-flex items-center px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to All Positions
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      {/* Job Details Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <Link 
            href="/careers"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Positions
          </Link>
          
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center text-gray-300">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{job.type}</span>
                    </div>
                    {job.remote && (
                      <div className="flex items-center text-green-400">
                        <Home className="h-4 w-4 mr-2" />
                        <span>Remote</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-8">
                  <p className="text-lg text-gray-300 mb-6">{job.description}</p>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">About the Role</h2>
                    <p className="text-gray-300 mb-4">{job.aboutRole}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Responsibilities</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {job.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Requirements</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {job.requirements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Nice to Have</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {job.preferred.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Application Form Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="p-6 md:p-8">
              {!formState.submitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Apply for this Position</h2>
                  
                  {formState.error && (
                    <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
                      {formState.error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="name">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input 
                          type="text"
                          id="name"
                          name="name"
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="Your full name"
                          value={formState.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="email">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input 
                          type="email"
                          id="email"
                          name="email"
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="your.email@example.com"
                          value={formState.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="phone">
                          Phone Number
                        </label>
                        <input 
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="Your phone number"
                          value={formState.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="linkedin">
                          LinkedIn Profile
                        </label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                          <input 
                            type="url"
                            id="linkedin"
                            name="linkedin"
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            placeholder="linkedin.com/in/yourprofile"
                            value={formState.linkedin}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="github">
                          GitHub Profile
                        </label>
                        <div className="relative">
                          <Github className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                          <input 
                            type="url"
                            id="github"
                            name="github"
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            placeholder="github.com/yourusername"
                            value={formState.github}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="portfolio">
                          Portfolio Website
                        </label>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                          <input 
                            type="url"
                            id="portfolio"
                            name="portfolio"
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            placeholder="yourportfolio.com"
                            value={formState.portfolio}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2" htmlFor="resume">
                        Resume/CV <span className="text-red-400">*</span>
                      </label>
                      <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 focus-within:ring-2 focus-within:ring-purple-500/50">
                        <div className="flex items-center">
                          <div className="flex-1">
                            {formState.resume ? (
                              <div className="flex items-center text-green-400">
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                <span className="truncate">{formState.resume.name}</span>
                              </div>
                            ) : (
                              <p className="text-gray-400">Upload your resume (PDF, DOCX)</p>
                            )}
                          </div>
                          <label className="cursor-pointer bg-gray-600 hover:bg-gray-500 transition-colors py-2 px-4 rounded-lg inline-flex items-center ml-3">
                            <Upload className="h-4 w-4 mr-2" />
                            <span>Browse</span>
                            <input 
                              type="file" 
                              id="resume"
                              name="resume"
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              required
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <label className="block text-sm font-medium mb-2" htmlFor="coverLetter">
                        Cover Letter
                      </label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[150px]"
                        placeholder="Tell us why you're interested in this position and what makes you a great fit."
                        value={formState.coverLetter}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    
                    <div className="text-right">
                      <button
                        type="submit"
                        className={`inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors ${
                          formState.submitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                        disabled={formState.submitting}
                      >
                        {formState.submitting ? (
                          <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <Send className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-green-500/20 h-20 w-20 rounded-full mx-auto flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Application Submitted!</h2>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Thank you for applying to the {job.title} position. We'll review your application 
                    and get back to you soon.
                  </p>
                  <Link 
                    href="/careers"
                    className="inline-flex items-center px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Positions
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 