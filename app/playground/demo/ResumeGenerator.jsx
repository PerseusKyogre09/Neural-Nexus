import React, { useState } from 'react';
import { generateAIResponse, ModelTypes } from './main.js';
import '../global.css';

/**
 * Resume Generator powered by Neural Nexus AI
 * Helps users create professional resumes with AI assistance
 */
const ResumeGenerator = () => {
  // State for form inputs and results
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
    objective: ''
  });
  
  const [resumeOutput, setResumeOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'resume'
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [error, setError] = useState(null);
  
  // Templates for different resume styles
  const templates = {
    professional: 'Clean professional format with clear section headings',
    modern: 'Contemporary layout with stylish design elements',
    minimalist: 'Simple, uncluttered design focusing on content',
    creative: 'Bold, distinctive layout for creative industries',
    academic: 'Structured format suitable for academic/research positions'
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Generate resume using AI
  const generateResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Construct prompt for AI
      const prompt = `Generate a ${selectedTemplate} resume for a job applicant with the following details:
      
      Full Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone}
      
      Education: ${formData.education}
      
      Work Experience: ${formData.experience}
      
      Skills: ${formData.skills}
      
      Professional Objective: ${formData.objective}
      
      Please format this as a professional resume with appropriate sections, using HTML and CSS that would look good when rendered in a browser. Focus on making this resume stand out to potential employers while maintaining accuracy and professionalism.`;
      
      // Call Neural Nexus API
      const response = await generateAIResponse(prompt, ModelTypes.LLAMA3);
      
      if (response.status === 'error') {
        throw new Error(response.error);
      }
      
      // Extract HTML content from response (assuming AI returns HTML)
      const htmlContent = extractHtmlFromResponse(response.result);
      setResumeOutput(htmlContent || response.result);
      
      // Switch to resume view tab
      setActiveTab('resume');
      
    } catch (err) {
      console.error('Error generating resume:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Extract HTML content from AI response
  const extractHtmlFromResponse = (response) => {
    // Find content between HTML tags if present
    const htmlRegex = /<html[\s\S]*?<\/html>/i;
    const htmlMatch = response.match(htmlRegex);
    
    if (htmlMatch) {
      return htmlMatch[0];
    }
    
    // If no full HTML, try to find body content
    const bodyRegex = /<body[\s\S]*?<\/body>/i;
    const bodyMatch = response.match(bodyRegex);
    
    if (bodyMatch) {
      return bodyMatch[0];
    }
    
    // If still no match, look for any HTML-like content
    if (response.includes('<div') || response.includes('<section')) {
      return `<div>${response}</div>`;
    }
    
    return null;
  };
  
  // Download resume as HTML file
  const downloadResume = () => {
    if (!resumeOutput) return;
    
    const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${formData.name} - Resume</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #2c3e50;
        }
        section {
          margin-bottom: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .contact-info {
          text-align: center;
          margin-bottom: 20px;
        }
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      ${resumeOutput}
    </body>
    </html>
    `;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.name.replace(/\s+/g, '_')}_Resume.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="vscode-dark resume-generator">
      <div className="generator-tabs">
        <button 
          className={`vscode-button tab-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Input Details
        </button>
        <button 
          className={`vscode-button tab-button ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
          disabled={!resumeOutput}
        >
          Resume Preview
        </button>
      </div>
      
      {activeTab === 'form' ? (
        <div className="form-container">
          <h2>Resume Generator</h2>
          <p className="intro-text">Fill in your details below and let Neural Nexus AI create a professional resume for you</p>
          
          <form onSubmit={generateResume}>
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="vscode-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="vscode-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="vscode-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3>Education</h3>
              <div className="form-group">
                <textarea
                  id="education"
                  name="education"
                  className="vscode-input"
                  value={formData.education}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="List your education history, e.g.:
BS in Computer Science, XYZ University (2015-2019)
High School Diploma, ABC High School (2011-2015)"
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Work Experience</h3>
              <div className="form-group">
                <textarea
                  id="experience"
                  name="experience"
                  className="vscode-input"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="List your work experience, e.g.:
Software Engineer, Tech Company (2019-present)
- Developed features for web application using React.js
- Collaborated with cross-functional teams to deliver projects

Intern, Another Company (Summer 2018)
- Assisted in development of mobile application
- Fixed bugs and implemented minor features"
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Skills</h3>
              <div className="form-group">
                <textarea
                  id="skills"
                  name="skills"
                  className="vscode-input"
                  value={formData.skills}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="List your skills, e.g.:
Programming Languages: JavaScript, Python, Java
Tools & Technologies: React, Node.js, Git, Docker
Soft Skills: Communication, Teamwork, Problem-solving"
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Professional Objective</h3>
              <div className="form-group">
                <textarea
                  id="objective"
                  name="objective"
                  className="vscode-input"
                  value={formData.objective}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="A brief summary of your career goals and what you're looking for, e.g.:
Dedicated software engineer with 3 years of experience seeking a challenging role that allows me to leverage my skills in full-stack development and problem-solving to create innovative solutions."
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Resume Template</h3>
              <div className="template-selector">
                {Object.entries(templates).map(([key, description]) => (
                  <div key={key} className="template-option">
                    <input
                      type="radio"
                      id={`template-${key}`}
                      name="template"
                      checked={selectedTemplate === key}
                      onChange={() => setSelectedTemplate(key)}
                    />
                    <label htmlFor={`template-${key}`}>
                      <strong className="template-name">{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                      <span className="template-desc">{description}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="vscode-button submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Generating Resume...' : 'Generate Resume'}
              </button>
            </div>
            
            {error && (
              <div className="vscode-status vscode-status-error">
                {error}
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="resume-preview">
          <div className="preview-actions">
            <button 
              onClick={downloadResume} 
              className="vscode-button download-button"
              disabled={!resumeOutput}
            >
              Download Resume
            </button>
            <button 
              onClick={() => setActiveTab('form')} 
              className="vscode-button edit-button"
            >
              Edit Details
            </button>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Neural Nexus is crafting your resume...</p>
            </div>
          ) : (
            <div 
              className="resume-content"
              dangerouslySetInnerHTML={{ __html: resumeOutput }}
            />
          )}
        </div>
      )}
      
      <div className="powered-by">
        Powered by Neural Nexus AI
      </div>
    </div>
  );
};

export default ResumeGenerator;

/* Styles for the component */
document.createElement('style').textContent = `
  .resume-generator {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    font-family: var(--vscode-font-family);
  }
  
  .generator-tabs {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--vscode-border);
  }
  
  .tab-button {
    background-color: transparent;
    border-radius: 0;
    border-bottom: 2px solid transparent;
    margin-right: 10px;
    padding: 8px 16px;
  }
  
  .tab-button.active {
    border-bottom-color: var(--vscode-accent);
    background-color: var(--vscode-bg-light);
  }
  
  .form-container {
    padding: 20px 0;
  }
  
  .intro-text {
    margin-bottom: 24px;
    color: var(--vscode-text-light);
  }
  
  .form-section {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--vscode-border);
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  .form-row {
    display: flex;
    gap: 16px;
  }
  
  .form-row .form-group {
    flex: 1;
  }
  
  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
  }
  
  textarea {
    min-height: 80px;
    width: 100%;
  }
  
  .form-actions {
    margin-top: 24px;
  }
  
  .submit-button {
    padding: 8px 20px;
    font-size: 15px;
  }
  
  .template-selector {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 12px;
  }
  
  .template-option {
    display: flex;
    align-items: flex-start;
    padding: 10px;
    border: 1px solid var(--vscode-border);
    border-radius: 4px;
  }
  
  .template-option input {
    margin-top: 4px;
    margin-right: 10px;
  }
  
  .template-name {
    display: block;
    margin-bottom: 2px;
  }
  
  .template-desc {
    display: block;
    font-size: 12px;
    color: var(--vscode-text-light);
  }
  
  .resume-preview {
    padding: 20px 0;
  }
  
  .preview-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .resume-content {
    background-color: white;
    color: #333;
    padding: 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-height: 500px;
    overflow-y: auto;
    max-height: 800px;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
  }
  
  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: var(--vscode-accent);
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .powered-by {
    text-align: center;
    margin-top: 30px;
    font-size: 12px;
    color: var(--vscode-text-muted);
    font-style: italic;
  }
  
  /* Make inputs full width */
  .vscode-input {
    width: 100%;
  }
`; 