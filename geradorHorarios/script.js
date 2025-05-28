const disciplinas = [];
const professores = [];
const professorPorDisciplina = {};
const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const horariosPorDia = 4;


for (let i = 1; i <= 25; i++) disciplinas.push(`D${i}`);
for (let i = 1; i <= 10; i++) professores.push(`P${i}`);


disciplinas.forEach((d, i) => {
  professorPorDisciplina[d] = professores[i % professores.length];
});


function gerarIndividuo() {
  const grade = Array(5).fill(null).map(() => Array(20).fill(null));

  const todasAulas = [];
  disciplinas.forEach(d => {
    for (let i = 0; i < 4; i++) {
      todasAulas.push(d);
    }
  });

  for (let periodo = 0; periodo < 5; periodo++) {
    const aulasPeriodo = [...todasAulas.splice(0, 20)];
    const slots = [...Array(20).keys()].sort(() => Math.random() - 0.5);
    aulasPeriodo.forEach((disciplina, idx) => {
      grade[periodo][slots[idx]] = disciplina;
    });
  }

  return grade;
}


function contarConflitos(grade) {
  let conflitos = 0;
  for (let slot = 0; slot < 20; slot++) {
    const profsNoSlot = new Set();
    for (let periodo = 0; periodo < 5; periodo++) {
      const disc = grade[periodo][slot];
      if (disc) {
        const prof = professorPorDisciplina[disc];
        if (profsNoSlot.has(prof)) {
          conflitos++;
        } else {
          profsNoSlot.add(prof);
        }
      }
    }
  }
  return conflitos;
}


function cruzamento(pai1, pai2, numCortes) {
  const filho = Array(5).fill(null).map(() => Array(20).fill(null));
  const cortes = [];
  while (cortes.length < numCortes) {
    const corte = Math.floor(Math.random() * 20);
    if (!cortes.includes(corte)) cortes.push(corte);
  }
  cortes.sort((a, b) => a - b);
  cortes.push(20);

  let dePai1 = true;
  let inicio = 0;
  for (const corte of cortes) {
    for (let periodo = 0; periodo < 5; periodo++) {
      for (let i = inicio; i < corte; i++) {
        filho[periodo][i] = dePai1 ? pai1[periodo][i] : pai2[periodo][i];
      }
    }
    dePai1 = !dePai1;
    inicio = corte;
  }
  return filho;
}


function mutacao(individuo, probMutacao) {
  const novo = JSON.parse(JSON.stringify(individuo));
  for (let periodo = 0; periodo < 5; periodo++) {
    for (let slot = 0; slot < 20; slot++) {
      if (Math.random() < probMutacao) {
        const outroSlot = Math.floor(Math.random() * 20);
        [novo[periodo][slot], novo[periodo][outroSlot]] =
          [novo[periodo][outroSlot], novo[periodo][slot]];
      }
    }
  }
  return novo;
}


function renderGrade(grade) {
  const conflitos = contarConflitos(grade);
  let html = `<h2>Gerador de Horários</h2>`;

  for (let periodo = 0; periodo < 5; periodo++) {
    html += `<table>
      <thead>
        <tr><th colspan="6">Período ${periodo + 1}</th></tr>
        <tr>
          <th>Horário</th>
          ${dias.map(d => `<th>${d}</th>`).join('')}
        </tr>
      </thead>
      <tbody>`;

    for (let h = 0; h < horariosPorDia; h++) {
      html += `<tr><td>Horário ${h + 1}</td>`;
      for (let d = 0; d < dias.length; d++) {
        const slot = d * horariosPorDia + h;
        const disc = grade[periodo][slot];
        const prof = disc ? professorPorDisciplina[disc] : null;

        let conflito = false;
        if (disc) {
          for (let p = 0; p < 5; p++) {
            if (p !== periodo) {
              const dCheck = grade[p][slot];
              const profCheck = dCheck ? professorPorDisciplina[dCheck] : null;
              if (profCheck && profCheck === prof) {
                conflito = true;
                break;
              }
            }
          }
        }

        html += `<td class="${conflito ? 'conflict' : ''}">
                    ${disc ? `${disc} ${prof}` : ''}
                 </td>`;
      }
      html += `</tr>`;
    }

    html += `</tbody></table>`;
  }

  return html;
}


function algoritmoGenetico(popSize, maxGen, probCruz, probMut, numCortes) {
  let populacao = [];
  for (let i = 0; i < popSize; i++) {
    const grade = gerarIndividuo();
    const conflitos = contarConflitos(grade);
    populacao.push({ grade, conflitos });
  }

  for (let gen = 0; gen < maxGen; gen++) {
    populacao.sort((a, b) => a.conflitos - b.conflitos);
    const elite = populacao.slice(0, Math.floor(popSize / 2));
    const novaPop = [...elite];

    while (novaPop.length < popSize) {
      const pai1 = elite[Math.floor(Math.random() * elite.length)].grade;
      const pai2 = elite[Math.floor(Math.random() * elite.length)].grade;

      let filhoGrade = Math.random() < probCruz
        ? cruzamento(pai1, pai2, numCortes)
        : JSON.parse(JSON.stringify(pai1));

      filhoGrade = mutacao(filhoGrade, probMut);
      const conflitos = contarConflitos(filhoGrade);
      novaPop.push({ grade: filhoGrade, conflitos });
    }

    populacao = novaPop;
  }

  populacao.sort((a, b) => a.conflitos - b.conflitos);
  return populacao[0];
}


document.getElementById('runBtn').addEventListener('click', () => {
  const popSize = Number(document.getElementById('popSize').value);
  const maxGen = Number(document.getElementById('maxGen').value);
  const probCruz = Number(document.getElementById('pc').value);
  const probMut = Number(document.getElementById('pm').value);
  const numCortes = Number(document.getElementById('numCortes').value);

  document.getElementById('result').innerHTML = "<p>Executando, aguarde...</p>";

  setTimeout(() => {
    const melhor = algoritmoGenetico(popSize, maxGen, probCruz, probMut, numCortes);
    document.getElementById('result').innerHTML = renderGrade(melhor.grade);
  }, 100);
});
