import type { PatientCase } from '../game/types';
import type { ClinicId } from '../game/clinic';

export const PATIENT_CASES_RECORD: Partial<Record<ClinicId, PatientCase[]>> = {
  'infectious-disease': [
    {
      id: 'id-tb-hiv-001',
      arrivalBlurb: 'Walk-in. Extremely cachectic, coughing frequently.',
      chiefComplaint: 'I have been coughing for a month and I\'m losing weight.',
      identity: {
        name: 'Sipho Ndlovu',
        age: 32,
        gender: 'M',
        occupation: 'Mineworker',
        livingSituation: 'Living in a hostel with 6 other men',
        primaryLanguage: 'isiZulu (speaks English well)',
        healthLiteracy: 'low',
        personality: 'stoic',
        personalTheory: 'I think it is the dust from the mine.'
      },
      clinicalState: {
        primaryDiagnosis: 'pulmonary-tuberculosis',
        severity: 'urgent',
        timeline: 'Cough started 6 weeks ago, night sweats 3 weeks ago.',
        baselineVitals: { hr: 110, bp: '100/60', spo2: 92, temp: 38.5, rr: 24 },
        medications: [],
        allergies: []
      },
      history: {
        surface: [
          { id: 'cough', question: 'Tell me about the cough', answer: 'It is a wet cough, sometimes with yellow stuff.', relevant: true },
          { id: 'weight', question: 'Have you lost weight?', answer: 'Yes, my clothes are very loose now.', relevant: true }
        ],
        middle: [
          { id: 'sweats', question: 'Do you sweat at night?', answer: 'Yes, I wake up and my bed is wet.', relevant: true },
          { id: 'blood', question: 'Is there blood in the cough?', answer: 'Sometimes I see little streaks of blood.', relevant: true }
        ],
        deep: [
          { id: 'hiv', question: 'Have you ever been tested for HIV?', answer: 'Yes... 3 years ago it was positive, but I stopped taking the ARVs because I felt fine.', relevant: true },
          { id: 'contacts', question: 'Has anyone around you been coughing?', answer: 'Yes, my roommate at the hostel was sent home because he was coughing blood.', relevant: true }
        ]
      },
      physicalExam: {
        generalAppearance: 'Cachectic young man, visibly tachypneic, occasional productive cough.',
        abnormalFindings: [
          'Chest: Crepitations and bronchial breathing in the right upper lobe.',
          'Lymph nodes: Generalized cervical lymphadenopathy.',
          'General: Oral thrush present.'
        ]
      },
      testResults: [
        { testId: 'cxr', result: 'Right upper lobe cavitary lesion with surrounding consolidation.', abnormal: true },
        { testId: 'gene-xpert', result: 'MTB detected, Rifampicin resistance NOT detected.', abnormal: true },
        { testId: 'hiv-rapid', result: 'Positive.', abnormal: true }
      ],
      correctDiagnosisId: 'pulmonary-tuberculosis',
      diagnosisOptions: ['pulmonary-tuberculosis', 'pneumocystis-pneumonia', 'lung-cancer', 'community-acquired-pna', 'bronchiectasis'],
      acceptableTreatmentIds: ['tb-rifafour', 'hiv-arv-restart', 'admit-isolation'],
      criticalTreatmentIds: ['tb-rifafour'],
      education: {
        difficulty: 4,
        targetTrainingLevel: 'Medical Student (Year 4+)',
        learningObjectives: ['Recognize classic presentation of PTB', 'Identify need to screen for HIV in TB patients', 'Understand public health implications (isolation/contact tracing)'],
        commonErrors: ['Missing the HIV history', 'Forgetting to isolate the patient'],
        facultyNotes: 'Classic South African TB/HIV co-infection presentation. Emphasize probing for HIV status and adherence.'
      },
      rubric: {
        data_gathering: [
          {
            criterion_id: 'dg-tb-01',
            label: 'Probed for red-flag TB symptoms',
            weight: 2,
            framework: 'SOCRATES',
            evidence: 'Student asked about hemoptysis, night sweats, or significant weight loss beyond the chief complaint.',
          },
          {
            criterion_id: 'dg-tb-02',
            label: 'Screened for HIV status',
            weight: 3,
            evidence: 'Student explicitly asked about HIV testing, status, or risk factors. TB is the index diagnosis — HIV screening is mandatory in SA.',
            guideline_ref: 'who-tb-2023:who-tb-hiv-screen-all',
          },
          {
            criterion_id: 'dg-tb-03',
            label: 'Investigated treatment adherence',
            weight: 2,
            evidence: 'Student asked about ARV adherence, whether patient is still taking medication, or when they last saw an HIV clinician.',
          },
          {
            criterion_id: 'dg-tb-04',
            label: 'Explored TB contact exposure',
            weight: 2,
            evidence: 'Student asked about household or workplace contacts with cough, known TB, or whether anyone else has been sick.',
            guideline_ref: 'who-tb-2023:who-tb-contact-tracing',
          },
          {
            criterion_id: 'dg-tb-05',
            label: 'Assessed social / living situation',
            weight: 1,
            evidence: 'Student asked about living conditions (hostel, crowded accommodation), occupational dust exposure, or ability to isolate.',
          },
        ],
        clinical_management: [
          {
            criterion_id: 'cm-tb-01',
            label: 'Initiated anti-TB therapy',
            weight: 3,
            evidence: 'Student ordered or initiated first-line TB treatment (Rifafour / RHZE fixed-dose combination).',
            guideline_ref: 'who-tb-2023:who-tb-rifafour-firstline',
          },
          {
            criterion_id: 'cm-tb-02',
            label: 'Addressed HIV co-management',
            weight: 3,
            evidence: 'Student arranged ART initiation or restart, HIV clinic referral, or CD4 count — recognizing that TB/HIV co-infection requires integrated care.',
            guideline_ref: 'who-tb-2023:who-tb-hiv-start-art',
          },
          {
            criterion_id: 'cm-tb-03',
            label: 'Arranged appropriate isolation',
            weight: 2,
            evidence: 'Student considered airborne precautions: isolation admission, mask, or referral to a dedicated TB facility.',
            guideline_ref: 'who-tb-2023:who-tb-infection-control',
          },
          {
            criterion_id: 'cm-tb-04',
            label: 'Ordered appropriate investigations',
            weight: 1,
            evidence: 'Student ordered CXR, sputum GeneXpert (± culture), and HIV test to confirm the diagnosis and assess resistance.',
          },
        ],
        interpersonal: [
          {
            criterion_id: 'ip-tb-01',
            label: 'Communicated with low-health-literacy patient',
            weight: 2,
            framework: 'PLAB2',
            evidence: 'Used plain language, avoided medical jargon, checked understanding, and was not dismissive of the patient\'s "mine dust" theory.',
          },
          {
            criterion_id: 'ip-tb-02',
            label: 'Handled sensitive disclosure with empathy',
            weight: 2,
            framework: 'NURSE',
            evidence: 'When discussing HIV status and ART non-adherence, responded with empathy rather than judgment. Named the difficulty.',
          },
          {
            criterion_id: 'ip-tb-03',
            label: 'Explained public health rationale without stigmatising',
            weight: 1,
            evidence: 'Explained why isolation and contact tracing are needed in a way that did not blame or frighten the patient.',
          },
        ],
        safety_netting: {
          required_elements: [
            'Discussed default prevention — explained what happens if TB meds or ARVs are stopped',
            'Advised return for worsening dyspnea, hemoptysis, or high fever',
            'Explained contact tracing to the patient and offered to notify the hostel',
          ],
          weight: 2,
          guideline_ref: 'who-tb-2023:who-tb-contact-tracing',
        },
        global_rating: 'borderline-regression',
      },
    }
  ],
  'endocrinology': [
    {
      id: 'endo-dka-001',
      arrivalBlurb: 'Arrived by family car. Looks confused and breathing deeply.',
      chiefComplaint: 'I feel very sick to my stomach and I cannot stop vomiting.',
      identity: {
        name: 'Thandiwe Mokoena',
        age: 22,
        gender: 'F',
        occupation: 'University Student',
        livingSituation: 'Living with parents',
        primaryLanguage: 'English',
        healthLiteracy: 'medium',
        personality: 'anxious',
        personalTheory: 'I think I ate something bad at the cafeteria.'
      },
      clinicalState: {
        primaryDiagnosis: 'diabetic-ketoacidosis',
        severity: 'critical',
        timeline: 'Vomiting started yesterday. Polydipsia for 3 days.',
        baselineVitals: { hr: 125, bp: '95/55', spo2: 98, temp: 37.0, rr: 28 },
        medications: ['Metformin', 'Humulin 30/70 (ran out)'],
        allergies: ['Penicillin']
      },
      history: {
        surface: [
          { id: 'vomiting', question: 'When did the vomiting start?', answer: 'Yesterday morning. I can\'t keep water down.', relevant: true },
          { id: 'pain', question: 'Do you have stomach pain?', answer: 'Yes, it aches all over.', relevant: true }
        ],
        middle: [
          { id: 'urine', question: 'Are you urinating more than usual?', answer: 'Yes, I had to go to the bathroom 5 times last night.', relevant: true },
          { id: 'thirst', question: 'Are you very thirsty?', answer: 'My mouth is so dry, I\'m incredibly thirsty.', relevant: true }
        ],
        deep: [
          { id: 'diabetes', question: 'Do you have diabetes?', answer: 'Yes, Type 1.', relevant: true },
          { id: 'insulin', question: 'Have you been taking your insulin?', answer: 'The clinic ran out of stock last week. I\'ve been trying to stretch what I had left.', relevant: true }
        ]
      },
      physicalExam: {
        generalAppearance: 'Lethargic young woman. Breathing is deep and rapid (Kussmaul). Fruity odor on breath.',
        abnormalFindings: [
          'Abdomen: Diffuse tenderness, no guarding or rebound.',
          'Skin: Decreased turgor, dry mucous membranes.',
          'Neurological: GCS 14 (confused).'
        ]
      },
      testResults: [
        { testId: 'fingerprick-glucose', result: 'Hi (> 33.3 mmol/L).', abnormal: true },
        { testId: 'abg', result: 'pH 7.15, pCO2 22, HCO3 8, pO2 95. Severe high anion gap metabolic acidosis.', abnormal: true },
        { testId: 'urine-dipstick', result: 'Glucose 4+, Ketones 4+.', abnormal: true },
        { testId: 'bmp', result: 'Na 132, K 5.2, Cl 98, Urea 12, Cr 110.', abnormal: true }
      ],
      correctDiagnosisId: 'diabetic-ketoacidosis',
      diagnosisOptions: ['diabetic-ketoacidosis', 'gastroenteritis', 'appendicitis', 'sepsis', 'hhs'],
      acceptableTreatmentIds: ['iv-fluids-saline', 'iv-insulin-infusion', 'k-replacement', 'admit-icu'],
      criticalTreatmentIds: ['iv-fluids-saline', 'iv-insulin-infusion'],
      education: {
        difficulty: 3,
        targetTrainingLevel: 'Medical Student (Year 5)',
        learningObjectives: ['Recognize DKA masquerading as acute abdomen', 'Prioritize fluid resuscitation before insulin', 'Understand public sector medication stockout realities'],
        commonErrors: ['Diagnosing gastroenteritis and discharging', 'Starting insulin before IV fluids or potassium check'],
        facultyNotes: 'Highlights the reality of stockouts in resource-limited settings leading to acute emergencies.'
      },
      rubric: {
        data_gathering: [
          {
            criterion_id: 'dg-dka-01',
            label: 'Identified DKA rather than acute abdomen',
            weight: 3,
            framework: 'SOCRATES',
            evidence: 'Student considered the broader picture — vomiting + polyuria + polydipsia — rather than anchoring on gastroenteritis or appendicitis.',
          },
          {
            criterion_id: 'dg-dka-02',
            label: 'Probed for diabetes history',
            weight: 3,
            evidence: 'Student asked if the patient has diabetes, what type, and what medications they are on.',
          },
          {
            criterion_id: 'dg-dka-03',
            label: 'Investigated medication access / adherence',
            weight: 3,
            evidence: 'Student asked about insulin supply, whether they ran out, missed doses, or had trouble accessing the clinic pharmacy.',
          },
          {
            criterion_id: 'dg-dka-04',
            label: 'Checked for precipitating factors',
            weight: 2,
            evidence: 'Student asked about infection, trauma, missed meals, or other stressors that could have triggered DKA.',
          },
          {
            criterion_id: 'dg-dka-05',
            label: 'Assessed volume status and severity',
            weight: 1,
            evidence: 'Student noted signs of dehydration (tachycardia, hypotension, dry mucous membranes, confusion, Kussmaul breathing).',
          },
        ],
        clinical_management: [
          {
            criterion_id: 'cm-dka-01',
            label: 'Prioritised fluid resuscitation before insulin',
            weight: 3,
            evidence: 'Student ordered IV fluids (0.9% NaCl bolus) first — recognising that insulin cannot work effectively in a volume-depleted patient.',
            guideline_ref: 'ada-dka-2024:ada-dka-fluids-first',
          },
          {
            criterion_id: 'cm-dka-02',
            label: 'Initiated appropriate insulin therapy',
            weight: 3,
            evidence: 'Student ordered IV insulin infusion (not subcutaneous sliding scale) after confirming potassium >3.3 mEq/L.',
            guideline_ref: 'ada-dka-2024:ada-dka-insulin-protocol',
          },
          {
            criterion_id: 'cm-dka-03',
            label: 'Checked and managed potassium',
            weight: 2,
            evidence: 'Student checked potassium (BMP results) and addressed replacement — recognising that insulin drives K+ intracellularly and can cause dangerous hypokalemia.',
            guideline_ref: 'ada-dka-2024:ada-dka-potassium-mgt',
          },
          {
            criterion_id: 'cm-dka-04',
            label: 'Arranged appropriate disposition',
            weight: 2,
            evidence: 'Student arranged ICU/HDU admission or high-acuity monitoring — DKA requires close observation for cerebral edema, hypoglycemia, and potassium shifts.',
          },
          {
            criterion_id: 'cm-dka-05',
            label: 'Addressed medication access for discharge planning',
            weight: 2,
            evidence: 'Student discussed insulin supply, referral to a chronic-disease clinic, or a plan to prevent future stockout-related admissions.',
          },
        ],
        interpersonal: [
          {
            criterion_id: 'ip-dka-01',
            label: 'Reassured a confused and frightened young patient',
            weight: 2,
            framework: 'NURSE',
            evidence: 'Spoke calmly, acknowledged the patient\'s fear (\'I think I ate something bad\'), and explained what DKA is in plain terms.',
          },
          {
            criterion_id: 'ip-dka-02',
            label: 'Explained the stockout reality without blame',
            weight: 1,
            evidence: 'When the patient revealed running out of insulin, responded supportively — did not make the patient feel guilty for a systems failure.',
          },
        ],
        safety_netting: {
          required_elements: [
            'Explained what symptoms require urgent return (vomiting, confusion, rapid breathing)',
            'Discussed insulin storage, adherence strategies, and what to do if the clinic runs out again',
            'Arranged follow-up with a chronic-disease clinic or diabetes educator',
          ],
          weight: 2,
          guideline_ref: 'ada-dka-2024:ada-dka-transition-to-subcut',
        },
        global_rating: 'borderline-regression',
      },
    }
  ],
  'cardiology': [
    {
      id: 'card-stemi-001',
      arrivalBlurb: 'Walk-in. Sweating profusely, clutching chest.',
      chiefComplaint: 'It feels like an elephant is sitting on my chest.',
      identity: {
        name: 'Pieter van der Merwe',
        age: 58,
        gender: 'M',
        occupation: 'Mechanic',
        livingSituation: 'Living with wife',
        primaryLanguage: 'Afrikaans (speaks English)',
        healthLiteracy: 'low',
        personality: 'stoic',
        personalTheory: 'Just bad heartburn, I had a heavy braai (BBQ) yesterday.'
      },
      clinicalState: {
        primaryDiagnosis: 'stemi-anterior',
        severity: 'critical',
        timeline: 'Pain started 45 minutes ago while lifting a tire at work.',
        baselineVitals: { hr: 105, bp: '160/95', spo2: 94, temp: 36.8, rr: 22 },
        medications: ['Enalapril', 'Simvastatin'],
        allergies: []
      },
      history: {
        surface: [
          { id: 'onset', question: 'When did it start?', answer: 'About 45 minutes ago, sudden.', relevant: true },
          { id: 'quality', question: 'How does the pain feel?', answer: 'Like a heavy crushing weight.', relevant: true }
        ],
        middle: [
          { id: 'radiation', question: 'Does the pain travel?', answer: 'Yes, down my left arm and into my jaw.', relevant: true },
          { id: 'associated', question: 'Do you feel nauseous or sweaty?', answer: 'I\'m drenched in sweat. I feel like vomiting.', relevant: true }
        ],
        deep: [
          { id: 'risk', question: 'Do you smoke or have medical conditions?', answer: 'I smoke a pack a day. I have high blood pressure and cholesterol.', relevant: true },
          { id: 'prior', question: 'Have you had this before?', answer: 'Never like this. Usually just a little tightness when I work hard, but it goes away.', relevant: true }
        ]
      },
      physicalExam: {
        generalAppearance: 'Diaphoretic, pale, in obvious distress clutching his chest.',
        abnormalFindings: [
          'Heart: Tachycardic, regular. S4 gallop present.',
          'Lungs: Clear to auscultation bilaterally.',
          'Skin: Cool and clammy.'
        ]
      },
      testResults: [
        { testId: 'ecg', result: 'ST-segment elevation in V1-V4 with reciprocal depression in II, III, aVF.', abnormal: true },
        { testId: 'troponin', result: 'hs-Trop T: 125 ng/L (elevated).', abnormal: true },
        { testId: 'cxr', result: 'No acute pulmonary edema, normal cardiac silhouette.', abnormal: false }
      ],
      correctDiagnosisId: 'stemi',
      diagnosisOptions: ['stemi', 'nstemi', 'gerd', 'pulmonary-embolism', 'aortic-dissection'],
      acceptableTreatmentIds: ['aspirin', 'clopidogrel', 'heparin', 'morphine', 'pci-referral'],
      criticalTreatmentIds: ['aspirin', 'pci-referral'],
      education: {
        difficulty: 2,
        targetTrainingLevel: 'Medical Student (Year 4)',
        learningObjectives: ['Immediate recognition of STEMI', 'Correct initial medical management (MONA/antiplatelets)'],
        commonErrors: ['Dismissing as GERD due to patient theory', 'Delaying ECG'],
        facultyNotes: 'Straightforward anterior STEMI. Goal is rapid ECG and antiplatelet administration.'
      },
      rubric: {
        data_gathering: [
          {
            criterion_id: 'dg-stemi-01',
            label: 'Did not anchor on patient\'s heartburn theory',
            weight: 3,
            evidence: 'Student did not dismiss the chest pain as GERD — despite the patient\'s own explanation (\'heavy braai\'), the student recognised the need to rule out ACS with an ECG.',
          },
          {
            criterion_id: 'dg-stemi-02',
            label: 'Characterised chest pain fully',
            weight: 2,
            framework: 'SOCRATES',
            evidence: 'Student asked about onset, radiation, severity, associated symptoms (nausea, diaphoresis, dyspnea), and exacerbating/relieving factors.',
          },
          {
            criterion_id: 'dg-stemi-03',
            label: 'Elicited cardiovascular risk factors',
            weight: 2,
            evidence: 'Student asked about smoking, hypertension, high cholesterol, diabetes, or family history of premature heart disease.',
          },
          {
            criterion_id: 'dg-stemi-04',
            label: 'Ordered ECG within minutes of arrival',
            weight: 3,
            evidence: 'Student prioritised an ECG as the first investigation — recognising that a 12-lead ECG can be acquired and interpreted within 10 minutes.',
            guideline_ref: 'esc-stemi-2023:esc-stemi-ecg-10min',
          },
          {
            criterion_id: 'dg-stemi-05',
            label: 'Checked for contraindications to antiplatelet therapy',
            weight: 1,
            evidence: 'Student asked about bleeding history, peptic ulcer, recent surgery, or medications (warfarin/NOACs) before giving antiplatelets.',
          },
        ],
        clinical_management: [
          {
            criterion_id: 'cm-stemi-01',
            label: 'Administered aspirin immediately',
            weight: 3,
            evidence: 'Student gave or ordered aspirin 300 mg (loading) — the single most important immediate intervention in suspected STEMI.',
            guideline_ref: 'esc-stemi-2023:esc-stemi-antiplatelet-loading',
          },
          {
            criterion_id: 'cm-stemi-02',
            label: 'Started P2Y12 inhibitor',
            weight: 3,
            evidence: 'Student ordered clopidogrel or ticagrelor loading — dual antiplatelet therapy is standard before PCI.',
            guideline_ref: 'esc-stemi-2023:esc-stemi-antiplatelet-loading',
          },
          {
            criterion_id: 'cm-stemi-03',
            label: 'Activated cath lab or arranged PCI transfer',
            weight: 3,
            evidence: 'Student arranged primary PCI within 120 minutes of diagnosis — the gold-standard reperfusion strategy.',
            guideline_ref: 'esc-stemi-2023:esc-stemi-reperfusion-primary-pci',
          },
          {
            criterion_id: 'cm-stemi-04',
            label: 'Administered anticoagulation',
            weight: 2,
            evidence: 'Student ordered heparin or enoxaparin as bridging anticoagulation before PCI.',
            guideline_ref: 'esc-stemi-2023:esc-stemi-anticoagulation',
          },
          {
            criterion_id: 'cm-stemi-05',
            label: 'Provided adequate pain relief',
            weight: 1,
            evidence: 'Student offered morphine for severe chest pain unrelieved by nitrates (or acknowledged the need for analgesia).',
            guideline_ref: 'esc-stemi-2023:esc-stemi-pain-morphine',
          },
        ],
        interpersonal: [
          {
            criterion_id: 'ip-stemi-01',
            label: 'Communicated urgency without frightening the patient',
            weight: 2,
            framework: 'NURSE',
            evidence: 'Explained that this is a serious but treatable condition, mobilised the team efficiently, and kept the patient informed without panic.',
          },
          {
            criterion_id: 'ip-stemi-02',
            label: 'Respected patient\'s own explanation (heartburn)',
            weight: 1,
            evidence: 'Did not belittle the patient\'s theory — gently redirected towards the cardiac workup without making the patient feel foolish.',
          },
        ],
        safety_netting: {
          required_elements: [
            'Explained the importance of calling EMS if chest pain recurs after discharge',
            'Discussed cardiac rehabilitation and lifestyle changes (smoking cessation)',
            'Arranged follow-up with cardiology',
          ],
          weight: 2,
        },
        global_rating: 'borderline-regression',
      },
    }
  ]
};
