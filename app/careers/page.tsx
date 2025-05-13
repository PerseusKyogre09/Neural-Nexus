"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Zap, 
  Heart, 
  Users, 
  GraduationCap,
  Code,
  Search,
  ChevronDown,
  ArrowRight,
  Building
} from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  // Gen-Z style variable names for the win
  const [searchVibe, setSearchVibe] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedLoc, setSelectedLoc] = useState('all');
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  
  // Company core values
  const coreValues = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Innovation First",
      description: "We push boundaries and embrace cutting-edge technology to lead the AI revolution."
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-400" />,
      title: "User-Centric",
      description: "Everything we build is designed with our users' needs and experiences in mind."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: "Collaborative Spirit",
      description: "We believe in the power of diverse teams working together to solve complex problems."
    }
  ];
  
  // Job departments
  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'design', name: 'Design' },
    { id: 'product', name: 'Product' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'operations', name: 'Operations' }
  ];
  
  // Locations
  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'sf', name: 'San Francisco, CA' },
    { id: 'nyc', name: 'New York, NY' },
    { id: 'remote', name: 'Remote' },
    { id: 'london', name: 'London, UK' }
  ];
  
  // Mock job openings data
  const jobOpenings = [
    {
      id: 1,
      title: "Senior ML Engineer",
      department: "engineering",
      location: "sf",
      type: "Full-time",
      locationDisplay: "San Francisco, CA",
      posted: "1 week ago",
      description: "We're looking for a talented Senior ML Engineer to help develop and optimize our AI models platform. You'll work on cutting-edge machine learning systems that power our model repository and inference APIs.",
      responsibilities: [
        "Design and implement machine learning infrastructure for model optimization",
        "Build scalable systems for training, evaluating, and serving AI models",
        "Collaborate with the research team to transfer academic innovations into production",
        "Optimize model performance, latency, and resource utilization",
        "Mentor junior engineers and contribute to architecture decisions"
      ],
      requirements: [
        "5+ years of experience in machine learning engineering",
        "Strong proficiency in Python and deep learning frameworks (PyTorch, TensorFlow)",
        "Experience with large-scale distributed systems and cloud infrastructure",
        "Understanding of software engineering best practices and CI/CD pipelines",
        "Excellent problem-solving skills and communication ability"
      ]
    },
    {
      id: 2,
      title: "Product Designer",
      department: "design",
      location: "sf",
      type: "Full-time",
      locationDisplay: "San Francisco, CA",
      posted: "2 weeks ago",
      description: "Join our design team to create beautiful, intuitive interfaces for our AI model platform. You'll shape how users interact with complex AI systems, making them accessible and delightful to use.",
      responsibilities: [
        "Create user-centered designs from concept to high-fidelity prototypes",
        "Design intuitive interfaces for complex AI model interactions",
        "Collaborate with engineers and product managers to implement designs",
        "Conduct user research and usability testing",
        "Help establish and maintain our design system"
      ],
      requirements: [
        "3+ years of experience in product design",
        "Strong portfolio showing UX/UI design for web applications",
        "Proficiency with Figma, Sketch, or similar design tools",
        "Experience designing for technical products is a plus",
        "Excellent communication and collaboration skills"
      ]
    },
    {
      id: 3,
      title: "Backend Engineer",
      department: "engineering",
      location: "remote",
      type: "Full-time",
      locationDisplay: "Remote",
      posted: "3 days ago",
      description: "We're seeking a Backend Engineer to help build the infrastructure that powers our AI model marketplace. You'll work on high-performance APIs, data storage systems, and serverless computing platforms.",
      responsibilities: [
        "Design and implement scalable backend services using Node.js/TypeScript",
        "Build and maintain RESTful APIs for our platform",
        "Work with databases and optimize query performance",
        "Implement authentication, authorization, and security best practices",
        "Collaborate with frontend engineers to integrate APIs"
      ],
      requirements: [
        "4+ years of backend development experience",
        "Strong knowledge of Node.js, TypeScript, and modern backend frameworks",
        "Experience with SQL and NoSQL databases",
        "Familiarity with cloud services (AWS, GCP, or Azure)",
        "Knowledge of API design principles and security practices"
      ]
    },
    {
      id: 4,
      title: "Growth Marketing Manager",
      department: "marketing",
      location: "nyc",
      type: "Full-time",
      locationDisplay: "New York, NY",
      posted: "5 days ago",
      description: "We're looking for a Growth Marketing Manager to help expand our user base and increase engagement with our platform. You'll lead campaigns, analyze performance data, and optimize conversion funnels.",
      responsibilities: [
        "Develop and execute growth marketing strategies across multiple channels",
        "Design and optimize user acquisition and retention campaigns",
        "Analyze marketing data to identify opportunities and insights",
        "Collaborate with product and design teams on growth initiatives",
        "Manage and optimize our marketing budget for maximum ROI"
      ],
      requirements: [
        "3+ years of experience in growth marketing or related field",
        "Strong analytical skills and experience with marketing attribution",
        "Experience with SEM, SEO, content marketing, and social media",
        "Familiarity with marketing automation tools and CRM systems",
        "Data-driven mindset and excellent communication skills"
      ]
    },
    {
      id: 5,
      title: "DevOps Engineer",
      department: "engineering",
      location: "london",
      type: "Full-time",
      locationDisplay: "London, UK",
      posted: "1 week ago",
      description: "Join our DevOps team to build and maintain the infrastructure that powers our AI model platform. You'll work on containerization, CI/CD pipelines, monitoring systems, and cloud infrastructure.",
      responsibilities: [
        "Build and maintain containerized environments using Docker and Kubernetes",
        "Implement and improve CI/CD pipelines for rapid, reliable deployments",
        "Design and manage cloud infrastructure on AWS or GCP",
        "Set up monitoring, alerting, and logging systems",
        "Collaborate with engineering teams to improve system reliability and performance"
      ],
      requirements: [
        "4+ years of experience in DevOps or SRE roles",
        "Strong knowledge of Kubernetes, Docker, and container orchestration",
        "Experience with infrastructure as code (Terraform, CloudFormation)",
        "Familiarity with CI/CD tools and practices",
        "Understanding of networking, security, and cloud architecture"
      ]
    },
    {
      id: 6,
      title: "Product Manager",
      department: "product",
      location: "remote",
      type: "Full-time",
      locationDisplay: "Remote",
      posted: "2 weeks ago",
      description: "We're seeking a Product Manager to help shape the future of our AI model platform. You'll work closely with engineering, design, and business teams to define product strategy and roadmap.",
      responsibilities: [
        "Define product vision, strategy, and roadmap for specific product areas",
        "Gather and prioritize product requirements based on user needs and business goals",
        "Work closely with engineering and design teams to deliver new features",
        "Analyze product metrics and user feedback to drive improvements",
        "Communicate product plans and progress to stakeholders"
      ],
      requirements: [
        "3+ years of experience in product management for technical products",
        "Strong understanding of user-centered design principles",
        "Experience with agile development methodologies",
        "Excellent analytical, communication, and leadership skills",
        "Technical background or familiarity with AI/ML is a plus"
      ]
    }
  ];
  
  // Filter job openings based on search, department, and location
  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = searchVibe === '' || 
      job.title.toLowerCase().includes(searchVibe.toLowerCase()) ||
      job.description.toLowerCase().includes(searchVibe.toLowerCase());
    
    const matchesDepartment = selectedDept === 'all' || job.department === selectedDept;
    const matchesLocation = selectedLoc === 'all' || job.location === selectedLoc;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });
  
  // Toggle job details expansion
  const toggleJobExpansion = (jobId: number) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-10 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/30 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-blue-600/30 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
              Join Our Team
            </h1>
            <p className="text-xl text-gray-300">
              Help us build the future of AI at Neural Nexus. We're a team of passionate technologists working on cutting-edge problems.
            </p>
          </motion.div>
          
          {/* Search and Filters */}
          <motion.div 
            className="max-w-4xl mx-auto bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for roles..." 
                  className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  value={searchVibe}
                  onChange={(e) => setSearchVibe(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none bg-gray-900/70 border border-gray-700 rounded-lg py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-full"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  aria-label="Filter by department"
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none bg-gray-900/70 border border-gray-700 rounded-lg py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-full"
                  value={selectedLoc}
                  onChange={(e) => setSelectedLoc(e.target.value)}
                  aria-label="Filter by location"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Job Listings */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Open Positions ({filteredJobs.length})</h2>
          
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map(job => (
                <motion.div
                  key={job.id}
                  className={`bg-gray-800/30 border ${
                    expandedJob === job.id ? 'border-purple-500/50' : 'border-gray-700/50'
                  } rounded-xl overflow-hidden transition-colors`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div 
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
                    onClick={() => toggleJobExpansion(job.id)}
                  >
                    <div>
                      <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                      <div className="flex flex-wrap items-center text-sm text-gray-400">
                        <div className="flex items-center mr-4 mb-2 md:mb-0">
                          <Building className="h-4 w-4 mr-1" />
                          <span>{departments.find(d => d.id === job.department)?.name}</span>
                        </div>
                        <div className="flex items-center mr-4 mb-2 md:mb-0">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.locationDisplay}</span>
                        </div>
                        <div className="flex items-center mb-2 md:mb-0">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Posted {job.posted}</span>
                        </div>
                      </div>
                    </div>
                    
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${
                      expandedJob === job.id ? 'rotate-180' : ''
                    }`} />
                  </div>
                  
                  {expandedJob === job.id && (
                    <div className="p-5 pt-0 border-t border-gray-700/50">
                      <p className="text-gray-300 mb-4">{job.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-purple-400">Responsibilities:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-300">
                          {job.responsibilities.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 text-purple-400">Requirements:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-300">
                          {job.requirements.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <Link 
                        href={`/careers/apply/${job.id}`}
                        className="inline-flex items-center bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-lg transition-colors"
                      >
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700/50">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-bold mb-2">No positions found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't find any open positions matching your criteria.
              </p>
              <button 
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                onClick={() => {
                  setSearchVibe('');
                  setSelectedDept('all');
                  setSelectedLoc('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Why Join Us */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-10 text-center">Why Join Neural Nexus?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Core Values */}
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Benefits */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-8 border border-purple-700/30">
            <h3 className="text-2xl font-bold mb-6 text-center">Our Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-start">
                <div className="bg-purple-600/20 p-2 rounded-lg mr-3">
                  <GraduationCap className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Learning & Growth</h4>
                  <p className="text-sm text-gray-300">Continuous learning opportunities and education stipends</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-600/20 p-2 rounded-lg mr-3">
                  <Heart className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Health & Wellness</h4>
                  <p className="text-sm text-gray-300">Comprehensive healthcare, mental health support, and wellness programs</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-pink-600/20 p-2 rounded-lg mr-3">
                  <Clock className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Flexible Work</h4>
                  <p className="text-sm text-gray-300">Remote-friendly with flexible hours and unlimited PTO</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-600/20 p-2 rounded-lg mr-3">
                  <Code className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Latest Tech</h4>
                  <p className="text-sm text-gray-300">Access to cutting-edge tools and technologies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Don't See the Perfect Role?</h2>
          <p className="text-xl text-gray-300 mb-8">
            We're always looking for talented people to join our team. Send us your resume and let us know how you could contribute.
          </p>
          <Link 
            href="/careers/general" 
            className="inline-flex items-center bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded-lg transition-colors text-lg font-medium"
          >
            Submit General Application
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
} 