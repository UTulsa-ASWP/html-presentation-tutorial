/* ====================================================================
   DATASETS
   ==================================================================== */

const MEDICAL_RECORDS = [
  { birth: "1945-07-31", zip: "02138", gender: "M", diagnosis: "Hypertension" },
  { birth: "1945-07-31", zip: "02139", gender: "M", diagnosis: "Diabetes" },
  { birth: "1945-07-31", zip: "02140", gender: "M", diagnosis: "Back Pain" },
  { birth: "1945-07-31", zip: "02138", gender: "F", diagnosis: "Hypothyroid" },
  { birth: "1945-07-31", zip: "02141", gender: "F", diagnosis: "Insomnia" },
  { birth: "1945-07-31", zip: "02142", gender: "F", diagnosis: "Migraine" },
  { birth: "1962-03-14", zip: "02138", gender: "F", diagnosis: "Depression" },
  { birth: "1962-03-14", zip: "02138", gender: "M", diagnosis: "Heart Disease" },
  { birth: "1978-11-22", zip: "02138", gender: "M", diagnosis: "Eczema" },
  { birth: "1950-01-15", zip: "02139", gender: "F", diagnosis: "Arthritis" },
  { birth: "1955-06-08", zip: "02140", gender: "M", diagnosis: "Allergies" },
  { birth: "1970-04-30", zip: "02138", gender: "F", diagnosis: "Anxiety" },
  { birth: "1983-12-05", zip: "02138", gender: "M", diagnosis: "Asthma" },
  { birth: "1960-08-17", zip: "02138", gender: "F", diagnosis: "High Cholesterol" },
  { birth: "1972-09-09", zip: "02138", gender: "M", diagnosis: "Obesity" },
  { birth: "1948-05-25", zip: "02138", gender: "F", diagnosis: "Rheumatoid" },
  { birth: "1985-10-11", zip: "02138", gender: "M", diagnosis: "Allergies" },
  { birth: "1958-02-20", zip: "02140", gender: "F", diagnosis: "Anemia" },
  { birth: "1966-06-05", zip: "02141", gender: "M", diagnosis: "Kidney Stones" },
  { birth: "1974-12-01", zip: "02142", gender: "F", diagnosis: "Sinusitis" },
];

const VOTER_RECORDS = [
  { name: "William F. Weld",     birth: "1945-07-31", zip: "02138", gender: "M" },
  { name: "James Chen",          birth: "1945-07-31", zip: "02139", gender: "M" },
  { name: "Michael Kowalski",    birth: "1945-07-31", zip: "02140", gender: "M" },
  { name: "Margaret Hayes",      birth: "1945-07-31", zip: "02138", gender: "F" },
  { name: "Patricia O'Brien",    birth: "1945-07-31", zip: "02141", gender: "F" },
  { name: "Elizabeth Wong",      birth: "1945-07-31", zip: "02142", gender: "F" },
  { name: "Robert Johnson",      birth: "1962-03-14", zip: "02138", gender: "M" },
  { name: "Jennifer Adams",      birth: "1962-03-14", zip: "02138", gender: "F" },
  { name: "David Park",          birth: "1978-11-22", zip: "02138", gender: "M" },
  { name: "Linda Taylor",        birth: "1950-01-15", zip: "02139", gender: "F" },
  { name: "Thomas Reyes",        birth: "1955-06-08", zip: "02140", gender: "M" },
  { name: "Barbara White",       birth: "1970-04-30", zip: "02138", gender: "F" },
  { name: "Christopher Lee",     birth: "1983-12-05", zip: "02138", gender: "M" },
  { name: "Dorothy Klein",       birth: "1960-08-17", zip: "02138", gender: "F" },
  { name: "Mark Stevens",        birth: "1972-09-09", zip: "02138", gender: "M" },
  { name: "Susan Wheeler",       birth: "1948-05-25", zip: "02138", gender: "F" },
  { name: "Daniel Morrison",     birth: "1985-10-11", zip: "02138", gender: "M" },
  { name: "Carol Jensen",        birth: "1958-02-20", zip: "02140", gender: "F" },
  { name: "Paul Ramirez",        birth: "1966-06-05", zip: "02141", gender: "M" },
  { name: "Helen Fitzgerald",    birth: "1974-12-01", zip: "02142", gender: "F" },
  { name: "George Peterson",     birth: "1952-09-03", zip: "02138", gender: "M" },
  { name: "Nancy Brooks",        birth: "1980-07-18", zip: "02139", gender: "F" },
  { name: "Kevin Walsh",         birth: "1968-11-11", zip: "02140", gender: "M" },
  { name: "Rachel Goldberg",     birth: "1976-02-28", zip: "02138", gender: "F" },
  { name: "Steven Blake",        birth: "1949-04-12", zip: "02141", gender: "M" },
  { name: "Karen Mitchell",      birth: "1987-08-22", zip: "02142", gender: "F" },
  { name: "Brian Alvarez",       birth: "1971-10-05", zip: "02138", gender: "M" },
  { name: "Donna Friedman",      birth: "1963-01-19", zip: "02139", gender: "F" },
  { name: "Edward Tanaka",       birth: "1956-03-30", zip: "02140", gender: "M" },
  { name: "Laura Sullivan",      birth: "1982-05-15", zip: "02141", gender: "F" },
];

