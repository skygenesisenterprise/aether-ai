'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  MessageSquare,
  Sparkles,
  Bot,
  History,
  Settings,
  Search,
  MoreVertical,
  ChevronDown,
  BookOpen,
  Code,
  Send,
  Loader2,
  Pencil,
  FolderOpen,
  Bookmark,
  BarChart3,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { usePlatform } from '@/context/PlatformContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Sample conversation data
const sampleConversations = [
  {
    id: '1',
    title: 'Project Architecture Review',
    messages: 42,
    lastMessage: 'Discussing microservices approach...',
    timestamp: '2 hours ago',
    model: 'gpt-4',
    isPinned: true,
    folder: 'Work',
    tags: ['architecture', 'backend'],
  },
  {
    id: '2',
    title: 'Marketing Strategy for Q4',
    messages: 18,
    lastMessage: 'Budget allocation proposal...',
    timestamp: '5 hours ago',
    model: 'gpt-4',
    isPinned: false,
    folder: 'Marketing',
    tags: ['strategy', 'q4'],
  },
  {
    id: '3',
    title: 'React Hooks Best Practices',
    messages: 89,
    lastMessage: 'Custom hooks implementation...',
    timestamp: 'Yesterday',
    model: 'gpt-4',
    isPinned: true,
    folder: 'Development',
    tags: ['react', 'frontend'],
  },
  {
    id: '4',
    title: 'Customer Support Ticket #1234',
    messages: 12,
    lastMessage: 'Resolution provided to customer...',
    timestamp: '2 days ago',
    model: 'gpt-3.5',
    isPinned: false,
    folder: 'Support',
    tags: ['support', 'urgent'],
  },
  {
    id: '5',
    title: 'Team Meeting Notes - Nov 15',
    messages: 67,
    lastMessage: 'Action items assigned...',
    timestamp: '3 days ago',
    model: 'gpt-4',
    isPinned: false,
    folder: 'Meetings',
    tags: ['meeting', 'notes'],
  },
  {
    id: '6',
    title: 'API Documentation Review',
    messages: 34,
    lastMessage: 'Finalizing OpenAPI spec...',
    timestamp: '1 week ago',
    model: 'gpt-4',
    isPinned: false,
    folder: 'Documentation',
    tags: ['api', 'documentation'],
  },
]

// Sample models
const models = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable', icon: Sparkles, version: 'Latest' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Faster & cheaper', icon: Sparkles, version: 'Preview' },
  { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective', icon: Bot, version: 'Stable' },
  { id: 'claude-3', name: 'Claude 3', description: 'Reasoning focused', icon: Bot, version: 'Latest' },
  { id: 'llama-3', name: 'Llama 3', description: 'Open source', icon: Bot, version: 'Latest' },
]

// Sample folders
const folders = [
  { name: 'Work', icon: FolderOpen, color: 'blue' },
  { name: 'Personal', icon: FolderOpen, color: 'green' },
  { name: 'Development', icon: FolderOpen, color: 'purple' },
  { name: 'Marketing', icon: FolderOpen, color: 'orange' },
  { name: 'Support', icon: FolderOpen, color: 'red' },
  { name: 'Meetings', icon: FolderOpen, color: 'cyan' },
  { name: 'Documentation', icon: FolderOpen, color: 'gray' },
]

// Quick action buttons
const quickActions = [
  { label: 'New Chat', icon: Plus, action: 'new' },
  { label: 'New Project', icon: Plus, action: 'project' },
  { label: 'New Collection', icon: FolderOpen, action: 'collection' },
  { label: 'Import', icon: FolderOpen, action: 'import' },
]

// Sample capabilities
const capabilities = [
  { title: 'Code Generation', icon: Code, description: 'Generate code in any language' },
  { title: 'Data Analysis', icon: BarChart3, description: 'Analyze and visualize data' },
  { title: 'Content Creation', icon: Pencil, description: 'Write articles, emails, and more' },
  { title: 'Language Translation', icon: BookOpen, description: 'Translate between 100+ languages' },
]

