import React from 'react';
import { MenuIcon, XIcon, SearchIcon } from '../Icons';

type Page = 'simulator' | 'about' | 'contact' | 'privacy' | 'terms';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  onGoHome: () => void;
  onOpenCommandPalette: () => void;
  currentPage: Page;
  showSidebarToggle?: boolean;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const NavButton: React.FC<{ page: Page, currentPage: Page, onNavigate: (page: Page) => void, children: React.ReactNode }> = ({ page, currentPage, onNavigate, children }) => {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => onNavigate(page)}
      className={`text-sm font-medium transition-colors hover:text-text-primary ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}
    >
      {children}
       {isActive && <div className="h-0.5 bg-accent-primary mt-1"></div>}
    </button>
  );
};

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onGoHome, onOpenCommandPalette, currentPage, showSidebarToggle = false, onToggleSidebar, isSidebarOpen = false }) => {
  return (
    <header className="bg-background-secondary/80 backdrop-blur-sm border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between sticky top-0 z-50 flex-shrink-0">
      <div className="flex items-center gap-4">
        {showSidebarToggle && (
            <button 
                onClick={onToggleSidebar} 
                className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary"
                aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            >
                {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
        )}
        <button className="flex items-center justify-center cursor-pointer" onClick={onGoHome}>
            <h1 className="text-2xl font-bold text-text-primary">
            <span className="text-accent-primary">CS</span>Lab
            </h1>
        </button>
      </div>
      <nav className="hidden sm:flex gap-4 sm:gap-6">
        <NavButton page="simulator" currentPage={currentPage} onNavigate={onNavigate}>Simulator</NavButton>
        <NavButton page="about" currentPage={currentPage} onNavigate={onNavigate}>About</NavButton>
        <NavButton page="contact" currentPage={currentPage} onNavigate={onNavigate}>Contact</NavButton>
      </nav>
       <div className="flex items-center gap-2">
          <button 
            onClick={onOpenCommandPalette}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Open command palette"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
       </div>
    </header>
  );
};

export default Navbar;