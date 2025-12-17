import React from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorkflowProvider } from '@/context/WorkflowContext';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Automation from '@/pages/Automation';
import Workflow from '@/pages/Workflow';
import Architecture from '@/pages/Architecture';
import About from '@/pages/About';

function App() {
  // Force dark mode
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <WorkflowProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground dark">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/workflow" element={<Workflow />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </WorkflowProvider>
  );
}

export default App;