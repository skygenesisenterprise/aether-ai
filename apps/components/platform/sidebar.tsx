'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Settings,
  FileText,
  MessageSquare,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Code,
  Bot,
  Plug,
  LayoutDashboard,
  Folder,
  History,
  UserPlus,
  Grid3X3,
  Bell,
  Kanban,
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
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

// Navigation items configuration matching apps/app/(platform)/ structure
const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: false,
    items: [],
  },
  {
    title: 'Workspaces',
    href: '/workspaces',
    icon: Folder,
    badge: false,
    items: [],
  },
  {
    title: 'Applications',
    href: '/applications',
    icon: Grid3X3,
    badge: false,
    items: [],
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: Kanban,
    badge: false,
    items: [],
  },
  {
    title: 'Conversations',
    href: '/conversations',
    icon: MessageSquare,
    badge: true,
    badgeCount: 3,
    items: [],
  },
  {
    title: 'Integrations',
    href: '/integrations',
    icon: Plug,
    badge: false,
    items: [],
  },
  {
    title: 'Users & Teams',
    href: '/users',
    icon: Users,
    badge: false,
    items: [
      { title: 'All Users', href: '/users' },
      { title: 'Teams', href: '/teams' },
      { title: 'Invitations', href: '/users/invitations' },
    ],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    badge: false,
    items: [
      { title: 'General', href: '/settings/general' },
      { title: 'Billing', href: '/settings/billing' },
      { title: 'Security', href: '/settings/security' },
      { title: 'Notifications', href: '/settings/notifications' },
      { title: 'API Keys', href: '/settings/api-keys' },
      { title: 'SSO', href: '/settings/sso' },
    ],
  },
  {
    title: 'Audit Logs',
    href: '/audit-logs',
    icon: History,
    badge: false,
    items: [],
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
    badge: true,
    badgeCount: 5,
    items: [],
  },
]

// Bottom navigation items
const bottomNavItems = [
  {
    title: 'Documentation',
    href: '/docs',
    icon: FileText,
  },
  {
    title: 'API Reference',
    href: '/api',
    icon: Code,
  },
  {
    title: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
  },
]

// Quick actions
const quickActions = [
  { label: 'New Chat', icon: Plus, action: '/new-chat' },
  { label: 'New Project', icon: Plus, action: '/projects/new' },
  { label: 'New User', icon: UserPlus, action: '/users/new' },
  { label: 'New Integration', icon: Plug, action: '/integrations/new' },
]

interface SidebarProps {
  className?: string
}

interface NavSubItem {
  title: string
  href: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: boolean
  badgeCount?: number
  items?: NavSubItem[]
}

interface NavGroupProps {
  items: NavItem[]
  title?: string
  showTitle?: boolean
}

