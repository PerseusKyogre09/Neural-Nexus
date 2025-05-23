"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Upload, Check, AlertCircle, X, ArrowRight, BrainCircuit, Server, Cpu } from "lucide-react";
import Link from "next/link";

// Create a client component for the parts that need useSearchParams
function UploadForm() {
  const searchParams = useSearchParams();
  const uploadType = searchParams.get('type');
  const editModelId = searchParams.get('edit');

  // Using Gen-Z style variable names
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [vibeCheck, setVibeCheck] = useState<string[]>([]);
  const [modelName, setModelName] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [modelType, setModelType] = useState(
    uploadType === 'zip' ? 'text-generation' :
    uploadType === 'markdown' ? 'documentation' :
    uploadType === 'lfs' ? 'large-model' : 
    uploadType === 'github' ? 'open-source' :
    uploadType === 'huggingface' ? 'huggingface' :
    uploadType === 'api' ? 'api-based' :
    'text-generation'  // default if no type specified
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const modelTypeOptions = [
    { value: 'text-generation', label: 'Text Generation (LLM)' },
    { value: 'image-generation', label: 'Image Generation' },
    { value: 'audio-generation', label: 'Audio Generation' },
    { value: 'video-generation', label: 'Video Generation' },
    { value: 'embedding', label: 'Embeddings' },
    { value: 'classification', label: 'Classification' }
  ];

  // Set page title based on upload type
  useEffect(() => {
    if (editModelId) {
      // Fetch model data for editing
      // This would be implemented with a real API call
      console.log(`Editing model with ID: ${editModelId}`);
      // For demo, we'll just set a placeholder title
      document.title = "Edit AI Model | Neural Nexus";
    } else {
      document.title = uploadType 
        ? `Upload ${uploadType.toUpperCase()} Model | Neural Nexus`
        : "Upload Model | Neural Nexus";
    }
  }, [uploadType, editModelId]);

  // Super dope event handler for file uploads
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };

  // Handle file selection from dialog
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };

  // Yeet a file from the upload list
  const yeetFile = (fileToRemove: File) => {
    setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
  };

  // Start the upload process - using real API endpoint
  const sendItUp = async () => {
    // Basic validation
    if (!modelName) {
      setVibeCheck([...vibeCheck, "Yo, your model needs a name!"]);
      return;
    }
    
    if (selectedFiles.length === 0) {
      setVibeCheck([...vibeCheck, "Can't upload nothing, bestie! Select files first."]);
      return;
    }
    
    // Clear any previous errors
    setVibeCheck([]);
    
    // Start upload process
    setUploadStatus('uploading');
    
    try {
      // This is a placeholder for actual file upload to Supabase Storage
      // In a real app, you would upload files to storage and get URLs
      const fileUrls = [];
      let progress = 0;
      
      // Simulate file upload progress for now
      for (const file of selectedFiles) {
        progress += (100 / selectedFiles.length);
        setUploadProgress(progress);
        // TODO: Implement actual file upload to Supabase Storage
        fileUrls.push('placeholder-url/' + file.name);
      }
      
      // Get user ID from auth - this is a placeholder
      // In a real app, you would get this from your auth context
      const userId = 'placeholder-user-id';
      
      // Send model data to API endpoint
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          name: modelName,
          description: modelDescription,
          category: modelType,
          file_url: fileUrls[0], // Using first file as main URL for simplicity
          file_path: fileUrls[0],
          file_size: selectedFiles[0]?.size || 0,
          file_type: selectedFiles[0]?.type || 'unknown',
          thumbnail_url: '', // TODO: Generate thumbnail
          is_public: true
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setUploadStatus('success');
        setUploadProgress(100);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setVibeCheck([...vibeCheck, error.message || "Server said 'nah' to your upload. Try again?"]);
    }
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/your-models" className="inline-flex items-center text-gray-400 hover:text-purple-400 transition-colors">
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Your Models
        </Link>
      </div>
      
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
          {editModelId ? "Edit Your Model" : 
           uploadType === 'zip' ? "Upload ML Model Package" :
           uploadType === 'markdown' ? "Upload Documentation-Based Model" :
           uploadType === 'lfs' ? "Upload Large Model (LFS)" :
           uploadType === 'github' ? "Connect GitHub Model Repository" :
           uploadType === 'huggingface' ? "Import from Hugging Face" :
           uploadType === 'api' ? "Configure API-Based Model" :
           "Upload Your Model"}
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          {uploadType === 'github' ? "Link your open source model repository for seamless integration" :
           uploadType === 'huggingface' ? "Import models directly from Hugging Face's model hub" :
           uploadType === 'api' ? "Connect your model through a custom API endpoint" :
           "Share your AI creations with the world on Neural Nexus"}
        </p>
      </motion.div>
      
      {/* Content area */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
        {uploadStatus === 'success' ? (
          <SuccessScreen modelName={modelName} />
        ) : (
          <div className="space-y-8">
            {/* Step 1: Model details */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full mr-3 text-sm">1</span>
                Model Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Model Name *</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Give your model a vibe name"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Model Type *</label>
                  <select 
                    className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                    aria-label="Model Type"
                  >
                    {modelTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea 
                    className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                    placeholder="Spill the tea on what your model can do..."
                    value={modelDescription}
                    onChange={(e) => setModelDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Step 2: Upload files */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full mr-3 text-sm">2</span>
                Upload Files
              </h2>
              
              <div 
                className={`border-2 border-dashed ${
                  selectedFiles.length > 0 ? 'border-purple-500/50' : 'border-gray-700'
                } rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                {selectedFiles.length === 0 ? (
                  <div>
                    <div className="mb-4 flex justify-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Drag and drop your files here</h3>
                    <p className="text-gray-400 mb-4">or click to browse files</p>
                    <button 
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse Files
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      multiple 
                      onChange={handleFileSelect}
                      aria-label="File upload"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-medium">Selected Files</h3>
                      <button 
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center text-sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Add More Files
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple 
                        onChange={handleFileSelect}
                        aria-label="Add more files"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-600/20 rounded-md flex items-center justify-center mr-3">
                              <BrainCircuit className="h-4 w-4 text-purple-400" />
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-sm font-medium truncate">{file.name}</div>
                              <div className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                            </div>
                          </div>
                          <button 
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                            onClick={() => yeetFile(file)}
                            aria-label="Remove file"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Error messages */}
            {vibeCheck.length > 0 && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <h3 className="flex items-center text-red-400 font-medium mb-2">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Oops! Got some issues
                </h3>
                <ul className="list-disc list-inside text-red-200">
                  {vibeCheck.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Upload button */}
            <div className="flex justify-end">
              <button
                onClick={sendItUp}
                disabled={uploadStatus === 'uploading'}
                className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                  uploadStatus === 'uploading'
                    ? 'bg-purple-700/50 text-purple-300 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                } transition-colors`}
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading ({Math.round(uploadProgress)}%)
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Model
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Loading fallback component
function LoadingUpload() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function UploadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <Suspense fallback={<LoadingUpload />}>
            <UploadForm />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function SuccessScreen({ modelName }: { modelName: string }) {
  return (
    <div className="text-center p-6">
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-500/20 text-green-400 rounded-full">
        <Check size={40} />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Model Uploaded Successfully!</h2>
      <p className="text-lg text-gray-300 mb-8">
        Your model "{modelName}" has been uploaded and is being processed.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SuccessStep 
          icon={<BrainCircuit className="h-8 w-8 text-purple-400" />}
          title="Processing"
          description="Your model is being validated and processed"
          status="in-progress"
        />
        
        <SuccessStep 
          icon={<Cpu className="h-8 w-8 text-blue-400" />}
          title="Optimization"
          description="Optimizing your model for inference performance"
          status="pending"
        />
        
        <SuccessStep 
          icon={<Server className="h-8 w-8 text-pink-400" />}
          title="Deployment"
          description="Making your model available for API access"
          status="pending"
        />
      </div>
      
      <div className="flex justify-center gap-4">
        <Link 
          href="/dashboard" 
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link 
          href="/upload" 
          className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          Upload Another Model
        </Link>
      </div>
    </div>
  );
}

function SuccessStep({ icon, title, description, status }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}) {
  const getStatusStyles = () => {
    switch(status) {
      case 'pending':
        return 'border-gray-700/50 bg-gray-800/50';
      case 'in-progress':
        return 'border-purple-600/30 bg-purple-900/20 animate-pulse';
      case 'completed':
        return 'border-green-600/30 bg-green-900/20';
    }
  };
  
  return (
    <div className={`p-4 rounded-xl border ${getStatusStyles()}`}>
      <div className="mb-3">
        {icon}
      </div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
      
      <div className="mt-3 text-xs font-medium">
        {status === 'pending' && <span className="text-gray-400">Pending</span>}
        {status === 'in-progress' && <span className="text-purple-400">In Progress</span>}
        {status === 'completed' && <span className="text-green-400">Completed</span>}
      </div>
    </div>
  );
} 