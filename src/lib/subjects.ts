export const CAPS_SUBJECTS = [
  { name: "Mathematics", icon: "∑", color: "#7C3AED", topics: ["Algebra & Equations","Functions & Graphs","Trigonometry","Geometry","Statistics & Probability","Vectors","Calculus (Gr 12)"] },
  { name: "Mathematical Literacy", icon: "◐", color: "#0EA5E9", topics: ["Finance & Interest","Measurement","Data Handling","Maps & Scale","Tax & Budgeting"] },
  { name: "English", icon: "Aa", color: "#EC4899", topics: ["Comprehension","Essay Writing","Literature & Poetry","Language Structures","Visual Literacy"] },
  { name: "Accounting", icon: "R", color: "#059669", topics: ["Double Entry","Trial Balance","Financial Statements","Cash Flow","Costing & Budgets"] },
  { name: "Business Studies", icon: "◆", color: "#F59E0B", topics: ["Business Environment","Management & Leadership","Marketing","Operations","Entrepreneurship"] },
  { name: "Economics", icon: "↗", color: "#0891B2", topics: ["Microeconomics","Macroeconomics","Market Structures","Fiscal & Monetary Policy","International Trade"] },
  { name: "Physical Sciences", icon: "⚛", color: "#6366F1", topics: ["Mechanics","Electricity & Magnetism","Waves & Light","Chemical Reactions","Organic Chemistry"] },
  { name: "Life Sciences", icon: "❋", color: "#16A34A", topics: ["Cells & Organisation","Genetics & Inheritance","Human Reproduction","Ecology","Evolution"] },
  { name: "History", icon: "◷", color: "#B45309", topics: ["Apartheid Resistance","Cold War","World War II","Decolonisation","South African History"] },
  { name: "Geography", icon: "◎", color: "#0D9488", topics: ["Geomorphology","Climatology","Settlement","Economic Geography","Map Skills"] },
  { name: "Life Orientation", icon: "♥", color: "#DB2777", topics: ["Health & Wellbeing","Careers & Study Choices","Human Rights","Environment","Relationships"] },
  { name: "IsiZulu", icon: "Z", color: "#9333EA", topics: ["Ukuqonda Okufundwayo","Ukubhala","Ulimi","Izincwadi","Ukuhlaziya"] },
  { name: "Afrikaans", icon: "A", color: "#EA580C", topics: ["Opsomming","Opstel","Letterkunde","Taalstrukture","Begripstoets"] },
  { name: "Sepedi", icon: "S", color: "#65A30D", topics: ["Tiriso","Mongwadi","Diprosa","Polelo","Tlhaloso"] },
  { name: "IsiXhosa", icon: "X", color: "#0284C7", topics: ["Ukuqonda","Ukubhala","Ulwimi","Iincwadi","Uhlalutyo"] },
  { name: "Sesotho", icon: "Se", color: "#C026D3", topics: ["Tiriso","Mongwadi","Diprosa","Polelo","Tlhaloso"] },
];

export const GRADES = [8,9,10,11,12];
export const CURRICULUMS = ["CAPS (South Africa)","Cambridge","IB","British","American","Other"];

