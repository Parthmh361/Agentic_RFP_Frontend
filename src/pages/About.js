import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Award, Target, Users, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen p-6" data-testid="about-page">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">About This Project</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built as a hackathon demonstration of agentic AI workflows
          </p>
        </motion.div>

        {/* Project Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-morphism border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Project Context</CardTitle>
              <CardDescription>Why this project was built</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                This application was developed to demonstrate how AI agents can be orchestrated through n8n-style
                workflows to automate complex business processes. The RFP response workflow was chosen because it:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold">1</span>
                  </div>
                  <div>
                    <span className="font-semibold">Represents a real business need:</span>
                    <span className="text-muted-foreground ml-2">
                      Companies spend significant time and resources responding to RFPs
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold">2</span>
                  </div>
                  <div>
                    <span className="font-semibold">Demonstrates multi-agent collaboration:</span>
                    <span className="text-muted-foreground ml-2">
                      Multiple specialized agents work together to achieve a common goal
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold">3</span>
                  </div>
                  <div>
                    <span className="font-semibold">Showcases event-driven architecture:</span>
                    <span className="text-muted-foreground ml-2">
                      The system reacts to events rather than following manual step-by-step navigation
                    </span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Zap,
              title: 'Automated Workflow',
              description: 'Fully automated execution from RFP selection to proposal generation'
            },
            {
              icon: Target,
              title: 'Real-Time Visibility',
              description: 'Live workflow visualization with status updates and agent logs'
            },
            {
              icon: Users,
              title: 'Multi-Agent System',
              description: 'Five specialized agents working in coordinated sequence'
            },
            {
              icon: Award,
              title: 'Production-Ready UI',
              description: 'Professional, cyberpunk-themed interface ready for demos'
            }
          ].map((achievement, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <Card className="h-full hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <achievement.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-heading">{achievement.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Technical Approach */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-morphism border-secondary/30">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Technical Approach</CardTitle>
              <CardDescription>How the system was built</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-heading font-semibold text-lg text-primary">Simulation vs. Real Integration</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  While this is a demonstration application, the architecture is designed to be easily extended with
                  real integrations:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="text-sm text-muted-foreground">
                    • Mock RFP data can be replaced with real web scraping or API integrations
                  </li>
                  <li className="text-sm text-muted-foreground">
                    • Simulated agent processing can be swapped with actual AI model calls (GPT-5, Claude, etc.)
                  </li>
                  <li className="text-sm text-muted-foreground">
                    • In-memory storage can be replaced with persistent MongoDB collections
                  </li>
                  <li className="text-sm text-muted-foreground">
                    • The n8n-inspired workflow can be deployed in actual n8n for production use
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-heading font-semibold text-lg text-primary">Design Philosophy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The application was designed with the following principles:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="text-sm text-muted-foreground">
                    • <span className="text-foreground font-semibold">Zero manual navigation:</span> Once an RFP is selected, everything runs automatically
                  </li>
                  <li className="text-sm text-muted-foreground">
                    • <span className="text-foreground font-semibold">Visual feedback:</span> Every step is visible with real-time status updates
                  </li>
                  <li className="text-sm text-muted-foreground">
                    • <span className="text-foreground font-semibold">Professional aesthetics:</span> Cyberpunk theme that looks impressive in demos
                  </li>
                  <li className="text-sm text-muted-foreground">
                    • <span className="text-foreground font-semibold">Extensible architecture:</span> Easy to add more agents or modify the workflow
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground font-mono text-sm">
            Built with React, FastAPI, and a vision for automated enterprise workflows
          </p>
        </motion.div>
      </div>
    </div>
  );
}