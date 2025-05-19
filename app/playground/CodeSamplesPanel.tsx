"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Code, Copy, CheckCircle, ChevronDown, ChevronRight, Tag, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CodeSamplesPanelProps {
  theme: string;
  onClose: () => void;
}

interface CodeSample {
  id: string;
  language: string;
  name: string;
  description: string;
  code: string;
  tags: string[];
  expanded?: boolean;
}

export default function CodeSamplesPanel({ theme, onClose }: CodeSamplesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [samples, setSamples] = useState<CodeSample[]>(CODE_SAMPLES);
  const [filteredSamples, setFilteredSamples] = useState<CodeSample[]>(CODE_SAMPLES);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLanguages, setShowLanguages] = useState(true);
  
  // List of supported languages
  const languages = Array.from(new Set(CODE_SAMPLES.map(sample => sample.language))).sort();
  
  // Filter samples when search query or selected language changes
  useEffect(() => {
    let filtered = [...samples];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        sample => 
          sample.name.toLowerCase().includes(query) || 
          sample.description.toLowerCase().includes(query) ||
          sample.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedLanguage) {
      filtered = filtered.filter(sample => sample.language === selectedLanguage);
    }
    
    setFilteredSamples(filtered);
  }, [samples, searchQuery, selectedLanguage]);
  
  // Toggle sample expansion
  const toggleSample = (id: string) => {
    setSamples(prev => 
      prev.map(sample => 
        sample.id === id ? { ...sample, expanded: !sample.expanded } : sample
      )
    );
  };
  
  // Copy code to clipboard
  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b",
        theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
      )}>
        <div className="flex items-center">
          <Code className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="text-lg font-bold">Code Samples</h2>
        </div>
        
        <button
          onClick={onClose}
          className={cn(
            "p-1 rounded-full",
            theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
          )}
          aria-label="Close Code Samples"
          title="Close Code Samples"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="p-4 border-b space-y-3">
        <div className={cn(
          "flex items-center px-3 py-2 rounded-md",
          theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
        )}>
          <Search className="h-4 w-4 mr-2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code samples..."
            className={cn(
              "bg-transparent flex-1 focus:outline-none text-sm",
              theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'
            )}
            aria-label="Search code samples"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="flex items-center text-sm"
          >
            {showLanguages ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            <span>Languages</span>
          </button>
          
          {selectedLanguage && (
            <button
              onClick={() => setSelectedLanguage(null)}
              className={cn(
                "flex items-center text-xs px-2 py-1 rounded",
                theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c]' : 'bg-[#e0e0e0] hover:bg-[#d0d0d0]'
              )}
            >
              <Filter className="h-3 w-3 mr-1" />
              Clear filter
            </button>
          )}
        </div>
        
        {showLanguages && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {languages.map(language => (
              <button
                key={language}
                onClick={() => setSelectedLanguage(selectedLanguage === language ? null : language)}
                className={cn(
                  "px-2 py-1 rounded text-xs",
                  selectedLanguage === language
                    ? theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
                    : theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c]' : 'bg-[#e0e0e0] hover:bg-[#d0d0d0]'
                )}
              >
                {language}
              </button>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Samples list */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredSamples.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No code samples found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSamples.map(sample => (
              <div
                key={sample.id}
                className={cn(
                  "rounded-lg border overflow-hidden",
                  theme === 'dark' ? 'border-[#3d3d3d] bg-[#2d2d2d]' : 'border-[#e0e0e0] bg-white'
                )}
              >
                <div 
                  className={cn(
                    "p-3 cursor-pointer",
                    theme === 'dark' ? 'hover:bg-[#333333]' : 'hover:bg-[#f9f9f9]'
                  )}
                  onClick={() => toggleSample(sample.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium text-sm">{sample.name}</h3>
                        <span className={cn(
                          "ml-2 px-1.5 py-0.5 text-xs rounded",
                          theme === 'dark' ? 'bg-[#3c3c3c] text-gray-300' : 'bg-[#f0f0f0] text-gray-600'
                        )}>
                          {sample.language}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{sample.description}</p>
                    </div>
                    <button
                      className="ml-2 p-1"
                      aria-label={sample.expanded ? "Collapse" : "Expand"}
                    >
                      {sample.expanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {sample.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sample.tags.map((tag, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center px-1.5 py-0.5 rounded-full text-xs",
                            theme === 'dark' ? 'bg-[#3c3c3c] text-gray-300' : 'bg-[#f0f0f0] text-gray-600'
                          )}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {sample.expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "border-t",
                      theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
                    )}
                  >
                    <div className="relative">
                      <pre className={cn(
                        "p-3 overflow-x-auto text-xs font-mono",
                        theme === 'dark' ? 'bg-[#1e1e1e] text-gray-300' : 'bg-[#f5f5f5] text-gray-800'
                      )}>
                        <code>{sample.code}</code>
                      </pre>
                      <button
                        onClick={() => copyCode(sample.code, sample.id)}
                        className={cn(
                          "absolute top-2 right-2 p-1 rounded",
                          theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c]' : 'bg-[#e0e0e0] hover:bg-[#d0d0d0]'
                        )}
                        aria-label="Copy code"
                        title="Copy code"
                      >
                        {copiedId === sample.id ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Code samples data
const CODE_SAMPLES: CodeSample[] = [
  {
    id: "1",
    language: "JavaScript",
    name: "Hello World",
    description: "A simple hello world example in JavaScript",
    code: "console.log('Hello, Neural Nexus!');",
    tags: ["beginner", "basics"]
  },
  {
    id: "2",
    language: "JavaScript",
    name: "Fetch API",
    description: "Example of using the Fetch API to make HTTP requests",
    code: `// Fetch data from an API
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });`,
    tags: ["api", "async", "web"]
  },
  {
    id: "3",
    language: "TypeScript",
    name: "Interface Definition",
    description: "Define a TypeScript interface for a user object",
    code: `interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  roles?: string[];
}

// Example usage
const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true,
  createdAt: new Date(),
  roles: ['admin', 'user']
};`,
    tags: ["types", "interfaces"]
  },
  {
    id: "4",
    language: "TypeScript",
    name: "React Component",
    description: "A simple React functional component with TypeScript",
    code: `import React, { useState } from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  variant = 'primary' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getButtonClass = () => {
    switch(variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };
  
  return (
    <button
      className={\`px-4 py-2 rounded text-white \${getButtonClass()}\`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
      {isHovered && <span className="ml-2">→</span>}
    </button>
  );
};

export default Button;`,
    tags: ["react", "component", "ui"]
  },
  {
    id: "5",
    language: "Python",
    name: "List Comprehension",
    description: "Example of Python list comprehension",
    code: `# Create a list of squares
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# List comprehension with conditional
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)  # [0, 4, 16, 36, 64]

# Nested list comprehension
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print(flattened)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]`,
    tags: ["lists", "comprehension"]
  },
  {
    id: "6",
    language: "Python",
    name: "Neural Network with PyTorch",
    description: "Simple neural network implementation using PyTorch",
    code: `import torch
import torch.nn as nn
import torch.optim as optim

# Define a simple neural network
class SimpleNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SimpleNN, self).__init__()
        self.layer1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.layer2 = nn.Linear(hidden_size, output_size)
    
    def forward(self, x):
        x = self.layer1(x)
        x = self.relu(x)
        x = self.layer2(x)
        return x

# Initialize the model
input_size = 10
hidden_size = 20
output_size = 2
model = SimpleNN(input_size, hidden_size, output_size)

# Define loss function and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Example input tensor
x = torch.randn(5, input_size)
target = torch.empty(5, dtype=torch.long).random_(output_size)

# Forward pass
output = model(x)
loss = criterion(output, target)

# Backward pass and optimize
optimizer.zero_grad()
loss.backward()
optimizer.step()

print(f"Loss: {loss.item()}")`,
    tags: ["machine learning", "neural network", "pytorch"]
  },
  {
    id: "7",
    language: "Java",
    name: "Stream API",
    description: "Using Java Stream API for data processing",
    code: `import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("John", "Jane", "Jack", "James", "Jill");
        
        // Filter names starting with "Ja"
        List<String> filteredNames = names.stream()
            .filter(name -> name.startsWith("Ja"))
            .collect(Collectors.toList());
        System.out.println("Filtered names: " + filteredNames);
        
        // Transform to uppercase
        List<String> upperCaseNames = names.stream()
            .map(String::toUpperCase)
            .collect(Collectors.toList());
        System.out.println("Uppercase names: " + upperCaseNames);
        
        // Sort names
        List<String> sortedNames = names.stream()
            .sorted()
            .collect(Collectors.toList());
        System.out.println("Sorted names: " + sortedNames);
        
        // Check if any name contains "i"
        boolean hasNameWithI = names.stream()
            .anyMatch(name -> name.contains("i"));
        System.out.println("Has name with 'i': " + hasNameWithI);
    }
}`,
    tags: ["streams", "functional", "data processing"]
  },
  {
    id: "8",
    language: "Rust",
    name: "Ownership Example",
    description: "Demonstrating Rust's ownership system",
    code: `fn main() {
    // Ownership basics
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved to s2, s1 is no longer valid
    
    // This would cause an error:
    // println!("s1: {}", s1);
    
    println!("s2: {}", s2);
    
    // Borrowing
    let s3 = String::from("world");
    let len = calculate_length(&s3); // Passing a reference
    
    println!("The length of '{}' is {}.", s3, len);
    
    // Mutable borrowing
    let mut s4 = String::from("hello");
    change(&mut s4);
    
    println!("Modified string: {}", s4);
}

fn calculate_length(s: &String) -> usize {
    s.len() // s is a reference, so it doesn't take ownership
}

fn change(s: &mut String) {
    s.push_str(", world");
}`,
    tags: ["ownership", "borrowing", "memory safety"]
  },
  {
    id: "9",
    language: "Go",
    name: "Goroutines and Channels",
    description: "Concurrent programming with Go",
    code: `package main

import (
	"fmt"
	"time"
)

func main() {
	// Create a channel
	messages := make(chan string)

	// Start a goroutine that sends messages
	go func() {
		for i := 1; i <= 5; i++ {
			messages <- fmt.Sprintf("Message %d", i)
			time.Sleep(time.Millisecond * 500)
		}
		close(messages) // Close the channel when done
	}()

	// Receive messages from the channel
	for msg := range messages {
		fmt.Println("Received:", msg)
	}

	// Using multiple goroutines
	fmt.Println("\\nUsing multiple goroutines:")
	
	// Create channels
	c1 := make(chan string)
	c2 := make(chan string)

	// Start goroutines
	go func() {
		time.Sleep(time.Second * 1)
		c1 <- "one"
	}()

	go func() {
		time.Sleep(time.Second * 2)
		c2 <- "two"
	}()

	// Receive from both channels
	for i := 0; i < 2; i++ {
		select {
		case msg1 := <-c1:
			fmt.Println("Received:", msg1)
		case msg2 := <-c2:
			fmt.Println("Received:", msg2)
		}
	}
}`,
    tags: ["concurrency", "goroutines", "channels"]
  },
  {
    id: "10",
    language: "SQL",
    name: "Complex Query",
    description: "Advanced SQL query with joins and aggregation",
    code: `-- Create sample tables
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    city VARCHAR(50)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE,
    total_amount DECIMAL(10, 2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    item_id INT PRIMARY KEY,
    order_id INT,
    product_name VARCHAR(100),
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Complex query with joins and aggregation
SELECT 
    c.name AS customer_name,
    c.city,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(o.total_amount) AS total_spent,
    AVG(o.total_amount) AS average_order_value,
    MAX(o.order_date) AS last_order_date,
    STRING_AGG(DISTINCT oi.product_name, ', ') AS purchased_products
FROM 
    customers c
JOIN 
    orders o ON c.customer_id = o.customer_id
JOIN 
    order_items oi ON o.order_id = oi.order_id
WHERE 
    o.order_date >= '2023-01-01'
    AND o.total_amount > 100
GROUP BY 
    c.customer_id, c.name, c.city
HAVING 
    COUNT(DISTINCT o.order_id) > 1
ORDER BY 
    total_spent DESC
LIMIT 10;`,
    tags: ["database", "joins", "aggregation"]
  }
]; 