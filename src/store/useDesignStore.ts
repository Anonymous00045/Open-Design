import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { projectsAPI, aiAPI, Project, AIJob, User } from '@/lib/api';

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'animation' | 'figma';
  url: string;
  size: number;
  // Visual embeddings for AI processing
  embeddings?: number[];
  // Analysis results from AI pipeline
  analysis?: {
    layout: LayoutElement[];
    colors: string[];
    typography: TypographyElement[];
    animations: AnimationElement[];
    motionVectors?: MotionVector[];
  };
  // Metadata for training pipeline
  metadata?: {
    uploadedAt: string;
    processedAt?: string;
    aiJobId?: string;
    verified?: boolean;
  };
}

interface LayoutElement {
  type: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main';
  class: string;
  bounds: { x: number; y: number; width: number; height: number };
  children?: LayoutElement[];
}

interface TypographyElement {
  family: string;
  weight: number;
  size: number;
  usage: 'heading' | 'body' | 'caption' | 'button';
  color?: string;
}

interface AnimationElement {
  selector: string;
  type: 'fade-in' | 'slide-up' | 'scale' | 'rotate' | 'parallax';
  duration: number;
  delay: number;
  easing?: string;
}

interface MotionVector {
  element: string;
  animation: string;
  duration: number;
  delay: number;
  keyframes?: { time: number; properties: Record<string, any> }[];
}

interface CommunitySnippet {
  id: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  framework: 'react' | 'vue' | 'angular' | 'plain';
  code: {
    html?: string;
    css?: string;
    js?: string;
    jsx?: string;
  };
  rating: number;
  downloads: number;
  verified: boolean;
  createdAt: string;
}

interface LibraryFilters {
  framework?: string;
  tags?: string[];
  rating?: number;
  search?: string;
}

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

// Project interface now imported from API types

interface DesignState {
  // Current project
  currentProject: Project | null;
  projects: Project[];
  loading: boolean;

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

  // Assets state
  assets: Asset[];

  // AI state
  aiJobs: AIJob[];
  aiLoading: boolean;

  // Actions
  loadProjects: () => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  createProject: (project: { title: string; description?: string }) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>, createVersion?: boolean) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveProject: () => Promise<void>;

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
  generateCodeFromCanvas: () => Promise<void>;

  // Asset actions
  addAsset: (asset: Asset) => void;
  removeAsset: (assetId: string) => void;
  getAssets: () => Asset[];

  // AI actions - Following architecture pipeline
  submitAIJob: (type: 'design2code' | 'refine' | 'animation' | 'generate', input: any) => Promise<string>;
  getAIJob: (jobId: string) => Promise<AIJob>;
  loadAIJobs: () => Promise<void>;
  
  // Community actions - Following architecture
  submitToLibrary: (snippet: CommunitySnippet) => Promise<void>;
  browseLibrary: (filters?: LibraryFilters) => Promise<CommunitySnippet[]>;
  rateSnippet: (snippetId: string, rating: number) => Promise<void>;

  // UI actions
  setActivePanel: (panel: 'canvas' | 'code' | 'preview' | 'ai') => void;
  toggleSidebar: () => void;
  toggleAiPanel: () => void;
}

