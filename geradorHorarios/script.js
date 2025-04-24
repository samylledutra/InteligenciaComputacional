const disciplinas = [];
const professores = [];
const professorPorDisciplina = {};
const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
const horariosPorDia = 4;

for (let i = 1; i <= 25; i++) disciplinas.push(`D${i}`);
for (let i = 1; i <= 10; i++) professores.push(`P${i}`);

disciplinas.forEach((d, i) => {
  professorPorDisciplina[d] = professores[i % professores.length];
});

function gerarIndividuo() {
  const grade = Array(5).fill(null).map(() =>
    Array(horariosPorDia * dias.length).fill(null)
  );
  disciplinas.forEach(disciplina => {
    let colocadas = 0;
    while (colocadas < 4) {
      const dia = Math.floor(Math.random() * 5);
      const horario = Math.floor(Math.random() * 4);
      const slot = dia * horariosPorDia + horario;
      const periodo = Math.floor(Math.random() * 5);
      if (!grade[periodo][slot]) {
        grade[periodo][slot] = disciplina;
        colocadas++;
      }
    }
  });
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

function renderGrade(grade, conflitos, index) {
  let html = `<h2>Grade #${index + 1} — Conflitos: ${conflitos}</h2>`;
  html += `<table><thead><tr><th>Período</th>`;
  dias.forEach(d => {
    for (let h = 1; h <= horariosPorDia; h++) {
      html += `<th>${d} - H${h}</th>`;
    }
  });
  html += `</tr></thead><tbody>`;
  for (let i = 0; i < 5; i++) {
    html += `<tr><td>P${i + 1}</td>`;
    for (let j = 0; j < 20; j++) {
      const disc = grade[i][j];
      const prof = disc ? professorPorDisciplina[disc] : '';
      const conflito = grade.filter((_, p) => p !== i).some(g => g[j] && professorPorDisciplina[g[j]] === prof);
      html += `<td class="${conflito ? 'conflict' : ''}">${disc || ''}</td>`;
    }
    html += `</tr>`;
  }
  html += `</tbody></table>`;
  return html;
}

function renderGradeUnificada(populacao) {
  let html = `<h2>Grade Unificada </h2>`;
  html += `<table><thead><tr><th>Indivíduo</th><th>Período</th>`;
  dias.forEach(d => {
    for (let h = 1; h <= horariosPorDia; h++) {
      html += `<th>${d} - H${h}</th>`;
    }
  });
  html += `</tr></thead><tbody>`;

  populacao.forEach((p, index) => {
    const grade = p.grade;
    for (let periodo = 0; periodo < 5; periodo++) {
      html += `<tr><td>#${index + 1}</td><td>P${periodo + 1}</td>`;
      for (let slot = 0; slot < 20; slot++) {
        const disc = grade[periodo][slot];
        const prof = disc ? professorPorDisciplina[disc] : '';
        const conflito = grade.filter((_, pIndex) => pIndex !== periodo).some(g => g[slot] && professorPorDisciplina[g[slot]] === prof);
        html += `<td class="${conflito ? 'conflict' : ''}">${disc || ''}</td>`;
      }
      html += `</tr>`;
    }
  });

  html += `</tbody></table>`;
  return html;
}

const populacao = [];
for (let i = 0; i < 50; i++) {
  const grade = gerarIndividuo();
  const conflitos = contarConflitos(grade);
  populacao.push({ grade, conflitos });
}

populacao.sort((a, b) => a.conflitos - b.conflitos);
const primeiraMetade = populacao.slice(0, 25);
const selecionado1 = primeiraMetade[0];
const selecionado2 = populacao[Math.floor(Math.random() * 50)];

document.getElementById('grades-container').innerHTML =
  renderGradeUnificada(populacao) +
  `<h2>Seleção:</h2>
   <p>Melhor da metade: Conflitos = ${selecionado1.conflitos}</p>
   <p>Aleatório: Conflitos = ${selecionado2.conflitos}</p>`;
