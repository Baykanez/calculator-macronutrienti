document.getElementById('form-calculator').addEventListener('submit', function (e) {
  e.preventDefault();

  const sex = document.getElementById('sex').value;
  const varsta = parseFloat(document.getElementById('varsta').value);
  const greutate = parseFloat(document.getElementById('greutate').value);
  const inaltime = parseFloat(document.getElementById('inaltime').value);
  const activitate = parseFloat(document.getElementById('activitate').value);
  const obiectiv = document.getElementById('obiectiv').value;

  // BMR - formula Mifflin-St Jeor
  let bmr;
  if (sex === 'm') {
    bmr = 10 * greutate + 6.25 * inaltime - 5 * varsta + 5;
  } else {
    bmr = 10 * greutate + 6.25 * inaltime - 5 * varsta - 161;
  }

  // TDEE
  let tdee = bmr * activitate;

  // Deficit sex-specific și TDEE de referință pentru plan progresiv
  const deficit = sex === 'm' ? 500 : 300;
  const tdeeBrut = Math.round(tdee);
  const minimKcal = sex === 'm' ? 1500 : 1200;

  if (obiectiv === 'slabire') tdee -= deficit;
  if (obiectiv === 'masa') tdee += 300;

  // Prag minim recomandat la slăbire
  let atinsPrag = false;
  if (obiectiv === 'slabire' && tdee < minimKcal) {
    tdee = minimKcal;
    atinsPrag = true;
  }

  const calorii = Math.round(tdee);

  // Proteine
  const proteineG = sex === 'm'
    ? Math.round(greutate * 2)
    : Math.round(greutate * 1.5);
  const proteineKcal = proteineG * 4;

  // Grăsimi - 30% din calorii totale
  const grasimilorKcal = calorii * 0.30;
  const grasimilorG = Math.round(grasimilorKcal / 9);

  // Carbohidrați - caloriile rămase
  const carbohidratiKcal = calorii - proteineKcal - grasimilorKcal;
  const carbohidratiG = Math.round(carbohidratiKcal / 4);

  // Hidratare - 35-40 ml/kg
  const apaMin = (greutate * 35 / 1000).toFixed(1);
  const apaMax = (greutate * 40 / 1000).toFixed(1);

  // Afișare rezultate
  document.getElementById('r-calorii').textContent = calorii + ' kcal';
  document.getElementById('r-proteine').textContent = proteineG + ' g';
  document.getElementById('r-carbohidrati').textContent = carbohidratiG + ' g';
  document.getElementById('r-grasimi').textContent = grasimilorG + ' g';
  document.getElementById('r-apa').textContent = apaMin + ' – ' + apaMax + ' litri';

  // Avertizare prag minim
  const elAvertizare = document.getElementById('r-avertizare');
  const elAvertizareText = document.getElementById('r-avertizare-text');
  let avertizareTxt = '';
  if (obiectiv === 'slabire' && atinsPrag) {
    avertizareTxt = `Deficitul calculat scade sub pragul minim recomandat de ${minimKcal} kcal/zi pentru ${sex === 'm' ? 'bărbați' : 'femei'}. Aportul a fost ajustat automat la această valoare.`;
    elAvertizareText.textContent = avertizareTxt;
    elAvertizare.classList.remove('hidden');
  } else {
    elAvertizare.classList.add('hidden');
  }

  // Plan progresiv de reducere calorică
  const elRecomandare = document.getElementById('r-recomandare');
  const elPlanProgresiv = document.getElementById('r-plan-progresiv');
  let planProgresivHTML = '';
  let planProgresivTxt = '';

  if (obiectiv === 'slabire') {
    const pasi = deficit / 100;
    for (let i = 1; i <= pasi; i++) {
      const kcalZiua = tdeeBrut - i * 100;
      const kcalAfisat = Math.max(kcalZiua, minimKcal);
      const esteTinta = i === pasi || kcalZiua <= minimKcal;
      const sufix = esteTinta ? ' ← țintă' : '';
      planProgresivHTML += `Ziua ${i}: <strong>${kcalAfisat} kcal</strong>${esteTinta ? ' <em>← țintă</em>' : ''}<br>`;
      planProgresivTxt += `Ziua ${i}: ${kcalAfisat} kcal${sufix}\n`;
      if (kcalZiua <= minimKcal) break;
    }
    elPlanProgresiv.innerHTML = planProgresivHTML;
    elRecomandare.classList.remove('hidden');
  } else {
    elRecomandare.classList.add('hidden');
  }

  // Salvare date pentru descărcare
  const rezultateEl = document.getElementById('rezultate');
  rezultateEl.dataset.avertizare = avertizareTxt;
  rezultateEl.dataset.planProgresiv = planProgresivTxt;

  rezultateEl.classList.remove('hidden');
});

document.getElementById('btn-descarca').addEventListener('click', function () {
  const calorii = document.getElementById('r-calorii').textContent;
  const proteine = document.getElementById('r-proteine').textContent;
  const carbohidrati = document.getElementById('r-carbohidrati').textContent;
  const grasimi = document.getElementById('r-grasimi').textContent;
  const apa = document.getElementById('r-apa').textContent;

  const rezultateEl = document.getElementById('rezultate');
  const avertizare = rezultateEl.dataset.avertizare || '';
  const planProgresiv = rezultateEl.dataset.planProgresiv || '';

  let continut =
    'Necesarul tău zilnic de macronutrienți\n' +
    '========================================\n' +
    'Calorii totale:  ' + calorii + '\n' +
    'Proteine:        ' + proteine + '\n' +
    'Carbohidrați:    ' + carbohidrati + '\n' +
    'Grăsimi:         ' + grasimi + '\n' +
    'Hidratare:       ' + apa + '\n';

  if (avertizare) {
    continut += '\nATENȚIE: ' + avertizare + '\n';
  }

  if (planProgresiv) {
    continut +=
      '\nReducere progresivă recomandată (max. 100 kcal/zi):\n' +
      '--------------------------------------------\n' +
      planProgresiv;
  }

  const blob = new Blob([continut], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'macronutrienti.txt';
  a.click();
  URL.revokeObjectURL(url);
});
