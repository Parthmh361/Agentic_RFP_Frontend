import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Package, FileText, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export const RFPCard = ({ rfp, onSelect, isSelected, disabled }) => {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`cursor-pointer border-border hover:border-primary/50 transition-all duration-300 ${
          isSelected ? 'border-primary neon-glow' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && onSelect(rfp)}
        data-testid={`rfp-card-${rfp.id}`}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-heading text-primary">{rfp.title}</CardTitle>
              <CardDescription className="mt-2 text-sm">{rfp.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-xs">{rfp.deadline}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-xs">{rfp.quantity}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Requirements</span>
            </div>
            <ul className="space-y-1 pl-5">
              {rfp.requirements.slice(0, 3).map((req, idx) => (
                <li key={idx} className="text-xs text-muted-foreground list-disc">{req}</li>
              ))}
              {rfp.requirements.length > 3 && (
                <li className="text-xs text-muted-foreground/60 italic">+{rfp.requirements.length - 3} more</li>
              )}
            </ul>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              !disabled && onSelect(rfp);
            }}
            disabled={disabled}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(14,165,233,0.4)] font-heading uppercase tracking-wider"
            data-testid={`rfp-execute-btn-${rfp.id}`}
          >
            <Play className="h-4 w-4 mr-2" />
            Execute Workflow
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};