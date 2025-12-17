import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WorkflowContext = createContext();

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within WorkflowProvider');
  }
  return context;
};

const WORKFLOW_STEPS = [
  { id: 'trigger', name: 'Automated Trigger', status: 'idle', agent: 'System' },
  { id: 'sales_agent', name: 'RFP Extraction', status: 'idle', agent: 'Sales Agent' },
  { id: 'deadline_validation', name: 'Deadline Validation', status: 'idle', agent: 'Main Agent' },
  { id: 'main_agent_context', name: 'Context Preparation', status: 'idle', agent: 'Main Agent' },
  { id: 'technical_agent', name: 'SKU Matching', status: 'idle', agent: 'Technical Agent' },
  { id: 'pricing_agent', name: 'Cost Estimation', status: 'idle', agent: 'Pricing Agent' },
  { id: 'main_agent_assembly', name: 'Proposal Assembly', status: 'idle', agent: 'Main Agent' },
  { id: 'complete', name: 'Complete', status: 'idle', agent: 'System' }
];

const WORKFLOW_PHASES = {
  NOT_STARTED: 'NOT_STARTED',
  LOADING_SFPS: 'LOADING_SFPS',
  STEP_1_DEADLINE_FILTER: 'STEP_1_DEADLINE_FILTER',
  STEP_2_SPEC_FILTER: 'STEP_2_SPEC_FILTER',
  STEP_3_SCORING: 'STEP_3_SCORING',
  FINAL_SHORTLIST: 'FINAL_SHORTLIST',
  COMPLETED: 'COMPLETED'
};

