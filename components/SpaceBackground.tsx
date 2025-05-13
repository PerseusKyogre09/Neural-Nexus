"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Star field animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars
    class Star {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 2;
        
        // Occasionally create colored stars for nebula effect
        const colors = ['255, 255, 255', '150, 150, 255', '255, 150, 150', '150, 255, 200'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      move() {
        this.z -= 0.5;
        
        if (this.z <= 0) {
          this.z = 1000;
          this.x = Math.random() * canvas!.width;
          this.y = Math.random() * canvas!.height;
        }
      }
      
      draw() {
        const x = this.x;
        const y = this.y;
        const size = this.size * (1000 - this.z) / 1000;
        const opacity = (1000 - this.z) / 1000;
        
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${this.color}, ${opacity})`;
        ctx!.arc(x, y, size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }
    
    // Create planets
    class Planet {
      x: number;
      y: number;
      size: number;
      color: string;
      xSpeed: number;
      ySpeed: number;
      
      constructor() {
        this.size = Math.random() * 10 + 5;
        this.x = Math.random() * (canvas!.width - this.size * 2) + this.size;
        this.y = Math.random() * (canvas!.height - this.size * 2) + this.size;
        
        // Create gradients for planets
        const colors = [
          '80, 100, 200', // Blue
          '200, 100, 80', // Red
          '100, 200, 100', // Green
          '180, 180, 100'  // Yellow
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Very slow movement
        this.xSpeed = (Math.random() - 0.5) * 0.1;
        this.ySpeed = (Math.random() - 0.5) * 0.1;
      }
      
      move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        
        // Bounce off edges
        if (this.x <= this.size || this.x >= canvas!.width - this.size) {
          this.xSpeed *= -1;
        }
        
        if (this.y <= this.size || this.y >= canvas!.height - this.size) {
          this.ySpeed *= -1;
        }
      }
      
      draw() {
        const gradient = ctx!.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        gradient.addColorStop(0, `rgba(${this.color}, 0.8)`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        
        ctx!.beginPath();
        ctx!.fillStyle = gradient;
        ctx!.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx!.fill();
      }
    }
    
    // Create nebula clouds
    class NebulaeCloud {
      x: number;
      y: number;
      size: number;
      color: string;
      
      constructor() {
        this.size = Math.random() * 100 + 50;
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        
        const colors = [
          '255, 100, 150, 0.03', // Pink
          '100, 150, 255, 0.03', // Blue
          '150, 100, 255, 0.03', // Purple
          '100, 255, 150, 0.03'  // Green
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      draw() {
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${this.color})`;
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }
    
    // Create objects
    const stars: Star[] = Array.from({ length: 400 }, () => new Star());
    const planets: Planet[] = Array.from({ length: 5 }, () => new Planet());
    const nebulaClouds: NebulaeCloud[] = Array.from({ length: 15 }, () => new NebulaeCloud());
    
    // Animation loop
    const animate = () => {
      // Clear canvas with slight fade effect for trails
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      
      // Draw nebula clouds first (background)
      nebulaClouds.forEach(cloud => {
        cloud.draw();
      });
      
      // Draw and move stars
      stars.forEach(star => {
        star.move();
        star.draw();
      });
      
      // Draw and move planets
      planets.forEach(planet => {
        planet.move();
        planet.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
      
      {/* Floating orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-10 blur-xl bg-gradient-to-r from-purple-500 to-blue-500"
          style={{
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
            scale: [1, Math.random() * 0.2 + 0.9, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 10 + 20,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/50" />
    </div>
  );
} 