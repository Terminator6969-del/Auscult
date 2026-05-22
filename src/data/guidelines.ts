// Clinical practice guideline registry for the medkit-attending grading agent.
//
// Each entry is sourced directly from the publishing society's website
// (NICE, BTS, ESC, ADA, AHA, IDSA/ATS, etc.). Recommendation `text` fields
// are reproduced verbatim from the public guideline page; classification
// metadata (`recClass`, `lev`, GRADE) is only set when the source page
// explicitly states it.
//
// Every entry here is `verificationStatus: "auto-fetched"` until a
// clinician has reviewed the wording and confirmed accuracy. Do not flip
// any entry to `"verified"` from code — that is a human-MD sign-off only.
//
// `lastVerified` is the ISO date the page was retrieved by the curator
// agent (not necessarily the guideline publication date — see `year`).
//
// Citation format used by the grading agent:
//   `${guideline.id}:${rec.recId}`
// e.g. "nice-ng136-htn-2019:ng136-1.4.32-step1-acei-arb"

export interface GuidelineRecommendation {
  recId: string;
  text: string;
  recClass?: 'I' | 'IIa' | 'IIb' | 'III';
  lev?: 'A' | 'B' | 'C';
  gradeStrength?: 'strong' | 'conditional';
  gradeCertainty?: 'high' | 'moderate' | 'low' | 'very-low';
  topic: string;
  system:
    | 'cardiovascular'
    | 'endocrine'
    | 'respiratory'
    | 'renal'
    | 'gastrointestinal'
    | 'neurological'
    | 'musculoskeletal'
    | 'infectious'
    | 'other';
}

export interface Guideline {
  id: string;
  body:
    | 'NICE'
    | 'ESC'
    | 'ERS'
    | 'AHA'
    | 'ACC'
    | 'ADA'
    | 'BTS'
    | 'IDSA'
    | 'ATS'
    | 'GOLD'
    | 'GINA'
    | 'KDIGO';
  year: number;
  region: 'UK' | 'EU' | 'US' | 'Global';
  title: string;
  url: string;
  pdfUrl?: string;
  doi?: string;
  pubmedId?: string;
  recommendations: GuidelineRecommendation[];
  verificationStatus: 'auto-fetched' | 'verified' | 'needs-verification';
  lastVerified: string;
  notes?: string;
  supersededBy?: string;
}

