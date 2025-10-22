'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Image, 
  Video, 
  FileImage, 
  Loader2,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';

interface UploadFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'animation' | 'figma';
  status: 'uploading' | 'analyzing' | 'complete' | 'error';
  progress: number;
  preview?: string;
  analysis?: any;
}

export default function UploadWidget() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const { addAsset } = useDesignStore();

  const acceptedTypes = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
    'video/*': ['.mp4', '.webm', '.mov'],
    'application/json': ['.json'], // Lottie files
    '.fig': [], // Figma exports
  };

  const getFileType = (file: File): UploadFile['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/json' || file.name.endsWith('.json')) return 'animation';
    if (file.name.endsWith('.fig')) return 'figma';
    return 'image'; // default
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') || 
                     file.type.startsWith('video/') ||
                     file.type === 'application/json' ||
                     file.name.endsWith('.fig');
      return isValid && file.size <= 50 * 1024 * 1024; // 50MB limit
    });

    const newUploads: UploadFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: getFileType(file),
      status: 'uploading',
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Process each file
    for (const upload of newUploads) {
      await processFile(upload);
    }
  };

  const processFile = async (upload: UploadFile) => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploads(prev => prev.map(u => 
          u.id === upload.id ? { ...u, progress } : u
        ));
      }

      // Change to analyzing
      setUploads(prev => prev.map(u => 
        u.id === upload.id ? { ...u, status: 'analyzing', progress: 0 } : u
      ));

      // Simulate analysis
      const analysisResult = await analyzeFile(upload);
      
      // Complete
      setUploads(prev => prev.map(u => 
        u.id === upload.id ? { 
          ...u, 
          status: 'complete', 
          progress: 100,
          analysis: analysisResult 
        } : u
      ));

      // Add to assets
      addAsset({
        id: upload.id,
        name: upload.file.name,
        type: upload.type,
        url: upload.preview || '',
        size: upload.file.size,
        analysis: analysisResult
      });

    } catch (error) {
      setUploads(prev => prev.map(u => 
        u.id === upload.id ? { ...u, status: 'error' } : u
      ));
    }
  };

  const analyzeFile = async (upload: UploadFile) => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis = {
      dimensions: { width: 1200, height: 800 },
      colors: ['#3B82F6', '#8B5CF6', '#EC4899'],
      elements: [
        { type: 'text', content: 'Hero Title', style: { fontSize: '48px', fontWeight: 'bold' } },
        { type: 'button', content: 'Call to Action', style: { background: '#3B82F6' } }
      ],
      layout: 'hero-section',
      animations: upload.type === 'video' ? [
        { type: 'fadeIn', duration: '1s', delay: '0s' },
        { type: 'slideUp', duration: '0.8s', delay: '0.2s' }
      ] : []
    };

    return mockAnalysis;
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'analyzing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (upload: UploadFile) => {
    switch (upload.status) {
      case 'uploading':
        return `Uploading... ${upload.progress}%`;
      case 'analyzing':
        return 'Analyzing design...';
      case 'complete':
        return 'Ready for generation';
      case 'error':
        return 'Upload failed';
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Upload Design Assets
        </h3>
        <p className="text-muted-foreground mb-4">
          Drag & drop images, videos, animations, or Figma exports
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Image className="w-3 h-3" />
            PNG, JPG, SVG
          </span>
          <span className="flex items-center gap-1">
            <Video className="w-3 h-3" />
            MP4, WebM
          </span>
          <span className="flex items-center gap-1">
            <FileImage className="w-3 h-3" />
            Lottie JSON
          </span>
        </div>

        <input
          type="file"
          multiple
          accept="image/*,video/*,.json,.fig"
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer transition-colors"
        >
          Choose Files
        </label>
      </motion.div>

      {/* Upload List */}
      <AnimatePresence>
        {uploads.map((upload) => (
          <motion.div
            key={upload.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {upload.preview && (
                  <img 
                    src={upload.preview} 
                    alt={upload.file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium text-foreground">{upload.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(upload.file.size / 1024 / 1024).toFixed(1)} MB • {upload.type}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusIcon(upload.status)}
                <span className="text-sm text-muted-foreground">
                  {getStatusText(upload)}
                </span>
                <button
                  onClick={() => removeUpload(upload.id)}
                  className="p-1 hover:bg-surface-variant rounded"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {(upload.status === 'uploading' || upload.status === 'analyzing') && (
              <div className="mt-3">
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${upload.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {upload.status === 'complete' && upload.analysis && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Analysis Results</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>Layout: {upload.analysis.layout}</div>
                  <div>Elements: {upload.analysis.elements.length}</div>
                  <div>Colors: {upload.analysis.colors.length}</div>
                  <div>Animations: {upload.analysis.animations.length}</div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}