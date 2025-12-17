import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, FileText, DollarSign, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorkflow } from '@/context/WorkflowContext';
import SKUWorkflowView from '@/components/SKUWorkflowView';

// Skeleton loader for incomplete data
const SkeletonLoader = ({ text = "Loading proposal details..." }) => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  </div>
);

export const ProposalViewer = () => {
  const { finalSelection, isExecuting, currentPhase, WORKFLOW_PHASES } = useWorkflow();

  // Render guard: Do NOT show until finalSelection is populated
  if (!finalSelection || !finalSelection.sku) {
    if (isExecuting || currentPhase !== WORKFLOW_PHASES.COMPLETED) {
      return <SkeletonLoader text="Finalizing technical and pricing details..." />;
    }
    return null; // After completion but no data = error state (unlikely)
  }

  const { sku, matchScore, justification, technical, pricing } = finalSelection;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border-green-500/50 neon-glow" data-testid="proposal-viewer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
              <div>
                <CardTitle className="text-2xl font-heading text-primary">RFP Response Ready</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Proposal generated successfully</p>
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading uppercase tracking-wider" data-testid="download-proposal-btn">
              <Download className="h-4 w-4 mr-2" />
              Download Proposal
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-heading flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Technical Solution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {technical && (
                <div className="mb-3 p-3 bg-card rounded">
                  <p className="text-xs font-mono text-muted-foreground uppercase">Technical Agent Analysis</p>
                  <p className="text-sm">Project Type: <span className="font-semibold">{technical.projectType}</span></p>
                  <p className="text-sm">Quantity (L): <span className="font-semibold">{technical.quantity.toLocaleString()}</span></p>
                  <p className="text-sm">Compliance: <span className="font-semibold">{technical.compliance}</span></p>
                </div>
              )}
              <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">Matched Product</p>
              <p className="text-lg font-semibold">{sku.productName}</p>
              <p className="text-sm text-primary font-mono">SKU: {sku.sku}</p>
              <p className="mt-2 text-sm">Selected SKU (Best Match): <span className="font-semibold text-green-600">{sku.sku}</span></p>
              <p className="text-sm text-muted-foreground mt-1">Justification: {justification}</p>
            </div>
            <div>
              <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">Match Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${matchScore}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-primary to-green-500"
                      />
                </div>
                  <span className="text-2xl font-heading text-primary">{matchScore}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">Specifications</p>
              <ul className="space-y-2">
                  {(sku.properties ? Object.entries(sku.properties).slice(0, 5).map(([key, val]) => `${key}: ${val}`) : []).map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* SKU Comparison Table */}
            {sku && (
              <div>
                <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">SKU Details</p>
                <div className="bg-muted/10 rounded-lg border border-muted p-3 space-y-2">
                  <div><span className="text-xs text-muted-foreground">SKU Code:</span> <span className="font-mono font-semibold">{sku.sku}</span></div>
                  <div><span className="text-xs text-muted-foreground">Cost/Liter:</span> <span className="font-semibold">${Number(sku.costPerLiter || 0).toLocaleString()}</span></div>
                  <div><span className="text-xs text-muted-foreground">Corrosion Resistance:</span> <span className="text-sm">{sku.corrosionResistance || 'Standard'}</span></div>
                  <div><span className="text-xs text-muted-foreground">UV Resistance:</span> <span className="text-sm">{sku.uvResistance || 'Standard'}</span></div>
                </div>
              </div>
            )}

            {/* Per-SKU pipeline visualization (if available) */}
            {finalSelection && (
              <div className="mt-6">
                <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-2">Selection Details</p>
                <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-3 space-y-2">
                  <div><span className="text-xs text-muted-foreground">Final Selection ID:</span> <span className="font-mono text-sm">{finalSelection.sfpId}</span></div>
                  <div><span className="text-xs text-muted-foreground">Title:</span> <span className="font-semibold">{finalSelection.sfpTitle}</span></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-heading flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Pricing Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="glass-morphism rounded-lg p-4 space-y-3">
              <p className="text-sm text-muted-foreground">Pricing prepared by <span className="font-semibold">Asian Paints</span>. Calculated specifically for the selected SKU and quantity.</p>
              {(pricing.breakdown || []).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                  <span className="text-sm">{item.item}</span>
                  <span className="font-mono font-semibold">${Number(item.cost || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="glass-morphism rounded-lg p-4 bg-primary/10 border border-primary/30">
              <div className="flex items-center justify-between">
                <span className="text-lg font-heading uppercase tracking-wider">Total Project Cost</span>
                <span className="text-3xl font-heading text-primary">${Number(pricing.totalCost || 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};