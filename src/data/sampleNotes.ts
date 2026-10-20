/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to generate SVG notebook paper note data URLs
function createNotebookPageSvg(options: {
  title: string;
  course: string;
  date: string;
  lines: string[];
  highlightColor?: string;
  diagramSvg?: string;
}): string {
  const { title, course, date, lines, highlightColor = '#fef08a', diagramSvg = '' } = options;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
  <defs>
    <pattern id="ruled-lines" width="900" height="32" patternUnits="userSpaceOnUse">
      <line x1="0" y1="31" x2="900" y2="31" stroke="#cbd5e1" stroke-width="1.2" />
    </pattern>
    <style>
      .handwritten-title { font-family: 'Comic Sans MS', 'Caveat', 'Segoe Print', cursive, sans-serif; font-size: 28px; font-weight: bold; fill: #1e293b; }
      .handwritten-sub { font-family: 'Comic Sans MS', 'Caveat', cursive, sans-serif; font-size: 18px; fill: #475569; }
      .handwritten-text { font-family: 'Comic Sans MS', 'Caveat', cursive, sans-serif; font-size: 19px; fill: #0f172a; line-height: 32px; }
      .formula-box { font-family: 'Courier New', monospace; font-size: 20px; font-weight: bold; fill: #1e3a8a; }
    </style>
  </defs>

  <!-- Paper background with warm off-white texture -->
  <rect width="900" height="1200" fill="#fafaf9" />
  <rect width="900" height="1200" fill="url(#ruled-lines)" />

  <!-- Red margin line on the left (classic college ruled notebook) -->
  <line x1="120" y1="0" x2="120" y2="1200" stroke="#f87171" stroke-width="2.5" />
  <line x1="123" y1="0" x2="123" y2="1200" stroke="#fca5a5" stroke-width="1" />

  <!-- Header Section -->
  <rect x="135" y="42" width="720" height="70" rx="8" fill="#f1f5f9" opacity="0.6" />
  <text x="145" y="75" class="handwritten-title">${title}</text>
  <text x="145" y="100" class="handwritten-sub">Course: ${course} | Date: ${date} | Page 1 of 1</text>

  <!-- Highlighting bar behind title -->
  <rect x="140" y="55" width="340" height="26" fill="${highlightColor}" opacity="0.45" rx="4" />

  <!-- Content Lines -->
  ${lines
    .map(
      (line, i) => `
    <text x="140" y="${160 + i * 32}" class="handwritten-text">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
  `
    )
    .join('')}

  <!-- Optional diagram or visual annotation -->
  ${diagramSvg}

  <!-- Bottom footer -->
  <text x="750" y="1175" class="handwritten-sub" font-size="14" fill="#94a3b8">StudySnap Note #102</text>
</svg>`;

  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

export interface SampleNote {
  id: string;
  title: string;
  subject: string;
  course: string;
  description: string;
  thumbnail: string;
  previewUrl: string;
}

export const SAMPLE_NOTES: SampleNote[] = [
  {
    id: 'bio-mitosis',
    title: 'Mitosis & Cell Division Cycle',
    subject: 'Cellular Biology',
    course: 'BIO 101 - Cell Biology',
    description: 'Detailed lecture notes covering Interphase, Prophase, Metaphase, Anaphase, Telophase, and Cytokinesis with spindle fiber checkpoints.',
    thumbnail: '🧬',
    previewUrl: createNotebookPageSvg({
      title: 'Mitosis & The Eukaryotic Cell Cycle',
      course: 'BIO 101 - Lecture 7',
      date: 'Fall Semester',
      highlightColor: '#fef08a',
      lines: [
        '★ Core Objective: Replicate DNA & divide chromosomes equally into 2 daughter cells.',
        '',
        '1. Interphase (90% of cell cycle time):',
        '   - G1 Phase: Cell growth, protein synthesis, duplicate organelles.',
        '   - S Phase (Synthesis): DNA replication takes place! Chromosomes double.',
        '   - G2 Phase: Final prep, microtubule assembly, G2/M DNA damage checkpoint.',
        '',
        '2. M Phase (Mitosis - 4 main nuclear division stages):',
        '   [P] Prophase: Chromatin condenses into visible sister chromatids.',
        '       Nuclear envelope breaks down. Centrosomes move to opposite poles.',
        '   [M] Metaphase: Chromosomes align single-file along the equator (Metaphase Plate).',
        '       Kinetochore fibers attach to centromeres. Spindle checkpoint!',
        '   [A] Anaphase: Sister chromatids pulled apart by shortening kinetochore fibers.',
        '       Chromatids are now individual daughter chromosomes!',
        '   [T] Telophase: 2 new nuclear membranes reform around separated chromatin.',
        '       Chromosomes decondense back into diffuse chromatin.',
        '',
        '3. Cytokinesis (Physical cytoplasm cleavage):',
        '   - Animal cells: Actin contractile ring creates Cleavage Furrow.',
        '   - Plant cells: Golgi vesicles form Cell Plate -> new cell wall.',
        '',
        '★ Crucial Checkpoint: M-Checkpoint prevents anaphase until ALL kinetochores are attached!',
        '★ Non-disjunction in anaphase leads to aneuploidy (e.g. Trisomy 21).',
      ],
      diagramSvg: `
        <!-- Diagram of metaphase to anaphase -->
        <g transform="translate(140, 920)">
          <rect x="0" y="0" width="700" height="210" rx="12" fill="#e0f2fe" opacity="0.7" stroke="#38bdf8" stroke-width="2" />
          <text x="20" y="32" class="handwritten-title" font-size="20" fill="#0369a1">Key Diagram: Metaphase vs Anaphase</text>
          
          <!-- Metaphase side -->
          <circle cx="160" cy="115" r="55" fill="#ffffff" stroke="#0284c7" stroke-dasharray="4,4" />
          <line x1="160" y1="65" x2="160" y2="165" stroke="#ef4444" stroke-width="3" />
          <text x="110" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0369a1">Metaphase Plate</text>

          <!-- Arrow -->
          <path d="M 270 115 L 340 115 M 325 105 L 340 115 L 325 125" stroke="#0369a1" stroke-width="3" fill="none" />

          <!-- Anaphase side -->
          <circle cx="460" cy="115" r="55" fill="#ffffff" stroke="#0284c7" stroke-dasharray="4,4" />
          <line x1="430" y1="80" x2="430" y2="150" stroke="#ef4444" stroke-width="3" />
          <line x1="490" y1="80" x2="490" y2="150" stroke="#ef4444" stroke-width="3" />
          <text x="400" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0369a1">Anaphase Separation</text>
        </g>
      `,
    }),
  },
  {
    id: 'chem-equilibrium',
    title: "Le Chatelier's Principle & Equilibrium",
    subject: 'General Chemistry',
    course: 'CHEM 102 - Chemical Reactions',
    description: 'Equilibrium constant expressions (Kc vs Kp), ICE tables, exothermic vs endothermic heat shifts, and stress response rules.',
    thumbnail: '⚗️',
    previewUrl: createNotebookPageSvg({
      title: "Chemical Equilibrium & Le Chatelier's Principle",
      course: 'CHEM 102 - Chapter 14',
      date: 'Spring Term',
      highlightColor: '#bae6fd',
      lines: [
        '★ Equilibrium Definition: Forward rate = Reverse rate. [Reactants] & [Products] remain constant!',
        '  Reaction does NOT stop — dynamic equilibrium.',
        '',
        'Equilibrium Expression for aA + bB ⇌ cC + dD:',
        '   K_eq = ([C]^c * [D]^d) / ([A]^a * [B]^b)',
        '   *Note: Pure SOLIDS (s) and LIQUIDS (l) are EXCLUDED from K_eq! (Activity = 1)',
        '',
        'Reaction Quotient Q vs Equilibrium K:',
        '   - If Q < K: Too many reactants -> shifts RIGHT (forward to make products)',
        '   - If Q = K: At dynamic equilibrium',
        '   - If Q > K: Too many products -> shifts LEFT (reverse to make reactants)',
        '',
        "Le Chatelier's Stress Responses (system acts to relieve applied stress):",
        '1. Concentration Stress:',
        '   - Add Reactant -> Shifts RIGHT to consume it.',
        '   - Remove Product -> Shifts RIGHT to replace it.',
        '',
        '2. Pressure / Volume Stress (Gaseous reactions ONLY):',
        '   - Increase Pressure (decrease Volume) -> Shifts toward FEWER moles of gas!',
        '   - Decrease Pressure (increase Volume) -> Shifts toward MORE moles of gas.',
        '',
        '3. Temperature Stress (Treat heat as reactant or product!):',
        '   - Exothermic (ΔH < 0): Reactants ⇌ Products + HEAT. Heating shifts LEFT, decreases K!',
        '   - Endothermic (ΔH > 0): Reactants + HEAT ⇌ Products. Heating shifts RIGHT, increases K!',
        '   *CRITICAL: Temperature is the ONLY factor that actually changes the numerical value of K!',
        '',
        '4. Catalyst: Speeds up BOTH forward & reverse rates equally. Does NOT shift equilibrium position.',
      ],
      diagramSvg: `
        <g transform="translate(140, 940)">
          <rect x="0" y="0" width="700" height="190" rx="10" fill="#fef3c7" opacity="0.75" stroke="#f59e0b" stroke-width="2" />
          <text x="25" y="35" class="handwritten-title" font-size="20" fill="#92400e">ICE Table Cheat Sheet (Initial, Change, Equilibrium)</text>
          <text x="25" y="70" class="formula-box" font-size="18" fill="#78350f">N2(g) + 3 H2(g) ⇌ 2 NH3(g)    (ΔH = -92 kJ, Exothermic)</text>
          <text x="25" y="105" font-family="sans-serif" font-size="16" fill="#1e293b">Initial:      1.0 M      3.0 M           0 M</text>
          <text x="25" y="135" font-family="sans-serif" font-size="16" fill="#dc2626">Change:      - x        - 3x           + 2x</text>
          <text x="25" y="165" font-family="sans-serif" font-size="16" font-weight="bold" fill="#047857">Equil:     (1.0 - x)   (3.0 - 3x)        (2x)</text>
        </g>
      `,
    }),
  },
  {
    id: 'econ-elasticity',
    title: 'Price Elasticity of Demand & Supply',
    subject: 'Microeconomics',
    course: 'ECON 201 - Micro Theory',
    description: 'Price elasticity formula, midpoint method, total revenue test, inelastic vs elastic demand curves, and determinants of elasticity.',
    thumbnail: '📈',
    previewUrl: createNotebookPageSvg({
      title: 'Price Elasticity of Demand (PED)',
      course: 'ECON 201 - Unit 3 Notes',
      date: 'Midterm Prep',
      highlightColor: '#ddd6fe',
      lines: [
        '★ Concept: Measures how sensitive quantity demanded (Qd) is to a change in price (P).',
        '',
        'Midpoint Formula for Price Elasticity (avoids direction bias):',
        '   PED = [ (Q2 - Q1) / ((Q1 + Q2) / 2) ] / [ (P2 - P1) / ((P1 + P2) / 2) ]',
        '   Always report PED as absolute value |Ed|.',
        '',
        'Classification of Elasticity Values:',
        '   - |Ed| > 1 : ELASTIC (Consumers are highly responsive. Small price hike = huge drop in Qd)',
        '   - |Ed| = 1 : UNIT ELASTIC (Percentage change in Q equals percentage change in P)',
        '   - |Ed| < 1 : INELASTIC (Consumers are price insensitive. Necessities, few substitutes)',
        '   - |Ed| = 0 : PERFECTLY INELASTIC (Vertical demand curve. e.g. Life-saving Insulin)',
        '   - |Ed| = ∞ : PERFECTLY ELASTIC (Horizontal demand curve. Pure commodity)',
        '',
        'Total Revenue Test (TR = Price × Quantity):',
        '   - If Demand is ELASTIC (|Ed| > 1): Price ↑ => Total Revenue ↓ (Quantity effect dominates)',
        '   - If Demand is INELASTIC (|Ed| < 1): Price ↑ => Total Revenue ↑ (Price effect dominates)',
        '   - If Demand is UNIT ELASTIC: Price change does not affect Total Revenue (TR is maximized!)',
        '',
        'Determinants of Elasticity (SPAM):',
        '   1. Substitutes available (more substitutes = more elastic)',
        '   2. Proportion of income spent (cars = elastic; pack of gum = inelastic)',
        '   3. Addictiveness / Necessity vs Luxury (necessity = inelastic)',
        '   4. Time horizon (longer time = consumers adapt = more elastic)',
      ],
      diagramSvg: `
        <g transform="translate(140, 940)">
          <rect x="0" y="0" width="700" height="190" rx="10" fill="#f3e8ff" opacity="0.8" stroke="#a855f7" stroke-width="2" />
          <text x="25" y="35" class="handwritten-title" font-size="20" fill="#6b21a8">Quick Decision Matrix: Total Revenue vs Price</text>
          <text x="25" y="75" font-family="sans-serif" font-size="16" fill="#1e293b">• Inelastic (|Ed| &lt; 1): Raising tuition increases university total revenue.</text>
          <text x="25" y="110" font-family="sans-serif" font-size="16" fill="#1e293b">• Elastic (|Ed| &gt; 1): Airline raising ticket price drops airline total revenue.</text>
          <text x="25" y="145" font-family="sans-serif" font-size="16" font-weight="bold" fill="#7c3aed">• Revenue Peak: Happens exactly where Demand passes through Unit Elasticity (|Ed| = 1).</text>
        </g>
      `,
    }),
  },
];
