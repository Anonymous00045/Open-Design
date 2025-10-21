'use client';

import { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  FileCode, 
  FileImage, 
  Play,
  Save,
  Copy,
  Download,
  Settings
} from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';

export default function CodeEditor() {
  const editorRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  const { 
    htmlCode, 
    cssCode, 
    jsCode, 
    setHtmlCode, 
    setCssCode, 
    setJsCode,
    generateCodeFromCanvas 
  } = useDesignStore();

  const tabs = [
    { id: 'html', label: 'HTML', icon: FileText, code: htmlCode, setCode: setHtmlCode },
    { id: 'css', label: 'CSS', icon: FileCode, code: cssCode, setCode: setCssCode },
    { id: 'js', label: 'JavaScript', icon: FileImage, code: jsCode, setCode: setJsCode },
  ];

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, monospace',
      lineHeight: 1.6,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
    });

    // Add custom themes
    monaco.editor.defineTheme('open-design-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '7c3aed', fontStyle: 'bold' },
        { token: 'string', foreground: '059669' },
        { token: 'number', foreground: 'dc2626' },
        { token: 'tag', foreground: '2563eb' },
        { token: 'attribute.name', foreground: '7c3aed' },
        { token: 'attribute.value', foreground: '059669' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#1f2937',
        'editor.lineHighlightBackground': '#f8fafc',
        'editor.selectionBackground': '#dbeafe',
        'editorCursor.foreground': '#3b82f6',
        'editorLineNumber.foreground': '#9ca3af',
        'editorLineNumber.activeForeground': '#374151',
      },
    });

    monaco.editor.defineTheme('open-design-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'a78bfa', fontStyle: 'bold' },
        { token: 'string', foreground: '10b981' },
        { token: 'number', foreground: 'f87171' },
        { token: 'tag', foreground: '60a5fa' },
        { token: 'attribute.name', foreground: 'a78bfa' },
        { token: 'attribute.value', foreground: '10b981' },
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#f1f5f9',
        'editor.lineHighlightBackground': '#1e293b',
        'editor.selectionBackground': '#1e40af',
        'editorCursor.foreground': '#3b82f6',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#cbd5e1',
      },
    });

    // Set theme based on system preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    monaco.editor.setTheme(isDark ? 'open-design-dark' : 'open-design-light');
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      const activeTabData = tabs.find(tab => tab.id === activeTab);
      if (activeTabData) {
        activeTabData.setCode(value);
      }
    }
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const handleCopyCode = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (activeTabData) {
      navigator.clipboard.writeText(activeTabData.code);
    }
  };

  const handleDownloadCode = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (activeTabData) {
      const blob = new Blob([activeTabData.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `code.${activeTab}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getLanguage = () => {
    switch (activeTab) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'javascript';
      default: return 'html';
    }
  };

  const getCurrentCode = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    return activeTabData?.code || '';
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Editor Toolbar */}
      <div className="h-12 bg-surface-container border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-surface-variant'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateCodeFromCanvas}
            className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
            title="Generate from Canvas"
          >
            <Play className="w-4 h-4 text-foreground" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFormatCode}
            className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
            title="Format Code"
          >
            <Settings className="w-4 h-4 text-foreground" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyCode}
            className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
            title="Copy Code"
          >
            <Copy className="w-4 h-4 text-foreground" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadCode}
            className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
            title="Download Code"
          >
            <Download className="w-4 h-4 text-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguage()}
          value={getCurrentCode()}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            lineHeight: 1.6,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
          }}
        />
      </div>
    </div>
  );
}

