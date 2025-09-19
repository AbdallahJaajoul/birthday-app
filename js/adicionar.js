const form = document.getElementById('formAdicionar');
const listaMembros = document.getElementById('listaMembros');

// Carrega membros do localStorage ou do JSON
let membros = JSON.parse(localStorage.getItem('membros')) || [];

// Função para renderizar a lista
function renderizar() {
  listaMembros.innerHTML = '';
  membros.forEach((m,i) => {
    const li = document.createElement('li');
    li.innerHTML = `${m.nome} - ${m.data} (${m.codigo}) <button onclick="remover(${i})">❌</button>`;
    listaMembros.appendChild(li);
  });
}

// Função para remover membro
function remover(index) {
  membros.splice(index,1);
  localStorage.setItem('membros', JSON.stringify(membros));
  renderizar();
}

// Adiciona membro via formulário
form.addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const data = document.getElementById('data').value;
  const codigo = document.getElementById('codigo').value;

  membros.push({ nome, data, codigo });
  localStorage.setItem('membros', JSON.stringify(membros));
  form.reset();
  renderizar();
});

// Carregar membros de um JSON externo (opcional)
fetch('membros.json')
  .then(res => res.json())
  .then(data => {
    // Evita duplicar membros já existentes no localStorage
    const codigosExistentes = membros.map(m => m.codigo + m.nome + m.data);
    data.forEach(m => {
      const chave = m.codigo + m.nome + m.data;
      if(!codigosExistentes.includes(chave)) membros.push(m);
    });
    localStorage.setItem('membros', JSON.stringify(membros));
    renderizar();
  });

renderizar();