// k-anonymization of the 20 MEDICAL_RECORDS (slide 10 interactive).
// Pre-computed; not generated algorithmically.
// k=3: birth → 20-year buckets, zip → 021**, two rows suppressed.
const MEDICAL_K3 = [
  { birth: "1940–1959", zip: "021**", gender: "M", diagnosis: "Hypertension",    generalized: true },
  { birth: "1940–1959", zip: "021**", gender: "M", diagnosis: "Diabetes",        generalized: true },
  { birth: "1940–1959", zip: "021**", gender: "M", diagnosis: "Back Pain",       generalized: true },
  { birth: "1940–1959", zip: "021**", gender: "M", diagnosis: "Allergies",       generalized: true },
  { birth: "1940–1959", zip: "021**", gender: "F", diagnosis: "Hypothyroid",     generalized: true },
  { birth: "1940–1959", zip: "021**", gender: "F", diagnosis: "Insomnia",        generalized: true },
  { birth: "1940–1959", zip: "021**", gender: "F", diagnosis: "Migraine",        generalized: true },
  { birth: "1940–1959", zip: "021**", gender: "F", diagnosis: "Arthritis",       generalized: true },
  { birth: "1940–1959", zip: "021**", gender: "F", diagnosis: "Rheumatoid",      generalized: true },
  { birth: "1940–1959", zip: "021**", gender: "F", diagnosis: "Anemia",          generalized: true },
  { birth: "1960–1979", zip: "021**", gender: "M", diagnosis: "Heart Disease",   generalized: true },
  { birth: "1960–1979", zip: "021**", gender: "M", diagnosis: "Eczema",          generalized: true },
  { birth: "1960–1979", zip: "021**", gender: "M", diagnosis: "Obesity",         generalized: true },
  { birth: "1960–1979", zip: "021**", gender: "M", diagnosis: "Kidney Stones",   generalized: true },
  { birth: "1960–1979", zip: "021**", gender: "F", diagnosis: "Depression",      generalized: true },
  { birth: "1960–1979", zip: "021**", gender: "F", diagnosis: "Anxiety",         generalized: true },
  { birth: "1960–1979", zip: "021**", gender: "F", diagnosis: "High Cholesterol",generalized: true },
  { birth: "1960–1979", zip: "021**", gender: "F", diagnosis: "Sinusitis",       generalized: true },
  { suppressed: true, reason: "1983 M — only 2 such rows, can't form a group of 3" },
  { suppressed: true, reason: "1985 M — only 2 such rows, can't form a group of 3" },
];

