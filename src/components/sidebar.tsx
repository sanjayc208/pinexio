'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import clsx from 'clsx';
import { cn } from '@/lib/utils';

type SidebarContextType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  side: 'left' | 'right';
  isMobile: boolean;
  maxWidth: number;
  toggleSidebar: () => void;
  showIconsOnCollapse: boolean;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
}

interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  defaultSide?: 'left' | 'right';
  defaultMaxWidth?: number;
  showIconsOnCollapse?: boolean;
  mobileView?: boolean;
}

export function SidebarProvider({
  defaultOpen = true,
  defaultSide = 'left',
  defaultMaxWidth = 280,
  showIconsOnCollapse = true,
  mobileView = true,
  ...props
}: SidebarProviderProps) {
  const useMobile = useIsMobile();

  const isMobile = mobileView ? useMobile : false;

  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [side] = React.useState<'left' | 'right'>(defaultSide);
  const [maxWidth] = React.useState(defaultMaxWidth);

  const toggleSidebar = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Add keyboard shortcut (Ctrl+B) to toggle sidebar
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const contextValue = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      side,
      isMobile,
      maxWidth,
      toggleSidebar,
      showIconsOnCollapse,
    }),
    [
      isOpen,
      setIsOpen,
      side,
      isMobile,
      maxWidth,
      toggleSidebar,
      showIconsOnCollapse,
    ]
  );

  return <SidebarContext.Provider value={contextValue} {...props} />;
}

// For enabling multiple sidebars in a layout
export function SidebarLayout({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex min-h-screen w-full', className)} {...props} />
  );
}

// Component for main content between sidebars
export function MainContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col h-screen overflow-auto w-full', className)}
      {...props}
    />
  );
}

export function Sidebar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { isOpen, side, isMobile, maxWidth, setIsOpen, showIconsOnCollapse } =
    useSidebar();

  // For mobile: use a fixed overlay when sidebar is open
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
        <aside
          className={cn(
            `
            fixed top-0 bottom-0 z-50 flex flex-col
            ${side === 'left' ? 'left-0' : 'right-0'}
            ${isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'}
            w-[85vw] max-w-[300px] bg-white dark:bg-gray-900 
            ${side === 'left' ? 'border-r' : 'border-l'} border-border
            transition-transform duration-300 ease-in-out
          `,
            className
          )}
          style={{ maxWidth: `${maxWidth}px` }}
          {...props}
        >
          {children}
        </aside>
      </>
    );
  }

  // For desktop: use a fixed sidebar with smooth width transition
  return (
    <aside
      className={clsx(
        `
        sticky top-0 bottom-0 z-0 flex flex-col h-screen
        ${side === 'left' ? 'left-0 border-r' : 'right-0 border-l'} border-border
        transition-all duration-300 ease-in-out bg-sidebar overflow-hidden
      `,
        className
      )}
      style={{
        width: isOpen ? `${maxWidth}px` : showIconsOnCollapse ? '4rem' : '0px',
        minWidth: showIconsOnCollapse ? '4rem' : '0',
        pointerEvents: !isOpen && !showIconsOnCollapse ? 'none' : undefined,
        userSelect: !isOpen && !showIconsOnCollapse ? 'none' : undefined,
      }}
      {...props}
    >
      {/* Always render children, let sidebar width handle the animation */}
      {children}
    </aside>
  );
}

