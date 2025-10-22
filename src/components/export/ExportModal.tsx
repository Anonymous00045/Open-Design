'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesignStore } from '@/store/useDesignStore';
import MiniLoadingScreen from '../ui/MiniLoadingScreen';
import {
    Download,
    Code,
    Image,
    FileText,
    Package,
    X,
    Copy,
    Check,
    Settings,
    Zap
} from 'lucide-react';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
    const { currentProject, htmlCode, cssCode, jsCode, canvasElements } = useDesignStore();
    const [activeTab, setActiveTab] = useState<'code' | 'image' | 'package'>('code');
    const [exportFormat, setExportFormat] = useState<'html' | 'react' | 'vue' | 'angular'>('html');
    const [imageFormat, setImageFormat] = useState<'png' | 'jpg' | 'svg' | 'pdf'>('png');
    const [packageType, setPackageType] = useState<'zip' | 'npm' | 'github'>('zip');
    const [copied, setCopied] = useState<string | null>(null);
    const [includeAssets, setIncludeAssets] = useState(true);
    const [minifyCode, setMinifyCode] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const exportTabs = [
        { id: 'code', label: 'Code Export', icon: Code },
        { id: 'image', label: 'Image Export', icon: Image },
        { id: 'package', label: 'Package Export', icon: Package }
    ];

    const handleCopyCode = async (code: string, type: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const generateReactCode = () => {
        return `import React from 'react';
import './styles.css';

export default function Component() {
  return (
    <div className="container">
      ${htmlCode.replace(/<(\w+)([^>]*)>/g, '<$1$2>')}
    </div>
  );
}`;
    };

    const generateVueCode = () => {
        return `<template>
  <div class="container">
    ${htmlCode}
  </div>
</template>

<script>
export default {
  name: 'Component',
  data() {
    return {
      // Component data
    }
  }
}
</script>

<style scoped>
${cssCode}
</style>`;
    };

    const generateAngularCode = () => {
        return `import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  template: \`
    <div class="container">
      ${htmlCode}
    </div>
  \`,
  styleUrls: ['./component.css']
})
export class ComponentComponent {
  // Component logic
}`;
    };

    const getCodeByFormat = () => {
        switch (exportFormat) {
            case 'react':
                return generateReactCode();
            case 'vue':
                return generateVueCode();
            case 'angular':
                return generateAngularCode();
            default:
                return htmlCode;
        }
    };

    const handleDownloadCode = async () => {
        setIsExporting(true);

        // Simulate export processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        const code = getCodeByFormat();
        const filename = `${currentProject?.name || 'design'}.${exportFormat === 'html' ? 'html' : exportFormat === 'react' ? 'jsx' : exportFormat}`;

        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsExporting(false);
    };

    const handleDownloadPackage = async () => {
        setIsExporting(true);

        // Simulate package generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // This would generate a complete package with all files
        const files = {
            'index.html': htmlCode,
            'styles.css': cssCode,
            'script.js': jsCode,
            'package.json': JSON.stringify({
                name: currentProject?.name?.toLowerCase().replace(/\s+/g, '-') || 'design-project',
                version: '1.0.0',
                description: currentProject?.description || 'Generated design project',
                main: 'index.html',
                scripts: {
                    start: 'serve .',
                    build: 'echo "Build complete"'
                }
            }, null, 2)
        };

        // Create zip file (simplified - in real app would use JSZip)
        console.log('Generating package with files:', files);
        alert('Package generation would happen here. In a real app, this would create a downloadable zip file.');

        setIsExporting(false);
    };

    const handleExportImage = async () => {
        setIsExporting(true);

        // Simulate image export processing
        await new Promise(resolve => setTimeout(resolve, 1800));

        // This would capture the canvas as an image
        console.log(`Exporting as ${imageFormat}`);
        alert(`Image export as ${imageFormat} would happen here. This would capture the canvas and download it.`);

        setIsExporting(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-surface-container rounded-lg border border-border w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">Export Project</h2>
                                <p className="text-muted-foreground mt-1">
                                    Export your design in various formats
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex mt-6 bg-muted rounded-lg p-1">
                            {exportTabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                        {activeTab === 'code' && (
                            <div className="space-y-6">
                                {/* Format Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-3">
                                        Export Format
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { id: 'html', label: 'HTML', desc: 'Pure HTML/CSS/JS' },
                                            { id: 'react', label: 'React', desc: 'React component' },
                                            { id: 'vue', label: 'Vue', desc: 'Vue component' },
                                            { id: 'angular', label: 'Angular', desc: 'Angular component' }
                                        ].map((format) => (
                                            <button
                                                key={format.id}
                                                onClick={() => setExportFormat(format.id as any)}
                                                className={`p-3 rounded-lg border text-left transition-colors ${exportFormat === format.id
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-border hover:border-border-hover'
                                                    }`}
                                            >
                                                <div className="font-medium text-sm">{format.label}</div>
                                                <div className="text-xs text-muted-foreground mt-1">{format.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-foreground">
                                        Export Options
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={includeAssets}
                                                onChange={(e) => setIncludeAssets(e.target.checked)}
                                                className="rounded border-border"
                                            />
                                            <span className="text-sm text-foreground">Include assets and images</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={minifyCode}
                                                onChange={(e) => setMinifyCode(e.target.checked)}
                                                className="rounded border-border"
                                            />
                                            <span className="text-sm text-foreground">Minify code</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Code Preview */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-medium text-foreground">
                                            Code Preview
                                        </label>
                                        <button
                                            onClick={() => handleCopyCode(getCodeByFormat(), 'code')}
                                            className="flex items-center space-x-1 px-3 py-1 text-xs bg-muted rounded hover:bg-muted/80 transition-colors"
                                        >
                                            {copied === 'code' ? (
                                                <>
                                                    <Check className="w-3 h-3" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3" />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
                                        <pre className="text-xs text-foreground whitespace-pre-wrap">
                                            {getCodeByFormat()}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'image' && (
                            <div className="space-y-6">
                                {/* Format Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-3">
                                        Image Format
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { id: 'png', label: 'PNG', desc: 'High quality, transparent' },
                                            { id: 'jpg', label: 'JPG', desc: 'Compressed, smaller size' },
                                            { id: 'svg', label: 'SVG', desc: 'Vector, scalable' },
                                            { id: 'pdf', label: 'PDF', desc: 'Document format' }
                                        ].map((format) => (
                                            <button
                                                key={format.id}
                                                onClick={() => setImageFormat(format.id as any)}
                                                className={`p-3 rounded-lg border text-left transition-colors ${imageFormat === format.id
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-border hover:border-border-hover'
                                                    }`}
                                            >
                                                <div className="font-medium text-sm">{format.label}</div>
                                                <div className="text-xs text-muted-foreground mt-1">{format.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Resolution Options */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-3">
                                        Resolution
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: '1x (Original)', value: '1x' },
                                            { label: '2x (Retina)', value: '2x' },
                                            { label: '3x (High DPI)', value: '3x' }
                                        ].map((resolution) => (
                                            <button
                                                key={resolution.value}
                                                className="p-3 rounded-lg border border-border hover:border-border-hover text-center transition-colors"
                                            >
                                                <div className="font-medium text-sm">{resolution.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-3">
                                        Preview
                                    </label>
                                    <div className="bg-muted rounded-lg p-4 text-center">
                                        <div className="w-32 h-24 bg-background rounded border border-border mx-auto mb-3 flex items-center justify-center">
                                            <Image className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Canvas preview will appear here
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'package' && (
                            <div className="space-y-6">
                                {/* Package Type */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-3">
                                        Package Type
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {[
                                            { id: 'zip', label: 'ZIP Archive', desc: 'Complete project files', icon: Package },
                                            { id: 'npm', label: 'NPM Package', desc: 'Ready for npm publish', icon: Zap },
                                            { id: 'github', label: 'GitHub Repo', desc: 'Push to repository', icon: Code }
                                        ].map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setPackageType(type.id as any)}
                                                    className={`p-4 rounded-lg border text-left transition-colors ${packageType === type.id
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-border hover:border-border-hover'
                                                        }`}
                                                >
                                                    <Icon className="w-6 h-6 mb-2" />
                                                    <div className="font-medium text-sm">{type.label}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">{type.desc}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Package Contents */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-3">
                                        Package Contents
                                    </label>
                                    <div className="bg-muted rounded-lg p-4">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <span>index.html</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <span>styles.css</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <span>script.js</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <span>package.json</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <span>README.md</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                {activeTab === 'code' && `Exporting as ${exportFormat.toUpperCase()}`}
                                {activeTab === 'image' && `Exporting as ${imageFormat.toUpperCase()}`}
                                {activeTab === 'package' && `Creating ${packageType.toUpperCase()} package`}
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (activeTab === 'code') handleDownloadCode();
                                        else if (activeTab === 'image') handleExportImage();
                                        else if (activeTab === 'package') handleDownloadPackage();
                                    }}
                                    className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Export</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Export Loading Overlay */}
                    {isExporting && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
                            <MiniLoadingScreen
                                message="Exporting your project..."
                                size="md"
                                showPrism={true}
                            />
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}