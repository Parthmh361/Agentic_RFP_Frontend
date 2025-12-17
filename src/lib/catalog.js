// Dummy product catalog for manufacturing domain
const CATALOG = [
  {
    productName: 'Industrial Exterior Paint',
    sku: 'AP-EXT-IC-20L-001',
    features: {
      corrosion_resistance: 'High',
      uv_resistance: 'High',
      chemical_resistance: 'Medium',
      coverage_sq_m_per_l: 8,
      compliance: ['ISO 12944', 'ASTM D523'],
      pack_size_l: 20,
      cost_per_l: 420
    }
  },
  {
    productName: 'Epoxy Protective Coating',
    sku: 'AP-EPX-PRT-10L-014',
    features: {
      corrosion_resistance: 'Very High',
      uv_resistance: 'Low',
      chemical_resistance: 'High',
      coverage_sq_m_per_l: 6,
      compliance: ['ISO 1461', 'ASTM D4541'],
      pack_size_l: 10,
      cost_per_l: 680
    }
  },
  {
    productName: 'Economy Industrial Coating',
    sku: 'AP-IND-ECO-20L-009',
    features: {
      corrosion_resistance: 'Medium',
      uv_resistance: 'Medium',
      chemical_resistance: 'Low',
      coverage_sq_m_per_l: 7,
      compliance: ['Basic ISO'],
      pack_size_l: 20,
      cost_per_l: 310
    }
  }
];

function scoreCompliance(requirements, complianceList) {
  // award points for each compliance standard mentioned in requirements
  let points = 0;
  const reqText = (requirements || '').toLowerCase();
  complianceList.forEach((c) => {
    if (reqText.includes(c.toLowerCase().split(' ')[0])) points += 1;
  });
  return Math.min(points, 3);
}

export function evaluateCatalog(requirements = '', quantity = 0, application = '') {
  const results = CATALOG.map((item) => {
    const f = item.features;

    // Simple spec matching: look for keywords
    const matchedSpecs = [];
    const missingSpecs = [];
    const req = (requirements || '').toLowerCase();

    if (req.includes('corrosion')) {
      matchedSpecs.push(`Corrosion resistance: ${f.corrosion_resistance}`);
    } else {
      missingSpecs.push('Corrosion requirement unspecified');
    }

    if (req.includes('uv') || req.includes('sun') || req.includes('exterior')) {
      matchedSpecs.push(`UV resistance: ${f.uv_resistance}`);
    }

    if (req.includes('chemical')) {
      matchedSpecs.push(`Chemical resistance: ${f.chemical_resistance}`);
    }

    if (req.includes('coverage') || req.includes('sq.m') || req.includes('coverage:')) {
      matchedSpecs.push(`Coverage: ${f.coverage_sq_m_per_l} sq.m/L`);
    }

    // Compliance scoring
    const complianceScore = scoreCompliance(requirements, f.compliance);
    if (complianceScore > 0) {
      matchedSpecs.push(`Compliance: ${f.compliance.join(', ')}`);
    } else {
      missingSpecs.push('Compliance standards not matched');
    }

    // Quantity suitability (pack size vs requested quantity)
    const packSuitability = quantity >= f.pack_size_l ? 1 : 0;
    if (packSuitability) matchedSpecs.push(`Pack size suitable: ${f.pack_size_l}L`);
    else missingSpecs.push(`Pack size may be undersized (${f.pack_size_l}L)`);

    // Application type bonus (e.g., exterior => paint)
    let applicationBonus = 0;
    if (application && application.toLowerCase().includes('exterior') && item.productName.toLowerCase().includes('exterior')) {
      applicationBonus = 1;
      matchedSpecs.push('Application fit: Exterior');
    }

    // Compute weighted match score
    // specWeight: 40, complianceWeight: 30, quantityWeight: 20, applicationWeight: 10
    const specPoints = Math.min(matchedSpecs.length, 5);
    const specScore = (specPoints / 5) * 40;
    const complianceScorePct = (complianceScore / 3) * 30;
    const quantityScore = packSuitability ? 20 : 5;
    const appScore = applicationBonus ? 10 : 0;

    const rawScore = Math.round(specScore + complianceScorePct + quantityScore + appScore);

    return {
      sku: item.sku,
      productName: item.productName,
      matchScore: rawScore,
      matchedSpecs,
      missingSpecs,
      features: f
    };
  });

  // sort descending
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}

export default CATALOG;
