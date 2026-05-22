"// One-time migration: wraps old polyclinic patient fields into new structure
// Run: node scripts/migrate.js

const fs = require('fs');
const src = fs.readFileSync('src/data/polyclinicPatients.ts', 'utf-8');

// Strategy: find each patient object that has 'name:' at the top level
// and transform it to use identity/clinicalState/history layers

// Step 1: Extract each patient object
// Patients start with { on its own line after a comma or bracket
// and end with }, on its own line before next patient or array close

let result = src;
let match;

// Match patient objects (the old format with 'name:' as a top-level field)
// Each patient starts with a line containing just '{' or '{ id:'
// We'll do a simpler approach: find each patient block by tracking brace depth

const lines = src.split('\\n');
const out = [];
let braceDepth = 0;
let currentPatient = [];
let inPatient = false;

function transformPatient(lines) {
  const text = lines.join('\\n');
  
  // Extract fields
  const id = text.match(/id:\\s*'([^']*)'/)?.[1] || '';
  const name = text.match(/name:\\s*'([^']*)'/)?.[1] || 'Unknown';
  const age = text.match(/age:\\s*(\\d+)/)?.[1] || '40';
  const gender = text.match(/gender:\\s*'([^']*)'/)?.[1] || 'F';
  const severity = text.match(/severity:\\s*'([^']*)'/)?.[1] || 'stable';
  const arrivalBlurb = text.match(/arrivalBlurb:\\s*'([^']*)'/)?.[1] || '';
  const chiefComplaint = text.match(/chiefComplaint:\\s*'([^']*)'/)?.[1] || '';
  const diagnosis = text.match(/diagnosis:\\s*'([^']*)'/)?.[1] || 'unknown';
  
  // vitals
  let hr = '80', bp = '120/80', spo2 = '98', temp = '37.0', rr = '16';
  const vitalsMatch = text.match(/vitals:\\s*\\{([^}]+)\\}/);
  if (vitalsMatch) {
    const v = vitalsMatch[1];
    if (v.match(/hr:\\s*(\\d+)/)) hr = v.match(/hr:\\s*(\\d+)/)[1];
    if (v.match(/bp:\\s*'([^']+)'/)) bp = v.match(/bp:\\s*'([^']+)'/)[1];
    if (v.match(/spo2:\\s*(\\d+)/)) spo2 = v.match(/spo2:\\s*(\\d+)/)[1];
    if (v.match(/temp:\\s*([\\d.]+)/)) temp = v.match(/temp:\\s*([\\d.]+)/)[1];
    if (v.match(/rr:\\s*(\\d+)/)) rr = v.match(/rr:\\s*(\\d+)/)[1];
  }
  
  // Extract anamnesis items
  const items = [];
  const anamnesisRegex = /\\{id:\\s*'([^']+)'[^}]*?question:\\s*'([^']*)'[^}]*?answer:\\s*'([^']*)'[^}]*?relevant:\\s*(true|false)[^}]*?\\}/g;
  let m;
  while ((m = anamnesisRegex.exec(text)) !== null) {
    items.push({ id: m[1], question: escapeStr(m[2]), answer: escapeStr(m[3]), relevant: m[4] });
  }
  
  // Split into surface/middle/deep (even thirds)
  const n = items.length;
  const third = Math.ceil(n / 3);
  const surface = items.slice(0, third);
  const middle = items.slice(third, Math.min(third * 2, n));
  const deep = items.slice(Math.min(third * 2, n));
  
  function fmtItems(arr) {
    if (arr.length === 0) return '          []';
    return '          [\\n' + arr.map(i => 
      `            { id: '${i.id}', question: '${i.question}', answer: '${i.answer}', relevant: ${i.relevant} }`
    ).join(',\\n') + '\\n          ]';
  }
  
  function escapeStr(s) {
    return s.replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'");
  }
  
  // Build the transformed patient
  return `  {
    id: '${id}',
    arrivalBlurb: '${arrivalBlurb}',
    chiefComplaint: '${chiefComplaint}',
    identity: {
      name: '${name}',
      age: ${age},
      gender: '${gender}',
      occupation: 'Unknown',
      livingSituation: 'Unknown',
      primaryLanguage: 'English',
      healthLiteracy: 'medium',
      personality: 'compliant',
      personalTheory: "I'm not sure what's wrong.",
    },
    clinicalState: {
      primaryDiagnosis: '${diagnosis}',
      severity: '${severity}',
      timeline: '',
      baselineVitals: { hr: ${hr}, bp: '${bp}', spo2: ${spo2}, temp: ${temp}, rr: ${rr} },
      medications: [],
      allergies: [],
    },
    history: {
      surface: ${fmtItems(surface)},
      middle: ${fmtItems(middle)},
      deep: ${fmtItems(deep)},
    },
    physicalExam: {
      generalAppearance: '',
      abnormalFindings: [],
    },
    correctDiagnosisId: '${diagnosis}',
    acceptableTreatmentIds: [],
    criticalTreatmentIds: [],
    education: {
      difficulty: 1,
      targetTrainingLevel: 'Medical Student',
      learningObjectives: [],
      commonErrors: [],
      facultyNotes: '',
    },
  }`;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  
  // Detect start of a patient object (a line with just '{' or '{ id:')
  if (trimmed === '{' || trimmed.startsWith('{ id:')) {
    if (trimmed.startsWith('{ id:') || trimmed === '{') {
      // Check if next few lines contain 'name:' — old format indicator
      const nextFew = lines.slice(i, i + 8).join('\\n');
      if (nextFew.includes('name:') && !nextFew.includes('identity:')) {
        // Start collecting patient
        inPatient = true;
        currentPatient = [line];
        braceDepth = 1;
        continue;
      }
    }
  }
  
  if (inPatient) {
    currentPatient.push(line);
    // Count braces to find end
    for (const ch of line) {
      if (ch === '{') braceDepth++;
      if (ch === '}') braceDepth--;
    }
    if (braceDepth <= 0) {
      // End of patient
      inPatient = false;
      out.push(transformPatient(currentPatient));
      continue;
    }
  } else {
    out.push(line);
  }
}

fs.writeFileSync('src/data/polyclinicPatients.ts', out.join('\\n'));
console.log('Migration complete. Re-run npm run build to check for errors.');
"