'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Code, 
  Eye, 
  Bot, 
  FolderOpen, 
  FileText,
  Image,
  Type,
  Square,
  Circle,
  Triangle,
  Palette,
  Layers,
  Grid3X3,
  Home,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Settings,
  User,
  LogOut,
  Plus
} from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';
import Link from 'next/link';
import { Avatar } from '@/components/avatar';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown';
import {
  Sidebar as SidebarContainer,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar';

const sidebarItems = [
  { id: 'canvas', label: 'Canvas', icon: Layout, description: 'Visual design editor' },
  { id: 'code', label: 'Code', icon: Code, description: 'Code editor' },
  { id: 'preview', label: 'Preview', icon: Eye, description: 'Live preview' },
  { id: 'ai', label: 'AI Assistant', icon: Bot, description: 'AI-powered help' },
];

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard', description: 'Project overview' },
  { id: 'workspace', label: 'Designer Studio', icon: Layout, href: '/', description: 'Design editor' },
  { id: 'billing', label: 'My Subscription', icon: CreditCard, href: '/billing', description: 'Subscription & management' },
  { id: 'contact', label: 'Contact Sales', icon: User, href: '/contact', description: 'Get in touch with our team' },
];

const designElements = [
  { id: 'text', label: 'Text', icon: Type, description: 'Add text element' },
  { id: 'image', label: 'Image', icon: Image, description: 'Add image element' },
  { id: 'button', label: 'Button', icon: Square, description: 'Add button element' },
  { id: 'container', label: 'Container', icon: Square, description: 'Add container' },
  { id: 'circle', label: 'Circle', icon: Circle, description: 'Add circle shape' },
  { id: 'triangle', label: 'Triangle', icon: Triangle, description: 'Add triangle shape' },
];

export default function Sidebar() {
  const { 
    activePanel, 
    setActivePanel, 
    sidebarCollapsed, 
    addElement,
    projects 
  } = useDesignStore();

  const handleAddElement = (type: string) => {
    const elementData = {
      type: type as any,
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 150,
      height: type === 'text' ? 50 : 100,
      content: type === 'text' ? 'New Text' : undefined,
      styles: {
        backgroundColor: type === 'button' ? '#3b82f6' : 'transparent',
        color: type === 'text' ? '#1f2937' : '#ffffff',
        fontSize: type === 'text' ? 16 : undefined,
        borderRadius: type === 'button' ? 8 : 0,
        padding: 12,
      },
    };
    addElement(elementData);
  };

  return (
    <AnimatePresence>
      {!sidebarCollapsed && (
        <motion.div
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-72"
        >
          <SidebarContainer>
            <SidebarHeader>
              <Dropdown>
                <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                  <Avatar src="/logo.svg" />
                  <SidebarLabel>Open Design</SidebarLabel>
                  <ChevronDown className="h-4 w-4 ml-auto" />
                </DropdownButton>
                <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                  <DropdownItem href="/settings">
                    <Settings className="h-4 w-4" />
                    <DropdownLabel>Settings</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="/">
                    <Avatar slot="icon" src="/logo.svg" />
                    <DropdownLabel>Open Design</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="/new-workspace">
                    <Plus className="h-4 w-4" />
                    <DropdownLabel>New workspace&hellip;</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              
              <SidebarSection className="max-lg:hidden">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarItem key={item.id} href={item.href}>
                      <Icon className="h-5 w-5" />
                      <SidebarLabel>{item.label}</SidebarLabel>
                    </SidebarItem>
                  );
                })}
              </SidebarSection>
            </SidebarHeader>

            <SidebarBody>
              <SidebarSection>
                <SidebarHeading>Designer Studio</SidebarHeading>
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarItem
                      key={item.id}
                      onClick={() => setActivePanel(item.id as any)}
                      className={activePanel === item.id ? 'bg-primary text-primary-foreground' : ''}
                    >
                      <Icon className="h-5 w-5" />
                      <SidebarLabel>{item.label}</SidebarLabel>
                    </SidebarItem>
                  );
                })}
              </SidebarSection>

              <SidebarSection>
                <SidebarHeading>Canvas Controls</SidebarHeading>
                <SidebarItem onClick={() => setActivePanel('canvas')}>
                  <Layers className="h-5 w-5" />
                  <SidebarLabel>Layers</SidebarLabel>
                </SidebarItem>
                <SidebarItem onClick={() => setActivePanel('canvas')}>
                  <Grid3X3 className="h-5 w-5" />
                  <SidebarLabel>Grid & Guides</SidebarLabel>
                </SidebarItem>
              </SidebarSection>

              <SidebarSection>
                <SidebarHeading>Essential Elements</SidebarHeading>
                <div className="grid grid-cols-2 gap-2 px-3">
                  {designElements.slice(0, 4).map((element) => {
                    const Icon = element.icon;
                    return (
                      <motion.button
                        key={element.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddElement(element.id)}
                        className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all group"
                      >
                        <Icon className="w-5 h-5 text-white/90 mb-1" />
                        <div className="text-xs font-medium text-white/90">
                          {element.label}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </SidebarSection>

              <SidebarSection className="max-lg:hidden">
                <SidebarHeading>Recent Projects</SidebarHeading>
                {projects.slice(0, 4).map((project) => (
                  <SidebarItem key={project._id}>
                    <FileText className="h-4 w-4" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{project.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </SidebarItem>
                ))}
              </SidebarSection>

              <SidebarSpacer />

              <SidebarSection>
                <SidebarItem href="/contact">
                  <Bot className="h-5 w-5" />
                  <SidebarLabel>Support & Contact</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="/signup">
                  <User className="h-5 w-5" />
                  <SidebarLabel>Account Settings</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarBody>

            <SidebarFooter className="max-lg:hidden">
              <Dropdown>
                <DropdownButton as={SidebarItem}>
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar src="/profile-photo.jpg" className="size-10" square alt="" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm/5 font-medium text-foreground">
                        John Doe
                      </span>
                      <span className="block truncate text-xs/5 font-normal text-muted-foreground">
                        john@opendesign.com
                      </span>
                    </span>
                  </span>
                  <ChevronUp className="h-4 w-4 ml-auto" />
                </DropdownButton>
                <DropdownMenu className="min-w-64" anchor="top start">
                  <DropdownItem href="/my-profile">
                    <User className="h-4 w-4" />
                    <DropdownLabel>My profile</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem href="/settings">
                    <Settings className="h-4 w-4" />
                    <DropdownLabel>Settings</DropdownLabel>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem href="/logout">
                    <LogOut className="h-4 w-4" />
                    <DropdownLabel>Sign out</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </SidebarFooter>
          </SidebarContainer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

