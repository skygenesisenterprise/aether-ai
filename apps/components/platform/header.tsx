'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  Plus,
  Users,
  Settings,
  HelpCircle,
  X,
  User,
  MessageSquare,
  BarChart3,
  Sparkles,
  Command,
  Bot,
  LayoutDashboard,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { usePlatform } from '@/context/PlatformContext'
import { useSidebar } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

// Notification types
interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  time: string
  avatar?: string
}

// Sample notifications for demo
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'New user registered',
    message: 'John Doe has joined your workspace',
    type: 'info',
    read: false,
    time: '2 min ago',
    avatar: 'JD',
  },
  {
    id: '2',
    title: 'Billing alert',
    message: 'Your subscription will expire in 3 days',
    type: 'warning',
    read: false,
    time: '1 hour ago',
  },
  {
    id: '3',
    title: 'System update',
    message: 'New features are now available',
    type: 'success',
    read: true,
    time: '3 hours ago',
  },
]

// Quick create menu items
const createMenuItems = [
  {
    label: 'New Chat',
    icon: MessageSquare,
    description: 'Start a new conversation',
    href: '/new-chat',
    shortcut: 'N',
  },
  {
    label: 'New Project',
    icon: BarChart3,
    description: 'Create a new project',
    href: '/projects/new',
    shortcut: 'P',
  },
  {
    label: 'New User',
    icon: User,
    description: 'Invite a new user',
    href: '/users/new',
    shortcut: 'U',
  },
  {
    label: 'New Workspace',
    icon: LayoutDashboard,
    description: 'Create a new workspace',
    href: '/workspaces/new',
    shortcut: 'W',
  },
]

// User menu items
const userMenuItems = [
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Billing', href: '/settings/billing', icon: BarChart3 },
  { label: 'Help & Support', href: '/help', icon: HelpCircle },
]

// Mobile navigation items
const mobileNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/projects', icon: BarChart3 },
  { label: 'Conversations', href: '/conversations', icon: MessageSquare },
  { label: 'Applications', href: '/applications', icon: Bot },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
]

interface HeaderProps {
  className?: string
}