export const GUIDELINES: Guideline[] = [
  {
    id: 'nice-ng136-htn-2019',
    body: 'NICE',
    year: 2019,
    region: 'UK',
    title: 'Hypertension in adults: diagnosis and management (NG136)',
    url: 'https://www.nice.org.uk/guidance/ng136',
    pdfUrl:
      'https://www.nice.org.uk/guidance/ng136/resources/hypertension-in-adults-diagnosis-and-management-pdf-66141722710213',
    verificationStatus: 'auto-fetched',
    lastVerified: '2026-04-25',
    notes:
      'Originally published 28 August 2019; surveillance updates through February 2026 (postural hypotension Nov 2023, BP targets in CVD Mar 2022). Recommendation numbering taken from the live recommendations chapter on nice.org.uk.',
    recommendations: [
      {
        recId: 'ng136-1.2.8-diagnostic-threshold',
        text: 'Confirm diagnosis of hypertension in people with a: clinic blood pressure of 140/90 mmHg or higher and ABPM daytime average or HBPM average of 135/85 mmHg or higher.',
        topic: 'diagnostic threshold',
        system: 'cardiovascular',
      },
      {
        recId: 'ng136-1.4.1-lifestyle-advice',
        text: 'Offer lifestyle advice to people with suspected or diagnosed hypertension, and continue to offer it periodically.',
        topic: 'lifestyle intervention',
        system: 'cardiovascular',
      },
      {
        recId: 'ng136-1.4.10-stage1-under80-treatment',
        text: 'Discuss starting antihypertensive drug treatment, in addition to lifestyle advice, with adults aged under 80 with persistent stage 1 hypertension who have 1 or more of the following: target organ damage; established cardiovascular disease; renal disease; diabetes; an estimated 10-year risk of cardiovascular disease of 10% or more.',
        topic: 'when to start drug treatment',
        system: 'cardiovascular',
      },
      {
        recId: 'ng136-1.4.32-step1-acei-arb',
        text: 'Offer an ACE inhibitor or an ARB to adults starting step 1 antihypertensive treatment who: have type 2 diabetes and are of any age or family origin, or are aged under 55 but not of Black African or African–Caribbean family origin.',
        topic: 'first-line drug choice',
        system: 'cardiovascular',
      },
      {
        recId: 'ng136-1.4.35-step1-ccb',
        text: 'Offer a calcium-channel blocker (CCB) to adults starting step 1 antihypertensive treatment who: are aged 55 or over and do not have type 2 diabetes, or are of Black African or African–Caribbean family origin and do not have type 2 diabetes (of any age).',
        topic: 'first-line drug choice',
        system: 'cardiovascular',
      },
      {
        recId: 'ng136-1.4.20-target-under80',
        text: 'For adults with hypertension aged under 80, reduce clinic blood pressure to below 140/90 mmHg and ensure that it is maintained below that level.',
        topic: 'blood pressure target',
        system: 'cardiovascular',
      },
      {
        recId: 'ng136-1.5.2-same-day-referral',
        text: 'Refer people for specialist assessment, carried out on the same day, if they have a clinic blood pressure of 180/120 mmHg and higher with: signs of retinal haemorrhage or papilloedema (accelerated hypertension) or life-threatening symptoms such as new onset confusion, chest pain, signs of heart failure, or acute kidney injury.',
        topic: 'red flag / same-day referral',
        system: 'cardiovascular',
      },
    ],
  },
  {
    id: 'nice-ng28-t2dm-2022',
    body: 'NICE',
    year: 2022,
    region: 'UK',
    title: 'Type 2 diabetes in adults: management (NG28)',
    url: 'https://www.nice.org.uk/guidance/ng28',
    pdfUrl:
      'https://www.nice.org.uk/guidance/ng28/resources/type-2-diabetes-in-adults-management-pdf-1837338615493',
    verificationStatus: 'auto-fetched',
    lastVerified: '2026-04-25',
    notes:
      'Originally published December 2015; major drug-treatment update February 2022 introducing the metformin + SGLT-2 inhibitor first-line pairing. Live recommendations chapter last touched 18 February 2026. Year retained as 2022 to reflect the substantive recommendation revision; consider bumping when NICE finalises the 2025/2026 draft.',
    recommendations: [
      {
        recId: 'ng28-1.2.1-structured-education',
        text: 'Offer structured education to adults with type 2 diabetes and their family members or carers (as appropriate) at the time of diagnosis, with annual reinforcement and review.',
        topic: 'structured education',
        system: 'endocrine',
      },
      {
        recId: 'ng28-1.3.3-healthy-eating',
        text: 'Encourage adults with type 2 diabetes to follow the same healthy eating advice as the general population, which includes: eating high-fibre, low-glycaemic-index sources of carbohydrate, such as fruit, vegetables, wholegrains and pulses; choosing low-fat dairy products; eating oily fish; controlling their intake of saturated and trans fatty acids.',
        topic: 'lifestyle / dietary advice',
        system: 'endocrine',
      },
      {
        recId: 'ng28-1.5.1-hba1c-monitoring',
        text: 'Measure HbA1c levels in adults with type 2 diabetes every: 3 to 6 months (tailored to individual needs) until HbA1c is stable on unchanging therapy; 6 months once the HbA1c level and blood glucose lowering therapy are stable.',
        topic: 'monitoring frequency',
        system: 'endocrine',
      },
      {
        recId: 'ng28-1.5.7-hba1c-target',
        text: 'For adults whose type 2 diabetes is managed either by healthy living and diet, or healthy living and diet combined with an initial medication regimen that is not associated with hypoglycaemia, support them to aim for an HbA1c level of 48 mmol/mol (6.5%). For adults on a medicine associated with hypoglycaemia, support them to aim for an HbA1c level of 53 mmol/mol (7.0%).',
        topic: 'glycaemic target',
        system: 'endocrine',
      },
      {
        recId: 'ng28-1.5.8-intensify-threshold',
        text: 'In adults with type 2 diabetes, if HbA1c levels are not adequately controlled by the initial medication regimen and rise to 58 mmol/mol (7.5%) or higher: reinforce advice about diet, healthy living and adherence to medicines and support the person to aim for an HbA1c level of 53 mmol/mol (7.0%) and intensify medicines.',
        topic: 'escalation threshold',
        system: 'endocrine',
      },
      {
        recId: 'ng28-1.13.1-initial-metformin-sglt2',
        text: 'For adults with type 2 diabetes and no relevant comorbidity, offer: modified-release metformin, and an SGLT-2 inhibitor.',
        topic: 'first-line pharmacotherapy',
        system: 'endocrine',
      },
      {
        recId: 'ng28-1.13.2-metformin-contraindicated',
        text: 'If metformin is contraindicated or not tolerated, offer monotherapy with an SGLT-2 inhibitor.',
        topic: 'first-line pharmacotherapy (alternative)',
        system: 'endocrine',
      },
    ],
  },
  {
    id: 'nice-ng250-pneumonia-2025',
    body: 'NICE',
    year: 2025,
    region: 'UK',
    title: 'Pneumonia: diagnosis and management (NG250)',
    url: 'https://www.nice.org.uk/guidance/ng250',
    verificationStatus: 'auto-fetched',
    lastVerified: '2026-04-25',
    notes:
      'Published 02 September 2025. Replaces the antimicrobial-prescribing guideline NG138 (2019) and incorporates portions of the older CG191 pathway. BTS 2009 CAP guideline remains the underlying evidence base but is not used here because the public BTS PDF was not machine-readable; once a clinician has reviewed BTS sections, add a `bts-cap-2009` entry alongside this one. Topics not covered here: hospital-acquired pneumonia (see NG139), and detailed empirical antibiotic agent/dose tables (recommendation 1.6.2 in NG250 references those tables rather than reproducing them inline).',
    recommendations: [
      {
        recId: 'ng250-1.2.1-crb65-community',
        text: 'If a clinical diagnosis of community-acquired pneumonia has been made, determine whether adults are at low, intermediate or high risk of death using the CRB65 scoring system.',
        topic: 'severity assessment (community)',
        system: 'respiratory',
      },
      {
        recId: 'ng250-1.2.7-curb65-hospital',
        text: 'If a clinical diagnosis of community-acquired pneumonia has been made in hospital, determine whether adults are at low, intermediate or high risk of death using the CURB65 scoring system.',
        topic: 'severity assessment (hospital)',
        system: 'respiratory',
      },
      {
        recId: 'ng250-1.5.1-start-antibiotics-4h',
        text: 'Start antibiotic treatment as soon as possible after establishing a diagnosis of community-acquired pneumonia, and within 4 hours of presentation to hospital.',
        topic: 'timing of antibiotic initiation',
        system: 'infectious',
      },
      {
        recId: 'ng250-1.5.4-oral-first-line',
        text: 'Give oral antibiotics first line if the person can take oral medicines, and the severity of their condition does not require intravenous antibiotics.',
        topic: 'route of administration',
        system: 'infectious',
      },
      {
        recId: 'ng250-1.5.5-iv-to-oral-switch',
        text: 'If intravenous antibiotics are given, review by 48 hours and, if possible, consider switching to oral antibiotics to complete the course.',
        topic: 'IV-to-oral switch',
        system: 'infectious',
      },
      {
        recId: 'ng250-1.6.3-stop-after-5-days',
        text: 'For adults with community-acquired pneumonia, stop antibiotic treatment after 5 days unless: microbiological results suggest a longer course is needed or the person is not clinically stable.',
        topic: 'duration of therapy',
        system: 'infectious',
      },
      {
        recId: 'ng250-1.10.3-safety-netting',
        text: 'Give advice to people with community-acquired pneumonia about possible adverse effects of the antibiotic(s); seeking further advice if symptoms worsen rapidly or significantly or do not start to improve within 3 days.',
        topic: 'safety-netting / follow-up',
        system: 'respiratory',
      },
      {
        recId: 'ng250-1.12.1-no-routine-fu-cxr',
        text: 'Do not routinely offer follow-up chest X-rays to people discharged from inpatient care after an episode of pneumonia.',
        topic: 'follow-up imaging',
        system: 'respiratory',
      },
    ],
  },
  // ────────────────────────────────────────────────────────────────
  // South African pilot case guidelines
  // ────────────────────────────────────────────────────────────────

  // TB/HIV co-infection (Sipho Ndlovu)
  {
    id: 'who-tb-2023',
    body: 'ATS',
    year: 2023,
    region: 'Global',
    title: 'WHO consolidated guidelines on tuberculosis: Module 4 — treatment of drug-susceptible tuberculosis',
    url: 'https://www.who.int/publications/i/item/9789240087419',
    verificationStatus: 'auto-fetched',
    lastVerified: '2026-04-25',
    notes:
      '2023 update. Key source for TB/HIV co-management, fixed-dose combination therapy, and infection control recommendations applicable to high-burden settings like South Africa.',
    recommendations: [
      {
        recId: 'who-tb-hiv-start-art',
        text: 'All people with TB and HIV should start antiretroviral therapy (ART) as soon as possible (within 2 weeks) after starting TB treatment, regardless of CD4 count.',
        topic: 'TB/HIV co-infection',
        system: 'infectious',
      },
      {
        recId: 'who-tb-hiv-screen-all',
        text: 'All people diagnosed with active TB should be offered HIV testing. All people living with HIV should be screened for active TB at every clinical encounter.',
        topic: 'TB/HIV integrated screening',
        system: 'infectious',
      },
      {
        recId: 'who-tb-rifafour-firstline',
        text: 'Adults with newly diagnosed pulmonary TB should receive a standard 6-month regimen comprising a 2-month intensive phase with rifampicin, isoniazid, pyrazinamide, and ethambutol (RHZE), followed by a 4-month continuation phase with rifampicin and isoniazid.',
        topic: 'first-line TB therapy',
        system: 'infectious',
      },
      {
        recId: 'who-tb-infection-control',
        text: 'People with infectious TB should be separated from others, wear surgical masks when outside isolation areas, and be educated about cough etiquette and respiratory hygiene.',
        topic: 'infection control / isolation',
        system: 'infectious',
      },
      {
        recId: 'who-tb-contact-tracing',
        text: 'Household contacts and other close contacts of people with pulmonary TB should be systematically investigated for active TB and, if eligible, offered TB preventive treatment.',
        topic: 'contact tracing',
        system: 'infectious',
      },
    ],
  },

  // DKA management (Thandiwe Mokoena)
  {
    id: 'ada-dka-2024',
    body: 'ADA',
    year: 2024,
    region: 'US',
    title: 'American Diabetes Association Standards of Care in Diabetes — 16. Diabetes Care in the Hospital',
    url: 'https://diabetesjournals.org/care/article/47/Supplement_1/S295/153822/16-Diabetes-Care-in-the-Hospital',
    verificationStatus: 'auto-fetched',
    lastVerified: '2026-04-25',
    notes:
      'ADA Standards of Care 2024. Section 16 covers inpatient glycemic management, DKA/HHS diagnosis and treatment algorithms. JBS DS guidelines (UK) were also consulted for fluid/insulin titration rates.',
    recommendations: [
      {
        recId: 'ada-dka-diagnosis',
        text: 'DKA is diagnosed by the triad of hyperglycemia (BG ≥250 mg/dL), metabolic acidosis (pH <7.3, HCO3 <18 mEq/L), and ketonemia/ketonuria. HHS is diagnosed by BG ≥600 mg/dL without significant acidosis.',
        topic: 'diagnostic criteria',
        system: 'endocrine',
      },
      {
        recId: 'ada-dka-fluids-first',
        text: 'Begin fluid resuscitation with 0.9% NaCl (15–20 mL/kg over the first hour) before initiating insulin therapy, to restore intravascular volume and improve tissue perfusion.',
        topic: 'fluid resuscitation priority',
        system: 'endocrine',
      },
      {
        recId: 'ada-dka-insulin-protocol',
        text: 'Start intravenous regular insulin at 0.1 U/kg bolus followed by 0.1 U/kg/h continuous infusion. Reduce insulin rate once BG <250 mg/dL (13.9 mmol/L) and add dextrose-containing fluids to prevent hypoglycemia.',
        topic: 'insulin therapy',
        system: 'endocrine',
      },
      {
        recId: 'ada-dka-potassium-mgt',
        text: 'Monitor potassium closely. If K+ <5.2 mEq/L, add 20–30 mEq potassium to each liter of IV fluid to maintain K+ between 4.0–5.0 mEq/L. Do not start insulin if K+ <3.3 mEq/L — replete first.',
        topic: 'potassium management',
        system: 'endocrine',
      },
      {
        recId: 'ada-dka-transition-to-subcut',
        text: 'When DKA resolves (pH >7.3, HCO3 ≥18, BG <200 mg/dL), transition to subcutaneous insulin. Overlap SC and IV insulin by 1–2 hours for basal insulin to prevent rebound ketoacidosis.',
        topic: 'transition to subcutaneous',
        system: 'endocrine',
      },
    ],
  },

  // STEMI management (Pieter van der Merwe)
  {
    id: 'esc-stemi-2023',
    body: 'ESC',
    year: 2023,
    region: 'EU',
    title: '2023 ESC Guidelines for the management of acute coronary syndromes',
    url: 'https://academic.oup.com/eurheartj/article/44/38/3720/7243211',
    verificationStatus: 'auto-fetched',
    lastVerified: '2026-04-25',
    notes:
      '2023 ESC update. Key recommendations for STEMI diagnosis, antiplatelet therapy, reperfusion strategies (primary PCI vs fibrin lysis), and peri-infarct care.',
    recommendations: [
      {
        recId: 'esc-stemi-ecg-10min',
        text: 'A 12-lead ECG should be acquired and interpreted within 10 minutes of first medical contact in any patient with suspected STEMI.',
        topic: 'rapid ECG',
        system: 'cardiovascular',
      },
      {
        recId: 'esc-stemi-antiplatelet-loading',
        text: 'Dual antiplatelet therapy consisting of aspirin (300 mg loading, 75–100 mg daily) plus a P2Y12 inhibitor (prasugrel 60 mg or ticagrelor 180 mg loading) should be given as early as possible before primary PCI.',
        topic: 'antiplatelet therapy',
        system: 'cardiovascular',
      },
      {
        recId: 'esc-stemi-anticoagulation',
        text: 'Anticoagulation with unfractionated heparin (70–100 U/kg bolus) or enoxaparin (0.5 mg/kg IV) should be given in patients undergoing primary PCI.',
        topic: 'anticoagulation',
        system: 'cardiovascular',
      },
      {
        recId: 'esc-stemi-reperfusion-primary-pci',
        text: 'Primary percutaneous coronary intervention (PCI) within 120 minutes of diagnosis is the preferred reperfusion strategy for patients with STEMI presenting within 12 hours of symptom onset.',
        topic: 'reperfusion / PCI',
        system: 'cardiovascular',
      },
      {
        recId: 'esc-stemi-pain-morphine',
        text: 'Morphine (2–4 mg IV, repeated as needed) is indicated for pain relief in STEMI patients who do not respond to nitrates, with careful monitoring for respiratory depression.',
        topic: 'pain management',
        system: 'cardiovascular',
      },
    ],
  },
];

export function getGuideline(id: string): Guideline | null {
  return GUIDELINES.find((g) => g.id === id) ?? null;
}

export function getRecommendation(
  ref: string,
): { guideline: Guideline; rec: GuidelineRecommendation } | null {
  // ref format: "guideline_id:rec_id"
  // e.g. "nice-ng136-htn-2019:ng136-1.4.32-step1-acei-arb"
  const [gid, rid] = ref.split(':');
  if (!gid || !rid) return null;
  const g = getGuideline(gid);
  if (!g) return null;
  const r = g.recommendations.find((x) => x.recId === rid);
  if (!r) return null;
  return { guideline: g, rec: r };
}