// k=5: wider birth buckets (40-year), still suppress the two 1980s rows.
const MEDICAL_K5 = [
  { birth: "1940–1979", zip: "021**", gender: "M", diagnosis: "Hypertension",    generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "M", diagnosis: "Diabetes",        generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "M", diagnosis: "Back Pain",       generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "M", diagnosis: "Allergies",       generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "M", diagnosis: "Heart Disease",   generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "M", diagnosis: "Eczema",          generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "M", diagnosis: "Obesity",         generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "M", diagnosis: "Kidney Stones",   generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "F", diagnosis: "Hypothyroid",     generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "F", diagnosis: "Insomnia",        generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "F", diagnosis: "Migraine",        generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "F", diagnosis: "Arthritis",       generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "F", diagnosis: "Rheumatoid",      generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "F", diagnosis: "Anemia",          generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "F", diagnosis: "Depression",      generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "F", diagnosis: "Anxiety",         generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "F", diagnosis: "High Cholesterol",generalized: true },
  { birth: "1940–1979", zip: "021**", gender: "F", diagnosis: "Sinusitis",       generalized: true },
  { suppressed: true, reason: "1983 M — outside any group of 5" },
  { suppressed: true, reason: "1985 M — outside any group of 5" },
];

const K_DATA_RAW = [
  { age: 32, zip: "02138", gender: "M", diagnosis: "Heart Disease" },
  { age: 34, zip: "02139", gender: "M", diagnosis: "Heart Disease" },
  { age: 36, zip: "02141", gender: "M", diagnosis: "Heart Disease" },
  { age: 38, zip: "02142", gender: "M", diagnosis: "Heart Disease" },
  { age: 31, zip: "02140", gender: "M", diagnosis: "Heart Disease" },
  { age: 45, zip: "02138", gender: "F", diagnosis: "Arthritis" },
  { age: 48, zip: "02139", gender: "F", diagnosis: "Migraine" },
  { age: 51, zip: "02140", gender: "F", diagnosis: "Depression" },
  { age: 55, zip: "02141", gender: "F", diagnosis: "Diabetes" },
  { age: 58, zip: "02142", gender: "F", diagnosis: "Asthma" },
  { age: 72, zip: "02138", gender: "M", diagnosis: "Cholesterol" },
  { age: 104, zip: "02139", gender: "F", diagnosis: "Insomnia" },
];

const K_DATA_K3 = [
  { age: "30–40", zip: "021**", gender: "M", diagnosis: "Heart Disease", generalized: true },
  { age: "30–40", zip: "021**", gender: "M", diagnosis: "Heart Disease", generalized: true },
  { age: "30–40", zip: "021**", gender: "M", diagnosis: "Heart Disease", generalized: true },
  { age: "30–40", zip: "021**", gender: "M", diagnosis: "Heart Disease", generalized: true },
  { age: "30–40", zip: "021**", gender: "M", diagnosis: "Heart Disease", generalized: true },
  { age: "40–60", zip: "021**", gender: "F", diagnosis: "Arthritis", generalized: true },
  { age: "40–60", zip: "021**", gender: "F", diagnosis: "Migraine", generalized: true },
  { age: "40–60", zip: "021**", gender: "F", diagnosis: "Depression", generalized: true },
  { age: "40–60", zip: "021**", gender: "F", diagnosis: "Diabetes", generalized: true },
  { age: "40–60", zip: "021**", gender: "F", diagnosis: "Asthma", generalized: true },
  { age: 72, zip: "02138", gender: "M", diagnosis: "Cholesterol" },
  { age: 104, zip: "02139", gender: "F", diagnosis: "Insomnia" },
];

const K_DATA_K5 = [
  { age: "30–40", zip: "021**", gender: "M", diagnosis: "Heart Disease", generalized: true, homogeneity: true },
  { age: "30–40", zip: "021**", gender: "M", diagnosis: "Heart Disease", generalized: true, homogeneity: true },
  { age: "30–40", zip: "021**", gender: "M", diagnosis: "Heart Disease", generalized: true, homogeneity: true },
  { age: "30–40", zip: "021**", gender: "M", diagnosis: "Heart Disease", generalized: true, homogeneity: true },
  { age: "30–40", zip: "021**", gender: "M", diagnosis: "Heart Disease", generalized: true, homogeneity: true },
  { age: "40–60", zip: "021**", gender: "F", diagnosis: "Arthritis", generalized: true },
  { age: "40–60", zip: "021**", gender: "F", diagnosis: "Migraine", generalized: true },
  { age: "40–60", zip: "021**", gender: "F", diagnosis: "Depression", generalized: true },
  { age: "40–60", zip: "021**", gender: "F", diagnosis: "Diabetes", generalized: true },
  { age: "40–60", zip: "021**", gender: "F", diagnosis: "Asthma", generalized: true },
  { suppressed: true },
  { suppressed: true },
];

