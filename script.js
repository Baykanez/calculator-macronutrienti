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

  // Ajustare obiectiv
  if (obiectiv === 'slabire') tdee -= 500;
  if (obiectiv === 'masa') tdee += 300;

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

  document.getElementById('rezultate').classList.remove('hidden');
});

document.getElementById('btn-descarca').addEventListener('click', function () {
  const calorii = document.getElementById('r-calorii').textContent;
  const proteine = document.getElementById('r-proteine').textContent;
  const carbohidrati = document.getElementById('r-carbohidrati').textContent;
  const grasimi = document.getElementById('r-grasimi').textContent;
  const apa = document.getElementById('r-apa').textContent;

  const continut =
    'Necesarul tău zilnic de macronutrienți\n' +
    '========================================\n' +
    'Calorii totale:  ' + calorii + '\n' +
    'Proteine:        ' + proteine + '\n' +
    'Carbohidrați:    ' + carbohidrati + '\n' +
    'Grăsimi:         ' + grasimi + '\n' +
    'Hidratare:       ' + apa + '\n';

  const blob = new Blob([continut], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'macronutrienti.txt';
  a.click();
  URL.revokeObjectURL(url);
});
