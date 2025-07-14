const totalDisciplinas = 25;
const totalPeriodos = 5;
const totalProfessores = 10;
const colunas = 100; 


const professorPorDisciplina = {};
const disciplinasComPeriodo = []; 


function gerarDisciplinas(totalDisciplinas, totalPeriodos, totalProfessores) {
  for (let i = 0; i < totalDisciplinas; i++) {
    const periodo = Math.floor(i / (totalDisciplinas / totalPeriodos));
    const professor = i % totalProfessores;
    const siglaDisciplina = `D${i.toString().padStart(2, "0")}`;
    const siglaProfessor = `P${professor.toString().padStart(2, "0")}`;

    disciplinasComPeriodo.push({
      sigla: siglaDisciplina,
      professor: siglaProfessor,
      periodo: periodo,
    });
    
    professorPorDisciplina[siglaDisciplina] = siglaProfessor;
  }
}


function embaralhar(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function popInicial(disciplinas, linhas = 50, colunas = 100, totalPeriodos = 5) {
  const populacao = [];
  for (let i = 0; i < linhas; i++) {
    const individuo = Array(colunas).fill(null);
    for (let periodo = 0; periodo < totalPeriodos; periodo++) {
      const disciplinasDoPeriodo = disciplinas.filter(d => d.periodo === periodo);
      const disciplinasEmbaralhadas = embaralhar(disciplinasDoPeriodo);
      
      let alocacoesFeitas = 0; 
      
      disciplinasEmbaralhadas.forEach((disciplina) => {
        let alocados = 0;
        const horariosDisponiveis = [];
        
        for (let j = 0; j < colunas; j++) {
          if (Math.floor(j / (colunas / totalPeriodos)) === periodo && individuo[j] === null) {
            horariosDisponiveis.push(j);
          }
        }
        const horariosEmbaralhados = embaralhar(horariosDisponiveis);
        
        for (const horario of horariosEmbaralhados) {
          if (alocados < 4 && individuo[horario] === null) { 
            individuo[horario] = `${disciplina.sigla} ${disciplina.professor}`;
            alocados++;
          } else if (alocados >= 4) {
            break; 
          }
        }
      });
    }
    populacao.push(individuo);
  }
  return populacao;
}


function avaliacao(grade, colunas = 100, totalPeriodos = 5) {
  let conflitos = 0;
  const slotsPorPeriodo = colunas / totalPeriodos; 

  
  for (let dia = 0; dia < 5; dia++) { 
    for (let horario = 0; horario < 4; horario++) { 
      const professoresNesseHorario = new Set();
      for (let periodo = 0; periodo < totalPeriodos; periodo++) { 
        const idx = (periodo * slotsPorPeriodo) + (dia * 4) + horario;
        const celula = grade[idx];

        if (celula) {
          const professor = celula.split(" ")[1]; 
          if (professoresNesseHorario.has(professor)) {
            conflitos++;
          } else {
            professoresNesseHorario.add(professor);
          }
        }
      }
    }
  }
  return conflitos;
}


function ordenacao(populacao, colunas, totalPeriodos) {
  return populacao
    .map(individuo => ({
      grade: individuo,
      conflitos: avaliacao(individuo, colunas, totalPeriodos),
    }))
    .sort((a, b) => a.conflitos - b.conflitos)
    .map(obj => obj.grade);
}


function selecao(populacao, colunas, totalPeriodos) {
  const idx1 = Math.floor(Math.random() * populacao.length);
  const idx2 = Math.floor(Math.random() * populacao.length);
  const ind1 = populacao[idx1];
  const ind2 = populacao[idx2];
  return [
    avaliacao(ind1, colunas, totalPeriodos) < avaliacao(ind2, colunas, totalPeriodos) ? ind1 : ind2,
    
    avaliacao(ind1, colunas, totalPeriodos) >= avaliacao(ind2, colunas, totalPeriodos) ? ind1 : ind2,
  ];
}


function cruzamento(pais, cortes = 2, pc = 0.7, totalPeriodos = 5, colunas = 100) {
  const filhos = [[], []];
  if (Math.random() < pc) {
    cortes = Math.max(1, Math.min(4, cortes)); 
    const pontos = new Set();
    while (pontos.size < cortes) {
      const ponto = Math.floor(Math.random() * totalPeriodos) + 1; 
      pontos.add(ponto);
    }
    const pontosOrdenados = Array.from(pontos).sort((a, b) => a - b);
    let cruza = false;
    let inicio = 0;

    for (const ponto of pontosOrdenados) {
      const fim = ponto * (colunas / totalPeriodos);
      for (let j = inicio; j < fim; j++) {
        filhos[0][j] = cruza ? pais[1][j] : pais[0][j];
        filhos[1][j] = cruza ? pais[0][j] : pais[1][j];
      }
      cruza = !cruza;
      inicio = fim;
    }
    
    for (let j = inicio; j < colunas; j++) {
      filhos[0][j] = cruza ? pais[1][j] : pais[0][j];
      filhos[1][j] = cruza ? pais[0][j] : pais[1][j];
    }
  } else {
    filhos[0] = [...pais[0]];
    filhos[1] = [...pais[1]];
  }
  return filhos;
}


function mutacao(filhos, pm = 0.1, totalPeriodos = 5, colunas = 100) {
  for (let k = 0; k < filhos.length; k++) {
    if (Math.random() < pm) {
      for (let periodo = 0; periodo < totalPeriodos; periodo++) {
        const base = periodo * (colunas / totalPeriodos);
        const p1 = base + Math.floor(Math.random() * (colunas / totalPeriodos));
        const p2 = base + Math.floor(Math.random() * (colunas / totalPeriodos));
        const temp = filhos[k][p1];
        filhos[k][p1] = filhos[k][p2];
        filhos[k][p2] = temp;
      }
    }
  }
  return filhos;
}


function algoritmoGenetico({
  totalDisciplinas,
  totalPeriodos,
  totalProfessores,
  totalPopulacao,
  colunas,
  maxGeracoes,
  pc,
  pm,
  cortes,
}) {
  
  gerarDisciplinas(totalDisciplinas, totalPeriodos, totalProfessores);
  let populacao = popInicial(disciplinasComPeriodo, totalPopulacao, colunas, totalPeriodos);
  populacao = ordenacao(populacao, colunas, totalPeriodos);

  let melhorIndividuo = populacao[0].slice();
  let melhorConflitos = avaliacao(melhorIndividuo, colunas, totalPeriodos);

  for (let geracao = 0; geracao < maxGeracoes; geracao++) {
    let novaPopulacao = [];
    while (novaPopulacao.length < totalPopulacao) {
      const pais = selecao(populacao, colunas, totalPeriodos);
      let filhos = cruzamento(pais, cortes, pc, totalPeriodos, colunas);
      filhos = mutacao(filhos, pm, totalPeriodos, colunas);
      novaPopulacao.push(filhos[0]);
      if (novaPopulacao.length < totalPopulacao) {
        novaPopulacao.push(filhos[1]);
      }
    }
    populacao = ordenacao(novaPopulacao, colunas, totalPeriodos);

    const conflitosAtual = avaliacao(populacao[0], colunas, totalPeriodos);
    if (conflitosAtual < melhorConflitos) {
      melhorIndividuo = populacao[0].slice();
      melhorConflitos = conflitosAtual;
    }
  }
  return { melhorIndividuo, melhorConflitos, populacao };
}


function renderizarGrade(populacaoParaRenderizar, containerId, colunas = 100, totalPeriodos = 5) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const tabela = document.createElement("table");
 
  const trPeriodos = document.createElement("tr");
  const thVazio = document.createElement("th");
  thVazio.rowSpan = 2;
  thVazio.textContent = "#";
  trPeriodos.appendChild(thVazio);
  for (let i = 0; i < totalPeriodos; i++) {
    const th = document.createElement("th");
    th.colSpan = colunas / totalPeriodos;
    th.textContent = `Período ${i + 1}`;
    trPeriodos.appendChild(th);
  }
  tabela.appendChild(trPeriodos);
  
  const trHorarios = document.createElement("tr");
  for (let i = 0; i < colunas; i++) {
    const th = document.createElement("th");
    th.textContent = (i % (colunas / totalPeriodos)) + 1; 
    trHorarios.appendChild(th);
  }
  tabela.appendChild(trHorarios);


  populacaoParaRenderizar.forEach((linha, index) => {
    const tr = document.createElement("tr");
    const thLinha = document.createElement("th");
    thLinha.textContent = index + 1;
    tr.appendChild(thLinha);
    linha.forEach(celula => {
      const td = document.createElement("td");
      td.textContent = celula ? celula : "";
      tr.appendChild(td);
    });
    tabela.appendChild(tr);
  });
  container.appendChild(tabela);
}


