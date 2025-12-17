import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Server, Globe, Zap, Database, GitBranch, Code } from 'lucide-react';

const techStack = [
  {
    icon: Server,
    category: 'Backend',
    items: ['FastAPI (Python)', 'MongoDB', 'Motor (Async Driver)', 'Pydantic Models']
  },
  {
    icon: Code,
    category: 'Frontend',
    items: ['React 19', 'Tailwind CSS', 'Framer Motion', 'React Flow', 'Recharts']
  },
  {
    icon: Zap,
    category: 'Orchestration',
    items: ['n8n-inspired workflow', 'Event-driven execution', 'Real-time state management', 'Context API']
  },
  {
    icon: Database,
    category: 'Data Layer',
    items: ['In-memory mock data', 'Async processing', 'Real-time updates', 'State persistence']
  }
];

export default function Architecture() {
  return (
    <div className="min-h-screen p-6" data-testid="architecture-page">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">System Architecture</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technical overview of the agentic RFP automation system
          </p>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-morphism border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">n8n-Inspired Pipeline</CardTitle>
              <CardDescription>Event-driven workflow orchestration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid-background rounded-xl p-8 space-y-8">
                {/* Trigger */}
                <div className="flex items-center gap-4">
                  <div className="glass-morphism rounded-lg p-4 border-green-500/50 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-green-400" />
                      <span className="font-mono text-xs text-green-400">TRIGGER</span>
                    </div>
                    <p className="font-heading font-semibold">Schedule / Manual</p>
                    <p className="text-xs text-muted-foreground mt-1">RFP Source Monitoring</p>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-green-500/50 to-cyan-500/50" />
                </div>

                {/* Agents Flow */}
                <div className="flex items-start gap-4 overflow-x-auto pb-4">
                  {[
                    { name: 'Sales Agent', color: 'cyan', desc: 'Extract RFP' },
                    { name: 'Main Agent', color: 'purple', desc: 'Validate' },
                    { name: 'Main Agent', color: 'purple', desc: 'Prepare Context' },
                    { name: 'Tech Agent', color: 'green', desc: 'Match SKU' },
                    { name: 'Pricing Agent', color: 'yellow', desc: 'Calculate Cost' },
                    { name: 'Main Agent', color: 'purple', desc: 'Assemble' }
                  ].map((agent, idx) => (
                    <React.Fragment key={idx}>
                      <div className="glass-morphism rounded-lg p-4 border-primary/30 min-w-[180px]">
                        <div className="flex items-center gap-2 mb-2">
                          <GitBranch className={`h-4 w-4 text-${agent.color}-400`} />
                          <span className="font-mono text-xs text-muted-foreground">AGENT</span>
                        </div>
                        <p className="font-heading font-semibold text-sm">{agent.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{agent.desc}</p>
                      </div>
                      {idx < 5 && (
                        <div className="flex items-center justify-center min-w-[40px]">
                          <div className="h-px w-8 bg-primary" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Output */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-green-500/50" />
                  <div className="glass-morphism rounded-lg p-4 border-green-500/50 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-green-400" />
                      <span className="font-mono text-xs text-green-400">OUTPUT</span>
                    </div>
                    <p className="font-heading font-semibold">Final Proposal</p>
                    <p className="text-xs text-muted-foreground mt-1">Ready for Submission</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <Card className="h-full hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <tech.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-heading">{tech.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tech.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-center gap-2 text-sm">
                        <span className="text-primary">•</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-morphism border-secondary/30">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Implementation Highlights</CardTitle>
              <CardDescription>What makes this demo production-ready</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-heading font-semibold text-lg text-primary">Frontend Excellence</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">Real-time workflow visualization using React Flow</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">Smooth animations with Framer Motion</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">Context-based state management</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">Responsive, cyberpunk-themed UI</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-heading font-semibold text-lg text-primary">Backend Architecture</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">RESTful API with FastAPI</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">Async/await for concurrent processing</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">Pydantic models for data validation</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">Simulated agent processing with realistic delays</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}