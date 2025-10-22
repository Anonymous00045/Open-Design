'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDesignStore } from '@/store/useDesignStore';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Calendar,
  Clock,
  Folder,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Download,
  Share2
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { projects, createProject, deleteProject, setCurrentProject } = useDesignStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'starred'>('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filterBy) {
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return matchesSearch && project.updatedAt > weekAgo;
      case 'starred':
        // For now, we'll assume all projects are starred
        return matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const handleCreateProject = async (projectData: { name: string; description: string }) => {
    try {
      const newProject = await createProject({
        title: projectData.name,
        description: projectData.description
      });
      setCurrentProject(newProject);
      setShowNewProjectModal(false);
      router.push('/'); // Navigate to canvas
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleOpenProject = (project: any) => {
    setCurrentProject(project);
    router.push('/'); // Navigate to canvas
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface-container">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-surface-variant"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Projects</h1>
                <p className="text-muted-foreground mt-1">
                  Manage and organize your design projects
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>

            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Projects</option>
              <option value="recent">Recent</option>
              <option value="starred">Starred</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project._id} 
                project={project} 
                onOpen={() => handleOpenProject(project)}
                onDelete={() => deleteProject(project._id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProjects.map((project) => (
              <ProjectListItem 
                key={project._id} 
                project={project} 
                onOpen={() => handleOpenProject(project)}
                onDelete={() => deleteProject(project._id)}
              />
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first project to get started'}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewProjectModal(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Project
            </motion.button>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}

function ProjectCard({ project, onOpen, onDelete }: any) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-surface-container rounded-lg border border-border overflow-hidden group cursor-pointer"
      onClick={onOpen}
    >
      {/* Preview */}
      <div className="aspect-video bg-muted flex items-center justify-center">
        <div className="text-muted-foreground">
          <Grid3X3 className="w-8 h-8" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-foreground truncate">{project.title}</h3>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded hover:bg-surface-variant transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 z-10 min-w-32">
                <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-surface-variant transition-colors flex items-center space-x-2">
                  <Edit className="w-3 h-3" />
                  <span>Rename</span>
                </button>
                <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-surface-variant transition-colors flex items-center space-x-2">
                  <Copy className="w-3 h-3" />
                  <span>Duplicate</span>
                </button>
                <button className="w-full px-3 py-1.5 text-left text-sm hover:bg-surface-variant transition-colors flex items-center space-x-2">
                  <Download className="w-3 h-3" />
                  <span>Export</span>
                </button>
                <hr className="my-1 border-border" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-destructive/10 text-destructive transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {project.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {project.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(project.updatedAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{project.designJson?.elements?.length || 0} elements</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectListItem({ project, onOpen, onDelete }: any) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="bg-surface-container rounded-lg border border-border p-4 cursor-pointer hover:shadow-sm transition-shadow"
      onClick={onOpen}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div>
            <h3 className="font-medium text-foreground">{project.title}</h3>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
            )}
            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(project.updatedAt)}</span>
              </div>
              <span>{project.designJson?.elements?.length || 0} elements</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle share
            }}
            className="p-2 rounded hover:bg-surface-variant transition-colors"
          >
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 rounded hover:bg-destructive/10 text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function NewProjectModal({ isOpen, onClose, onSubmit }: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-container rounded-lg border border-border p-6 w-full max-w-md mx-4"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Create New Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Enter project name..."
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              rows={3}
              placeholder="Describe your project..."
            />
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Project
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};