export const WorkflowProvider = ({ children }) => {
  const [selectedRFP, setSelectedRFP] = useState(null);
  const [executionId, setExecutionId] = useState(null);
  const [workflowSteps, setWorkflowSteps] = useState(WORKFLOW_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [agentOutputs, setAgentOutputs] = useState({});
  const [candidateSFPs, setCandidateSFPs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [executionSpeed, setExecutionSpeed] = useState('realistic'); // 'realistic' or 'fast'
  const [currentPhase, setCurrentPhase] = useState(WORKFLOW_PHASES.NOT_STARTED);
  const [stepStates, setStepStates] = useState([]); // Array of { stepName, activeSFPs, eliminatedSFPs: [{sfp, reason}] }
  const [finalSelection, setFinalSelection] = useState(null); // Consolidated final data after completion

  const addLog = useCallback((message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date().toISOString() }]);
  }, []);

  const executeWorkflow = useCallback(async (rfp) => {
    if (isExecuting) return;
    
    // Multi-SFP workflow: process ALL candidateSFPs through phases
    const sfpsToProcess = candidateSFPs && candidateSFPs.length > 0 ? candidateSFPs : [];
    if (sfpsToProcess.length === 0) {
      addLog('No SFPs available to process. Please fetch SFPs first.', 'warning');
      return;
    }

    setSelectedRFP(null); // Do NOT set selected RFP until workflow completes
    setFinalSelection(null); // Clear final selection at start
    setIsExecuting(true);
    setCurrentStepIndex(0);
    setCurrentPhase(WORKFLOW_PHASES.LOADING_SFPS);
    setWorkflowSteps(WORKFLOW_STEPS.map(s => ({ ...s, status: 'idle' })));
    setAgentOutputs({});
    setLogs([]);
    setStepStates([]);
    
    addLog(`Starting multi-SFP workflow with ${sfpsToProcess.length} SFPs...`, 'success');

    try {
      // Simulate step-by-step execution across ALL SFPs
      await simulateMultiSFPSteps(sfpsToProcess);
    } catch (error) {
      addLog(`Workflow error: ${error.message}`, 'error');
      setIsExecuting(false);
      setCurrentPhase(WORKFLOW_PHASES.NOT_STARTED);
    }
  }, [isExecuting, addLog, candidateSFPs]);

  const simulateMultiSFPSteps = async (allSFPs) => {
    const delays = executionSpeed === 'fast' ? [500, 800, 600, 1000, 900, 700, 500] : [2000, 2500, 1500, 2000, 3000, 2500, 2000];
    let activeSFPs = [...allSFPs];
    
    // Step 0: Trigger - Show ALL SFPs
    await executeStep(0, delays[0], () => {
      addLog('Automated trigger activated', 'info');
      addLog(`Loaded ${activeSFPs.length} SFPs for processing...`, 'info');
      setStepStates([{ stepName: 'Initial Load', activeSFPs: [...activeSFPs], eliminatedSFPs: [] }]);
      return { triggered: true, total_sfps: activeSFPs.length };
    });

    // Step 1: Deadline Validation - Filter out SFPs with insufficient deadline
    setCurrentPhase(WORKFLOW_PHASES.STEP_1_DEADLINE_FILTER);
    await executeStep(1, delays[1], () => {
      addLog('Sales Agent: Validating deadlines across all SFPs...', 'info');
      const today = new Date();
      const eliminated = [];
      const passed = [];

      activeSFPs.forEach((sfp) => {
        const deadlineDate = new Date(sfp.deadline);
        const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        if (daysRemaining < 7) {
          eliminated.push({ sfp, reason: `Insufficient deadline (${daysRemaining} days < 7 days required)` });
        } else {
          passed.push(sfp);
        }
      });

      activeSFPs = passed;
      addLog(`Deadline filter: ${passed.length} passed, ${eliminated.length} eliminated`, eliminated.length > 0 ? 'warning' : 'success');
      setStepStates(prev => [...prev, { stepName: 'Deadline Validation', activeSFPs: [...activeSFPs], eliminatedSFPs: eliminated }]);
      return { passed: activeSFPs.length, eliminated: eliminated.length };
    });

    // Step 2: Spec/Compliance Filter
    setCurrentPhase(WORKFLOW_PHASES.STEP_2_SPEC_FILTER);
    await executeStep(2, delays[2], () => {
      addLog('Technical Agent: Filtering by specification and compliance...', 'info');
      const eliminated = [];
      const passed = [];

      activeSFPs.forEach((sfp) => {
        const reqText = Array.isArray(sfp.requirements) ? sfp.requirements.join(' ').toLowerCase() : (sfp.requirements || '').toLowerCase();
        
        // Basic spec requirements check
        const hasMinRequirements = reqText.includes('corrosion') || reqText.includes('uv') || reqText.includes('chemical') || reqText.includes('iso') || reqText.includes('astm');
        
        if (!hasMinRequirements) {
          eliminated.push({ sfp, reason: 'Missing critical specification or compliance keywords' });
        } else {
          passed.push(sfp);
        }
      });

      activeSFPs = passed;
      addLog(`Spec/Compliance filter: ${passed.length} passed, ${eliminated.length} eliminated`, 'success');
      setStepStates(prev => [...prev, { stepName: 'Spec/Compliance Filter', activeSFPs: [...activeSFPs], eliminatedSFPs: eliminated }]);
      return { passed: activeSFPs.length, eliminated: eliminated.length };
    });

    // Step 3: Context Preparation
    await executeStep(3, delays[3], () => {
      addLog('Main Agent: Preparing technical context...', 'info');
      addLog(`Main Agent: Analyzing ${activeSFPs.length} remaining SFPs...`, 'info');
      addLog('Main Agent: Context prepared', 'success');
      return {
        remaining_sfps: activeSFPs.length,
        processing_stage: 'ready_for_scoring'
      };
    });

    // Step 4: Scoring & Ranking - Score remaining SFPs
    setCurrentPhase(WORKFLOW_PHASES.STEP_3_SCORING);
    let techSnapshot = null;
    setCurrentStepIndex(4);
    setWorkflowSteps(prev => prev.map((s, i) => i === 4 ? { ...s, status: 'running' } : s));
    addLog('Technical Agent: Scoring remaining SFPs against catalog...', 'info');

    {
      const { evaluateAllSFPsForSKU, shortlistSFPs } = require('../lib/matching');
      const asianCatalog = require('../lib/asianCatalog').default;

      // Score each active SFP against catalog
      const scoredSFPs = activeSFPs.map((sfp) => {
        let bestScore = 0;
        let bestSKU = null;
        
        asianCatalog.forEach((sku) => {
          const { score, breakdown } = require('../lib/matching').scoreSFP(sku, sfp);
          if (score > bestScore) {
            bestScore = score;
            bestSKU = { ...sku, score, breakdown };
          }
        });

        const reqText = Array.isArray(sfp.requirements) ? sfp.requirements.join(' ') : (sfp.requirements || '');
        const qty = Number(sfp.quantity) || 1000;
        const unitPrice = bestSKU ? Number(bestSKU.costPerLiter || 0) : 0;
        const estimatedCost = Math.round(unitPrice * qty);

        return {
          sfp,
          score: bestScore,
          matchedSKU: bestSKU,
          estimatedCost
        };
      });

      // Sort by score descending
      scoredSFPs.sort((a, b) => b.score - a.score);
      
      addLog(`Scoring complete: Top score ${scoredSFPs[0]?.score || 0}, Lowest score ${scoredSFPs[scoredSFPs.length - 1]?.score || 0}`, 'info');
      
      // Apply score threshold filter
      const MIN_SCORE_THRESHOLD = 40;
      const eliminated = [];
      const passed = [];

      scoredSFPs.forEach((item) => {
        if (item.score < MIN_SCORE_THRESHOLD) {
          eliminated.push({ sfp: item.sfp, reason: `Score ${item.score} below threshold ${MIN_SCORE_THRESHOLD}` });
        } else {
          passed.push(item);
        }
      });

      activeSFPs = passed.map(p => p.sfp);
      addLog(`Score filter: ${passed.length} passed (score >= ${MIN_SCORE_THRESHOLD}), ${eliminated.length} eliminated`, 'success');
      setStepStates(prev => [...prev, { stepName: 'Scoring & Threshold Filter', activeSFPs: [...activeSFPs], eliminatedSFPs: eliminated, scoredData: passed }]);

      // Store technical evaluation results
      techSnapshot = {
        stage: 'scored',
        scoredSFPs: passed,
        company: 'Asian Paints'
      };
      setAgentOutputs(prev => ({ ...prev, technical_agent: techSnapshot }));
      
      setWorkflowSteps(prev => prev.map((s, i) => i === 4 ? { ...s, status: 'completed' } : s));
      setCurrentStepIndex(4);
    }

    // Step 5: Final Shortlist
    setCurrentPhase(WORKFLOW_PHASES.FINAL_SHORTLIST);
    await executeStep(5, delays[5], () => {
      addLog('Main Agent: Creating final shortlist...', 'info');
      
      // Take top N SFPs
      const TOP_N = 3;
      const finalShortlist = activeSFPs.slice(0, TOP_N);
      const eliminated = activeSFPs.slice(TOP_N).map(sfp => ({ sfp, reason: `Ranked beyond top ${TOP_N}` }));

      activeSFPs = finalShortlist;
      addLog(`Final shortlist: ${finalShortlist.length} SFPs selected`, 'success');
      setStepStates(prev => [...prev, { stepName: 'Final Shortlist', activeSFPs: [...activeSFPs], eliminatedSFPs: eliminated }]);

      return {
        shortlist_count: finalShortlist.length,
        final_sfps: finalShortlist.map(s => s.id || s.title)
      };
    });

    // Step 6: Pricing - Calculate costs for shortlisted SFPs
    await executeStep(6, delays[6], () => {
      addLog('Pricing Agent: Calculating costs for shortlisted SFPs...', 'info');
      
      const tech = techSnapshot || agentOutputs.technical_agent || {};
      const pricingResults = [];

      activeSFPs.forEach((sfp) => {
        const scoredItem = (tech.scoredSFPs || []).find(s => s.sfp.id === sfp.id);
        if (scoredItem && scoredItem.matchedSKU) {
          const unitPrice = Number(scoredItem.matchedSKU.costPerLiter || 0);
          const qty = Number(sfp.quantity) || 1000;
          const materialCost = Math.round(unitPrice * qty);
          const implementation = Math.round(materialCost * 0.2);
          const support = Math.round(materialCost * 0.1);
          const contingency = Math.round(materialCost * 0.03);
          const total = materialCost + implementation + support + contingency;

          pricingResults.push({
            sfp_id: sfp.id,
            sfp_title: sfp.title,
            selected_sku: scoredItem.matchedSKU.sku,
            productName: scoredItem.matchedSKU.productName,
            unit_price_per_liter: unitPrice,
            quantity_liters: qty,
            material_cost: materialCost,
            implementation_cost: implementation,
            annual_support: support,
            contingency,
            total_project_cost: total,
            breakdown: [
              { item: `Material (${scoredItem.matchedSKU.productName})`, cost: materialCost },
              { item: 'Implementation & Integration', cost: implementation },
              { item: 'Annual Support', cost: support },
              { item: 'Contingency', cost: contingency }
            ]
          });
        }
      });

      addLog(`Pricing complete for ${pricingResults.length} SFPs`, 'success');

      return {
        company: 'Asian Paints',
        pricing_results: pricingResults,
        total_shortlisted: pricingResults.length
      };
    });

    // Step 7: Complete - Assemble final selection object
    setCurrentPhase(WORKFLOW_PHASES.COMPLETED);
    await executeStep(7, delays[0], () => {
      addLog('Workflow completed successfully', 'success');
      
      // Assemble final selection with all consolidated data
      if (activeSFPs.length > 0) {
        const selectedSFP = activeSFPs[0];
        const tech = techSnapshot || agentOutputs.technical_agent || {};
        const scoredItem = (tech.scoredSFPs || []).find(s => s.sfp.id === selectedSFP.id);
        
        if (scoredItem && scoredItem.matchedSKU) {
          const sku = scoredItem.matchedSKU;
          const matchScore = scoredItem.score || 0;
          const qty = Number(selectedSFP.quantity) || 1000;
          const unitPrice = Number(sku.costPerLiter || 0);
          const materialCost = Math.round(unitPrice * qty);
          const implementation = Math.round(materialCost * 0.2);
          const support = Math.round(materialCost * 0.1);
          const contingency = Math.round(materialCost * 0.03);
          const totalCost = materialCost + implementation + support + contingency;
          
          const sales = agentOutputs.sales_agent || {};
          
          const finalData = {
            sfpId: selectedSFP.id,
            sfpTitle: selectedSFP.title,
            sku,
            matchScore,
            justification: `Highest match score (${matchScore}%) among ${activeSFPs.length} shortlisted SFPs`,
            technical: {
              projectType: sales.project_type || 'Industrial Coating',
              quantity: qty,
              compliance: (sales.compliance_requirements || []).join(', ') || 'Standard ISO/ASTM',
              specifications: sku.properties || {}
            },
            pricing: {
              breakdown: [
                { item: `Material (${sku.productName})`, cost: materialCost },
                { item: 'Implementation & Integration', cost: implementation },
                { item: 'Annual Support', cost: support },
                { item: 'Contingency', cost: contingency }
              ],
              totalCost
            }
          };
          
          setFinalSelection(finalData);
          setSelectedRFP(selectedSFP);
          addLog(`Final selection: ${selectedSFP.title} with ${sku.productName} (Score: ${matchScore}%)`, 'success');
        }
      }
      
      setIsExecuting(false);
      return { completed: true, final_sfp_count: activeSFPs.length };
    });
  };

  const executeStep = async (stepIndex, delay, outputGenerator) => {
    // Mark step as running
    setCurrentStepIndex(stepIndex);
    setWorkflowSteps(prev => prev.map((s, i) => 
      i === stepIndex ? { ...s, status: 'running' } : s
    ));

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, delay));

    // Generate output
    const output = outputGenerator();
    if (output === null) return; // Early termination

    // Mark step as complete
    setWorkflowSteps(prev => prev.map((s, i) => 
      i === stepIndex ? { ...s, status: 'completed' } : s
    ));
    
    // Store output
    setAgentOutputs(prev => ({
      ...prev,
      [workflowSteps[stepIndex].id]: output
    }));
    return output;
  };

  const resetWorkflow = useCallback(() => {
    setSelectedRFP(null);
    setFinalSelection(null);
    setExecutionId(null);
    setWorkflowSteps(WORKFLOW_STEPS.map(s => ({ ...s, status: 'idle' })));
    setCurrentStepIndex(-1);
    setCurrentPhase(WORKFLOW_PHASES.NOT_STARTED);
    setStepStates([]);
    setIsExecuting(false);
    setAgentOutputs({});
    setLogs([]);
  }, []);

  const value = {
    selectedRFP,
    setSelectedRFP,
    executionId,
    workflowSteps,
    currentStepIndex,
    isExecuting,
    agentOutputs,
    logs,
    executionSpeed,
    setExecutionSpeed,
    executeWorkflow,
    resetWorkflow,
    addLog,
    candidateSFPs,
    setCandidateSFPs,
    currentPhase,
    stepStates,
    WORKFLOW_PHASES,
    finalSelection
  };

  // Expose a global setter for legacy pages that call into `window.__workflowsetCandidateSFPs`.
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.__workflowsetCandidateSFPs = (s) => setCandidateSFPs(Array.isArray(s) ? s : []);
      }
    } catch (e) {
      // noop
    }
    return () => {
      try {
        if (typeof window !== 'undefined' && window.__workflowsetCandidateSFPs) {
          delete window.__workflowsetCandidateSFPs;
        }
      } catch (e) {
        // noop
      }
    };
  }, [setCandidateSFPs]);

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};