const SALARY_BINS = [
  { range: "$20–30k", count: 30 },
  { range: "$30–40k", count: 80 },
  { range: "$40–50k", count: 180 },
  { range: "$50–60k", count: 250 },
  { range: "$60–70k", count: 220 },
  { range: "$70–80k", count: 130 },
  { range: "$80–90k", count: 70 },
  { range: "$90–100k", count: 25 },
  { range: "$100–110k", count: 10 },
  { range: "$110–120k", count: 5 },
];

const SALARY_MIDPOINTS = [25000, 35000, 45000, 55000, 65000, 75000, 85000, 95000, 105000, 115000];

const TOWN_GROUPS = [
  { name: "Group A (Majority)", count: 950 },
  { name: "Group B", count: 12 },
  { name: "Group C", count: 7 },
  { name: "Group D", count: 5 },
  { name: "Group E", count: 3 },
];

/* ====================================================================
   LAPLACE NOISE
   ==================================================================== */

function laplaceNoise(epsilon, sensitivity = 1) {
  const scale = sensitivity / epsilon;
  const u = Math.random() - 0.5;
  return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
}

function sliderToEpsilon(sliderValue) {
  return Math.pow(10, sliderValue / 10);
}

/* ====================================================================
   LINKAGE ATTACK
   ==================================================================== */

let linkageFilters = { birth: false, gender: false, zip: false };

function renderMedicalTable() {
  const body = document.getElementById('medicalBody');
  body.innerHTML = MEDICAL_RECORDS.map((r, i) => {
    const shouldShow = rowMatchesFilters(r);
    const isFinal = linkageFilters.birth && linkageFilters.gender && linkageFilters.zip && shouldShow;
    const cls = isFinal ? 'reveal' : (shouldShow ? '' : 'filtered-out');
    return `<tr class="${cls}" data-idx="${i}">
      <td>${r.birth}</td>
      <td>${r.zip}</td>
      <td>${r.gender}</td>
      <td>${r.diagnosis}</td>
    </tr>`;
  }).join('');
}

function renderVoterTable() {
  const body = document.getElementById('voterBody');
  body.innerHTML = VOTER_RECORDS.map((r, i) => {
    const shouldShow = rowMatchesFilters(r);
    const isFinal = linkageFilters.birth && linkageFilters.gender && linkageFilters.zip && shouldShow;
    const cls = isFinal ? 'reveal' : (shouldShow ? '' : 'filtered-out');
    return `<tr class="${cls}" data-idx="${i}">
      <td>${r.name}</td>
      <td>${r.birth}</td>
      <td>${r.zip}</td>
      <td>${r.gender}</td>
    </tr>`;
  }).join('');
}

function rowMatchesFilters(r) {
  if (linkageFilters.birth && r.birth !== "1945-07-31") return false;
  if (linkageFilters.gender && r.gender !== "M") return false;
  if (linkageFilters.zip && r.zip !== "02138") return false;
  return true;
}

function applyFilter(which) {
  linkageFilters[which] = true;
  renderMedicalTable();
  renderVoterTable();
  updateLinkageCounts();

  if (which === 'birth') {
    document.getElementById('filterBirthBtn').disabled = true;
    document.getElementById('filterBirthBtn').classList.add('active');
    document.getElementById('filterGenderBtn').disabled = false;
  } else if (which === 'gender') {
    document.getElementById('filterGenderBtn').disabled = true;
    document.getElementById('filterGenderBtn').classList.add('active');
    document.getElementById('filterZipBtn').disabled = false;
  } else if (which === 'zip') {
    document.getElementById('filterZipBtn').disabled = true;
    document.getElementById('filterZipBtn').classList.add('active');
    setTimeout(() => {
      document.getElementById('linkageReveal').style.display = 'block';
    }, 500);
  }
}

function updateLinkageCounts() {
  const med = MEDICAL_RECORDS.filter(rowMatchesFilters).length;
  const vot = VOTER_RECORDS.filter(rowMatchesFilters).length;
  document.getElementById('medicalCount').textContent = med;
  document.getElementById('voterCount').textContent = vot;
}