export function SidebarHeader({
  icon,
  label,
  className,
  children,
  ...props
}: {
  icon?: React.ReactNode;
  label?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen, showIconsOnCollapse } = useSidebar();
  let iconNode = icon;
  let labelNode = label;
  if (!icon && !label && children) {
    const childrenArray = React.Children.toArray(children);
    iconNode = childrenArray[0];
    labelNode = childrenArray.slice(1);
  }
  // Only animate label if showIconsOnCollapse is true
  const labelClass = showIconsOnCollapse
    ? 'transition-all duration-300 overflow-hidden whitespace-nowrap' +
      (isOpen
        ? ' opacity-100 ml-2 w-auto translate-x-0'
        : ' opacity-0 ml-0 w-0 -translate-x-4')
    : 'ml-2 w-auto';
  return (
    <div
      className={cn(
        'flex items-center h-16 gap-2 border-b border-border transition-all duration-300 p-3',
        className
      )}
      {...props}
    >
      {iconNode && <span className="flex-shrink-0">{iconNode}</span>}
      <span
        className={labelClass}
        style={showIconsOnCollapse ? { maxWidth: isOpen ? 200 : 0 } : undefined}
      >
        {labelNode}
      </span>
    </div>
  );
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // const { showIconsOnCollapse } = useSidebar();
  // Always render content, let sidebar width handle the animation if showIconsOnCollapse is false
  return (
    <div
      className={cn('flex-1 overflow-auto px-3 py-2', className)}
      {...props}
    />
  );
}

export function SidebarFooter({
  icon,
  label,
  className,
  children,
  ...props
}: {
  icon?: React.ReactNode;
  label?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen, showIconsOnCollapse } = useSidebar();
  let iconNode = icon;
  let labelNode = label;
  if (!icon && !label && children) {
    const childrenArray = React.Children.toArray(children);
    iconNode = childrenArray[0];
    labelNode = childrenArray.slice(1);
  }
  // Only animate label if showIconsOnCollapse is true
  const labelClass = showIconsOnCollapse
    ? 'transition-all duration-300 overflow-hidden whitespace-nowrap' +
      (isOpen
        ? ' opacity-100 ml-2 w-auto translate-x-0'
        : ' opacity-0 ml-0 w-0 -translate-x-4')
    : 'ml-2 w-auto';
  return (
    <div
      className={cn(
        'flex items-center h-16 gap-2 border-t border-border transition-all duration-300 p-3',
        className
      )}
      {...props}
    >
      {iconNode && <span className="flex-shrink-0">{iconNode}</span>}
      <span
        className={labelClass}
        style={showIconsOnCollapse ? { maxWidth: isOpen ? 200 : 0 } : undefined}
      >
        {labelNode}
      </span>
    </div>
  );
}

export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen, showIconsOnCollapse } = useSidebar();
  return isOpen || showIconsOnCollapse ? (
    <nav className={cn('space-y-1 px-2', className)} {...props} />
  ) : null;
}

interface SidebarMenuItemProps {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  children?: React.ReactNode;
  isActive?: boolean;
  defaultOpen?: boolean;
  alwaysOpen?: boolean;
  isCollapsable?: boolean;
}

