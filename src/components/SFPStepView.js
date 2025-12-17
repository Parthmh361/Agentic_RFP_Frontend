import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export const SFPStepView = ({ stepStates = [] }) => {
  if (!Array.isArray(stepStates) || stepStates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading">Step-by-Step SFP Filtering</h2>
      
      {stepStates.map((step, stepIdx) => (
        <Card key={stepIdx} className="overflow-hidden">
          <CardHeader className="bg-muted/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-heading">{step.stepName}</CardTitle>
              <div className="text-sm font-mono">
                <span className="text-green-600">✅ {step.activeSFPs.length} Active</span>
                {step.eliminatedSFPs.length > 0 && (
                  <span className="ml-4 text-red-600">❌ {step.eliminatedSFPs.length} Eliminated</span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Active SFPs */}
            {step.activeSFPs.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2 text-green-600">✅ Passed This Step:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  <AnimatePresence>
                    {step.activeSFPs.map((sfp, idx) => (
                      <motion.div
                        key={sfp.id || idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="p-3 border border-green-500/30 rounded bg-green-50/10 flex items-start gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">{sfp.title || sfp.id}</div>
                          <div className="text-xs text-muted-foreground">{sfp.id}</div>
                          {step.scoredData && step.scoredData.find(s => s.sfp.id === sfp.id) && (
                            <div className="text-xs text-green-600 mt-1">
                              Score: {Math.round(step.scoredData.find(s => s.sfp.id === sfp.id).score)}
                              {step.scoredData.find(s => s.sfp.id === sfp.id).estimatedCost > 0 && (
                                <> • ${Number(step.scoredData.find(s => s.sfp.id === sfp.id).estimatedCost || 0).toLocaleString()}</>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Eliminated SFPs */}
            {step.eliminatedSFPs.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2 text-red-600">❌ Eliminated in This Step:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {step.eliminatedSFPs.map((item, idx) => (
                    <motion.div
                      key={item.sfp.id || idx}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0.5 }}
                      className="p-3 border border-red-500/30 rounded bg-red-50/10 flex items-start gap-2 line-through"
                    >
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{item.sfp.title || item.sfp.id}</div>
                        <div className="text-xs text-muted-foreground">{item.sfp.id}</div>
                        <div className="text-xs text-red-600 mt-1">{item.reason}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SFPStepView;
