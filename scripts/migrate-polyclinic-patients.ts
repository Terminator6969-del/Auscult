"// One-time migration script: transforms polyclinicPatients.ts from old format
// (top-level name/age/gender/severity/vitals/anamnesis) to new format
// (identity/clinicalState/history layers).
// Run: node scripts/migrate-polyclinic-patients.ts
// Then manually verify the output and replace src/data/polyclinicPatients.ts

import { readFileSync, writeFileSync } from 'fs';

const src = readFileSync('src/data/polyclinicPatients.ts', 'utf-8');

// Break into two parts: imports/type declarations at top, then patient arrays
// Strategy: transform each patient object by adding identity/clinicalState/history
// while preserving other fields.

// Simple approach: regex replace each patient object
// Match pattern: {
//   id: '...',
//   name: '...',
//   age: ...,
//   gender: '...',
//   severity: '...',
//   ...other fields...
//   anamnesis: [ ... ],
// }
// 
// Transform to:
// {
//   id: '...',
//   arrivalBlurb: ...,
//   chiefComplaint: ...,
//   identity: { name, age, gender, occupation, livingSituation, primaryLanguage, healthLiteracy, personality, personalTheory },
//   clinicalState: { primaryDiagnosis, severity, timeline, baselineVitals, medications, allergies },
//   history: { surface, middle, deep },
//   physicalExam: { ... },
//   ...
// }

