import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'container' | 'div';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  styles: {
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    borderRadius?: number;
    padding?: number;
    margin?: number;
    border?: string;
    boxShadow?: string;
  };
  children?: DesignElement[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  elements: DesignElement[];
  html: string;
  css: string;
  js: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DesignState {
  // Current project
  currentProject: Project | null;
  projects: Project[];
  
  // Canvas state
  selectedElement: DesignElement | null;
  canvasElements: DesignElement[];
  canvasSize: { width: number; height: number };
  
  // Code editor state
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  
  // UI state
  activePanel: 'canvas' | 'code' | 'preview' | 'ai';
  sidebarCollapsed: boolean;
  aiPanelOpen: boolean;
  
  // Actions
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Canvas actions
  addElement: (element: Omit<DesignElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (element: DesignElement | null) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
  
  // Code actions
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
  generateCodeFromCanvas: () => void;
  
  // UI actions
  setActivePanel: (panel: 'canvas' | 'code' | 'preview' | 'ai') => void;
  toggleSidebar: () => void;
  toggleAiPanel: () => void;
}

const defaultProject: Project = {
  id: 'default',
  name: 'Untitled Project',
  description: 'A new design project',
  elements: [],
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Open Design Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to Open Design</h1>
        <p>Start building your design by adding elements to the canvas.</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
  css: `/* Open Design Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', system-ui, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8fafc;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1a202c;
}

p {
    font-size: 1.125rem;
    color: #4a5568;
    margin-bottom: 1rem;
}`,
  js: `// Open Design JavaScript
console.log('Open Design project loaded');

// Add your custom JavaScript here
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
});`,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useDesignStore = create<DesignState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentProject: defaultProject,
      projects: [defaultProject],
      selectedElement: null,
      canvasElements: [],
      canvasSize: { width: 1200, height: 800 },
      htmlCode: defaultProject.html,
      cssCode: defaultProject.css,
      jsCode: defaultProject.js,
      activePanel: 'canvas',
      sidebarCollapsed: false,
      aiPanelOpen: false,

      // Project actions
      setCurrentProject: (project) => set({ currentProject: project }),
      
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: `project-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
        }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          ),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, ...updates, updatedAt: new Date() }
              : state.currentProject,
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          currentProject:
            state.currentProject?.id === id ? null : state.currentProject,
        }));
      },

      // Canvas actions
      addElement: (elementData) => {
        const newElement: DesignElement = {
          ...elementData,
          id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        set((state) => ({
          canvasElements: [...state.canvasElements, newElement],
        }));
      },

      updateElement: (id, updates) => {
        set((state) => ({
          canvasElements: state.canvasElements.map((element) =>
            element.id === id ? { ...element, ...updates } : element
          ),
          selectedElement:
            state.selectedElement?.id === id
              ? { ...state.selectedElement, ...updates }
              : state.selectedElement,
        }));
      },

      deleteElement: (id) => {
        set((state) => ({
          canvasElements: state.canvasElements.filter((element) => element.id !== id),
          selectedElement:
            state.selectedElement?.id === id ? null : state.selectedElement,
        }));
      },

      selectElement: (element) => set({ selectedElement: element }),
      
      setCanvasSize: (size) => set({ canvasSize: size }),

      // Code actions
      setHtmlCode: (code) => set({ htmlCode: code }),
      setCssCode: (code) => set({ cssCode: code }),
      setJsCode: (code) => set({ jsCode: code }),

      generateCodeFromCanvas: () => {
        const { canvasElements } = get();
        // This would generate HTML/CSS from canvas elements
        // For now, we'll keep the existing code
        console.log('Generating code from canvas elements:', canvasElements);
      },

      // UI actions
      setActivePanel: (panel) => set({ activePanel: panel }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleAiPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
    }),
    {
      name: 'design-store',
    }
  )
);

