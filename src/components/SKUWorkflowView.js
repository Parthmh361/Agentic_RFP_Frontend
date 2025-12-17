import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

export const SKUWorkflowView = ({ perSkuEvaluations = [] }) => {
  if (!Array.isArray(perSkuEvaluations) || perSkuEvaluations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {perSkuEvaluations.map((p) => {
        const evaluations = Array.isArray(p.evaluations) ? p.evaluations : [];
        const shortlist = Array.isArray(p.shortlist) ? p.shortlist : [];
        const finalSel = p.finalSelection || {};

        return (
          <Card key={p.sku} className="bg-card" data-testid={`sku-workflow-${p.sku}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-heading">{p.productName} <span className="ml-2 text-xs font-mono text-muted-foreground">{p.sku}</span></CardTitle>
                  <div className="text-xs text-muted-foreground">Final selected: {finalSel.sku || finalSel.sku}</div>
                </div>
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3 border rounded">
                  <div className="text-xs font-mono text-muted-foreground">Stage 1</div>
                  <div className="font-semibold">All Candidates</div>
                  <div className="text-sm text-muted-foreground">{evaluations.length} SFPs evaluated</div>
                </div>

                <div className="p-3 border rounded">
                  <div className="text-xs font-mono text-muted-foreground">Stage 2</div>
                  <div className="font-semibold">Filtered</div>
                  <div className="text-sm text-muted-foreground">{shortlist.length} shortlisted</div>
                </div>

                <div className="p-3 border rounded">
                  <div className="text-xs font-mono text-muted-foreground">Stage 3</div>
                  <div className="font-semibold">Ranked (Top 3)</div>
                  <div className="space-y-1 mt-2">
                    {evaluations.slice(0,3).map((e, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="font-mono text-xs text-muted-foreground">{e.sfp_id || e.id || `SFP-${idx}`}</div>
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">Score: {Math.round(e.score || 0)}</div>
                          <div className="text-xs text-muted-foreground">spec:{Math.round(e.specScore||0)} / comp:{Math.round(e.complianceScore||0)}</div>
                        </div>
                      </div>
                    ))}
                    {evaluations.length === 0 && <div className="text-sm text-muted-foreground">No ranked candidates</div>}
                  </div>
                </div>

                <div className="p-3 border rounded">
                  <div className="text-xs font-mono text-muted-foreground">Stage 4</div>
                  <div className="font-semibold">Final Selection</div>
                  <div className="text-sm mt-2">
                    <div className="font-semibold">{finalSel.sku || '—'}</div>
                    <div className="text-xs text-muted-foreground">Score: {Math.round(finalSel.score || 0)}</div>
                    {finalSel.matchedSpecs && finalSel.matchedSpecs.length > 0 && (
                      <div className="text-xs mt-2">Top strengths: {finalSel.matchedSpecs.slice(0,3).join(', ')}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-mono text-muted-foreground mb-2">Candidates (stage view)</p>
                <div className="space-y-2">
                  {evaluations.map((e, idx) => {
                    const eliminated = e.eliminationStage;
                    const rowClass = eliminated ? 'opacity-50 line-through text-muted-foreground' : '';
                    return (
                      <div key={e.sfpId || e.sfp_id || idx} className={`p-2 border rounded flex items-center justify-between ${rowClass}`}>
                        <div>
                            <div className="font-semibold">{e.title || (e.sfp && e.sfp.title) || `SFP ${idx+1}`}</div>
                            <div className="text-xs text-muted-foreground">Score: {Math.round(e.score||0)} • ID: {e.sfpId || (e.sfp && e.sfp.id) || '—'}</div>
                            <div className="text-xs text-muted-foreground">Estimated material cost: ${Number(e.estimatedMaterialCost || e.estimated_material_cost || 0).toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Breakdown: spec {Math.round((e.breakdown && e.breakdown.specScore) || 0)} • comp {Math.round((e.breakdown && e.breakdown.complianceScore) || 0)} • qty {Math.round((e.breakdown && e.breakdown.quantityScore) || 0)}</div>
                        </div>
                        <div className="text-right text-xs">
                          {eliminated ? <span className="px-2 py-1 rounded bg-red-100 text-red-700">Removed ({eliminated})</span> : <span className="px-2 py-1 rounded bg-green-100 text-green-700">Kept</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SKUWorkflowView;
