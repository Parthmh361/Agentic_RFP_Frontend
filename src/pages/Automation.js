import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RFPCard } from '@/components/RFPCard';
import { WorkflowCanvas } from '@/components/WorkflowCanvas';
import { TerminalLog } from '@/components/TerminalLog';
import { AgentCard } from '@/components/AgentCard';
import { ProposalViewer } from '@/components/ProposalViewer';
import { SFPStepView } from '@/components/SFPStepView';
import { useWorkflow } from '@/context/WorkflowContext';
import { motion } from 'framer-motion';
import { RotateCcw, Zap, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Automation() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { 
    selectedRFP, 
    workflowSteps, 
    currentStepIndex,
    isExecuting, 
    agentOutputs, 
    logs,
    executionSpeed,
    setExecutionSpeed,
    executeWorkflow, 
    resetWorkflow,
    setCandidateSFPs,
    currentPhase,
    stepStates,
    WORKFLOW_PHASES
  } = useWorkflow();
  const { addLog } = useWorkflow();

  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  const handleFetchFromSource = () => {
    // Simulate fetching a large list of RFPs based on selected source or URL
    const large = generateLargeMockRFPs(selectedSource || sourceUrl);
    setRfps(large);
    // set candidate SFPs in workflow context for full multi-SKU evaluation
    try {
      if (typeof setCandidateSFPs === 'function') setCandidateSFPs(large);
    } catch (e) {
      // fallback to global setter if context not available
      if (typeof window !== 'undefined' && window.__workflowsetCandidateSFPs) {
        window.__workflowsetCandidateSFPs(large);
      }
    }
    setLoading(false);

    // Start simulated shortlisting and automatic execution
    (async () => {
      addLog(`Sales Agent: Evaluating ${large.length} RFPs from source...`, 'info');

      // simple scoring by keyword matches
      const scored = large.map((r) => {
        const text = (Array.isArray(r.requirements) ? r.requirements.join(' ') : r.requirements || '') + ' ' + (r.description || '');
        let score = 0;
        const kws = ['corrosion', 'chemical', 'uv', 'exterior', 'marine', 'coastal', 'fire', 'tank', 'industrial'];
        kws.forEach((k) => { if (text.toLowerCase().includes(k)) score += 1; });
        return { ...r, score };
      });

      // log individual scores (staggered)
      for (const s of scored) {
        addLog(`Sales Agent: RFP ${s.id} scored ${s.score}`, 'info');
        await new Promise((res) => setTimeout(res, 120));
      }

      // shortlist top N
      const topN = 8;
      const shortlist = scored.sort((a,b)=>b.score-a.score).slice(0, topN);
      addLog(`Sales Agent: Shortlisting top ${topN} RFPs...`, 'info');
      // present shortlist
      setRfps(shortlist.map(s=> ({ ...s })) );

      await new Promise((res) => setTimeout(res, 1200));

      addLog('Sales Agent: Shortlisting complete. Ready to execute workflow.', 'success');
    })();
  };

  const generateLargeMockRFPs = (sourceHint) => {
    const templates = [
      {
        title: 'Exterior Industrial Paint Supply - Coastal Plant',
        description: 'Supply and apply exterior corrosion-resistant paint for coastal facility structures.',
        requirements: ['High corrosion resistance for marine environment','UV stability','ISO 12944','Coverage at least 7 sq.m/L'],
      },
      {
        title: 'Protective Coating for Chemical Storage Tanks',
        description: 'Supply epoxy protective coating suitable for chemical resistance and heavy-duty protection.',
        requirements: ['Very high corrosion resistance','High chemical resistance','ISO 1461','Adhesion testing required'],
      },
      {
        title: 'Interior Emulsion for Offices',
        description: 'Interior durable emulsion for office refurbishment.',
        requirements: ['Low VOC','High durability for interiors','Coverage at least 9 sq.m/L'],
      },
      {
        title: 'Marine Coating for Jetty Structures',
        description: 'Marine grade coating for piers and jetty equipment.',
        requirements: ['Marine environment resistant','ISO 12944','UV stability','Coastal corrosion resistance'],
      }
    ];

    const list = [];
    for (let i=0;i<20;i++) {
      const t = templates[i % templates.length];
      list.push({
        id: `RFP-${(1000+i)}`,
        title: `${t.title} (${i+1})`,
        description: t.description,
        deadline: new Date(Date.now() + (5 + (i%30)) * 24 * 3600 * 1000).toISOString().split('T')[0],
        quantity: 200 + (i%10)*50,
        requirements: t.requirements,
        source_url: sourceHint || 'simulated://source'
      });
    }
    return list;
  };

  useEffect(() => {
    fetchRFPs();
  }, []);

  const fetchRFPs = async () => {
    try {
      const response = await axios.get(`${API}/rfps`);
      // If backend returns no RFPs, fall back to local mock data for demo
      const remote = response.data || [];
      if (!remote || remote.length === 0) {
        setRfps(MOCK_RFPS);
      } else {
        setRfps(remote);
      }
    } catch (error) {
      console.error('Error fetching RFPs:', error);
      // Fallback to mock RFPs so the demo remains functional offline
      setRfps(MOCK_RFPS);
    } finally {
      setLoading(false);
    }
  };

  // Local mock RFPs for demonstration when backend is unavailable
  const MOCK_RFPS = [
    {
      id: 'RFP-PAINT-001',
      title: 'Exterior Industrial Paint Supply - Coastal Plant',
      description: 'Supply and apply exterior corrosion-resistant paint for coastal facility structures.',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
      quantity: 1000, // in liters
      requirements: [
        'High corrosion resistance for marine environment',
        'UV stability for prolonged sun exposure',
        'Compliance with ISO 12944 and ASTM D523',
        'Coverage at least 7 sq.m/L',
        'Pack sizes preferred: 20L or 10L'
      ]
    },
    {
      id: 'RFP-COAT-002',
      title: 'Protective Coating for Chemical Storage Tanks',
      description: 'Supply epoxy protective coating suitable for chemical resistance and heavy-duty protection.',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString().split('T')[0],
      quantity: 500,
      requirements: [
        'Very high corrosion resistance',
        'High chemical resistance',
        'Compliance with ISO 1461',
        'Surface preparation and adhesion testing required'
      ]
    }
  ];

  const handleSelectRFP = (rfp) => {
    if (isExecuting) return;
    executeWorkflow(rfp);
  };

  const handleReset = () => {
    resetWorkflow();
  };

  const isWorkflowComplete = currentStepIndex >= workflowSteps.length - 1 && workflowSteps[workflowSteps.length - 1].status === 'completed';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground font-mono">Loading RFPs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" data-testid="automation-page">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-heading font-bold tracking-tight">Live Automation Demo</h1>
            <p className="text-lg text-muted-foreground mt-2">Select an RFP to trigger automated workflow execution</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="speed-mode"
                checked={executionSpeed === 'fast'}
                onCheckedChange={(checked) => setExecutionSpeed(checked ? 'fast' : 'realistic')}
                disabled={isExecuting}
                data-testid="speed-toggle"
              />
              <Label htmlFor="speed-mode" className="text-sm font-mono flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {executionSpeed === 'fast' ? 'Fast Mode' : 'Realistic Mode'}
              </Label>
            </div>
            {selectedRFP && (
              <Button 
                onClick={handleReset} 
                variant="outline"
                disabled={isExecuting}
                className="font-heading uppercase tracking-wider"
                data-testid="reset-workflow-btn"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </motion.div>

        {/* Select RFP Section */}
        {!isExecuting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-heading flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  Available RFPs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div className="md:col-span-2">
                    <label className="text-xs font-mono text-muted-foreground">RFP Source Link (simulate)</label>
                    <input
                      type="text"
                      placeholder="https://govt-tenders.example/tender/123"
                      className="w-full mt-1 p-2 rounded border border-muted/20 bg-card"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      disabled={isExecuting}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-muted-foreground">Select sample source</label>
                    <select className="w-full mt-1 p-2 rounded border border-muted/20 bg-card" value={selectedSource} onChange={(e)=> setSelectedSource(e.target.value)} disabled={isExecuting}>
                      <option value="">-- sample sources --</option>
                      <option value="gov">Government Tender Portal</option>
                      <option value="infra">Infrastructure Procurement</option>
                      <option value="corp">Corporate RFP Page</option>
                    </select>
                  </div>
                  <div className="md:col-span-3 flex gap-2">
                    <Button onClick={handleFetchFromSource} disabled={isExecuting}>Simulate Fetch</Button>
                    <Button variant="outline" onClick={() => { setSourceUrl(''); setSelectedSource(''); setRfps(MOCK_RFPS); }} disabled={isExecuting}>Reset Sources</Button>
                    {rfps.length > 0 && !isExecuting && (
                      <Button onClick={() => executeWorkflow(null)} className="bg-green-600 hover:bg-green-700">Start Multi-SFP Workflow</Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rfps.map((rfp) => (
                    <RFPCard
                      key={rfp.id}
                      rfp={rfp}
                      onSelect={handleSelectRFP}
                      isSelected={false}
                      disabled={isExecuting}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Workflow Visualization */}
        {(isExecuting || currentPhase === WORKFLOW_PHASES.COMPLETED) && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Workflow Pipeline</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">n8n-style orchestration view</p>
                </CardHeader>
                <CardContent>
                  <WorkflowCanvas />
                </CardContent>
              </Card>
            </motion.div>

            {/* Logs and Agent Output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TerminalLog logs={logs} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                {/* Only show Selected RFP when workflow is COMPLETED */}
                {currentPhase === WORKFLOW_PHASES.COMPLETED && selectedRFP && (
                  <Card className="glass-morphism">
                    <CardHeader>
                      <CardTitle className="text-xl font-heading">Final Selected RFP</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <h3 className="font-heading text-lg text-primary">{selectedRFP.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedRFP.description}</p>
                      <div className="flex items-center gap-4 text-xs font-mono pt-2">
                        <span>Deadline: {selectedRFP.deadline}</span>
                        <span>•</span>
                        <span>{selectedRFP.quantity}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Show workflow phase and step progress during execution */}
                {isExecuting && currentPhase !== WORKFLOW_PHASES.COMPLETED && (
                  <Card className="glass-morphism">
                    <CardHeader>
                      <CardTitle className="text-xl font-heading">Workflow Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-mono">Phase: <span className="text-primary">{currentPhase}</span></div>
                        {stepStates.length > 0 && (
                          <div className="text-sm">
                            <div className="font-semibold">Current Step: {stepStates[stepStates.length - 1].stepName}</div>
                            <div className="text-muted-foreground">Active SFPs: {stepStates[stepStates.length - 1].activeSFPs.length}</div>
                            <div className="text-muted-foreground">Eliminated: {stepStates[stepStates.length - 1].eliminatedSFPs.length}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {currentStepIndex >= 0 && workflowSteps[currentStepIndex] && (
                  <AgentCard
                    step={workflowSteps[currentStepIndex]}
                    output={agentOutputs[workflowSteps[currentStepIndex].id]}
                    isActive={true}
                  />
                )}
              </motion.div>
            </div>

            {/* Per-Step SFP Visualization */}
            {stepStates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <SFPStepView stepStates={stepStates} />
              </motion.div>
            )}

            {/* Proposal Viewer */}
            {isWorkflowComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ProposalViewer />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}