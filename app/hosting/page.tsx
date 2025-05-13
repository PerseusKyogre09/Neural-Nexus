"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Server, Shield, Zap, Database, Link as LinkIcon, MonitorSmartphone, Cpu, HardDrive } from "lucide-react";
import Link from "next/link";

export default function HostingPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-10 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Model Hosting & Deployment
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Securely deploy, scale, and monitor your AI models in production with Neural Nexus
          </motion.p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Feature 1: High Performance */}
            <HostingFeature 
              icon={<Zap className="h-10 w-10 text-yellow-400" />}
              title="High-Performance Infrastructure"
              description="Deploy your models on state-of-the-art GPU and TPU infrastructure optimized for AI workloads."
              color="yellow"
            />
            
            {/* Feature 2: Scalability */}
            <HostingFeature 
              icon={<Server className="h-10 w-10 text-blue-400" />}
              title="Auto-Scaling"
              description="Automatically scale compute resources based on demand to handle varying workloads efficiently."
              color="blue"
            />
            
            {/* Feature 3: Security */}
            <HostingFeature 
              icon={<Shield className="h-10 w-10 text-purple-400" />}
              title="Enterprise-Grade Security"
              description="End-to-end encryption, access controls, and compliance with industry standards."
              color="purple"
            />
            
            {/* Feature 4: Monitoring */}
            <HostingFeature 
              icon={<MonitorSmartphone className="h-10 w-10 text-green-400" />}
              title="Real-Time Monitoring"
              description="Track model performance, latency, and usage with comprehensive dashboards."
              color="green"
            />
            
            {/* Feature 5: Versioning */}
            <HostingFeature 
              icon={<Database className="h-10 w-10 text-pink-400" />}
              title="Model Versioning"
              description="Manage multiple model versions and roll back to previous deployments when needed."
              color="pink"
            />
            
            {/* Feature 6: API */}
            <HostingFeature 
              icon={<LinkIcon className="h-10 w-10 text-teal-400" />}
              title="REST API Access"
              description="Integrate your hosted models into any application with our easy-to-use REST API."
              color="teal"
            />
          </div>
          
          {/* Deployment Options */}
          <div className="bg-gray-800/30 rounded-xl p-8 mb-12 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6">Deployment Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DeploymentOption 
                icon={<Cpu className="h-8 w-8 text-blue-400" />}
                title="Serverless Deployment"
                description="Pay only for what you use with no server management. Ideal for variable workloads."
                features={[
                  "Pay-per-prediction pricing",
                  "Automatic scaling to zero",
                  "Low-latency cold starts",
                  "No infrastructure management"
                ]}
              />
              
              <DeploymentOption 
                icon={<Server className="h-8 w-8 text-purple-400" />}
                title="Dedicated Instances"
                description="Reserved compute resources for consistent performance and predictable pricing."
                features={[
                  "Guaranteed compute resources",
                  "Predictable monthly pricing",
                  "Custom hardware configurations",
                  "Multi-model deployments"
                ]}
              />
              
              <DeploymentOption 
                icon={<HardDrive className="h-8 w-8 text-green-400" />}
                title="On-Premise Solutions"
                description="Deploy Neural Nexus infrastructure in your own data centers for maximum control."
                features={[
                  "Data sovereignty compliance",
                  "Integration with existing systems",
                  "Custom security policies",
                  "Dedicated support team"
                ]}
              />
            </div>
          </div>
          
          {/* Pricing Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Transparent, Predictable Pricing</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose the plan that works for your needs, with no hidden fees
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <PricingTier 
                title="Developer"
                price="$29"
                period="/month"
                description="For individuals and small projects"
                features={[
                  "1 model deployment",
                  "2 GB RAM per instance",
                  "1 concurrent request",
                  "100K predictions/month",
                  "Community support"
                ]}
                ctaLink="/pricing"
                ctaText="View Details"
                popular={false}
              />
              
              <PricingTier 
                title="Professional"
                price="$199"
                period="/month"
                description="For growing teams and businesses"
                features={[
                  "10 model deployments",
                  "8 GB RAM per instance",
                  "20 concurrent requests",
                  "1M predictions/month",
                  "24/7 email support",
                  "Performance monitoring"
                ]}
                ctaLink="/pricing"
                ctaText="View Details"
                popular={true}
              />
              
              <PricingTier 
                title="Enterprise"
                price="Custom"
                period=""
                description="For organizations with advanced needs"
                features={[
                  "Unlimited model deployments",
                  "Custom RAM configurations",
                  "Unlimited concurrent requests",
                  "Custom prediction volume",
                  "Dedicated support manager",
                  "Custom SLAs",
                  "On-premise option"
                ]}
                ctaLink="/contact"
                ctaText="Contact Sales"
                popular={false}
              />
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-900/70 to-blue-900/70 rounded-2xl p-8 text-center border border-purple-700/30">
            <h2 className="text-3xl font-bold mb-4">Ready to deploy your models?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Get started with Neural Nexus model hosting today
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors shadow-lg shadow-purple-600/20">
                Start Free Trial
              </Link>
              <Link href="/docs/hosting" className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors">
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function HostingFeature({ icon, title, description, color }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: string;
}) {
  const bgColorMap: Record<string, string> = {
    yellow: "from-yellow-400/10 to-yellow-600/10 border-yellow-500/20",
    blue: "from-blue-400/10 to-blue-600/10 border-blue-500/20",
    purple: "from-purple-400/10 to-purple-600/10 border-purple-500/20",
    green: "from-green-400/10 to-green-600/10 border-green-500/20",
    pink: "from-pink-400/10 to-pink-600/10 border-pink-500/20",
    teal: "from-teal-400/10 to-teal-600/10 border-teal-500/20",
  };
  
  return (
    <motion.div 
      className={`p-6 rounded-xl bg-gradient-to-br ${bgColorMap[color]} border border-gray-700/50 backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
}

function DeploymentOption({ icon, title, description, features }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-bold ml-3">{title}</h3>
      </div>
      <p className="text-gray-300 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-400 mr-2">✓</span>
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingTier({ title, price, period, description, features, ctaLink, ctaText, popular }: {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaLink: string;
  ctaText: string;
  popular: boolean;
}) {
  return (
    <div className={`bg-gray-800/50 rounded-xl overflow-hidden border ${popular ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-700/50'}`}>
      {popular && (
        <div className="bg-purple-600 text-white text-center py-1 text-sm font-bold">
          MOST POPULAR
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-gray-400 ml-1">{period}</span>
        </div>
        <p className="text-gray-300 text-sm mb-6">{description}</p>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <span className="text-green-400 mr-2">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link href={ctaLink} className={`block text-center py-2 px-4 rounded-lg font-medium transition-colors ${
          popular 
            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}>
          {ctaText}
        </Link>
      </div>
    </div>
  );
} 