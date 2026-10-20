/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudySummary, Flashcard, QuizQuestion } from '../types/study';

export interface SampleStudyMaterial {
  id: string;
  title: string;
  subject: string;
  summary: StudySummary;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export const SAMPLE_STUDY_MATERIALS: Record<string, SampleStudyMaterial> = {
  'bio-mitosis': {
    id: 'bio-mitosis',
    title: 'Mitosis & The Eukaryotic Cell Cycle',
    subject: 'Cellular Biology',
    summary: {
      subjectArea: 'Cellular Biology',
      topicTitle: 'Mitosis & The Eukaryotic Cell Cycle',
      estimatedStudyTimeMinutes: 18,
      executiveSummary: `The eukaryotic cell cycle is an orderly sequence of events in which a cell duplicates its contents and divides into two genetically identical daughter cells. The cycle is divided into two broad phases: Interphase (comprising G1, S, and G2 phases) which occupies about 90% of the cell cycle time, and M Phase (Mitosis and Cytokinesis).

During Interphase, the cell synthesizes proteins, produces organelles, and duplicates its chromosomal DNA during the S (Synthesis) phase. The subsequent M Phase encompasses four tightly regulated nuclear division stages: Prophase (chromatin condensation and spindle formation), Metaphase (chromosome alignment at the equatorial plane), Anaphase (sister chromatid separation), and Telophase (nuclear envelope reformation). Physical division of the cytoplasm (Cytokinesis) follows via an actin cleavage furrow in animal cells or a vesicle-derived cell plate in plant cells.

The cell cycle is governed by critical checkpoints—particularly the G1/S restriction point, the G2/M DNA damage checkpoint, and the Spindle Assembly Checkpoint (M-Checkpoint). Failure of these surveillance mechanisms can result in genomic instability, aneuploidy, or uncontrolled oncogenic proliferation.`,
      keyTakeaways: [
        'Interphase encompasses G1, S (DNA replication), and G2 phases, consuming ~90% of cell cycle duration.',
        'The four mitotic stages follow PMAT: Prophase (condense), Metaphase (align), Anaphase (separate), Telophase (reform).',
        'In Anaphase, sister chromatids are pulled toward opposite spindle poles and become independent daughter chromosomes.',
        'Cytokinesis differs between kingdoms: actin cleavage furrow in animals vs Golgi cell plate in plants.',
        'The M-Checkpoint ensures all kinetochores are securely bound to spindle microtubules before allowing Anaphase separation.',
      ],
      keyConcepts: [
        {
          term: 'Sister Chromatids',
          definition: 'Two identical copies of a single replicated chromosome joined together at a centromere.',
          importance: 'essential',
          context: 'Created during S-phase; separated into individual chromosomes during Anaphase.',
        },
        {
          term: 'Kinetochore',
          definition: 'A multi-protein complex assembled on the centromere that anchors spindle microtubules.',
          importance: 'essential',
          context: 'Directs chromosome movement and signals the Spindle Assembly Checkpoint.',
        },
        {
          term: 'Cleavage Furrow',
          definition: 'A shallow groove in animal cell surfaces made by a contractile ring of actin microfilaments.',
          importance: 'high',
          context: 'Pinches the animal cell membrane in two during cytokinesis.',
        },
        {
          term: 'Cell Plate',
          definition: 'A membrane-bound disc formed by fusing Golgi vesicles along the plant cell equator.',
          importance: 'high',
          context: 'Forms the middle lamella and primary cell wall between new plant cells.',
        },
        {
          term: 'M-Checkpoint (Spindle Checkpoint)',
          definition: 'A cellular surveillance mechanism ensuring all chromosomes are bi-oriented on the spindle.',
          importance: 'essential',
          context: 'Prevents premature anaphase and nondisjunction aneuploidy like Down Syndrome.',
        },
      ],
      formulasAndEquations: [
        {
          label: 'Chromosome Count Rule in Mitosis',
          formula: '2n (Diploid Parent) ➔ 2n + 2n (Two Diploid Daughters)',
          explanation: 'Mitosis preserves exact chromosome ploidy, unlike meiosis which halves chromosome count to 1n.',
        },
      ],
      simplifiedBreakdowns: [
        {
          title: 'Mitosis vs Cytokinesis',
          simpleExplanation: 'Mitosis is just dividing the blueprints (nucleus & DNA). Cytokinesis is cutting the physical house in half (the cytoplasm and cell membrane).',
          analogy: 'Imagine photocopying a 100-page textbook into two identical binders (Mitosis), then putting each binder into separate backpacks (Cytokinesis).',
        },
        {
          title: 'The M-Checkpoint',
          simpleExplanation: 'A safety lock that stops the cell from pulling chromosomes apart until every single one is properly strapped in.',
          analogy: 'Like a rollercoaster operator checking that every passenger has clicked their safety harness before pulling the launch lever.',
        },
      ],
      unclearOrCutoffNotes: [],
    },
    flashcards: [
      {
        id: 'fc-bio-1',
        front: 'What major molecular event occurs strictly during the S phase of Interphase?',
        back: 'DNA replication (chromosomes duplicate so each has two identical sister chromatids).',
        category: 'Cell Cycle',
        hint: 'S stands for Synthesis.',
        mastered: false,
      },
      {
        id: 'fc-bio-2',
        front: 'In which mitotic stage do chromosomes line up single-file along the equator of the cell?',
        back: 'Metaphase (aligned on the metaphase plate).',
        category: 'Mitosis Stages',
        hint: 'M for Middle.',
        mastered: false,
      },
      {
        id: 'fc-bio-3',
        front: 'What physical structure divides the cytoplasm in plant cells during cytokinesis?',
        back: 'The Cell Plate (formed by coalescing Golgi-derived vesicles carrying cell wall materials).',
        category: 'Cytokinesis',
        hint: 'Unlike animal cells which use an actin cleavage furrow.',
        mastered: false,
      },
      {
        id: 'fc-bio-4',
        front: 'What structure attaches spindle microtubules directly to centromeres?',
        back: 'The Kinetochore (a specialized protein complex on the centromere).',
        category: 'Cell Anatomy',
        hint: 'Spindle fibers pull on this specific protein anchor.',
        mastered: false,
      },
      {
        id: 'fc-bio-5',
        front: 'At what exact moment do sister chromatids become classified as individual chromosomes?',
        back: 'During Anaphase, as soon as their centromeres split and they are pulled apart.',
        category: 'Mitosis Stages',
        hint: 'A for Apart.',
        mastered: false,
      },
      {
        id: 'fc-bio-6',
        front: 'What dangerous genetic error occurs if the M-checkpoint fails to detect unattached chromatids?',
        back: 'Nondisjunction, leading to daughter cells with abnormal chromosome counts (aneuploidy).',
        category: 'Checkpoints',
        hint: 'Unequal distribution of chromosomes.',
        mastered: false,
      },
    ],
    quiz: [
      {
        id: 'qz-bio-1',
        question: 'Which of the following correctly orders the four sequential stages of mitosis?',
        options: [
          'Prophase, Metaphase, Anaphase, Telophase',
          'Interphase, Prophase, Metaphase, Cytokinesis',
          'Metaphase, Prophase, Telophase, Anaphase',
          'Prophase, Anaphase, Metaphase, Telophase',
        ],
        correctIndex: 0,
        explanation: 'The standard mnemonic is PMAT: Prophase (condensation), Metaphase (alignment at the middle), Anaphase (separation apart), and Telophase (two new nuclei form). Interphase and Cytokinesis precede and follow mitosis.',
        hint: 'Remember the acronym PMAT.',
        difficulty: 'easy',
      },
      {
        id: 'qz-bio-2',
        question: 'Why can plant cells NOT form a cleavage furrow during cytokinesis like animal cells do?',
        options: [
          'They possess a rigid cellulose cell wall that cannot be pinched inward',
          'They lack actin microfilaments and myosin motor proteins',
          'Their mitotic spindle fibers never dissolve after telophase',
          'They do not replicate their nuclear membranes during mitosis',
        ],
        correctIndex: 0,
        explanation: 'The rigid cellulose cell wall prevents the plant cell membrane from invaginating. Instead, plant cells construct a cell plate from Golgi vesicles along the phragmoplast.',
        hint: 'Think about plant cell wall structure.',
        difficulty: 'medium',
      },
      {
        id: 'qz-bio-3',
        question: 'A human somatic cell has 46 chromosomes in G1. How many chromatids are present during Metaphase?',
        options: ['92 chromatids', '46 chromatids', '23 chromatids', '184 chromatids'],
        correctIndex: 0,
        explanation: 'During S phase, each of the 46 chromosomes replicates into two sister chromatids. In Metaphase, they remain joined at the centromere, giving 46 chromosomes made of 92 sister chromatids.',
        hint: 'Each chromosome has 2 sister chromatids after S phase.',
        difficulty: 'hard',
      },
      {
        id: 'qz-bio-4',
        question: 'What is the primary function of the M-phase spindle checkpoint?',
        options: [
          'To verify that all kinetochores are securely bound to spindle microtubules before anaphase begins',
          'To check whether the DNA sequence has any replication errors or mutations',
          'To trigger the breakdown of the nuclear envelope in early prophase',
          'To ensure the cell has reached sufficient size and mass in G1 phase',
        ],
        correctIndex: 0,
        explanation: 'The M-checkpoint (Spindle Assembly Checkpoint) halts the transition from metaphase to anaphase until all sister chromatids are amphitelically attached to the mitotic spindle.',
        hint: 'It checks chromosome attachment at the metaphase plate.',
        difficulty: 'medium',
      },
      {
        id: 'qz-bio-5',
        question: 'Which protein filaments compose the contractile ring responsible for the animal cleavage furrow?',
        options: [
          'Actin and myosin',
          'Tubulin and dynein',
          'Keratin and collagen',
          'Histone and condensin',
        ],
        correctIndex: 0,
        explanation: 'The contractile ring is an actomyosin ring composed of actin microfilaments and non-muscle myosin II motor proteins that cinch the plasma membrane.',
        hint: 'Same filaments used in muscle contraction.',
        difficulty: 'hard',
      },
    ],
  },
  'chem-equilibrium': {
    id: 'chem-equilibrium',
    title: "Chemical Equilibrium & Le Chatelier's Principle",
    subject: 'General Chemistry',
    summary: {
      subjectArea: 'General Chemistry',
      topicTitle: "Chemical Equilibrium & Le Chatelier's Principle",
      estimatedStudyTimeMinutes: 20,
      executiveSummary: `Chemical equilibrium represents a dynamic state in a closed reversible system where the rate of the forward reaction equals the rate of the reverse reaction. At equilibrium, the concentrations of reactants and products remain constant over time, although chemical conversion continues simultaneously in both directions.

The equilibrium constant (K_eq) quantifies the ratio of product activities to reactant activities at a specific temperature. Pure solids and pure liquids are omitted from the equilibrium expression because their concentration/density remains constant. Comparing the reaction quotient (Q) to K reveals the direction a non-equilibrium system must shift to reach equilibrium.

Le Chatelier's Principle dictates that when a system at equilibrium is subjected to an external stress (changes in concentration, pressure/volume, or temperature), the system will shift its equilibrium position to counteract that perturbation. Crucially, temperature is the only variable that alters the numerical equilibrium constant K itself.`,
      keyTakeaways: [
        'At dynamic equilibrium, forward rate equals reverse rate; concentrations do NOT have to be equal, only constant.',
        'Pure solids (s) and pure liquids (l) are strictly omitted from equilibrium constant expressions.',
        'If Q < K, system shifts RIGHT toward products; if Q > K, system shifts LEFT toward reactants.',
        'Increasing total pressure shifts the system toward the side with fewer moles of gas.',
        'Temperature is the ONLY disturbance that alters the numerical value of K_eq.',
      ],
      keyConcepts: [
        {
          term: 'Dynamic Equilibrium',
          definition: 'A state where opposing reactions proceed at equal rates, maintaining constant macroscopic concentrations.',
          importance: 'essential',
          context: 'Reactions never stop; molecules continuously interconvert.',
        },
        {
          term: 'Reaction Quotient (Q)',
          definition: 'A calculated ratio of products to reactants with identical form to K, but calculated using non-equilibrium concentrations.',
          importance: 'essential',
          context: 'Determines whether forward or reverse reaction is favored at any instant.',
        },
        {
          term: "Le Chatelier's Principle",
          definition: 'If an equilibrium is subjected to a stress, the system adjusts in the direction that relieves the stress.',
          importance: 'essential',
          context: 'Predicts directional shifts when pressure, temperature, or concentration changes.',
        },
        {
          term: 'Catalyst at Equilibrium',
          definition: 'A substance that lowers activation energy equally for both forward and reverse pathways.',
          importance: 'high',
          context: 'Accelerates how quickly equilibrium is reached without shifting position or changing K.',
        },
      ],
      formulasAndEquations: [
        {
          label: 'General Equilibrium Expression (aA + bB ⇌ cC + dD)',
          formula: 'K_eq = ([C]^c * [D]^d) / ([A]^a * [B]^b)',
          explanation: 'Coefficients become exponents. Pure solids and liquids are omitted.',
        },
        {
          label: "Van 't Hoff Temperature Relation",
          formula: 'Exothermic (ΔH < 0): Temp ↑ ➔ K ↓ | Endothermic (ΔH > 0): Temp ↑ ➔ K ↑',
          explanation: 'Treat heat as a product in exothermic reactions and as a reactant in endothermic reactions.',
        },
      ],
      simplifiedBreakdowns: [
        {
          title: 'Dynamic Equilibrium',
          simpleExplanation: 'People walking up a down-escalator at the exact same walking speed as the escalator moves down.',
          analogy: 'To an outside observer, the person is standing completely still, even though their legs and the escalator are in continuous motion.',
        },
        {
          title: "Le Chatelier's Reaction to Pressure",
          simpleExplanation: 'When you squeeze a crowded elevator, everyone packs into the smaller corner with fewer people.',
          analogy: 'Increasing pressure squeezes the container, so gas molecules condense toward whatever side has fewer gas molecules to relieve the crowded pressure.',
        },
      ],
      unclearOrCutoffNotes: [],
    },
    flashcards: [
      {
        id: 'fc-chem-1',
        front: 'Why are pure solids and pure liquids excluded from the equilibrium constant expression (K_eq)?',
        back: 'Their concentration (density divided by molar mass) remains constant regardless of the amount present.',
        category: 'Equilibrium Math',
        hint: 'Activity is defined as 1.',
        mastered: false,
      },
      {
        id: 'fc-chem-2',
        front: 'If Q = 45 and K = 120 at 298 K, which direction will the reaction shift?',
        back: 'Shifts RIGHT (forward) because Q < K, meaning there are excess reactants relative to products.',
        category: 'Reaction Quotient',
        hint: 'Q wants to grow up to reach K.',
        mastered: false,
      },
      {
        id: 'fc-chem-3',
        front: 'For an EXOTHERMIC reaction (ΔH < 0), what happens to the value of K if temperature is increased?',
        back: 'K decreases, and the reaction shifts LEFT toward reactants (heat is a product).',
        category: 'Temperature Effect',
        hint: 'Treat heat as a product.',
        mastered: false,
      },
      {
        id: 'fc-chem-4',
        front: 'How does adding a chemical catalyst affect the equilibrium position and the numerical value of K?',
        back: 'No change! A catalyst speeds up forward and reverse rates equally; it only helps reach equilibrium faster.',
        category: 'Catalysis',
        hint: 'Does a catalyst favor one side?',
        mastered: false,
      },
      {
        id: 'fc-chem-5',
        front: 'What happens to the equilibrium of N2(g) + 3H2(g) ⇌ 2NH3(g) if container volume is halved?',
        back: 'Halving volume doubles pressure; system shifts RIGHT (4 moles of gas reactant ➔ 2 moles of gas product).',
        category: 'Pressure Stress',
        hint: 'Count the moles of gas on each side.',
        mastered: false,
      },
    ],
    quiz: [
      {
        id: 'qz-chem-1',
        question: 'Which of the following stresses will change the numerical value of the equilibrium constant K?',
        options: [
          'Changing the reaction temperature',
          'Adding a positive platinum catalyst',
          'Doubling the total atmospheric pressure',
          'Injecting an inert gas such as helium at constant volume',
        ],
        correctIndex: 0,
        explanation: 'Temperature is the sole variable in the Arrhenius/van t Hoff relationship that changes K. Concentration and pressure shift positions, but K remains constant at constant temperature.',
        hint: 'Only one thermodynamic variable alters K.',
        difficulty: 'medium',
      },
      {
        id: 'qz-chem-2',
        question: 'Consider CaCO3(s) ⇌ CaO(s) + CO2(g). What is the correct equilibrium expression for Kc?',
        options: [
          'Kc = [CO2]',
          'Kc = ([CaO][CO2]) / [CaCO3]',
          'Kc = [CO2] / [CaCO3]',
          'Kc = 1 / [CO2]',
        ],
        correctIndex: 0,
        explanation: 'CaCO3 and CaO are pure solids, so their activities are 1. The only gaseous or aqueous species is CO2(g), making Kc = [CO2].',
        hint: 'Exclude all solid species.',
        difficulty: 'easy',
      },
      {
        id: 'qz-chem-3',
        question: 'In the endothermic reaction 2 NO2(g) [brown] ⇌ N2O4(g) [colorless] (ΔH > 0), what happens when cooled in an ice bath?',
        options: [
          'The mixture shifts LEFT, becoming more brown',
          'The mixture shifts RIGHT, becoming more colorless',
          'No shift occurs because total gas moles are unequal',
          'K increases and pressure drops to zero',
        ],
        correctIndex: 0,
        explanation: 'In an endothermic reaction, heat is a reactant (Heat + 2 NO2 ⇌ N2O4). Removing heat by cooling pulls the reaction to the reactant side (LEFT), producing more brown NO2.',
        hint: 'Cooling removes heat from the reactant side.',
        difficulty: 'hard',
      },
    ],
  },
  'econ-elasticity': {
    id: 'econ-elasticity',
    title: 'Price Elasticity of Demand & Supply',
    subject: 'Microeconomics',
    summary: {
      subjectArea: 'Microeconomics',
      topicTitle: 'Price Elasticity of Demand & Supply',
      estimatedStudyTimeMinutes: 16,
      executiveSummary: `Price elasticity of demand (PED) quantifies the percentage responsiveness of the quantity demanded of a good to a percentage change in its price. Economists utilize the midpoint formula to calculate elasticity values that remain symmetrical regardless of whether price increases or decreases.

Goods with many substitutes, luxury status, or representing a high percentage of consumer budget exhibit price-elastic demand (|Ed| > 1), meaning consumers are highly price-sensitive. Conversely, essential goods with few substitutes (e.g., insulin, basic utilities) exhibit inelastic demand (|Ed| < 1).

The Total Revenue Test provides a direct relationship: for inelastic goods, raising prices increases total firm revenue because price gains surpass quantity losses. For elastic goods, raising prices causes revenue to fall. Revenue reaches its maximum at unit elasticity (|Ed| = 1).`,
      keyTakeaways: [
        'Use the Midpoint Method to calculate elasticity to ensure consistent values between two price points.',
        '|Ed| > 1 is Elastic; |Ed| < 1 is Inelastic; |Ed| = 1 is Unit Elastic.',
        'Inelastic Demand: Price and Total Revenue move in the SAME direction (P↑ ➔ TR↑).',
        'Elastic Demand: Price and Total Revenue move in OPPOSITE directions (P↑ ➔ TR↓).',
        'Total revenue is mathematically maximized at the unit elastic point of the demand curve.',
      ],
      keyConcepts: [
        {
          term: 'Price Elasticity of Demand (PED)',
          definition: 'The percentage change in quantity demanded divided by percentage change in price.',
          importance: 'essential',
          context: 'Measures consumer price sensitivity.',
        },
        {
          term: 'Total Revenue Test',
          definition: 'A method evaluating elasticity by comparing directional changes between price and revenue.',
          importance: 'essential',
          context: 'Crucial for firms deciding pricing strategy.',
        },
        {
          term: 'Cross-Price Elasticity of Demand (XED)',
          definition: 'Responsiveness of demand for good A following a price change in good B.',
          importance: 'high',
          context: 'Positive for substitutes; negative for complements.',
        },
      ],
      formulasAndEquations: [
        {
          label: 'Midpoint Elasticity Formula',
          formula: 'PED = [ (Q2 - Q1) / ((Q1 + Q2) / 2) ] / [ (P2 - P1) / ((P1 + P2) / 2) ]',
          explanation: 'Computes percentage changes relative to the average base values.',
        },
        {
          label: 'Total Revenue Relationship',
          formula: 'TR = Price (P) × Quantity (Q)',
          explanation: 'If |Ed| < 1: P↑ ➔ TR↑. If |Ed| > 1: P↑ ➔ TR↓.',
        },
      ],
      simplifiedBreakdowns: [
        {
          title: 'Elastic vs Inelastic Goods',
          simpleExplanation: 'Elastic = You have options and walk away if price jumps. Inelastic = You need it to survive, so you pay whatever they ask.',
          analogy: 'Elastic: A scoop of ice cream. If the truck charges $20, you just buy cookies instead. Inelastic: Gasoline when your car is stranded on an empty highway.',
        },
      ],
      unclearOrCutoffNotes: [],
    },
    flashcards: [
      {
        id: 'fc-econ-1',
        front: 'If a subway system raises fares by 10% and ridership drops by only 2%, is demand elastic or inelastic?',
        back: 'Inelastic (|Ed| = 2% / 10% = 0.2 < 1). Total revenue will increase.',
        category: 'Elasticity Classification',
        hint: 'Compare % change in quantity to % change in price.',
        mastered: false,
      },
      {
        id: 'fc-econ-2',
        front: 'What happens to total revenue when a company cuts prices on an ELASTIC good (|Ed| > 1)?',
        back: 'Total revenue increases, because the percentage gain in quantity sold exceeds the price drop.',
        category: 'Total Revenue Test',
        hint: 'Think opposite movements.',
        mastered: false,
      },
      {
        id: 'fc-econ-3',
        front: 'What does a vertical demand curve indicate about price elasticity?',
        back: 'Perfect elasticity of zero (|Ed| = 0; perfectly inelastic). Quantity demanded does not change at any price.',
        category: 'Curve Shapes',
        hint: 'Completely insensitive to price changes.',
        mastered: false,
      },
    ],
    quiz: [
      {
        id: 'qz-econ-1',
        question: 'A movie theater wants to increase total revenue. Its analysts find that ticket demand is elastic (|Ed| = 1.6). What should it do?',
        options: [
          'Decrease ticket prices',
          'Increase ticket prices',
          'Keep ticket prices exactly constant',
          'Eliminate student discounts',
        ],
        correctIndex: 0,
        explanation: 'When demand is elastic (|Ed| > 1), a price cut causes a proportionally larger increase in ticket sales, driving up total revenue.',
        hint: 'Elastic demand requires moving price opposite to desired revenue.',
        difficulty: 'medium',
      },
      {
        id: 'qz-econ-2',
        question: 'If the cross-price elasticity of demand between two products is negative (XED < 0), the goods are:',
        options: [
          'Complements (e.g., hot dogs and hot dog buns)',
          'Substitutes (e.g., butter and margarine)',
          'Inferior goods (e.g., instant ramen)',
          'Normal luxury goods (e.g., sports cars)',
        ],
        correctIndex: 0,
        explanation: 'When good B becomes more expensive, people buy less of both good B and its complement good A. Thus, XED is negative.',
        hint: 'They are consumed together.',
        difficulty: 'medium',
      },
    ],
  },
};
