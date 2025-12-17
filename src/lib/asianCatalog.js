// Asian Paints mock product catalog (12 SKUs)
const ASIAN_CATALOG = [
  {
    sku: 'AP-EXT-IC-20L-001',
    productName: 'Industrial Exterior Protective Paint',
    category: 'Exterior / Industrial',
    properties: { corrosionResistance: 'High', uvResistance: 'High', durability: 'High', coverage: 8 },
    compliance: ['ISO 12944', 'ASTM D523'],
    costPerLiter: 420,
    packSizesL: [20, 200],
    applications: ['Industrial buildings', 'Infrastructure projects', 'Coastal facilities']
  },
  {
    sku: 'AP-EPX-PRT-10L-014',
    productName: 'Epoxy Protective Coating',
    category: 'Protective / Industrial',
    properties: { corrosionResistance: 'Very High', uvResistance: 'Low', durability: 'Very High', coverage: 6 },
    compliance: ['ISO 1461', 'ASTM D4541'],
    costPerLiter: 680,
    packSizesL: [10, 50],
    applications: ['Chemical storage tanks', 'Pipelines', 'Industrial floors']
  },
  {
    sku: 'AP-IND-ECO-20L-009',
    productName: 'Economy Industrial Coating',
    category: 'Industrial / Economy',
    properties: { corrosionResistance: 'Medium', uvResistance: 'Medium', durability: 'Medium', coverage: 7 },
    compliance: ['Basic ISO'],
    costPerLiter: 310,
    packSizesL: [20, 200],
    applications: ['Warehouse interiors', 'Non-critical infrastructure']
  },
  {
    sku: 'AP-EXT-PRM-20L-002',
    productName: 'Premium Exterior Finish',
    category: 'Exterior',
    properties: { corrosionResistance: 'High', uvResistance: 'Very High', durability: 'High', coverage: 9 },
    compliance: ['ISO 12944', 'Environmental Safe Coatings'],
    costPerLiter: 520,
    packSizesL: [20],
    applications: ['Architectural facades', 'Commercial exteriors']
  },
  {
    sku: 'AP-INT-PLUS-5L-011',
    productName: 'Interior Durable Emulsion',
    category: 'Interior',
    properties: { corrosionResistance: 'Low', uvResistance: 'Low', durability: 'High', coverage: 10 },
    compliance: ['Low VOC'],
    costPerLiter: 210,
    packSizesL: [5, 20],
    applications: ['Office interiors', 'Residential interiors']
  },
  {
    sku: 'AP-ANTI-CORR-DR-200L-020',
    productName: 'Anti-Corrosive Primer (Drum)',
    category: 'Protective / Industrial',
    properties: { corrosionResistance: 'Very High', uvResistance: 'Low', durability: 'High', coverage: 5 },
    compliance: ['ASTM D714', 'ISO 12944'],
    costPerLiter: 480,
    packSizesL: [200],
    applications: ['Structural steel', 'Bridges', 'Offshore platforms']
  },
  {
    sku: 'AP-UV-SHIELD-4L-033',
    productName: 'UV Stabilized Topcoat',
    category: 'Exterior',
    properties: { corrosionResistance: 'Medium', uvResistance: 'Very High', durability: 'High', coverage: 8 },
    compliance: ['ASTM D523'],
    costPerLiter: 610,
    packSizesL: [4, 20],
    applications: ['Facade coatings', 'Solar-exposed structures']
  },
  {
    sku: 'AP-CHEM-RES-10L-044',
    productName: 'Chemical Resistant Coating',
    category: 'Protective',
    properties: { corrosionResistance: 'High', uvResistance: 'Low', durability: 'Very High', coverage: 6 },
    compliance: ['ISO 1461', 'Chemical Safety Std'],
    costPerLiter: 700,
    packSizesL: [10, 50],
    applications: ['Chemical plants', 'Storage tanks']
  },
  {
    sku: 'AP-FIRE-RET-20L-055',
    productName: 'Fire Retardant Coating',
    category: 'Protective',
    properties: { corrosionResistance: 'Medium', uvResistance: 'Medium', durability: 'High', coverage: 6 },
    compliance: ['Fire Safety Std', 'ISO 9001'],
    costPerLiter: 750,
    packSizesL: [20],
    applications: ['Structural steel', 'Large enclosures']
  },
  {
    sku: 'AP-ECON-EXT-20L-066',
    productName: 'Economy Exterior Coating',
    category: 'Exterior / Economy',
    properties: { corrosionResistance: 'Medium', uvResistance: 'Medium', durability: 'Medium', coverage: 7 },
    compliance: ['Basic ISO'],
    costPerLiter: 330,
    packSizesL: [20],
    applications: ['Low-cost housing', 'Non-critical exteriors']
  },
  {
    sku: 'AP-MARINE-COAT-20L-077',
    productName: 'Marine Grade Coating',
    category: 'Protective / Exterior',
    properties: { corrosionResistance: 'Very High', uvResistance: 'High', durability: 'Very High', coverage: 6 },
    compliance: ['ISO 12944', 'Marine Coating Std'],
    costPerLiter: 820,
    packSizesL: [20, 200],
    applications: ['Ships', 'Offshore structures', 'Coastal installations']
  },
  {
    sku: 'AP-INT-ECO-1L-088',
    productName: 'Budget Interior Emulsion',
    category: 'Interior / Economy',
    properties: { corrosionResistance: 'Low', uvResistance: 'Low', durability: 'Medium', coverage: 11 },
    compliance: ['Low VOC'],
    costPerLiter: 150,
    packSizesL: [1, 5],
    applications: ['Residential interiors']
  }
];

