'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, TrendingUp, BookOpen, Info, 
  Menu, X, BookMarked, BarChart2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    href: "/", 
    label: "Dashboard", 
    icon: Home,
    description: "Overview and quick insights"
  },
  { 
    href: "/stories", 
    label: "Stories", 
    icon: BookMarked,
    description: "Deep dive analysis and comparisons"
  },
  { 
    href: "/trends", 
    label: "Analytics", 
    icon: BarChart2,
    description: "Comprehensive data and patterns"
  },
  { 
    href: "/learn", 
    label: "Learning Hub", 
    icon: BookOpen,
    description: "Educational resources and certification"
  },
  { 
    href: "/about", 
    label: "About", 
    icon: Info,
    description: "Our mission and impact"
  }
];

export function Navigation() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsExpanded(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      document.documentElement.style.setProperty('--sidebar-width', isExpanded ? '320px' : '80px');
    } else {
      document.documentElement.style.setProperty('--sidebar-width', '0px');
    }
  }, [isExpanded, isMobile]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const NavContent = () => (
    <div className="flex flex-col space-y-2 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            onClick={() => isMobile && setMobileMenuOpen(false)}
            className="block transition-transform hover:scale-102"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'nav-item relative',
                isActive && 'active before:absolute before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-[hsl(var(--accent-primary))] before:to-[hsl(var(--accent-secondary))]'
              )}
            >
              <Icon className={cn(
                'h-5 w-5',
                isActive ? 'text-white' : 'text-[hsl(var(--muted))]'
              )} />
              {(isExpanded || isMobile) && (
                <div className="flex-1">
                  <div className={cn(
                    'font-medium',
                    isActive ? 'text-white' : 'text-[hsl(var(--muted))]'
                  )}>{item.label}</div>
                  <div className="text-sm text-[hsl(var(--muted))]">{item.description}</div>
                </div>
              )}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={false}
        animate={{ 
          width: isExpanded ? '320px' : '80px',
          opacity: 1,
          x: 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={cn(
          'hidden lg:flex flex-col fixed h-screen',
          'backdrop-blur-xl bg-[hsl(var(--nav-bg))] border-r border-white/10',
          'shadow-2xl z-50 transition-all duration-300'
        )}
      >
        <div className="flex items-center p-4">
          <Link href="/" className="flex-1">
            <motion.h1 
              className="text-2xl font-bold text-gradient"
              animate={{ opacity: isExpanded ? 1 : 0 }}
            >
              UNVEIL
            </motion.h1>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleNavbar}
            className="hover:bg-white/10"
          >
            {isExpanded ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>

        <NavContent />

        <div className="mt-auto p-4">
          <Button 
            variant="outline" 
            className="w-full backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10"
          >
            {isExpanded ? 'Quick Tutorial' : '?'}
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.nav
        className={cn(
          'lg:hidden fixed top-0 left-0 right-0 z-50',
          'backdrop-blur-xl bg-[hsl(var(--nav-bg))] border-b border-white/10',
          'shadow-lg'
        )}
      >
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <h1 className="text-2xl font-bold text-gradient">
              UNVEIL
            </h1>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMobileMenu}
            className="hover:bg-white/10"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              'lg:hidden fixed inset-0 z-40',
              'backdrop-blur-xl bg-[hsl(var(--nav-bg))]',
              'pt-20'
            )}
          >
            <NavContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}