function renderizarGradePorPeriodo(individuo, containerId, totalPeriodos = 5, colunas = 100) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const cellsPerPeriod = colunas / totalPeriodos; 
  const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  const horas = ["1ª Aula", "2ª Aula", "3ª Aula", "4ª Aula"];

  
  for (let p = 0; p < totalPeriodos; p++) {
    const table = document.createElement("table");

    
    const caption = document.createElement("caption");
    caption.textContent = `Período ${p + 1}`;
    table.appendChild(caption);

    
    const trHeader = document.createElement("tr");
    const thEmpty = document.createElement("th");
    thEmpty.textContent = "";
    trHeader.appendChild(thEmpty);
    dias.forEach(dia => {
      const th = document.createElement("th");
      th.textContent = dia;
      trHeader.appendChild(th);
    });
    table.appendChild(trHeader);

   
    for (let h = 0; h < horas.length; h++) {
      const tr = document.createElement("tr");
      const thHora = document.createElement("th");
      thHora.textContent = horas[h];
      tr.appendChild(thHora);

      
      for (let d = 0; d < dias.length; d++) {
        const td = document.createElement("td");
       
        const index = p * cellsPerPeriod + d * 4 + h;
        td.textContent = individuo[index] || "";
        
      
        if (individuo[index] === null) {
          td.classList.add('empty-slot');
        } else {
             
            const professorAtual = individuo[index].split(" ")[1];
            let conflitoVisual = false;
           
            for (let otherPeriod = 0; otherPeriod < totalPeriodos; otherPeriod++) {
                if (otherPeriod !== p) {
                    const otherIndex = otherPeriod * cellsPerPeriod + d * 4 + h;
                    if (individuo[otherIndex]) {
                        const otherProfessor = individuo[otherIndex].split(" ")[1];
                        if (professorAtual === otherProfessor) {
                            conflitoVisual = true;
                            break;
                        }
                    }
                }
            }
            if (conflitoVisual) {
                td.classList.add('conflict');
            }
        }
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    container.appendChild(table);
  }
}



function executarAG() {
  const totalPopulacao = parseInt(document.getElementById("popSize").value);
  const maxGeracoes = parseInt(document.getElementById("maxGen").value);
  const pc = parseFloat(document.getElementById("pc").value);
  const pm = parseFloat(document.getElementById("pm").value);
  let cortes = parseInt(document.getElementById("numCortes").value);

  
  if (totalPopulacao <= 0 || maxGeracoes <= 0 || pc <= 0 || pc > 1 || pm <= 0 || pm > 1) {
    alert("Parâmetros Inválidos, insira-os novamentes!");
    return;
  }

  
  if (totalPopulacao % 2 !== 0)
    totalPopulacao++;

  
  cortes = Math.max(1, Math.min(4, cortes));

  document.getElementById('result').innerHTML = "<p>Executando, aguarde...</p>";
  
  
  setTimeout(() => {
    const { melhorIndividuo, melhorConflitos, populacao } = algoritmoGenetico({
      totalDisciplinas: totalDisciplinas,
      totalPeriodos: totalPeriodos,
      totalProfessores: totalProfessores,
      totalPopulacao: totalPopulacao,
      colunas: colunas,
      maxGeracoes: maxGeracoes,
      pc: pc,
      pm: pm,
      cortes: cortes,
    });

    renderizarGradePorPeriodo(melhorIndividuo, "result", totalPeriodos, colunas);

    const info = document.getElementById("info-melhor");
    if (info) {
      info.textContent = `Conflitos do melhor horário: ${melhorConflitos}`;
    }
  }, 100); 
}


document.getElementById('runBtn').addEventListener('click', executarAG);


gerarDisciplinas(totalDisciplinas, totalPeriodos, totalProfessores);