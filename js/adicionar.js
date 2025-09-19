const form = document.getElementById('formAdicionar');
const listaMembros = document.getElementById('listaMembros');

let membros = JSON.parse(localStorage.getItem('membros')) || [];

function renderizar(){
  listaMembros.innerHTML='';
  membros.forEach((m,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `${m.nome} - ${m.data} (${m.codigo}) <button onclick="remover(${i})">❌</button>`;
    listaMembros.appendChild(li);
  });
}

function remover(index){
  membros.splice(index,1);
  localStorage.setItem('membros', JSON.stringify(membros));
  renderizar();
}

form.addEventListener('submit', e=>{
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const data = document.getElementById('data').value;
  const codigo = document.getElementById('codigo').value;
  membros.push({nome, data, codigo});
  localStorage.setItem('membros', JSON.stringify(membros));
  form.reset();
  renderizar();
});

renderizar();

// Opcional: carregar membros de JSON
fetch('membros.json')
  .then(res=>res.json())
  .then(data=>{
    const chaveExistente = membros.map(m=>m.codigo+m.nome+m.data);
    data.forEach(m=>{
      if(!chaveExistente.includes(m.codigo+m.nome+m.data)) membros.push(m);
    });
    localStorage.setItem('membros', JSON.stringify(membros));
    renderizar();
  });