export function SidebarMenuItem({
  icon,
  label,
  href,
  children,
  isActive: propIsActive,
  defaultOpen = false,
  alwaysOpen = false,
  isCollapsable = false,
}: SidebarMenuItemProps) {
  const { isOpen, isMobile, setIsOpen, showIconsOnCollapse } = useSidebar();
  const [isExpanded, setIsExpanded] = React.useState(defaultOpen || alwaysOpen);
  const pathname = usePathname();
  const isActive =
    propIsActive !== undefined
      ? propIsActive
      : href
        ? pathname === href || pathname.startsWith(href)
        : false;
  React.useEffect(() => {
    if (alwaysOpen) {
      setIsExpanded(true);
    }
  }, [alwaysOpen]);
  const handleClick = (e: React.MouseEvent) => {
    if (children && !href && !alwaysOpen) {
      e.preventDefault();
      setIsExpanded((prev) => !prev);
    }
    if (isMobile && href) {
      setIsOpen(false);
    }
  };
  // Only animate label if showIconsOnCollapse is true
  const labelClass = showIconsOnCollapse
    ? 'transition-all duration-300 overflow-hidden whitespace-nowrap' +
      (isOpen
        ? ' opacity-100 ml-3 w-auto translate-x-0'
        : ' opacity-0 ml-0 w-0 -translate-x-4')
    : 'ml-3 w-auto';
  // For sublist: always render, let sidebar width handle the animation if showIconsOnCollapse is false
  const sublistClass = showIconsOnCollapse
    ? 'ml-6 mt-1 pl-3 border-l border-border space-y-1 transition-all duration-300' +
      (isOpen ? ' opacity-100 max-h-[1000px]' : ' opacity-0 max-h-0')
    : 'ml-6 mt-1 pl-3 border-l border-border space-y-1';
  const content = (
    <>
      <div className="flex items-center">
        {icon && (
          <span
            className={`${isActive ? 'font-medium' : 'text-gray-500 dark:text-gray-400'} flex-shrink-0`}
          >
            {icon}
          </span>
        )}
        <span
          className={labelClass}
          style={
            showIconsOnCollapse ? { maxWidth: isOpen ? 200 : 0 } : undefined
          }
        >
          {label}
        </span>
      </div>
      {/* Chevron for collapsable menus */}
      {children && !alwaysOpen && isCollapsable && (
        <span
          className={
            'transition-all duration-300 ml-auto' +
            (isOpen ? ' opacity-100' : ' opacity-0')
          }
        >
          {isOpen && (
            <ChevronRight
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
        </span>
      )}
    </>
  );
  return (
    <div>
      {href ? (
        <Link
          href={href}
          className={
            `flex items-center justify-between w-full p-2 rounded-md transition-colors duration-200 ` +
            (isActive
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-accent text-gray-700 dark:text-gray-300') +
            (!isOpen && showIconsOnCollapse ? ' justify-center' : '')
          }
          onClick={handleClick}
        >
          {content}
        </Link>
      ) : (
        <button
          className={
            `flex items-center justify-between w-full p-2 rounded-md transition-colors duration-200 ` +
            (isActive
              ? 'bg-sidebar text-blue-500'
              : 'hover:bg-accent text-gray-700 dark:text-gray-300') +
            (!isOpen && showIconsOnCollapse ? ' justify-center' : '')
          }
          onClick={handleClick}
        >
          {content}
        </button>
      )}
      {/* Always render sublist, let sidebar width handle the animation if showIconsOnCollapse is false */}
      {(isOpen && (isExpanded || alwaysOpen) && children) ||
      (!showIconsOnCollapse && (isExpanded || alwaysOpen) && children) ? (
        <div className={sublistClass}>{children}</div>
      ) : null}
    </div>
  );
}

export function NestedLink({
  children,
  href = '#',
  isActive: propIsActive,
}: {
  children: React.ReactNode;
  href?: string;
  isActive?: boolean;
}) {
  const pathname = usePathname();
  const { isMobile, setIsOpen } = useSidebar();

  // Determine if this link is active based on the current path
  const isActive =
    propIsActive !== undefined
      ? propIsActive
      : pathname === href || pathname.startsWith(href);
  const handleClick = () => {
    // Close the sidebar if in mobile view when a link is clicked
    if (isMobile && href) {
      setIsOpen(false); // Close the sidebar
    }
  };
  return (
    <Link
      href={href}
      className={`
        block py-1 px-2 rounded-md text-sm
        ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}
      `}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

export function SidebarTrigger() {
  const { toggleSidebar, side, isOpen } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle sidebar"
    >
      {isOpen ? (
        side === 'left' ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </button>
  );
}

export function SidebarHeaderLogo({
  logo,
  className,
}: {
  logo?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'h-10 w-10 flex items-center justify-center truncate',
        className
      )}
    >
      {logo}
    </div>
  );
}

export function SidebarHeaderTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadElement>) {
  return (
    <h1
      className={cn(
        'text-3xl font-stretch-110% -tracking-tighter text-black dark:text-white truncate',
        className
      )}
      {...props}
    />
  );
}

export function UserAvatar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'h-8 w-8 rounded-full flex items-center justify-center',
        className
      )}
      {...props}
    />
  );
}
