import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Bot, CheckSquare, FileSearch, ShoppingCart, DollarSign, FileCheck } from 'lucide-react';

const agents = [
  {
    icon: Bot,
    name: 'Sales Agent',
    role: 'RFP Extraction & Analysis',
    color: 'text-cyan-400',
    tasks: [
      'Automatically extracts RFP details from source',
      'Parses title, description, deadline, quantity',
      'Identifies key requirements and constraints',
      'Structures data for downstream processing'
    ]
  },
  {
    icon: CheckSquare,
    name: 'Main Agent (Validation)',
    role: 'Deadline & Context Management',
    color: 'text-purple-400',
    tasks: [
      'Validates submission deadline feasibility',
      'Calculates time remaining for response',
      'Prepares technical and pricing context',
      'Routes work to specialized agents'
    ]
  },
  {
    icon: ShoppingCart,
    name: 'Technical Agent',
    role: 'Product/SKU Matching',
    color: 'text-green-400',
    tasks: [
      'Searches internal product catalog',
      'Matches specifications to requirements',
      'Calculates compatibility score',
      'Provides technical justification'
    ]
  },
  {
    icon: DollarSign,
    name: 'Pricing Agent',
    role: 'Cost Estimation',
    color: 'text-yellow-400',
    tasks: [
      'Calculates license/product costs',
      'Adds implementation and service fees',
      'Estimates training and support costs',
      'Generates detailed cost breakdown'
    ]
  },
  {
    icon: FileCheck,
    name: 'Main Agent (Assembly)',
    role: 'Proposal Generation',
    color: 'text-purple-400',
    tasks: [
      'Assembles all agent outputs',
      'Generates executive summary',
      'Creates final proposal document',
      'Marks response ready for submission'
    ]
  }
];

export default function Workflow() {
  return (
    <div className="min-h-screen p-6" data-testid="workflow-page">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">Agent Workflow</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding the multi-agent orchestration that powers automated RFP processing
          </p>
        </motion.div>

        {/* Workflow Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-morphism border-primary/30">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">How It Works</CardTitle>
              <CardDescription>
                The system uses specialized AI agents that work together in a coordinated workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="glass-morphism rounded-lg p-6 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-heading font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">Automated Monitoring</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      The system continuously monitors configured RFP sources (government portals, tender websites)
                      for new opportunities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-heading font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">RFP Selection Trigger</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      When a user selects an RFP, the workflow is automatically triggered. No manual steps required.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-heading font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">Multi-Agent Execution</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Specialized agents execute in sequence, each contributing their expertise to build the final proposal.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-heading font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg">Real-Time Visibility</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Watch agents process data in real-time with live logs, status updates, and intermediate outputs.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agent Details */}
        <div className="space-y-4">
          <h2 className="text-3xl font-heading font-bold tracking-tight text-center">Meet the Agents</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent, idx) => (
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
                        <agent.icon className={`h-6 w-6 ${agent.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-heading">{agent.name}</CardTitle>
                        <CardDescription className="font-mono text-xs">{agent.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {agent.tasks.map((task, taskIdx) => (
                        <li key={taskIdx} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-muted-foreground">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Event-Driven Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="glass-morphism border-secondary/30">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">Event-Driven Architecture</CardTitle>
              <CardDescription>No manual navigation — fully automated execution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Unlike traditional step-by-step workflows, this system operates on event triggers:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileSearch className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <span className="font-semibold">Selection Event:</span>
                    <span className="text-muted-foreground ml-2">Choosing an RFP automatically triggers the workflow</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckSquare className="h-3 w-3 text-green-400" />
                  </div>
                  <div>
                    <span className="font-semibold">Completion Event:</span>
                    <span className="text-muted-foreground ml-2">Each agent's completion triggers the next agent</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckSquare className="h-3 w-3 text-yellow-400" />
                  </div>
                  <div>
                    <span className="font-semibold">Validation Event:</span>
                    <span className="text-muted-foreground ml-2">Failed validation stops the workflow automatically</span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}