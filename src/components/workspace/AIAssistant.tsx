'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Code, 
  Palette,
  Layout,
  Wand2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const quickPrompts = [
  "Create a modern landing page",
  "Add a contact form",
  "Make it responsive",
  "Add animations",
  "Improve the color scheme",
  "Generate a hero section",
  "Add a navigation menu",
  "Create a card layout",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI design assistant. I can help you create, modify, and improve your designs. What would you like to work on today?",
      timestamp: new Date(),
      suggestions: ["Create a new component", "Improve existing design", "Add animations"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    htmlCode, 
    cssCode, 
    jsCode, 
    setHtmlCode, 
    setCssCode, 
    setJsCode,
    canvasElements,
    addElement 
  } = useDesignStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response (in real app, this would call an API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (prompt: string): { content: string; suggestions?: string[] } => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('landing page') || lowerPrompt.includes('hero')) {
      const heroHTML = `
        <section class="hero">
          <div class="hero-content">
            <h1>Welcome to Our Platform</h1>
            <p>Build amazing designs with AI-powered tools</p>
            <button class="cta-button">Get Started</button>
          </div>
        </section>
      `;
      
      const heroCSS = `
        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }
        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .cta-button {
          background: #ff6b6b;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .cta-button:hover {
          transform: translateY(-2px);
        }
      `;
      
      setHtmlCode(heroHTML);
      setCssCode(heroCSS);
      
      return {
        content: "I've created a modern hero section for you! The design includes a gradient background, centered content, and a call-to-action button with hover effects.",
        suggestions: ["Add animations", "Make it responsive", "Add more sections"]
      };
    }
    
    if (lowerPrompt.includes('form') || lowerPrompt.includes('contact')) {
      const formHTML = `
        <form class="contact-form">
          <h2>Contact Us</h2>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>
      `;
      
      const formCSS = `
        .contact-form {
          max-width: 500px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }
        .contact-form button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .contact-form button:hover {
          background: #2563eb;
        }
      `;
      
      setHtmlCode(formHTML);
      setCssCode(formCSS);
      
      return {
        content: "I've created a professional contact form with proper styling, validation, and accessibility features. The form includes name, email, and message fields.",
        suggestions: ["Add form validation", "Style the form differently", "Add more fields"]
      };
    }
    
    if (lowerPrompt.includes('responsive') || lowerPrompt.includes('mobile')) {
      const responsiveCSS = `
        /* Mobile-first responsive design */
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }
        
        @media (min-width: 768px) {
          .container {
            padding: 2rem;
          }
        }
        
        @media (min-width: 1024px) {
          .container {
            padding: 3rem;
          }
        }
        
        .grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr;
        }
        
        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `;
      
      setCssCode(prev => prev + '\n' + responsiveCSS);
      
      return {
        content: "I've added responsive design principles to your CSS! The code includes mobile-first approach with breakpoints for tablet and desktop views.",
        suggestions: ["Test on different devices", "Add more breakpoints", "Optimize for performance"]
      };
    }
    
    return {
      content: "I understand you'd like help with your design. Could you be more specific about what you'd like me to create or modify? I can help with layouts, styling, components, and more!",
      suggestions: ["Create a component", "Improve styling", "Add functionality"]
    };
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleRegenerate = () => {
    if (messages.length > 1) {
      const lastUserMessage = messages.filter(m => m.type === 'user').pop();
      if (lastUserMessage) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-surface-container">
      {/* AI Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Powered by advanced AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                
                <div className={`rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface text-foreground border border-border'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs opacity-70">Suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickPrompt(suggestion)}
                            className="text-xs px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-surface text-foreground border border-border rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <p className="text-sm font-medium text-foreground mb-2">Quick Prompts:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs px-3 py-1 bg-surface border border-border rounded-full hover:bg-surface-variant transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask AI to help with your design..."
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              disabled={isLoading}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

