import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Home, GitBranch, Workflow, Code, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: GitBranch },
    { path: '/automation', label: 'Live Demo', icon: Zap },
    { path: '/workflow', label: 'Workflow', icon: Workflow },
    { path: '/architecture', label: 'Architecture', icon: Code },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className="glass-morphism border-b border-white/10 sticky top-0 z-50" data-testid="navbar">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
              <Zap className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold tracking-tight">AGENTIC RFP</h1>
              <p className="text-xs font-mono text-muted-foreground">Automation System</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative"
                  data-testid={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-heading uppercase tracking-wider text-sm transition-all duration-300 ${
                      isActive
                        ? 'bg-primary text-primary-foreground neon-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};