export const KNOWLEDGE_BASE: Record<string, { title: string; simple: string; steps: string[]; example: string; keyPoints: string[]; examTip: string }> = {
  "photosynthesis": {
    title: "Photosynthesis",
    simple: "Photosynthesis is how plants make their own food using sunlight. Think of a plant as a tiny kitchen: sunlight is the stove, water from the roots and carbon dioxide from the air are the ingredients, and glucose (sugar) is the food it cooks. Oxygen is released as a leftover — which is why forests help us breathe.",
    steps: ["1. Chlorophyll in leaves captures sunlight energy.","2. Roots absorb water from the soil.","3. Leaves take in carbon dioxide from the air through tiny pores called stomata.","4. Using sunlight energy, the plant converts water + carbon dioxide into glucose and oxygen.","5. Glucose gives the plant energy to grow; oxygen is released into the air."],
    example: "A maize plant in summer: sunlight + water + CO₂ → glucose for growth + oxygen for us to breathe. Equation: 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂.",
    keyPoints: ["Needs: sunlight, water, carbon dioxide, chlorophyll","Produces: glucose (food) + oxygen","Happens in: leaves (chloroplasts)","Opposite of respiration"],
    examTip: "CAPS exam favourite: write the word equation AND the balanced chemical equation. Label the leaf diagram (stomata, chlorophyll, xylem, phloem).",
  },
  "algebra": {
    title: "Algebra — Solving Equations",
    simple: "Algebra is like solving a puzzle where a letter (like x) hides a number. Your job is to find that number by keeping both sides of the equation balanced — whatever you do to one side, do to the other.",
    steps: ["1. Simplify each side (brackets, like terms).","2. Move letters to one side, numbers to the other (change sign when crossing =).","3. Combine like terms.","4. Divide by the coefficient of x.","5. Check by substituting your answer back in."],
    example: "2x + 6 = 14 → 2x = 14 − 6 = 8 → x = 4. Check: 2(4)+6 = 14 ✓",
    keyPoints: ["Balance both sides","Change sign when moving across =","Always check your answer","x is the unknown to find"],
    examTip: "Show every step — CAPS marks method even if the final answer slips. Never divide by zero.",
  },
  "trigonometry": {
    title: "Trigonometry (SOHCAHTOA)",
    simple: "Trigonometry helps you find missing sides or angles in a right-angled triangle. Remember SOH-CAH-TOA: Sine = Opposite/Hypotenuse, Cosine = Adjacent/Hypotenuse, Tangent = Opposite/Adjacent.",
    steps: ["1. Draw the triangle and label O, A, H relative to the given angle.","2. Choose SOH, CAH or TOA based on the sides you know/want.","3. Write the ratio equation.","4. Solve for the unknown (use inverse sin/cos/tan for angles).","5. Round sensibly (1 decimal for lengths in CAPS)."],
    example: "Angle 30°, hypotenuse 10 cm. Opposite = sin(30°) × 10 = 5 cm.",
    keyPoints: ["Hypotenuse is opposite the right angle","SOHCAHTOA","Use inverse functions for angles","Angles in a triangle sum to 180°"],
    examTip: "Always sketch and label first — half the marks are for the correct ratio.",
  },
  "newton": {
    title: "Newton's Laws of Motion",
    simple: "Newton's laws explain how objects move. Law 1: objects keep doing what they're doing unless a force acts. Law 2: force = mass × acceleration (F = ma). Law 3: every action has an equal and opposite reaction.",
    steps: ["1. Identify all forces on the object (weight, normal, friction, applied).","2. Draw a free-body diagram.","3. Choose positive direction and resolve forces.","4. Apply F_net = ma.","5. Solve for acceleration, then use motion equations if needed."],
    example: "A 2 kg trolley with 10 N force: a = F/m = 10/2 = 5 m/s².",
    keyPoints: ["F = ma","Inertia = resistance to change in motion","Action–reaction pairs act on different objects","Weight = mg (g = 9.8 m/s²)"],
    examTip: "State the law you are using and draw the force diagram — examiners look for both.",
  },
  "cell": {
    title: "The Cell",
    simple: "The cell is the smallest living unit — like a tiny factory. The nucleus is the manager (controls everything), mitochondria are the power stations (make energy), and the cell membrane is the security gate (controls what enters and leaves).",
    steps: ["1. Cell membrane controls entry/exit.","2. Cytoplasm is the jelly where reactions happen.","3. Nucleus contains DNA and controls the cell.","4. Mitochondria release energy from glucose.","5. Ribosomes build proteins; vacuole stores sap; chloroplasts (in plants) do photosynthesis."],
    example: "A muscle cell has many mitochondria because it needs lots of energy to contract. A root hair cell has a large vacuole and no chloroplasts.",
    keyPoints: ["Plant cells have cell wall + chloroplasts + large vacuole","Animal cells have no cell wall","Mitochondria = energy","Nucleus = control centre"],
    examTip: "Learn to label a cell diagram perfectly — it appears in almost every Life Sciences paper.",
  },
  "genetics": {
    title: "Genetics & Inheritance",
    simple: "Genetics is how traits (like eye colour) pass from parents to children. Genes are instructions written in DNA. You inherit one copy of each gene from each parent — that is why children look like a mix of both parents.",
    steps: ["1. A gene is a section of DNA for one trait.","2. Alleles are versions of a gene (e.g. brown vs blue eyes).","3. Dominant alleles show even if only one copy is present.","4. Use a Punnett square to predict offspring combinations.","5. Calculate ratios (e.g. 3:1) from the square."],
    example: "Bb × Bb → BB, Bb, Bb, bb → 3 brown : 1 blue (if B = brown dominant).",
    keyPoints: ["Genotype = genetic makeup, Phenotype = visible trait","Homozygous = same alleles, Heterozygous = different","Punnett squares predict outcomes","DNA is in chromosomes in the nucleus"],
    examTip: "Draw the Punnett square neatly and state genotype AND phenotype ratios.",
  },
  "apartheid": {
    title: "Apartheid & Resistance in South Africa",
    simple: "Apartheid (1948–1994) was a system where the white minority government separated and oppressed Black South Africans. People resisted through protests, strikes, underground movements and international pressure — eventually forcing change in 1994.",
    steps: ["1. 1948: National Party introduces apartheid laws (pass laws, Group Areas, Bantu Education).","2. 1950s–60s: Defiance Campaign, ANC banned, Sharpeville Massacre (1960) — ANC goes underground.","3. 1976: Soweto Uprising — students protest Afrikaans instruction.","4. 1980s: Township resistance, states of emergency, international sanctions.","5. 1990: Nelson Mandela released. 1994: first democratic election."],
    example: "The Rivonia Trial (1964) sentenced Mandela and others to life imprisonment on Robben Island — a turning point that kept the struggle visible worldwide.",
    keyPoints: ["Apartheid = racial separation by law","Key dates: 1948, 1960, 1976, 1990, 1994","ANC, PAC, UDF were resistance movements","Sanctions pressured the government economically"],
    examTip: "CAPS History loves source analysis — always link evidence to the question and mention cause + effect.",
  },
  "supply": {
    title: "Supply & Demand",
    simple: "Supply and demand explain how prices are decided. When many people want something (high demand) and little is available, price rises. When supply is high and demand is low, price falls. The market finds a balance point.",
    steps: ["1. Demand: as price falls, quantity demanded rises (inverse relationship).","2. Supply: as price rises, quantity supplied rises (direct relationship).","3. Equilibrium is where demand = supply.","4. A demand increase shifts the curve right → price & quantity rise.","5. A supply decrease shifts the curve left → price rises, quantity falls."],
    example: "Drought reduces maize supply → supply curve shifts left → maize price rises → consumers buy less.",
    keyPoints: ["Demand ↓ price → quantity ↑","Supply ↑ price → quantity ↑","Equilibrium = no shortage/surplus","Shifts vs movements along a curve differ"],
    examTip: "Draw labelled diagrams with axes, equilibrium point and arrows showing the shift direction.",
  },
  "accounting": {
    title: "Accounting — The Accounting Equation",
    simple: "Accounting tracks money using one golden rule: Assets = Liabilities + Owner's Equity. Everything a business owns (assets) was paid for either by borrowing (liabilities) or by the owner (equity). If the equation balances, the books are correct.",
    steps: ["1. List assets (cash, stock, equipment, debtors).","2. List liabilities (creditors, bank loan).","3. Owner's equity = capital + profit − drawings.","4. Check: Assets − Liabilities = Equity.","5. Record every transaction in the journal, then post to ledger."],
    example: "Assets R50 000 − Liabilities R20 000 = Owner's Equity R30 000.",
    keyPoints: ["Assets = Liabilities + Equity","Debit increases assets/expenses; Credit increases income/liabilities","Trial balance checks arithmetic","Drawings reduce equity"],
    examTip: "CAPS Accounting rewards neat T-accounts and balancing figures — show workings.",
  },
  "essay": {
    title: "English Essay Writing",
    simple: "A great essay has a clear introduction, developed body paragraphs and a strong conclusion. Each paragraph makes ONE point, supports it with evidence, and links back to the topic.",
    steps: ["1. Plan: brainstorm ideas, choose a clear stance.","2. Introduction: hook + thesis statement (your argument).","3. Body: PEEL — Point, Evidence, Explain, Link (one idea per paragraph).","4. Vary sentence length and use linking words (however, furthermore, therefore).","5. Conclusion: restate thesis in new words and leave a lasting thought."],
    example: "PEEL: 'Technology isolates us.' (Point) 'Studies show teens check phones 150× a day.' (Evidence) 'This replaces face-to-face conversation.' (Explain) 'Therefore, balance is essential.' (Link)",
    keyPoints: ["One idea per paragraph","Thesis in the introduction","Evidence + explanation, not just opinion","Proofread for grammar and flow"],
    examTip: "Plan for 5 minutes — it saves 15 minutes of wandering in the exam.",
  },
  "climate": {
    title: "Climate & Weather",
    simple: "Weather is what the atmosphere does day-to-day; climate is the average weather over 30+ years. Climate is shaped by latitude, altitude, ocean currents and air pressure systems.",
    steps: ["1. Latitude: equator receives direct sun → hotter; poles receive angled sun → colder.","2. Altitude: higher = cooler (temperature drops ~6°C per 1000 m).","3. Ocean currents: warm currents heat nearby land; cold currents cool it.","4. Pressure systems: high pressure = clear skies; low pressure = clouds & rain.","5. South Africa: interior plateau, cold Benguela current on west coast, warm Agulhas on east."],
    example: "Cape Town has Mediterranean climate (wet winters) because of the cold Benguela current and westerly winds.",
    keyPoints: ["Weather ≠ climate","Temperature decreases with altitude","High pressure = anticyclone (clear), Low = cyclone (rain)","SA west coast = cold current, east = warm"],
    examTip: "Always explain with a cause–effect chain: factor → process → result.",
  },
  "marketing": {
    title: "Marketing Mix (4 Ps)",
    simple: "The marketing mix is how a business gets customers to buy. Product (what you sell), Price (what you charge), Place (where you sell it) and Promotion (how you tell people). Get all four right and sales grow.",
    steps: ["1. Product: quality, features, branding, packaging.","2. Price: cost-plus, penetration or skimming strategy.","3. Place: retail, online, wholesalers — distribution channels.","4. Promotion: advertising, sales promotion, PR, personal selling.","5. Review: measure sales and adjust the mix."],
    example: "A sneaker brand: premium product, R1 499 price, sold in malls + online, promoted via influencers and TikTok.",
    keyPoints: ["Product, Price, Place, Promotion","Price must cover costs + profit","Place = distribution channel","Promotion must reach the target market"],
    examTip: "Apply the 4 Ps to a real business example — CAPS loves application, not just definitions.",
  },
};

export function findKnowledge(query: string) {
  const q = query.toLowerCase();
  for (const [key, val] of Object.entries(KNOWLEDGE_BASE)) {
    if (q.includes(key) || val.title.toLowerCase().split(" ").some(w => w.length > 4 && q.includes(w))) return val;
  }
  // keyword aliases
  const aliases: Record<string,string> = {
    "plant food":"photosynthesis","sunlight":"photosynthesis","equation":"algebra","solve":"algebra","x":"algebra",
    "triangle":"trigonometry","sin":"trigonometry","cos":"trigonometry","force":"newton","motion":"newton","law":"newton",
    "organelle":"cell","dna":"genetics","inherit":"genetics","gene":"genetics","apartheid":"apartheid","mandela":"apartheid","history":"apartheid",
    "demand":"supply","price":"supply","market":"supply","balance sheet":"accounting","journal":"accounting","essay":"essay","writing":"essay",
    "weather":"climate","rain":"climate","temperature":"climate","marketing":"marketing","sell":"marketing",
  };
  for (const [k,v] of Object.entries(aliases)) if (q.includes(k)) return KNOWLEDGE_BASE[v];
  return null;
}