function resetLinkage() {
  linkageFilters = { birth: false, gender: false, zip: false };
  ['filterBirthBtn', 'filterGenderBtn', 'filterZipBtn'].forEach(id => {
    document.getElementById(id).classList.remove('active');
  });
  document.getElementById('filterBirthBtn').disabled = false;
  document.getElementById('filterGenderBtn').disabled = true;
  document.getElementById('filterZipBtn').disabled = true;
  document.getElementById('linkageReveal').style.display = 'none';
  renderMedicalTable();
  renderVoterTable();
  updateLinkageCounts();
}

/* ====================================================================
   k-ANONYMITY
   ==================================================================== */

/* ====================================================================
   SLIDE 4 — DIRECT IDENTIFIERS
   ==================================================================== */

function removeDirectIdentifiers() {
  const table = document.getElementById('hospitalTable');
  const weld = document.getElementById('weldAside');
  if (table) table.classList.add('redacted');
  if (weld) weld.classList.add('blurred');
}

function restoreDirectIdentifiers() {
  const table = document.getElementById('hospitalTable');
  const weld = document.getElementById('weldAside');
  if (table) table.classList.remove('redacted');
  if (weld) weld.classList.remove('blurred');
}

let currentK = 1;

function setK(k) {
  currentK = k;
  ['k1Btn', 'k3Btn', 'k5Btn'].forEach(id => {
    document.getElementById(id).classList.remove('active');
  });
  document.getElementById(`k${k}Btn`).classList.add('active');

  const revealBtn = document.getElementById('revealBtn');
  if (k === 5) {
    revealBtn.disabled = false;
  } else {
    revealBtn.disabled = true;
    document.getElementById('homogeneityExplanation').style.display = 'none';
    document.querySelectorAll('#kBody tr').forEach(tr => {
      tr.classList.remove('homogeneity-reveal');
    });
  }

  renderKTable();

  const caption = document.getElementById('kTableCaption');
  if (k === 1) caption.textContent = 'Raw Hospital Dataset (k = 1)';
  else if (k === 3) caption.textContent = 'Generalized Dataset (k = 3)';
  else caption.textContent = 'Anonymized Dataset (k = 5)';
}

function renderKTable() {
  const body = document.getElementById('kBody');
  const data = currentK === 1 ? K_DATA_RAW : (currentK === 3 ? K_DATA_K3 : K_DATA_K5);

  body.innerHTML = data.map(r => {
    if (r.suppressed) {
      return `<tr><td class="suppressed" colspan="4">SUPPRESSED (outlier)</td></tr>`;
    }
    const cls = r.generalized ? 'generalized' : '';
    const rowCls = r.homogeneity ? 'homogeneity-group' : '';
    return `<tr class="${rowCls}">
      <td class="${cls}">${r.age}</td>
      <td class="${cls}">${r.zip}</td>
      <td class="${cls}">${r.gender}</td>
      <td>${r.diagnosis}</td>
    </tr>`;
  }).join('');
}

/* ====================================================================
   SLIDE 10 — INTERACTIVE k-ANONYMIZATION (MEDICAL RECORDS)
   ==================================================================== */

let medicalK = 1;

function setMedicalK(k) {
  medicalK = k;
  ['mk1Btn', 'mk3Btn', 'mk5Btn'].forEach(id => {
    document.getElementById(id).classList.remove('active');
  });
  document.getElementById(`mk${k}Btn`).classList.add('active');

  renderMedicalKTable();

  const caption = document.getElementById('mkTableCaption');
  if (k === 1) caption.textContent = 'Raw Medical Records (k = 1)';
  else if (k === 3) caption.textContent = 'Generalized Dataset (k = 3)';
  else caption.textContent = 'Anonymized Dataset (k = 5)';
}

function renderMedicalKTable() {
  const body = document.getElementById('mkBody');
  let data;
  if (medicalK === 1) {
    data = MEDICAL_RECORDS.map(r => ({
      birth: r.birth, zip: r.zip, gender: r.gender, diagnosis: r.diagnosis
    }));
  } else if (medicalK === 3) {
    data = MEDICAL_K3;
  } else {
    data = MEDICAL_K5;
  }

  body.innerHTML = data.map(r => {
    if (r.suppressed) {
      return `<tr><td class="suppressed" colspan="4">SUPPRESSED (outlier)</td></tr>`;
    }
    const cls = r.generalized ? 'generalized' : '';
    return `<tr>
      <td class="${cls}">${r.birth}</td>
      <td class="${cls}">${r.zip}</td>
      <td class="${cls}">${r.gender}</td>
      <td>${r.diagnosis}</td>
    </tr>`;
  }).join('');
}