const defaultProject: Project = {
  _id: 'default',
  ownerId: {} as User,
  title: 'Untitled Project',
  description: 'A new design project',
  public: false,
  collaborators: [],
  designJson: {
    elements: [],
    canvasSize: { width: 1200, height: 800 },
    version: '1.0.0'
  },
  code: {
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
    framework: 'plain' as const
  },
  versions: [],
  assets: [],
  tags: [],
  stats: {
    views: 0,
    likes: 0,
    forks: 0
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useDesignStore = create<DesignState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentProject: null,
      projects: [],
      loading: false,
      selectedElement: null,
      canvasElements: [],
      canvasSize: { width: 1200, height: 800 },
      htmlCode: '',
      cssCode: '',
      jsCode: '',
      activePanel: 'canvas',
      sidebarCollapsed: false,
      aiPanelOpen: false,
      aiJobs: [],
      aiLoading: false,
      assets: [],

      // Project actions
      loadProjects: async () => {
        try {
          set({ loading: true });
          const response = await projectsAPI.list();
          set({ projects: response.data.projects, loading: false });
        } catch (error) {
          console.error('Failed to load projects:', error);
          set({ loading: false });
        }
      },

      setCurrentProject: (project) => {
        set({
          currentProject: project,
          canvasElements: project?.designJson?.elements || [],
          canvasSize: project?.designJson?.canvasSize || { width: 1200, height: 800 },
          htmlCode: project?.code?.html || '',
          cssCode: project?.code?.css || '',
          jsCode: project?.code?.js || ''
        });
      },

      createProject: async (projectData) => {
        try {
          set({ loading: true });
          const response = await projectsAPI.create({
            title: projectData.title,
            description: projectData.description,
            designJson: {
              elements: [],
              canvasSize: { width: 1200, height: 800 },
              version: '1.0.0'
            },
            code: {
              html: '',
              css: '',
              js: '',
              framework: 'plain'
            },
            public: false,
            tags: []
          });

          const newProject = response.data;
          set((state) => ({
            projects: [newProject, ...state.projects],
            currentProject: newProject,
            loading: false
          }));

          return newProject;
        } catch (error) {
          console.error('Failed to create project:', error);
          set({ loading: false });
          throw error;
        }
      },

      updateProject: async (id, updates, createVersion = false) => {
        try {
          await projectsAPI.update(id, {
            ...updates,
            createVersion,
            versionMessage: createVersion ? 'Auto-save version' : undefined
          });

          set((state) => ({
            projects: state.projects.map((project) =>
              project._id === id ? { ...project, ...updates } : project
            ),
            currentProject:
              state.currentProject?._id === id
                ? { ...state.currentProject, ...updates }
                : state.currentProject,
          }));
        } catch (error) {
          console.error('Failed to update project:', error);
          throw error;
        }
      },

      deleteProject: async (id) => {
        try {
          await projectsAPI.delete(id);
          set((state) => ({
            projects: state.projects.filter((project) => project._id !== id),
            currentProject:
              state.currentProject?._id === id ? null : state.currentProject,
          }));
        } catch (error) {
          console.error('Failed to delete project:', error);
          throw error;
        }
      },

      saveProject: async () => {
        const { currentProject, canvasElements, htmlCode, cssCode, jsCode, canvasSize } = get();
        if (!currentProject) return;

        try {
          await projectsAPI.update(currentProject._id, {
            designJson: {
              elements: canvasElements,
              canvasSize,
              version: '1.0.0'
            },
            code: {
              html: htmlCode,
              css: cssCode,
              js: jsCode,
              framework: 'plain'
            }
          });
        } catch (error) {
          console.error('Failed to save project:', error);
          throw error;
        }
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

      generateCodeFromCanvas: async () => {
        const { canvasElements } = get();

        try {
          set({ aiLoading: true });

          // Generate HTML from canvas elements
          const htmlElements = canvasElements.map(element => {
            switch (element.type) {
              case 'text':
                return `    <div class="element-${element.id}" style="position: absolute; left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px;">
      <p>${element.content || 'Text'}</p>
    </div>`;
              case 'button':
                return `    <button class="element-${element.id}" style="position: absolute; left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px;">
      ${element.content || 'Button'}
    </button>`;
              case 'container':
                return `    <div class="element-${element.id}" style="position: absolute; left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px;">
      <!-- Container content -->
    </div>`;
              case 'image':
                return `    <div class="element-${element.id}" style="position: absolute; left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px;">
      <img src="https://via.placeholder.com/${element.width}x${element.height}" alt="Placeholder" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>`;
              default:
                return `    <div class="element-${element.id}" style="position: absolute; left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px;">
      <!-- ${element.type} element -->
    </div>`;
            }
          }).join('\n');

          const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Design</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="canvas-container">
${htmlElements}
  </div>
  <script src="script.js"></script>
</body>
</html>`;

          // Generate CSS
          const cssElements = canvasElements.map(element => {
            const styles = element.styles || {};
            return `.element-${element.id} {
  background-color: ${styles.backgroundColor || 'transparent'};
  color: ${styles.color || '#1f2937'};
  font-size: ${styles.fontSize || 16}px;
  font-family: ${styles.fontFamily || 'Inter, sans-serif'};
  border-radius: ${styles.borderRadius || 0}px;
  padding: ${styles.padding || 0}px;
  border: ${styles.border || 'none'};
  box-shadow: ${styles.boxShadow || 'none'};
}`;
          }).join('\n\n');

          const css = `/* Generated Styles */
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

.canvas-container {
  position: relative;
  width: 1200px;
  height: 800px;
  margin: 2rem auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

${cssElements}`;

          const js = `// Generated JavaScript
console.log('Design loaded successfully');

// Add interactivity
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
  
  // Add click handlers for buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('Button clicked:', this.textContent);
    });
  });
});`;

          set({
            htmlCode: html,
            cssCode: css,
            jsCode: js,
            aiLoading: false
          });
        } catch (error) {
          console.error('Failed to generate code:', error);
          set({ aiLoading: false });
        }
      },

      // AI actions
      submitAIJob: async (type: 'design2code' | 'refine' | 'animation' | 'generate', input) => {
        try {
          const response = await aiAPI.submitJob({ type, input });
          return response.data.jobId;
        } catch (error) {
          console.error('Failed to submit AI job:', error);
          throw error;
        }
      },

      getAIJob: async (jobId) => {
        try {
          const response = await aiAPI.getJob(jobId);
          return response.data;
        } catch (error) {
          console.error('Failed to get AI job:', error);
          throw error;
        }
      },

      loadAIJobs: async () => {
        try {
          const response = await aiAPI.listJobs();
          set({ aiJobs: response.data.jobs });
        } catch (error) {
          console.error('Failed to load AI jobs:', error);
        }
      },

      // Community actions - Following architecture
      submitToLibrary: async (snippet: CommunitySnippet) => {
        try {
          // In real implementation, this would call community API
          console.log('Submitting to community library:', snippet);
          // For now, just simulate success
          return Promise.resolve();
        } catch (error) {
          console.error('Failed to submit to library:', error);
          throw error;
        }
      },

      browseLibrary: async (filters?: LibraryFilters) => {
        try {
          // In real implementation, this would call community API
          console.log('Browsing library with filters:', filters);
          // Return mock data for now
          return Promise.resolve([]);
        } catch (error) {
          console.error('Failed to browse library:', error);
          throw error;
        }
      },

      rateSnippet: async (snippetId: string, rating: number) => {
        try {
          // In real implementation, this would call community API
          console.log('Rating snippet:', snippetId, rating);
          return Promise.resolve();
        } catch (error) {
          console.error('Failed to rate snippet:', error);
          throw error;
        }
      },

      // Asset actions
      addAsset: (asset) => {
        set((state) => ({
          assets: [...state.assets, asset]
        }));
      },

      removeAsset: (assetId) => {
        set((state) => ({
          assets: state.assets.filter(asset => asset.id !== assetId)
        }));
      },

      getAssets: () => {
        return get().assets;
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