function NotificationsPopover() {
  const [notifications, setNotifications] = React.useState<Notification[]>(sampleNotifications)
  const [open, setOpen] = React.useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 hover:bg-accent/50 transition-colors"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end" sideOffset={16}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  markAllAsRead()
                }}
                className="text-sm h-6 px-2"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={cn(
                'w-full p-4 text-left hover:bg-accent/50 transition-colors border-b last:border-0',
                !notification.read && 'bg-accent/30'
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar className="size-8">
                  <AvatarFallback
                    className={cn(
                      'text-xs font-medium',
                      notification.type === 'info' && 'bg-blue-100 text-blue-600',
                      notification.type === 'warning' && 'bg-amber-100 text-amber-600',
                      notification.type === 'error' && 'bg-red-100 text-red-600',
                      notification.type === 'success' && 'bg-green-100 text-green-600'
                    )}
                  >
                    {notification.avatar || notification.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {!notification.read && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="p-3 border-t">
          <Link
            href="/notifications"
            className="text-sm text-primary hover:underline"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CreateMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const handleCreate = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Plus className="size-4" />
          <span className="hidden md:inline">Create</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start" sideOffset={8}>
        <DropdownMenuLabel className="text-sm font-medium">
          What would you like to create?
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {createMenuItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onSelect={() => handleCreate(item.href)}
            className="cursor-pointer p-3"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="size-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              {item.shortcut && (
                <DropdownMenuShortcut>⌘{item.shortcut}</DropdownMenuShortcut>
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/templates" className="cursor-pointer">
            <Sparkles className="size-4 mr-2" />
            <span>Browse templates</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserMenu() {
  const { currentUser, activeWorkspace } = usePlatform()
  const router = useRouter()

  if (!currentUser) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Sign In</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 p-1 hover:bg-accent/50 transition-colors"
        >
          <Avatar className="size-8">
            {currentUser.avatarUrl ? (
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="hidden md:flex flex-col text-left">
            <p className="text-sm font-medium">{currentUser.displayName}</p>
            <p className="text-xs text-muted-foreground">{activeWorkspace?.name}</p>
          </div>
          <ChevronDown className="size-4 hidden md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-0">
          <div className="p-3 border-b">
            <p className="text-sm font-medium">{currentUser.displayName}</p>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
          </div>
        </DropdownMenuLabel>
        
        {activeWorkspace && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-1.5 text-xs text-muted-foreground uppercase tracking-wider">
                Active Workspace
              </DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer">
                <LayoutDashboard className="size-4 mr-2" />
                <span className="truncate">{activeWorkspace.name}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-1.5 text-xs text-muted-foreground uppercase tracking-wider">
            Account
          </DropdownMenuLabel>
          {userMenuItems.map((item) => (
            <DropdownMenuItem key={item.label} asChild className="cursor-pointer">
              <Link href={item.href}>
                <item.icon className="size-4 mr-2" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onSelect={() => router.push('/logout')}
        >
          <X className="size-4 mr-2" />
          <span>Sign Out</span>
          <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileSidebar() {
  const { toggleSidebar } = useSidebar()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex h-full flex-col">
          <div className="p-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <Bot className="size-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Aether AI</span>
            </Link>
          </div>
          <div className="p-3">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-1 p-2">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/50 transition-colors"
                >
                  <item.icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="p-3 border-t">
            <UserMenu />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function SearchBar() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Don't show search on certain pages
  const hideSearch = pathname?.startsWith('/calls/room')

  if (hideSearch) {
    return null
  }

  return (
    <form onSubmit={handleSearch} className="relative flex-1 md:flex-none md:w-64">
      <div
        className={cn(
          'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none',
          isFocused && 'text-primary'
        )}
      >
        <Search className="size-4 transition-colors" />
      </div>
      <Input
        type="search"
        placeholder={isFocused ? 'Type to search...' : 'Search'}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'w-full md:w-64 pl-10 pr-10 py-2 bg-background/80 backdrop-blur-sm border-none focus:ring-2 focus:ring-ring/20 transition-all',
          isFocused && 'ring-2 ring-ring/20'
        )}
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      )}
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hidden md:block"
      >
        <Command className="size-4" />
      </button>
    </form>
  )
}

function BreadcrumbNavigation() {
  const pathname = usePathname()
  const { activeWorkspace } = usePlatform()

  // Simple breadcrumb logic - can be enhanced
  const pathSegments = pathname?.split('/').filter(Boolean) || []

  if (pathname === '/dashboard' || pathSegments.length === 0) {
    return null
  }

  return (
    <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
      {activeWorkspace && (
        <>
          <span className="font-medium text-foreground">{activeWorkspace.name}</span>
          <span>/</span>
        </>
      )}
      {pathSegments.map((segment, index) => {
        const displayName = segment
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase())
        const isLast = index === pathSegments.length - 1

        return (
          <React.Fragment key={index}>
            {index > 0 && <span>/</span>}
            {isLast ? (
              <span className="font-medium text-foreground">{displayName}</span>
            ) : (
              <Link
                href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                className="hover:text-foreground transition-colors"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export function AdminHeader({ className }: HeaderProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const { activeWorkspace } = usePlatform()

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-background/80 backdrop-blur-lg border-b border-border/40 transition-all duration-300',
        isCollapsed ? 'left-0 md:left-[72px]' : 'left-0 md:left-[280px]',
        className
      )}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <MobileSidebar />
          
          {/* Sidebar toggle for desktop */}
          <button
            onClick={() => useSidebar().toggleSidebar()}
            className="hidden md:flex items-center justify-center size-9 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <Menu className="size-5" />
          </button>

          {/* Breadcrumb */}
          <BreadcrumbNavigation />
        </div>

        {/* Center - Search */}
        <div className="flex-1 mx-4">
          <SearchBar />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Create button */}
          <CreateMenu />

          {/* Notifications */}
          <NotificationsPopover />

          {/* Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 hover:bg-accent/50 transition-colors hidden md:flex"
                asChild
              >
                <Link href="/help">
                  <HelpCircle className="size-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span className="text-sm">Help & Support</span>
            </TooltipContent>
          </Tooltip>

          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
