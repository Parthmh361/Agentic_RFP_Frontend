// matching.js
// Deterministic matching utilities for SKU vs SFP (RFP) evaluation
// Exports:
// - scoreSFP(sku, sfp): returns { score, breakdown }
// - evaluateAllSFPsForSKU(sku, sfps): returns array of scored sfps
// - shortlistSFPs(results, options): returns shortlisted results

import { evaluateAsianCatalog, default as ASIAN_CATALOG } from './asianCatalog';

// Helper: map qualitative property to numeric
function qualitativeToScore(val) {
  if (!val) return 0;
  const v = String(val).toLowerCase();
  if (v.includes('very')) return 3;
  if (v.includes('high')) return 2;
  if (v.includes('medium')) return 1;
  return 0;
}

// scoreSFP: deterministic scoring based on explicit weights
export function scoreSFP(sku, sfp) {
  // sku: catalog item or lightweight object with properties
  // sfp: candidate project with requirements, quantity, application
  const reqText = Array.isArray(sfp.requirements) ? sfp.requirements.join(' ').toLowerCase() : (sfp.requirements || '').toLowerCase();
  const qty = Number(sfp.quantity) || 0;

  // Criteria
  // 1) Specification match (corrosion, uv, chemical) - weight 40
  let specPoints = 0;
  const specReasons = [];
  if (reqText.includes('corrosion')) {
    specPoints += qualitativeToScore(sku.properties.corrosionResistance) * 2; // up to 6
    specReasons.push(`Corrosion matched (${sku.properties.corrosionResistance})`);
  }
  if (reqText.includes('uv') || reqText.includes('sun') || reqText.includes('exterior')) {
    specPoints += qualitativeToScore(sku.properties.uvResistance) * 2;
    specReasons.push(`UV matched (${sku.properties.uvResistance})`);
  }
  if (reqText.includes('chemical')) {
    specPoints += qualitativeToScore(sku.properties.durability) * 2;
    specReasons.push(`Chemical/durability matched (${sku.properties.durability})`);
  }
  // normalize specPoints (max 12) to 0-40
  const specScore = Math.round((Math.min(specPoints, 12) / 12) * 40);

  // 2) Compliance match - weight 30
  const complianceMatches = sku.compliance.filter((c) => reqText.includes(c.split(' ')[0].toLowerCase()) || reqText.includes(c.toLowerCase()));
  const complianceScore = Math.round((Math.min(complianceMatches.length, 3) / 3) * 30);

  // 3) Quantity suitability - weight 20
  // If sfp quantity >= one of SKU packSizes, full points
  const packSuitable = sku.packSizesL.some((p) => qty >= p);
  const quantityScore = packSuitable ? 20 : (qty > 0 ? 8 : 0);

  // 4) Application matchup - weight 10
  const appText = (sfp.description || '').toLowerCase() + ' ' + (sfp.title || '').toLowerCase();
  const appMatch = sku.applications.some((a) => appText.includes(a.split(' ')[0].toLowerCase()));
  const applicationScore = appMatch ? 10 : 0;

  const total = specScore + complianceScore + quantityScore + applicationScore;

  const breakdown = {
    specScore,
    specReasons,
    complianceScore,
    complianceMatches,
    quantityScore,
    applicationScore,
    total
  };

  return { score: total, breakdown };
}

// Evaluate all SFPs for a given SKU
export function evaluateAllSFPsForSKU(sku, sfps) {
  // deterministic: iterate and score each
  const results = sfps.map((sfp) => {
    const { score, breakdown } = scoreSFP(sku, sfp);
    return {
      sfpId: sfp.id,
      title: sfp.title,
      score,
      breakdown,
      sfp
    };
  });
  // sort descending by score, stable
  results.sort((a, b) => b.score - a.score);
  return results;
}

// Shortlist SFPs by topN or threshold; deterministic tie-breaker by title
export function shortlistSFPs(results, options = { topN: 3, minScore: 30 }) {
  const { topN, minScore } = options;
  const filtered = results.filter(r => r.score >= minScore);
  if (filtered.length === 0) {
    // if none meet threshold, take topN
    return results.slice(0, topN);
  }
  return filtered.slice(0, topN);
}

export default {
  scoreSFP,
  evaluateAllSFPsForSKU,
  shortlistSFPs
};