function revealHomogeneity() {
  document.getElementById('homogeneityExplanation').style.display = 'block';
  const rows = document.querySelectorAll('#kBody tr.homogeneity-group');
  rows.forEach(tr => tr.classList.add('homogeneity-reveal'));
}

/* ====================================================================
   EPSILON SLIDER / HISTOGRAM
   ==================================================================== */

let currentEpsilon = 1.0;

function updateEpsilon() {
  const slider = document.getElementById('epsilonSlider');
  currentEpsilon = sliderToEpsilon(parseInt(slider.value));
  document.getElementById('epsilonValue').textContent = `ε = ${currentEpsilon.toFixed(2)}`;

  const interp = document.getElementById('epsilonInterpretation');
  if (currentEpsilon < 0.5) {
    interp.textContent = 'Strong privacy — the data is too blurry to be useful';
    interp.style.color = 'var(--red)';
  } else if (currentEpsilon < 2) {
    interp.textContent = 'The balance point — moderate privacy, moderate utility';
    interp.style.color = 'var(--ink-muted)';
  } else if (currentEpsilon < 10) {
    interp.textContent = 'Leaning toward utility — some privacy protection, clearer trends';
    interp.style.color = 'var(--ink-muted)';
  } else {
    interp.textContent = 'Weak privacy — the picture is clear, but attackers can get through';
    interp.style.color = 'var(--gold)';
  }

  drawSalaryChart();
  updateFrostedGlass();
}

function rerollEpsilon() { drawSalaryChart(); }

/* ====================================================================
   SLIDE 12 — CROWD BLUR (DP intro / frosted glass visual)
   ==================================================================== */

function updateCrowdBlur() {
  const slider = document.getElementById('crowdEpsilonSlider');
  if (!slider) return;
  const epsilon = sliderToEpsilon(parseInt(slider.value));
  document.getElementById('crowdEpsilonValue').textContent = `ε = ${epsilon.toFixed(2)}`;
  // Low epsilon → heavy blur; high epsilon → crisp.
  const blurPx = Math.min(32, Math.max(0, 6 / epsilon));
  const img = document.getElementById('crowdImage');
  if (img) img.style.filter = `blur(${blurPx.toFixed(2)}px)`;
}

function updateFrostedGlass() {
  const blur = Math.min(8, Math.max(0, 2.5 / currentEpsilon));
  const overlay = document.getElementById('glassOverlay');
  overlay.style.backdropFilter = `blur(${blur}px)`;
  overlay.style.webkitBackdropFilter = `blur(${blur}px)`;
}

