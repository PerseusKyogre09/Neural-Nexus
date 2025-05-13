"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Check,
  FileText,
  Shield,
  AlertTriangle,
  ChevronDown,
  Info,
  FileCode,
  Database
} from "lucide-react";
import Link from "next/link";

export default function GuidelinesPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Toggle section
  const toggleSection = (id: string) => {
    if (activeSection === id) {
      setActiveSection(null);
    } else {
      setActiveSection(id);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-10 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
              Model Guidelines
            </h1>
            <p className="text-xl text-gray-300">
              Everything you need to know about preparing, formatting, and uploading your AI models to Neural Nexus.
            </p>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 sticky top-24">
                <h3 className="text-xl font-bold mb-6">Contents</h3>
                <nav className="space-y-2">
                  {guidelineSections.map((section) => (
                    <a 
                      key={section.id}
                      href={`#${section.id}`}
                      className="block px-4 py-2 rounded-lg transition-colors hover:bg-gray-700/50"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSection(section.id);
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
                
                <div className="mt-8 pt-8 border-t border-gray-700/50">
                  <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-700/30">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2 text-purple-400" />
                      Need Help?
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Can't find what you're looking for or need additional assistance?
                    </p>
                    <Link 
                      href="/contact" 
                      className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:w-3/4">
              {guidelineSections.map((section) => (
                <GuidelineSection 
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  icon={section.icon}
                  isActive={activeSection === section.id}
                  toggleSection={() => toggleSection(section.id)}
                >
                  {section.content}
                </GuidelineSection>
              ))}
              
              <div className="mt-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-700/30">
                <h3 className="text-xl font-bold mb-3">Ready to Upload Your Model?</h3>
                <p className="text-gray-300 mb-4">
                  Now that you've reviewed our guidelines, you're ready to share your AI model with the world!
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/upload" 
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                  >
                    Upload Your Model
                  </Link>
                  <Link 
                    href="/tutorials/model-upload" 
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                  >
                    View Upload Tutorial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Guideline Section Component
function GuidelineSection({ 
  id, 
  title, 
  icon, 
  isActive, 
  toggleSection, 
  children 
}: { 
  id: string;
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  toggleSection: () => void;
  children: React.ReactNode;
}) {
  return (
    <div 
      id={id}
      className="mb-6 bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 scroll-mt-20"
    >
      <div 
        className="flex justify-between items-center p-6 cursor-pointer"
        onClick={toggleSection}
      >
        <div className="flex items-center">
          <div className="mr-4">
            {icon}
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <ChevronDown 
          className={`h-6 w-6 transition-transform ${isActive ? 'rotate-180' : ''}`} 
        />
      </div>
      
      {isActive && (
        <div className="px-6 pb-6">{children}</div>
      )}
    </div>
  );
}

// Content for each section
const guidelineSections = [
  {
    id: "eligibility",
    title: "Model Eligibility",
    icon: <Shield className="h-6 w-6 text-green-400" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Neural Nexus welcomes a wide variety of AI models. Here's what we accept:
        </p>
        
        <div className="space-y-3">
          <div className="flex">
            <Check className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Machine Learning Models</h4>
              <p className="text-sm text-gray-400">
                Traditional ML models, neural networks, reinforcement learning models, etc.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <Check className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Large Language Models</h4>
              <p className="text-sm text-gray-400">
                Pre-trained or fine-tuned transformer models for text generation, question answering, and more.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <Check className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Computer Vision Models</h4>
              <p className="text-sm text-gray-400">
                Object detection, image classification, segmentation, generation models, etc.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <Check className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Audio & Speech Models</h4>
              <p className="text-sm text-gray-400">
                Speech recognition, text-to-speech, audio classification, and generation models.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-red-900/20 p-4 rounded-lg border border-red-700/30">
          <h4 className="font-medium flex items-center text-red-400 mb-2">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Prohibited Content
          </h4>
          <p className="text-sm text-gray-300 mb-3">
            We do not allow models that:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
            <li>Generate illegal content, including CSAM</li>
            <li>Are designed for harassment or harm</li>
            <li>Infringe on intellectual property rights</li>
            <li>Contain malicious code or viruses</li>
            <li>Have been trained on datasets with unclear licenses</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "technical-requirements",
    title: "Technical Requirements",
    icon: <FileCode className="h-6 w-6 text-blue-400" />,
    content: (
      <div className="space-y-4">
        <h4 className="font-medium">Supported Formats</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-700/30 p-3 rounded-lg flex items-center">
            <div className="h-8 w-8 bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-400 font-mono text-xs">.pt</span>
            </div>
            <div>
              <div className="font-medium">PyTorch</div>
              <div className="text-xs text-gray-400">*.pt, *.pth formats</div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 p-3 rounded-lg flex items-center">
            <div className="h-8 w-8 bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-400 font-mono text-xs">.h5</span>
            </div>
            <div>
              <div className="font-medium">TensorFlow/Keras</div>
              <div className="text-xs text-gray-400">*.h5, *.keras formats</div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 p-3 rounded-lg flex items-center">
            <div className="h-8 w-8 bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-400 font-mono text-xs">.onnx</span>
            </div>
            <div>
              <div className="font-medium">ONNX</div>
              <div className="text-xs text-gray-400">Open Neural Network Exchange</div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 p-3 rounded-lg flex items-center">
            <div className="h-8 w-8 bg-yellow-900/30 rounded-lg flex items-center justify-center mr-3">
              <span className="text-yellow-400 font-mono text-xs">.bin</span>
            </div>
            <div>
              <div className="font-medium">Hugging Face</div>
              <div className="text-xs text-gray-400">Transformer models</div>
            </div>
          </div>
        </div>
        
        <h4 className="font-medium mt-6">Size Limits</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
            <div>
              <div className="font-medium">Free Plan</div>
              <div className="text-xs text-gray-400">Individual models</div>
            </div>
            <div className="font-mono text-purple-400">5 GB</div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
            <div>
              <div className="font-medium">Pro Plan</div>
              <div className="text-xs text-gray-400">Individual models</div>
            </div>
            <div className="font-mono text-purple-400">25 GB</div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
            <div>
              <div className="font-medium">Enterprise Plan</div>
              <div className="text-xs text-gray-400">Individual models</div>
            </div>
            <div className="font-mono text-purple-400">100 GB+</div>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mt-3">
          For larger models, please <Link href="/contact" className="text-purple-400 hover:underline">contact us</Link> for custom arrangements.
        </p>
      </div>
    )
  },
  {
    id: "documentation",
    title: "Required Documentation",
    icon: <FileText className="h-6 w-6 text-yellow-400" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Good documentation helps users understand and effectively use your model. Include the following:
        </p>
        
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <h4 className="font-medium mb-2">Model Description</h4>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
              <li>Purpose and capabilities of your model</li>
              <li>Input and output specifications</li>
              <li>Model architecture and key components</li>
              <li>Performance metrics and benchmarks</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <h4 className="font-medium mb-2">Training Information</h4>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
              <li>Training dataset description and source</li>
              <li>Training methodology and hyperparameters</li>
              <li>Data preprocessing steps</li>
              <li>Training environment details</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <h4 className="font-medium mb-2">Usage Instructions</h4>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
              <li>Code examples for loading and running the model</li>
              <li>Required dependencies and versions</li>
              <li>Sample inputs and expected outputs</li>
              <li>Recommended hardware requirements</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <h4 className="font-medium mb-2">Limitations & Ethical Considerations</h4>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
              <li>Known limitations and edge cases</li>
              <li>Potential biases and fairness considerations</li>
              <li>Privacy implications</li>
              <li>Recommended and non-recommended use cases</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
          <h4 className="font-medium text-blue-400 mb-2">Pro Tip</h4>
          <p className="text-sm text-gray-300">
            Include a README.md file with your model and use our documentation template to ensure you've covered all the essential information.
          </p>
          <Link href="/templates/model-readme" className="text-blue-400 text-sm hover:underline inline-block mt-2">
            Download Documentation Template
          </Link>
        </div>
      </div>
    )
  },
  {
    id: "licensing",
    title: "Licensing & Permissions",
    icon: <Shield className="h-6 w-6 text-red-400" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Clearly defining the licensing terms for your model is crucial for both you and your users.
        </p>
        
        <h4 className="font-medium mt-4">Supported License Types</h4>
        <div className="space-y-3 mt-2">
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <h5 className="font-medium">Open Source Licenses</h5>
            <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                MIT License
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                Apache 2.0
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                GPL v3
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                BSD License
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                Creative Commons
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                Mozilla Public License
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <h5 className="font-medium">Commercial Licenses</h5>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-400 mt-0.5 mr-2" />
                <div>
                  <span className="font-medium">Commercial-Use License</span>
                  <p className="text-gray-400">Allows users to use your model in commercial applications for a fee.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-400 mt-0.5 mr-2" />
                <div>
                  <span className="font-medium">Subscription License</span>
                  <p className="text-gray-400">Grants access to your model and updates for a recurring fee.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-green-400 mt-0.5 mr-2" />
                <div>
                  <span className="font-medium">Royalty License</span>
                  <p className="text-gray-400">Users pay a percentage of their revenue when using your model in their products.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <h5 className="font-medium">Custom Licenses</h5>
            <p className="text-sm text-gray-400 mt-1">
              You can also define custom license terms for your model. We provide a license editor to help you craft appropriate terms.
            </p>
          </div>
        </div>
        
        <div className="mt-6 bg-red-900/20 p-4 rounded-lg border border-red-700/30">
          <h4 className="font-medium flex items-center text-red-400 mb-2">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Important Requirements
          </h4>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
            <li>You must have the right to share the model under the license you choose</li>
            <li>If your model is derived from another model, ensure you comply with the original license</li>
            <li>Clearly document the training data sources and their licenses</li>
            <li>If using a custom license, ensure it's clear, reasonable, and enforceable</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "demo-requirements",
    title: "Demo Requirements",
    icon: <Database className="h-6 w-6 text-purple-400" />,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Creating a compelling demo helps users understand your model's capabilities and increases adoption.
        </p>
        
        <h4 className="font-medium mt-4">Demo Requirements</h4>
        <div className="space-y-3 mt-2">
          <div className="flex">
            <Check className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h5 className="font-medium">Interactive Demo</h5>
              <p className="text-sm text-gray-400">
                Provide an interactive demo that allows users to test your model with their own inputs.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <Check className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h5 className="font-medium">Sample Inputs</h5>
              <p className="text-sm text-gray-400">
                Include pre-defined examples that highlight different capabilities of your model.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <Check className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h5 className="font-medium">Output Visualization</h5>
              <p className="text-sm text-gray-400">
                Visualize model outputs in a clear and intuitive way (e.g., highlighting for NLP, bounding boxes for computer vision).
              </p>
            </div>
          </div>
          
          <div className="flex">
            <Check className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h5 className="font-medium">Performance Metrics</h5>
              <p className="text-sm text-gray-400">
                Display relevant metrics (e.g., confidence scores, processing time) when applicable.
              </p>
            </div>
          </div>
        </div>
        
        <h4 className="font-medium mt-6">Demo Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <h5 className="font-medium">Built-in Demo Creator</h5>
            <p className="text-sm text-gray-400 mt-1">
              Use our no-code demo creator to build interactive demos without writing any code.
            </p>
            <ul className="mt-2 text-sm space-y-1">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-gray-300">Drag-and-drop interface</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-gray-300">Pre-built visualization components</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-gray-300">Mobile-responsive designs</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <h5 className="font-medium">Custom Demo Integration</h5>
            <p className="text-sm text-gray-400 mt-1">
              Create your own demo with custom code and integrate it into your model page.
            </p>
            <ul className="mt-2 text-sm space-y-1">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-gray-300">Support for React, Vue, and pure JS</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-gray-300">API integration helpers</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                <span className="text-gray-300">Custom styling options</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
          <h4 className="font-medium text-blue-400 mb-2">Pro Tip</h4>
          <p className="text-sm text-gray-300">
            Models with interactive demos receive 5x more downloads than those without. Invest time in creating a compelling demo!
          </p>
        </div>
      </div>
    )
  }
]; 