function transformPatient(chunk: string): string {
  // Extract key fields
  const idMatch = chunk.match(/id:\s*'([^']+)'/);
  const nameMatch = chunk.match(/name:\s*'([^']+)'/);
  const ageMatch = chunk.match(/age:\s*(\d+)/);
  const genderMatch = chunk.match(/gender:\s*'([^']+)'/);
  const severityMatch = chunk.match(/severity:\s*'([^']+)'/);
  const vitalsMatch = chunk.match(/vitals:\s*\{([^}]+)\}/s);
  const arrivalBlurbMatch = chunk.match(/arrivalBlurb:\s*'([^']*)'/);
  const chiefComplaintMatch = chunk.match(/chiefComplaint:\s*'([^']*)'/);
  const anamnesisMatch = chunk.match(/anamnesis:\s*\[([\s\S]*?)\],?\n?\s*(?:\w+\s*:|\})/);

  if (!idMatch) return chunk; // safety skip

  const id = idMatch[1];
  const name = nameMatch ? nameMatch[1] : 'Unknown';
  const age = ageMatch ? parseInt(ageMatch[1]) : 40;
  const gender = genderMatch ? genderMatch[1] : 'F';
  const severity = severityMatch ? severityMatch[1] : 'stable';
  const arrivalBlurb = arrivalBlurbMatch ? arrivalBlurbMatch[1] : '';
  const chiefComplaint = chiefComplaintMatch ? chiefComplaintMatch[1] : '';
  
  // Parse vitals
  let hr = 80, bp = '120/80', spo2 = 98, temp = 37.0, rr = 16;
  if (vitalsMatch) {
    const v = vitalsMatch[1];
    const hrMatch = v.match(/hr:\s*(\d+)/);
    const bpMatch = v.match(/bp:\s*'([^']+)'/);
    const spo2Match = v.match(/spo2:\s*(\d+)/);
    const tempMatch = v.match(/temp:\s*([\d.]+)/);
    const rrMatch = v.match(/rr:\s*(\d+)/);
    if (hrMatch) hr = parseInt(hrMatch[1]);
    if (bpMatch) bp = bpMatch[1];
    if (spo2Match) spo2 = parseInt(spo2Match[1]);
    if (tempMatch) temp = parseFloat(tempMatch[1]);
    if (rrMatch) rr = parseInt(rrMatch[1]);
  }

  // Parse anamnesis items
  const items: string[] = [];
  if (anamnesisMatch) {
    const raw = anamnesisMatch[1];
    const itemRegex = /\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?question:\s*'([^']*)'[\s\S]*?answer:\s*'([^']*)'[\s\S]*?relevant:\s*(true|false)[\s\S]*?\}/g;
    let match;
    while ((match = itemRegex.exec(raw)) !== null) {
      items.push(`          { id: '${match[1]}', question: '${match[2].replace(/'/g, "\\\\'")}', answer: '${match[3].replace(/'/g, "\\\\'")}', relevant: ${match[4]} }`);
    }
  }

  // Split anamnesis items into surface/middle/deep
  const n = items.length;
  const third = Math.ceil(n / 3);
  const surface = items.slice(0, third);
  const middle = items.slice(third, Math.min(third * 2, n));
  const deep = items.slice(Math.min(third * 2, n));

  // Reconstruct the patient with identity/clinicalState/history
  // Extract other fields that should remain
  const otherFields: string[] = [];
  const lines = chunk.split('\\n');
  let inAnamnesis = false;
  for (const line of lines) {
    if (line.includes('anamnesis:')) { inAnamnesis = true; continue; }
    if (inAnamnesis) {
      if (line.trim() === '],' || line.trim() === ']') { inAnamnesis = false; continue; }
      continue;
    }
    // Skip fields we're replacing
    if (line.includes('id:') || line.includes('name:') || line.includes('age:') || 
        line.includes('gender:') || line.includes('severity:') || 
        line.includes('arrivalBlurb:') || line.includes('chiefComplaint:') ||
        line.includes('vitals:') || line.includes('diagnosis:') ||
        line.includes('personalTheory:') || line.includes('healthLiteracy:') ||
        line.includes('occupation:') || line.includes('livingSituation:') ||
        line.includes('primaryLanguage:') || line.includes('personality:') ||
        line.includes('medications:') || line.includes('allergies:') ||
        line.includes('timeline:')) continue;
    otherFields.push(line);
  }
  const otherBlock = otherFields.join('\\n').replace(/,\s*,\s*/g, ',').replace(/\{,\s*/g, '{');

  const diagnosisMatch = chunk.match(/diagnosis:\s*'([^']+)'/);
  const diagnosis = diagnosisMatch ? diagnosisMatch[1] : 'unknown';

  return `{
    id: '${id}',
    arrivalBlurb: '${arrivalBlurb.replace(/'/g, "\\\\'")}',
    chiefComplaint: '${chiefComplaint.replace(/'/g, "\\\\'")}',
    identity: {
      name: '${name.replace(/'/g, "\\\\'")}',
      age: ${age},
      gender: '${gender}',
      occupation: 'Unknown',
      livingSituation: 'Unknown',
      primaryLanguage: 'English',
      healthLiteracy: 'medium',
      personality: 'compliant',
      personalTheory: 'I\\'m not sure what\\'s wrong.',
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
      surface: [${surface.length > 0 ? '\\n' + surface.join(',\\n') + '\\n        ' : ''}],
      middle: [${middle.length > 0 ? '\\n' + middle.join(',\\n') + '\\n        ' : ''}],
      deep: [${deep.length > 0 ? '\\n' + deep.join(',\\n') + '\\n        ' : ''}],
    },
    physicalExam: {
      generalAppearance: '',
      abnormalFindings: [],
    },${otherBlock.replace(/^,\s*/m, '\\n')}
  }`;
}

// Find all patient objects and transform them
const result = src.replace(/(\n\s*\{[\s\S]*?\}\s*,?)\n\s*(?=\n\s*\]|\n\s*\w+\s*:|\n\s*\/\/)/g, (match) => {
  // Skip if it's already in new format (has identity field)
  if (match.includes('identity:') && match.includes('clinicalState:')) return match;
  return transformPatient(match);
});

writeFileSync('src/data/polyclinicPatients.transformed.ts', result);
console.log('Done. Check src/data/polyclinicPatients.transformed.ts and then rename it.');
"