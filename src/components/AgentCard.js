import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { motion } from 'framer-motion';

export const AgentCard = ({ step, output, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`border-border ${
          isActive ? 'border-primary/50 neon-glow' : ''
        } ${step.status === 'completed' ? 'border-green-500/30' : ''}`}
        data-testid={`agent-card-${step.id}`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-heading text-primary">{step.name}</CardTitle>
            <StatusBadge status={step.status} />
          </div>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{step.agent}</p>
        </CardHeader>
        
        {output && (
          <CardContent>
            <div className="glass-morphism rounded-lg p-4 space-y-2">
              {Object.entries(output).map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="font-mono text-primary">{key}:</span>
                  <span className="ml-2 text-muted-foreground">
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};