export default function PlatformHomePage() {
  const { currentUser, activeWorkspace } = usePlatform()
  const router = useRouter()
  const [selectedModel, setSelectedModel] = React.useState('gpt-4')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedFolder, setSelectedFolder] = React.useState('all')
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = React.useState(false)
  const [newChatTitle, setNewChatTitle] = React.useState('')
  const [messages, setMessages] = React.useState<{ role: 'user' | 'assistant'; content: string; timestamp: string }[]>([])
  const [inputValue, setInputValue] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  // Filter conversations based on search and folder
  const filteredConversations = sampleConversations.filter((conv) => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = selectedFolder === 'all' || conv.folder === selectedFolder
    return matchesSearch && matchesFolder
  })

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return

    setIsLoading(true)
    const userMessage = {
      role: 'user' as const,
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString(),
    }
    setMessages([...messages, userMessage])
    setInputValue('')

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant' as const,
        content: `I understand you're asking about "${inputValue.trim()}". Let me help you with that...`,
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleNewChat = () => {
    setMessages([])
    setInputValue('')
    setIsNewChatDialogOpen(false)
    setNewChatTitle('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-full w-full bg-[#1f2022] text-foreground">
      {/* Main Content Area */}
      <div className="flex h-full w-full overflow-hidden">
        
        {/* Left Sidebar - Conversations */}
        <aside className="w-[320px] border-r border-border/40 bg-[#25262b] hidden lg:flex flex-col">
          <div className="p-4 border-b border-border/40">
            <Button
              onClick={() => setIsNewChatDialogOpen(true)}
              className="w-full gap-2 bg-primary/10 hover:bg-primary/20 border-none text-primary hover:text-primary-foreground transition-colors"
            >
              <Plus className="size-4" />
              <span>New Chat</span>
            </Button>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background/50 border-none focus:ring-2 focus:ring-ring/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Folders Filter */}
          <div className="px-4 pb-2">
            <div className="flex gap-1 overflow-x-auto pb-2 -mb-2">
              <Button
                variant={selectedFolder === 'all' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedFolder('all')}
                className="h-7 px-2 text-xs"
              >
                All
              </Button>
              {folders.map((folder) => {
                const FolderIcon = folder.icon
                return (
                  <Button
                    key={folder.name}
                    variant={selectedFolder === folder.name ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedFolder(folder.name)}
                    className="h-7 px-2 text-xs gap-1"
                  >
                    <FolderIcon className="size-3" />
                    {folder.name}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1">
              {filteredConversations.map((conv, index) => (
                <button
                  key={conv.id}
                  onClick={() => router.push(`/conversations/${conv.id}`)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg hover:bg-accent/50 transition-colors flex items-center gap-3 group',
                    index === 0 && 'bg-accent/30'
                  )}
                >
                  <div className="flex flex-col items-center">
                    <Bot className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{conv.title}</p>
                      {conv.isPinned && (
                        <Bookmark className="size-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                    <div className="flex gap-1">
                      {conv.tags.slice(0, 1).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0.5 bg-muted/50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* User Info */}
          <div className="p-3 border-t border-border/40">
            {currentUser && (
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  {currentUser.avatarUrl ? (
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {currentUser.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{currentUser.displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <header className="p-4 border-b border-border/40 bg-[#25262b]/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsNewChatDialogOpen(true)}
                  className="lg:hidden"
                >
                  <Plus className="size-5" />
                </Button>
                <div className="hidden lg:flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        {(() => {
                          const selected = models.find((m) => m.id === selectedModel)
                          if (!selected) return null
                          const SelectedIcon = selected.icon
                          return <SelectedIcon className="size-4" />
                        })()}
                        <span>{models.find((m) => m.id === selectedModel)?.name || selectedModel}</span>
                        <ChevronDown className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {models.map((model) => {
                        const ModelIcon = model.icon
                        return (
                          <DropdownMenuItem
                            key={model.id}
                            onSelect={() => setSelectedModel(model.id)}
                            className="cursor-pointer"
                          >
                            <ModelIcon className="size-4 mr-2" />
                            <div className="flex flex-col">
                              <span>{model.name}</span>
                              <span className="text-xs text-muted-foreground">{model.description}</span>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <History className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Settings className="size-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto bg-[#343541] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9nPjwvc3ZnPg==')] bg-size-[100px_100px]">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="mb-6">
                  <Bot className="size-16 mx-auto text-muted-foreground/50" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Welcome to Aether AI</h1>
                <p className="text-muted-foreground max-w-md mb-6">
                  Start a conversation with AI. Ask anything, get instant answers, generate code, analyze data, and more.
                </p>
                <div className="flex gap-4 mb-8">
                  {capabilities.map((cap) => {
                    const CapIcon = cap.icon
                    return (
                      <Card
                        key={cap.title}
                        className="p-4 bg-background/50 border-border/40 hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        <CapIcon className="size-6 mb-2 text-primary" />
                        <CardTitle className="text-sm">{cap.title}</CardTitle>
                        <CardDescription className="text-xs">{cap.description}</CardDescription>
                      </Card>
                    )
                  })}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsNewChatDialogOpen(true)} className="gap-2">
                    <Plus className="size-4" />
                    New Chat
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Sparkles className="size-4" />
                    Suggest a prompt
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 space-y-6">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        'flex gap-4 max-w-[80%]',
                        message.role === 'user' ? 'ml-auto' : 'mr-auto'
                      )}
                    >
                      <Avatar className={cn(
                        'size-8 shrink-0',
                        message.role === 'user' ? 'bg-primary' : 'bg-muted'
                      )}>
                        <AvatarFallback className={cn(
                          message.role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                        )}>
                          {message.role === 'user' ? 'U' : 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        'p-4 rounded-xl',
                        message.role === 'user' 
                          ? 'bg-primary/10 text-foreground rounded-br-none'
                          : 'bg-muted/50 text-foreground rounded-bl-none'
                      )}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">{message.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 max-w-[80%] mr-auto"
                  >
                    <Avatar className="size-8 shrink-0 bg-muted">
                      <AvatarFallback className="text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <div className="flex gap-1">
                        <div className="size-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="size-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="size-2 rounded-full bg-muted-foreground/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/40 bg-[#25262b]/50 backdrop-blur-sm">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder={messages.length === 0 ? "Ask anything..." : "Type your message..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="pl-4 pr-12 py-3 bg-background/50 border-none focus:ring-2 focus:ring-ring/20 rounded-xl"
                />
                {inputValue && (
                  <button
                    onClick={() => setInputValue('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                )}
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="size-10 shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Send className="size-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Aether AI can make mistakes. Consider verifying important information.
            </p>
          </div>
        </main>

        {/* Right Sidebar - Model Info & History */}
        <aside className="w-[300px] border-l border-border/40 bg-[#25262b] hidden xl:flex flex-col">
          <div className="p-4">
            <h2 className="text-sm font-semibold mb-4">Model</h2>
            <div className="space-y-2">
              {models.map((model) => {
                const ModelIcon = model.icon
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={cn(
                      'w-full p-3 rounded-lg text-left transition-colors flex items-center gap-3 hover:bg-accent/50',
                      selectedModel === model.id && 'bg-accent/30'
                    )}
                  >
                    <ModelIcon className="size-5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </div>
                    {selectedModel === model.id && (
                      <div className="size-2 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <Separator className="mx-4" />

          <div className="p-4">
            <h2 className="text-sm font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {sampleConversations.slice(0, 4).map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => router.push(`/conversations/${conv.id}`)}
                  className="w-full text-left p-2 rounded-lg hover:bg-accent/50 transition-colors flex items-center gap-3"
                >
                  <MessageSquare className="size-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator className="mx-4" />

          <div className="p-4">
            <h2 className="text-sm font-semibold mb-4">Capabilities</h2>
            <div className="grid grid-cols-2 gap-2">
              {capabilities.map((cap) => {
                const CapIcon = cap.icon
                return (
                  <Tooltip key={cap.title}>
                    <TooltipTrigger asChild>
                      <button className="p-2 rounded-lg hover:bg-accent/50 transition-colors flex flex-col items-center gap-1">
                        <CapIcon className="size-4" />
                        <span className="text-xs">{cap.title}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-sm">{cap.description}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        </aside>

        {/* New Chat Dialog */}
        <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Chat</DialogTitle>
              <DialogDescription>
                Start a new conversation with AI
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Chat Title (Optional)</label>
                <Input
                  type="text"
                  placeholder="Give your chat a name..."
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Model</label>
                <div className="grid grid-cols-2 gap-2">
                  {models.slice(0, 4).map((model) => {
                    const ModelIcon = model.icon
                    return (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={cn(
                          'p-3 rounded-lg border transition-colors flex flex-col items-center gap-2 hover:bg-accent/50',
                          selectedModel === model.id ? 'border-primary bg-accent/30' : 'border-border/40'
                        )}
                      >
                        <ModelIcon className="size-5" />
                        <span className="text-sm">{model.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setIsNewChatDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleNewChat}>
                Start Chat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