function complianceMatch(requirementsText, complianceList) {
  const req = (requirementsText || '').toLowerCase();
  let score = 0;
  complianceList.forEach((c) => {
    if (req.includes(c.split(' ')[0].toLowerCase()) || req.includes(c.toLowerCase())) score += 1;
  });
  return Math.min(score, 3);
}

export function evaluateAsianCatalog(requirements = '', quantity = 0, application = '') {
  const reqText = Array.isArray(requirements) ? requirements.join(' ') : (requirements || '');
  const app = application || '';

  const results = ASIAN_CATALOG.map((item) => {
    const matchedSpecs = [];
    const missingSpecs = [];

    // Simple keyword checks for corrosion, uv, chemical
    if (reqText.toLowerCase().includes('corrosion')) matchedSpecs.push(`Corrosion: ${item.properties.corrosionResistance}`);
    else missingSpecs.push('Corrosion requirement unspecified');

    if (reqText.toLowerCase().includes('uv') || reqText.toLowerCase().includes('sun') || reqText.toLowerCase().includes('exterior')) matchedSpecs.push(`UV: ${item.properties.uvResistance}`);

    if (reqText.toLowerCase().includes('chemical')) matchedSpecs.push(`Chemical resistance: ${item.properties.durability || item.properties.corrosionResistance}`);

    if (reqText.toLowerCase().includes('coverage')) matchedSpecs.push(`Coverage: ${item.properties.coverage || item.properties.coverage} sq.m/L`);

    const compScore = complianceMatch(reqText, item.compliance);
    if (compScore > 0) matchedSpecs.push(`Compliance: ${item.compliance.join(', ')}`);
    else missingSpecs.push('Compliance mismatch');

    // Quantity suitability: simple heuristics
    const packSuitable = item.packSizesL.some((p) => quantity >= p);
    if (packSuitable) matchedSpecs.push('Pack size suitable');
    else missingSpecs.push('Pack size may be undersized');

    // Application fit bonus
    const appBonus = app && item.applications.some((a) => app.toLowerCase().includes(a.split(' ')[0].toLowerCase())) ? 1 : 0;

    // scoring weights
    const specPoints = Math.min(matchedSpecs.length, 6);
    const specScore = (specPoints / 6) * 50; // heavier weight on specs
    const complianceScore = (compScore / 3) * 25;
    const qtyScore = packSuitable ? 15 : 5;
    const appScore = appBonus ? 10 : 0;

    const score = Math.round(specScore + complianceScore + qtyScore + appScore);

    return {
      sku: item.sku,
      productName: item.productName,
      category: item.category,
      matchScore: score,
      matchedSpecs,
      missingSpecs,
      costPerLiter: item.costPerLiter,
      properties: item.properties,
      applications: item.applications
    };
  });

  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}

export default ASIAN_CATALOG;
