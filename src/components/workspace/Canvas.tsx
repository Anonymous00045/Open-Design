'use client';

import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Group } from 'react-konva';
import { motion } from 'framer-motion';
import { useDesignStore } from '@/store/useDesignStore';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Grid3X3,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function Canvas() {
  const stageRef = useRef<any>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { 
    canvasElements, 
    selectedElement, 
    selectElement, 
    updateElement,
    canvasSize,
    setCanvasSize 
  } = useDesignStore();

  const handleDragEnd = (e: any, elementId: string) => {
    const newAttrs = {
      x: e.target.x(),
      y: e.target.y(),
    };
    updateElement(elementId, newAttrs);
  };

  const handleResize = (e: any, elementId: string) => {
    const newAttrs = {
      width: e.target.width(),
      height: e.target.height(),
    };
    updateElement(elementId, newAttrs);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.1));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderElement = (element: any) => {
    const isSelected = selectedElement?.id === element.id;
    
    switch (element.type) {
      case 'text':
        return (
          <Text
            key={element.id}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            text={element.content || 'Text'}
            fontSize={element.styles.fontSize || 16}
            fontFamily={element.styles.fontFamily || 'Inter'}
            fill={element.styles.color || '#1f2937'}
            draggable
            onDragEnd={(e) => handleDragEnd(e, element.id)}
            onClick={() => selectElement(element)}
            onTap={() => selectElement(element)}
            stroke={isSelected ? '#3b82f6' : 'transparent'}
            strokeWidth={isSelected ? 2 : 0}
          />
        );
      
      case 'button':
        return (
          <Group
            key={element.id}
            x={element.x}
            y={element.y}
            draggable
            onDragEnd={(e) => handleDragEnd(e, element.id)}
            onClick={() => selectElement(element)}
            onTap={() => selectElement(element)}
          >
            <Rect
              width={element.width}
              height={element.height}
              fill={element.styles.backgroundColor || '#3b82f6'}
              cornerRadius={element.styles.borderRadius || 8}
              stroke={isSelected ? '#1d4ed8' : 'transparent'}
              strokeWidth={isSelected ? 2 : 0}
            />
            <Text
              x={element.styles.padding || 12}
              y={element.height / 2 - 8}
              text={element.content || 'Button'}
              fontSize={element.styles.fontSize || 14}
              fontFamily={element.styles.fontFamily || 'Inter'}
              fill={element.styles.color || '#ffffff'}
            />
          </Group>
        );
      
      case 'image':
        return (
          <Rect
            key={element.id}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill="#e5e7eb"
            stroke={isSelected ? '#3b82f6' : '#d1d5db'}
            strokeWidth={isSelected ? 2 : 1}
            draggable
            onDragEnd={(e) => handleDragEnd(e, element.id)}
            onClick={() => selectElement(element)}
            onTap={() => selectElement(element)}
          />
        );
      
      case 'circle':
        return (
          <Circle
            key={element.id}
            x={element.x + element.width / 2}
            y={element.y + element.height / 2}
            radius={Math.min(element.width, element.height) / 2}
            fill={element.styles.backgroundColor || '#e5e7eb'}
            stroke={isSelected ? '#3b82f6' : 'transparent'}
            strokeWidth={isSelected ? 2 : 0}
            draggable
            onDragEnd={(e) => handleDragEnd(e, element.id)}
            onClick={() => selectElement(element)}
            onTap={() => selectElement(element)}
          />
        );
      
      default:
        return (
          <Rect
            key={element.id}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill={element.styles.backgroundColor || 'transparent'}
            stroke={isSelected ? '#3b82f6' : '#d1d5db'}
            strokeWidth={isSelected ? 2 : 1}
            draggable
            onDragEnd={(e) => handleDragEnd(e, element.id)}
            onClick={() => selectElement(element)}
            onTap={() => selectElement(element)}
          />
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Canvas Toolbar */}
      <div className="h-12 bg-surface-container border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-foreground" />
          </motion.button>
          
          <span className="text-sm text-foreground font-medium px-2">
            {Math.round(zoom * 100)}%
          </span>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-foreground" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetZoom}
            className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-foreground" />
          </motion.button>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${
              showGrid ? 'bg-primary text-primary-foreground' : 'hover:bg-surface-variant'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-surface-variant transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-foreground" />
            ) : (
              <Maximize2 className="w-4 h-4 text-foreground" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center bg-muted/20 p-8">
        <div className="bg-white rounded-lg elevation-3 overflow-hidden">
          <Stage
            ref={stageRef}
            width={canvasSize.width * zoom}
            height={canvasSize.height * zoom}
            scaleX={zoom}
            scaleY={zoom}
            onClick={(e) => {
              // Deselect if clicking on empty space
              if (e.target === e.target.getStage()) {
                selectElement(null);
              }
            }}
          >
            <Layer>
              {/* Grid */}
              {showGrid && (
                <Group>
                  {Array.from({ length: Math.ceil(canvasSize.width / 20) }, (_, i) => (
                    <Rect
                      key={`v-${i}`}
                      x={i * 20}
                      y={0}
                      width={1}
                      height={canvasSize.height}
                      fill="#e5e7eb"
                      opacity={0.5}
                    />
                  ))}
                  {Array.from({ length: Math.ceil(canvasSize.height / 20) }, (_, i) => (
                    <Rect
                      key={`h-${i}`}
                      x={0}
                      y={i * 20}
                      width={canvasSize.width}
                      height={1}
                      fill="#e5e7eb"
                      opacity={0.5}
                    />
                  ))}
                </Group>
              )}
              
              {/* Canvas Elements */}
              {canvasElements.map(renderElement)}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}

