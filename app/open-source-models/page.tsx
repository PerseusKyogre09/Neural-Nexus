"use client";

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, Database, Code, BookOpen } from "lucide-react";

export default function OpenSourceModelsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
              Open Source AI Models & Resources
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dive into a world of free AI models, datasets, and scripts to supercharge your projects. We stan open-source vibes!
            </p>
          </motion.div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <BrainCircuit className="mr-3 text-purple-400" size={28} />
              Free AI Models from Hugging Face Transformers
            </h2>
            <p className="text-gray-300 mb-6">
              We're huge fans of the <Link href="https://huggingface.co/transformers" className="text-blue-400 hover:text-blue-300">Hugging Face Transformers</Link> library, which offers thousands of pre-trained models for NLP, vision, and audio tasks. Here's a curated list of some lit models you can use for free:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">BERT (Bidirectional Encoder Representations from Transformers)</h3>
                <p className="text-gray-300">Perfect for text classification, question answering, and more. Pre-trained on massive datasets for ultimate accuracy.</p>
                <Link href="https://huggingface.co/bert-base-uncased" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">GPT-2 (Generative Pre-trained Transformer 2)</h3>
                <p className="text-gray-300">Generate human-like text with this OG model. Great for chatbots and creative writing tools.</p>
                <Link href="https://huggingface.co/gpt2" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">T5 (Text-To-Text Transfer Transformer)</h3>
                <p className="text-gray-300">A versatile model for summarization, translation, and text generation. One model, many tasks!</p>
                <Link href="https://huggingface.co/t5-base" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">DistilBERT</h3>
                <p className="text-gray-300">A lighter, faster version of BERT with 97% of its performance but half the size. Speedy vibes!</p>
                <Link href="https://huggingface.co/distilbert-base-uncased" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">RoBERTa (Robustly Optimized BERT)</h3>
                <p className="text-gray-300">An upgraded BERT with better training techniques for top-tier results on NLP tasks.</p>
                <Link href="https://huggingface.co/roberta-base" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">CLIP (Contrastive Language-Image Pretraining)</h3>
                <p className="text-gray-300">Connects text and images for tasks like image classification and captioning. Vision + language = 🔥</p>
                <Link href="https://huggingface.co/openai/clip-vit-base-patch32" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Check it out <span className="ml-1">→</span>
                </Link>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link href="https://huggingface.co/models" className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all inline-block">
                Explore More Models on Hugging Face
              </Link>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <Database className="mr-3 text-blue-400" size={28} />
              Free Datasets for Training
            </h2>
            <p className="text-gray-300 mb-6">
              Data is the fuel for AI. Check out these free datasets to train your models, many of which are hosted or linked through Hugging Face and other open-source platforms:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Wikipedia Dataset</h3>
                <p className="text-gray-300">A massive collection of Wikipedia articles for NLP tasks. Great for pre-training language models.</p>
                <Link href="https://huggingface.co/datasets/wikipedia" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">COCO (Common Objects in Context)</h3>
                <p className="text-gray-300">A dataset for image captioning and object detection with over 330K images.</p>
                <Link href="https://cocodataset.org/" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">IMDB Reviews</h3>
                <p className="text-gray-300">Sentiment analysis dataset with 50K movie reviews labeled as positive or negative.</p>
                <Link href="https://huggingface.co/datasets/imdb" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">LibriSpeech</h3>
                <p className="text-gray-300">A dataset of 1,000 hours of English speech for speech recognition models.</p>
                <Link href="https://huggingface.co/datasets/librispeech_asr" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">SQuAD (Stanford Question Answering Dataset)</h3>
                <p className="text-gray-300">Over 100K question-answer pairs for reading comprehension models.</p>
                <Link href="https://huggingface.co/datasets/squad" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Open Images Dataset</h3>
                <p className="text-gray-300">9 million images with labels for object detection and segmentation.</p>
                <Link href="https://storage.googleapis.com/openimages/web/index.html" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Get the Data <span className="ml-1">→</span>
                </Link>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link href="https://huggingface.co/datasets" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition-all inline-block">
                Explore More Datasets
              </Link>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <Code className="mr-3 text-green-400" size={28} />
              Free Scripts & Tools for AI Development
            </h2>
            <p className="text-gray-300 mb-6">
              Get your hands on some dope scripts and tools to build, train, and deploy AI models. These are open-source and ready to slap in your projects:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Transformers Library by Hugging Face</h3>
                <p className="text-gray-300">The ultimate toolkit for working with pre-trained models. Fine-tune, train, and deploy with ease.</p>
                <Link href="https://github.com/huggingface/transformers" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">PyTorch Training Scripts</h3>
                <p className="text-gray-300">Official PyTorch scripts for training models on various tasks. Clean and customizable.</p>
                <Link href="https://github.com/pytorch/examples" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">TensorFlow Model Garden</h3>
                <p className="text-gray-300">A collection of scripts and models for TensorFlow users. From vision to NLP, it's all here.</p>
                <Link href="https://github.com/tensorflow/models" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">FastAI Library</h3>
                <p className="text-gray-300">High-level library for quick prototyping of deep learning models. Perfect for beginners and pros alike.</p>
                <Link href="https://github.com/fastai/fastai" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">ONNX (Open Neural Network Exchange)</h3>
                <p className="text-gray-300">Convert models between frameworks with this open format. Interoperability for the win!</p>
                <Link href="https://github.com/onnx/onnx" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Gradio by Hugging Face</h3>
                <p className="text-gray-300">Create interactive demos for your models with just a few lines of code. Show off your work!</p>
                <Link href="https://github.com/gradio-app/gradio" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Grab the Code <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <BookOpen className="mr-3 text-pink-400" size={28} />
              Learning Resources & Tutorials
            </h2>
            <p className="text-gray-300 mb-6">
              Wanna level up your AI game? These free resources and tutorials will get you from noob to pro in no time:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">Hugging Face Tutorials</h3>
                <p className="text-gray-300">Official guides on using Transformers for NLP, vision, and more. Step-by-step realness.</p>
                <Link href="https://huggingface.co/docs/transformers/tutorials" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Start Learning <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">DeepLearning.AI Courses</h3>
                <p className="text-gray-300">Free and paid courses on AI, deep learning, and NLP by Andrew Ng and team.</p>
                <Link href="https://www.deeplearning.ai/" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Start Learning <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">PyTorch Tutorials</h3>
                <p className="text-gray-300">Learn PyTorch from the ground up with these official tutorials for all skill levels.</p>
                <Link href="https://pytorch.org/tutorials/" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Start Learning <span className="ml-1">→</span>
                </Link>
              </div>

              <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                <h3 className="text-xl font-semibold mb-2">TensorFlow Tutorials</h3>
                <p className="text-gray-300">Master TensorFlow with guides on building and deploying models for any use case.</p>
                <Link href="https://www.tensorflow.org/tutorials" className="text-blue-400 hover:text-blue-300 flex items-center mt-3">
                  Start Learning <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/upload" className="px-6 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 rounded-lg transition-all inline-block mx-2">
              Upload Your Open Source Model
            </Link>
            <Link href="/community" className="px-6 py-2.5 bg-transparent border border-gray-600 hover:border-gray-500 text-gray-200 hover:text-white rounded-lg transition-all inline-block mx-2">
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 