function drawSalaryChart() {
  const svg = document.getElementById('salaryChart');
  const width = 800;
  const height = 350;
  const marginTop = 30;
  const marginBottom = 60;
  const marginLeft = 50;
  const marginRight = 20;
  const plotW = width - marginLeft - marginRight;
  const plotH = height - marginTop - marginBottom;

  const noisyCounts = SALARY_BINS.map(bin => {
    const noise = laplaceNoise(currentEpsilon, 1);
    return Math.max(0, Math.round(bin.count + noise));
  });

  const maxCount = Math.max(...SALARY_BINS.map(b => b.count)) * 1.15;
  const barWidth = plotW / SALARY_BINS.length * 0.8;
  const barGap = plotW / SALARY_BINS.length * 0.2;

  let bars = '';
  SALARY_BINS.forEach((bin, i) => {
    const x = marginLeft + i * (plotW / SALARY_BINS.length) + barGap / 2;
    const trueH = (bin.count / maxCount) * plotH;
    const trueY = marginTop + plotH - trueH;
    bars += `<rect class="chart-bar true" x="${x}" y="${trueY}" width="${barWidth}" height="${trueH}" opacity="0.3"/>`;
    const noisyH = (noisyCounts[i] / maxCount) * plotH;
    const noisyY = marginTop + plotH - noisyH;
    bars += `<rect class="chart-bar noisy" x="${x}" y="${noisyY}" width="${barWidth}" height="${noisyH}"/>`;
    const labelX = x + barWidth / 2;
    bars += `<text class="chart-label" x="${labelX}" y="${marginTop + plotH + 18}" text-anchor="middle">${bin.range}</text>`;
    bars += `<text class="chart-label" x="${labelX}" y="${marginTop + plotH + 34}" text-anchor="middle" fill="#1d3557" font-weight="600">${noisyCounts[i]}</text>`;
  });

  const axes = `
    <line class="chart-axis" x1="${marginLeft}" y1="${marginTop + plotH}" x2="${width - marginRight}" y2="${marginTop + plotH}"/>
    <line class="chart-axis" x1="${marginLeft}" y1="${marginTop}" x2="${marginLeft}" y2="${marginTop + plotH}"/>
    <text class="chart-title" x="${width / 2}" y="18" text-anchor="middle">Salary Distribution (1,000 synthetic individuals)</text>
  `;

  svg.innerHTML = axes + bars;

  const trueMean = SALARY_BINS.reduce((sum, b, i) => sum + SALARY_MIDPOINTS[i] * b.count, 0)
                    / SALARY_BINS.reduce((sum, b) => sum + b.count, 0);
  const noisyTotal = noisyCounts.reduce((a, b) => a + b, 0);
  const noisyMean = noisyTotal > 0
                    ? noisyCounts.reduce((sum, c, i) => sum + SALARY_MIDPOINTS[i] * c, 0) / noisyTotal
                    : 0;
  const delta = noisyMean - trueMean;

  document.getElementById('trueMean').textContent = '$' + Math.round(trueMean).toLocaleString();
  document.getElementById('noisyMean').textContent = '$' + Math.round(noisyMean).toLocaleString();
  document.getElementById('meanDelta').textContent = (delta >= 0 ? '+' : '−') + '$' + Math.abs(Math.round(delta)).toLocaleString();
}

/* ====================================================================
   MINORITY ERASURE
   ==================================================================== */

let townEpsilon = 1.0;

function updateTown() {
  const slider = document.getElementById('townEpsilonSlider');
  townEpsilon = sliderToEpsilon(parseInt(slider.value));
  document.getElementById('townEpsilonValue').textContent = `ε = ${townEpsilon.toFixed(2)}`;
  drawTownChart();
}

function rerollTown() { drawTownChart(); }

function drawTownChart() {
  const svg = document.getElementById('townChart');
  const width = 800;
  const height = 360;
  const marginTop = 40;
  const marginBottom = 40;
  const marginLeft = 200;
  const marginRight = 120;
  const plotW = width - marginLeft - marginRight;
  const plotH = height - marginTop - marginBottom;

  const noisyCounts = TOWN_GROUPS.map(g => {
    const noise = laplaceNoise(townEpsilon, 1);
    return Math.max(0, Math.round(g.count + noise));
  });

  const maxCount = TOWN_GROUPS[0].count * 1.1;
  const barH = plotH / TOWN_GROUPS.length * 0.65;
  const barGap = plotH / TOWN_GROUPS.length * 0.35;

  let bars = '';
  let erasedCount = 0;
  TOWN_GROUPS.forEach((g, i) => {
    const y = marginTop + i * (plotH / TOWN_GROUPS.length) + barGap / 2;
    const noisy = noisyCounts[i];
    const trueW = (g.count / maxCount) * plotW;
    const noisyW = (noisy / maxCount) * plotW;
    const isErased = noisy === 0;
    if (isErased) erasedCount++;

    const labelStyle = isErased ? 'fill: #9b2c2c; text-decoration: line-through;' : 'fill: #1a1a2e;';
    bars += `<text x="${marginLeft - 12}" y="${y + barH / 2 + 4}" text-anchor="end" font-family="Inter, sans-serif" font-size="13" font-weight="600" style="${labelStyle}">${g.name} (true: ${g.count})</text>`;

    bars += `<rect x="${marginLeft}" y="${y}" width="${trueW}" height="${barH}" fill="#c9c4b8" opacity="0.35"/>`;

    const fill = isErased ? '#e53e3e' : '#1d3557';
    const opacity = isErased ? '0.25' : '1';
    bars += `<rect class="chart-bar" x="${marginLeft}" y="${y}" width="${Math.max(2, noisyW)}" height="${barH}" fill="${fill}" opacity="${opacity}"/>`;

    const displayText = isErased ? 'ERASED' : noisy;
    const textColor = isErased ? '#9b2c2c' : '#1d3557';
    bars += `<text x="${marginLeft + Math.max(noisyW, 8) + 8}" y="${y + barH / 2 + 5}" font-family="JetBrains Mono, monospace" font-size="13" font-weight="700" fill="${textColor}">${displayText}</text>`;
  });

  const title = `<text class="chart-title" x="${width / 2}" y="22" text-anchor="middle">Mock Town Demographic Report (after DP noise)</text>`;

  svg.innerHTML = title + bars;

  document.getElementById('erasedCount').textContent = erasedCount;
}

