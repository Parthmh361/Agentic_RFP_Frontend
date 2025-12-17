import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { useWorkflow } from '@/context/WorkflowContext';

const CustomNode = ({ data }) => {
  const getNodeColor = () => {
    switch (data.status) {
      case 'running':
        return 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(14,165,233,0.5)]';
      case 'completed':
        return 'border-green-500 bg-green-500/20';
      case 'failed':
        return 'border-red-500 bg-red-500/20';
      default:
        return 'border-muted bg-muted/10';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-4 py-3 rounded-lg border-2 ${getNodeColor()} backdrop-blur-md min-w-[180px]`}
    >
      <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
        {data.agent}
      </div>
      <div className="font-heading text-sm font-semibold text-foreground">
        {data.label}
      </div>
      {data.status === 'running' && (
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary font-mono">Processing...</span>
        </div>
      )}
    </motion.div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export const WorkflowCanvas = () => {
  const { workflowSteps } = useWorkflow();

  const nodes = useMemo(() => {
    return workflowSteps.map((step, index) => ({
      id: step.id,
      type: 'custom',
      position: { x: index * 250, y: 100 },
      data: { 
        label: step.name, 
        agent: step.agent,
        status: step.status 
      },
    }));
  }, [workflowSteps]);

  const edges = useMemo(() => {
    return workflowSteps.slice(0, -1).map((step, index) => ({
      id: `${step.id}-${workflowSteps[index + 1].id}`,
      source: step.id,
      target: workflowSteps[index + 1].id,
      type: 'smoothstep',
      animated: workflowSteps[index].status === 'completed' && workflowSteps[index + 1].status === 'running',
      style: { 
        stroke: workflowSteps[index].status === 'completed' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
        strokeWidth: 2
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: workflowSteps[index].status === 'completed' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
      },
    }));
  }, [workflowSteps]);

  return (
    <div className="w-full h-[400px] glass-morphism rounded-xl overflow-hidden" data-testid="workflow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="rgba(128, 128, 128, 0.1)" gap={24} />
        <Controls className="glass-morphism border border-white/10" />
      </ReactFlow>
    </div>
  );
};