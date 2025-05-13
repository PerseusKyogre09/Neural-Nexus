import React, { useEffect } from 'react';

const ImageGenerator = () => {
  useEffect(() => {
    // Function to generate a simple SVG for apple touch icons
    const generateAppleTouchIcon = () => {
      const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
        <rect width="180" height="180" fill="#000" />
        <path d="M50 30 L130 30 L130 150 L50 150 Z" fill="#0099ff" />
        <circle cx="90" cy="90" r="40" fill="#00ffff" opacity="0.6" />
        <path d="M60 60 L120 120 M60 120 L120 60" stroke="white" stroke-width="8" />
      </svg>
      `;
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      return URL.createObjectURL(blob);
    };

    // Function to generate animated logo GIF (in reality, just a placeholder SVG)
    const generateAnimatedLogo = () => {
      const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00ffff" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#0099ff" stop-opacity="0.2" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="#000" />
        <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="url(#hexGradient)" stroke-width="2" />
        <circle cx="50" cy="50" r="20" fill="#00ffff" opacity="0.4" />
        <text x="50" y="55" font-size="12" text-anchor="middle" fill="white">Neural</text>
      </svg>
      `;
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      return URL.createObjectURL(blob);
    };

    // Function to generate featured background
    const generateFeaturedBg = () => {
      const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
        <rect width="1200" height="800" fill="#0F1729" />
        <g opacity="0.1">
          ${Array.from({ length: 50 }).map((_, i) => {
            const x = Math.random() * 1200;
            const y = Math.random() * 800;
            const size = 2 + Math.random() * 4;
            return `<circle cx="${x}" cy="${y}" r="${size}" fill="white" />`;
          }).join('')}
          ${Array.from({ length: 10 }).map((_, i) => {
            const x1 = Math.random() * 1200;
            const y1 = Math.random() * 800;
            const x2 = Math.random() * 1200;
            const y2 = Math.random() * 800;
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="cyan" stroke-width="1" opacity="0.3" />`;
          }).join('')}
        </g>
      </svg>
      `;
      
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      return URL.createObjectURL(blob);
    };

    // Create and download the files
    const downloadImage = (url, filename) => {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    };

    // Generate and download all missing images
    const touchIconUrl = generateAppleTouchIcon();
    const animatedLogoUrl = generateAnimatedLogo();
    const featuredBgUrl = generateFeaturedBg();
    
    downloadImage(touchIconUrl, 'apple-touch-icon.png');
    downloadImage(touchIconUrl, 'apple-touch-icon-precomposed.png');
    downloadImage(animatedLogoUrl, 'animated-logo.gif');
    downloadImage(featuredBgUrl, 'featured-bg.jpg');

    // Clean up object URLs
    return () => {
      URL.revokeObjectURL(touchIconUrl);
      URL.revokeObjectURL(animatedLogoUrl);
      URL.revokeObjectURL(featuredBgUrl);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 bg-black/80 text-white p-3 rounded-lg shadow-lg z-50">
      <p>Generating images...</p>
    </div>
  );
};

export default ImageGenerator; 