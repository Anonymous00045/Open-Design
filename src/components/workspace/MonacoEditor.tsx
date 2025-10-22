'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Code, Play, Save, Download, Settings } from 'lucide-react';

interface MonacoEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: string;
  height?: string;
}

export default function MonacoEditor({
  value = '',
  onChange,
  language = 'html',
  theme = 'vs-dark',
  height = '70vh'
}: MonacoEditorProps) {
  const [code, setCode] = useState(value);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isLoading, setIsLoading] = useState(true);

  const languages = [
    { id: 'html', label: 'HTML', icon: '🌐' },
    { id: 'css', label: 'CSS', icon: '🎨' },
    { id: 'javascript', label: 'JavaScript', icon: '⚡' },
    { id: 'typescript', label: 'TypeScript', icon: '🔷' },
    { id: 'json', label: 'JSON', icon: '📋' },
    { id: 'markdown', label: 'Markdown', icon: '📝' }
  ];

  const handleEditorChange = (newValue: string | undefined) => {
    const updatedValue = newValue || '';
    setCode(updatedValue);
    onChange?.(updatedValue);
  };

  const handleEditorDidMount = () => {
    setIsLoading(false);
  };

  const handleRunCode = () => {
    // Trigger preview update or code execution
    console.log('Running code:', code);
  };

  const handleSaveCode = () => {
    // Save code to project
    console.log('Saving code:', code);
  };

  const handleDownloadCode = () => {
    // Download code as file
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${selectedLanguage}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-3 bg-black/30 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Code Editor</span>
          </div>
          
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-gray-800">
                {lang.icon} {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunCode}
            className="flex items-center space-x-1 px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>Run</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveCode}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors"
          >
            <Save className="w-3 h-3" />
            <span>Save</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadCode}
            className="flex items-center space-x-1 px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </motion.button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading editor...</span>
            </div>
          </div>
        )}
        
        <Editor
          height={height}
          defaultLanguage={selectedLanguage}
          language={selectedLanguage}
          theme={theme}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            automaticLayout: true,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            cursorStyle: 'line',
            fontFamily: 'Fira Code, Monaco, Consolas, monospace',
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: true,
            trimAutoWhitespace: true,
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: true,
            parameterHints: { enabled: true },
            hover: { enabled: true },
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'blink',
            renderWhitespace: 'selection',
            renderControlCharacters: false,
            renderIndentGuides: true,
            highlightActiveIndentGuide: true,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            }
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-black/40 border-t border-white/10 text-xs text-white/70">
        <div className="flex items-center space-x-4">
          <span>Language: {languages.find(l => l.id === selectedLanguage)?.label}</span>
          <span>Lines: {code.split('\n').length}</span>
          <span>Characters: {code.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
}