/* ====================================================================
   PRESENTATION NAVIGATION
   ==================================================================== */

let currentSlide = 0;
let slideElements = [];

function initSlides() {
  slideElements = Array.from(document.querySelectorAll('section.slide'));

  const dots = document.getElementById('slideDots');
  dots.innerHTML = '';
  slideElements.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slide-dot';
    dot.dataset.idx = i;
    dot.addEventListener('click', () => goToSlide(i));
    dots.appendChild(dot);
  });

  updateSlideChrome();
}

function goToSlide(n) {
  currentSlide = Math.max(0, Math.min(slideElements.length - 1, n));
  slideElements[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateSlideChrome();
}

function updateSlideChrome() {
  const viewportCenter = window.scrollY + window.innerHeight / 2;
  let bestIdx = 0;
  let bestDist = Infinity;
  slideElements.forEach((el, i) => {
    const elCenter = el.offsetTop + el.offsetHeight / 2;
    const dist = Math.abs(viewportCenter - elCenter);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  });
  currentSlide = bestIdx;

  document.querySelectorAll('.slide-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });

  document.getElementById('slideCounter').textContent = `${currentSlide + 1} / ${slideElements.length}`;

  const pct = slideElements.length > 1 ? (currentSlide / (slideElements.length - 1)) * 100 : 0;
  document.getElementById('progressBar').style.width = pct + '%';

  if (document.getElementById('speakerNotesPanel').classList.contains('visible')) {
    populateSpeakerNotes();
  }
}

function populateSpeakerNotes() {
  const slide = slideElements[currentSlide];
  const notes = slide.querySelector('.speaker-notes');
  const container = document.getElementById('speakerNotesContent');
  if (notes) {
    container.innerHTML = notes.innerHTML;
  } else {
    container.innerHTML = '<p><em>No speaker notes for this slide.</em></p>';
  }
}

function toggleSpeakerNotes() {
  const panel = document.getElementById('speakerNotesPanel');
  panel.classList.toggle('visible');
  if (panel.classList.contains('visible')) {
    populateSpeakerNotes();
  }
}

/* ====================================================================
   KEYBOARD NAVIGATION
   ==================================================================== */

document.addEventListener('keydown', (e) => {
  const active = document.activeElement;
  const activeTag = active ? active.tagName : '';
  const isInput = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || active?.isContentEditable;

  if (isInput && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
    return;
  }

  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'ArrowDown') {
    e.preventDefault();
    goToSlide(currentSlide + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'ArrowUp') {
    e.preventDefault();
    goToSlide(currentSlide - 1);
  } else if (e.key === ' ' && !isInput) {
    e.preventDefault();
    goToSlide(currentSlide + 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSlide(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSlide(slideElements.length - 1);
  } else if ((e.key === 's' || e.key === 'S') && !isInput) {
    e.preventDefault();
    toggleSpeakerNotes();
  } else if (e.key === 'Escape') {
    const panel = document.getElementById('speakerNotesPanel');
    if (panel.classList.contains('visible')) {
      panel.classList.remove('visible');
    }
  }
});

/* ====================================================================
   INITIALIZATION
   ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  renderMedicalTable();
  renderVoterTable();
  updateLinkageCounts();
  renderKTable();
  renderMedicalKTable();
  updateCrowdBlur();
  drawSalaryChart();
  updateFrostedGlass();
  drawTownChart();

  initSlides();

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateSlideChrome, 100);
  });
});