function NavGroup({ items, title, showTitle = true }: NavGroupProps) {
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className="space-y-1">
      {showTitle && !isCollapsed && (
        <p className="px-3 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
          {title}
        </p>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const hasSubItems = item.items && item.items.length > 0
        const [isExpanded, setIsExpanded] = React.useState(
          isActive || (hasSubItems && item.items!.some((sub) => pathname.startsWith(sub.href)))
        )

        return (
          <React.Fragment key={item.title}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <button
                    onClick={() => {
                      if (hasSubItems) {
                        setIsExpanded(!isExpanded)
                      }
                    }}
                    className={cn(
                      'flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                      hasSubItems && 'cursor-pointer',
                      isCollapsed && 'justify-center px-2'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'size-5 shrink-0',
                        isActive ? 'text-accent-foreground' : 'text-muted-foreground'
                      )}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={isActive ? 'default' : 'secondary'}
                            className={cn(
                              'px-2 py-0.5 text-xs',
                              isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                            )}
                          >
                            {item.badgeCount || ''}
                          </Badge>
                        )}
                        {hasSubItems && (
                          <ChevronRight
                            className={cn(
                              'size-4 shrink-0 transition-transform duration-200',
                              isExpanded && 'rotate-90'
                            )}
                          />
                        )}
                      </>
                    )}
                    {isCollapsed && item.badge && item.badgeCount && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                </div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" align="center" sideOffset={8}>
                  <span className="text-sm">{item.title}</span>
                </TooltipContent>
              )}
            </Tooltip>

            {/* Submenu items */}
            {hasSubItems && isExpanded && !isCollapsed && (
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-6 space-y-1 py-1">
                      {item.items?.map((subItem) => {
                        if (!subItem) return null
                        const isSubActive = pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                        return (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className={cn(
                              'flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent/30',
                              isSubActive
                                ? 'bg-accent/50 text-foreground font-medium'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <div className="size-1.5 rounded-full bg-current opacity-60" />
                            <span className="truncate">{subItem.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function SidebarUserProfile() {
  const { currentUser, workspaces, activeWorkspace } = usePlatform()
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === 'collapsed'

  if (!currentUser) {
    return null
  }

  return (
    <div className="p-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-3 w-full rounded-lg p-2 hover:bg-accent/50 transition-colors',
              isCollapsed && 'justify-center'
            )}
          >
            <Avatar className="size-10">
              {currentUser.avatarUrl ? (
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col text-left min-w-0">
                <p className="text-sm font-medium truncate">{currentUser.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start" sideOffset={12}>
          <div className="p-2">
            <p className="text-sm font-medium">{currentUser.displayName}</p>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
          </div>
          <DropdownMenuSeparator />
          {activeWorkspace && (
            <>
              <div className="p-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Workspace</p>
                <p className="text-sm font-medium">{activeWorkspace.name}</p>
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings/billing">Billing</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function SidebarWorkspaceSelector() {
  const { workspaces, activeWorkspace, setActiveWorkspaceId } = usePlatform()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  if (workspaces.length <= 1 || isCollapsed) {
    return null
  }

  return (
    <div className="p-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-2 w-full rounded-lg p-2 bg-accent/50 hover:bg-accent transition-colors text-left'
            )}
          >
            <Folder className="size-4 shrink-0" />
            <span className="text-sm font-medium truncate">{activeWorkspace?.name || 'Select Workspace'}</span>
            <ChevronDown className="size-4 shrink-0 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start" sideOffset={8}>
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onSelect={() => setActiveWorkspaceId(workspace.id)}
              className="cursor-pointer"
            >
              <Folder className="size-4 mr-2" />
              <span className="truncate">{workspace.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function SidebarSearch() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const [searchQuery, setSearchQuery] = React.useState('')

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-accent/50 transition-colors">
            <Search className="size-5 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <span className="text-sm">Search</span>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div className="px-3 pb-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 bg-background/50 border-none focus:ring-2 focus:ring-ring"
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
  )
}

function SidebarQuickActions() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  if (isCollapsed) {
    return null
  }

  return (
    <div className="px-3 py-2">
      <p className="px-1 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
        Quick Actions
      </p>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action) => (
          <Tooltip key={action.label}>
            <TooltipTrigger asChild>
              <Link
                href={action.action}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <action.icon className="size-4 text-primary" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            </TooltipTrigger>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

function SidebarToggle() {
  const { toggleSidebar, state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-accent/50 transition-colors absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          {isCollapsed ? (
            <ChevronRight className="size-5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="size-5 text-muted-foreground" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <span className="text-sm">{isCollapsed ? 'Expand' : 'Collapse'}</span>
      </TooltipContent>
    </Tooltip>
  )
}

export function AdminSidebar({ className }: SidebarProps) {
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full bg-sidebar border-r border-border/40 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-[72px]' : 'w-[280px]',
          isMobile && 'hidden',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-border/40">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Bot className="size-5 text-primary-foreground" />
              </div>
              {!isCollapsed && (
                <span className="text-lg font-bold text-foreground">Aether AI</span>
              )}
            </Link>
          </div>

          {/* Search */}
          <SidebarSearch />

          {/* Workspace Selector */}
          <SidebarWorkspaceSelector />

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6 py-4">
              <NavGroup items={navItems.slice(0, 5)} title="Main" showTitle={!isCollapsed} />
              <Separator className={cn('mx-3', isCollapsed && 'mx-auto w-8')} />
              <NavGroup items={navItems.slice(5)} title="Admin" showTitle={!isCollapsed} />
            </div>
          </div>

          {/* Quick Actions */}
          <SidebarQuickActions />

          {/* Bottom Navigation */}
          <div className="border-t border-border/40 pt-4">
            <NavGroup items={bottomNavItems} showTitle={false} />
          </div>

          {/* User Profile */}
          <div className="border-t border-border/40">
            <SidebarUserProfile />
          </div>

          {/* Toggle Button */}
          <SidebarToggle />
        </div>
      </aside>
    </TooltipProvider>
  )
}

export default AdminSidebar
